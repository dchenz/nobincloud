import { Buffer } from "buffer";
import { ServerRoutes } from "../const";
import { decrypt, encrypt } from "../crypto/cipher";
import { generateWrappedKey } from "../crypto/password";
import { arrayBufferToString, uuid, uuidZero } from "../crypto/utils";
import { createCustomFileThumbnail } from "../misc/thumbnails";
import {
  FolderContentsResponse,
  UploadInitResponse,
  UploadPartsResponse,
} from "../types/API";
import {
  FileRef,
  FileUploadDetails,
  FolderContents,
  FolderCreationDetails,
  FolderRef,
  UUID,
} from "../types/Files";
import { decryptFileObject, decryptFolderObject, jsonFetch } from "./helpers";

const CHUNK_SIZE = 2 ** 24;

export async function encryptAndUploadFile(
  fileUpload: FileUploadDetails,
  accountKey: ArrayBuffer,
  onProgress: (current: number, total: number) => void,
  onComplete: (item: FileRef) => void
) {
  const [encryptedFileKey, fileKey] = await generateWrappedKey(accountKey);
  const totalChunks = Math.ceil(fileUpload.file.size / CHUNK_SIZE);
  const fileID = uuid();
  const thumbnail = await createCustomFileThumbnail(fileUpload.file);
  const fileMetadata = {
    name: fileUpload.file.name,
    createdAt: new Date(), // Will show time when the upload started
    type: fileUpload.file.type,
    size: fileUpload.file.size,
    thumbnail: thumbnail ? arrayBufferToString(thumbnail, "base64") : null,
  };
  const encryptedFileMetadata = await encrypt(
    Buffer.from(JSON.stringify(fileMetadata)),
    fileKey
  );
  const initResponse: UploadInitResponse = await (
    await fetch(ServerRoutes.uploadInit, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        total_chunks: totalChunks,
        metadata: {
          id: fileID,
          encryptionKey: arrayBufferToString(encryptedFileKey, "base64"),
          parentFolder: fileUpload.parentFolder,
          metadata: arrayBufferToString(encryptedFileMetadata, "base64"),
        },
      }),
    })
  ).json();
  for (let i = 0; i < totalChunks; i++) {
    const chunkBytes = await fileUpload.file
      .slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
      .arrayBuffer();

    const encryptedChunkBytes = await encrypt(chunkBytes, fileKey);

    fetch(ServerRoutes.uploadParts, {
      method: "POST",
      headers: {
        "x-assemble-upload-id": `${initResponse.id}`,
        "x-assemble-chunk-id": `${i}`,
      },
      body: encryptedChunkBytes,
    })
      .then((resp) => resp.json())
      .then((resp: UploadPartsResponse) => {
        if (resp.error) {
          throw new Error(resp.error);
        }
        onProgress(resp.have, resp.want);
        if (resp.have === resp.want) {
          onComplete({
            type: "f",
            id: fileID,
            encryptionKey: encryptedFileKey,
            parentFolder: fileUpload.parentFolder,
            metadata: fileMetadata,
          });
        }
      });
  }
}

export async function getFolderContents(
  folderID: UUID | null,
  accountKey: ArrayBuffer
): Promise<FolderContents> {
  if (!folderID) {
    folderID = uuidZero();
  }
  const contents = await jsonFetch<FolderContentsResponse>(
    `${ServerRoutes.folder}/${folderID}/list`
  );
  const files = [];
  const folders = [];
  for (const f of contents.files) {
    files.push(await decryptFileObject(f, accountKey));
  }
  for (const f of contents.folders) {
    folders.push(await decryptFolderObject(f, accountKey));
  }
  return {
    files,
    folders,
  };
}

export async function getFileDownload(file: FileRef): Promise<ArrayBuffer> {
  const url = `${ServerRoutes.file}/${file.id}`;
  const responseBytes = await (await fetch(url)).arrayBuffer();
  // TODO: Find a new scheme to decrypt chunked large files.
  const fileBytes = await decrypt(responseBytes, file.encryptionKey);
  if (!fileBytes) {
    throw new Error("file cannot be decrypted");
  }
  return fileBytes;
}

export async function deleteFileOnServer(file: FileRef): Promise<null> {
  const url = `${ServerRoutes.file}/${file.id}`;
  return await jsonFetch<null>(url, {
    method: "DELETE",
  });
}

export async function createFolder(
  folder: FolderCreationDetails,
  accountKey: ArrayBuffer
): Promise<FolderRef> {
  const id = uuid();
  const url = `${ServerRoutes.folder}/${id}`;
  const [encryptedFolderKey, folderKey] = await generateWrappedKey(accountKey);
  const folderMetadata = {
    name: folder.name,
    createdAt: new Date(),
  };
  const encryptedFolderMetadata = await encrypt(
    Buffer.from(JSON.stringify(folderMetadata)),
    folderKey
  );
  await jsonFetch(url, {
    method: "PUT",
    body: JSON.stringify({
      id,
      encryptionKey: arrayBufferToString(encryptedFolderKey, "base64"),
      parentFolder: folder.parentFolder,
      metadata: arrayBufferToString(encryptedFolderMetadata, "base64"),
    }),
  });
  return {
    type: "d",
    id,
    encryptionKey: folderKey,
    parentFolder: folder.parentFolder,
    metadata: folderMetadata,
  };
}
