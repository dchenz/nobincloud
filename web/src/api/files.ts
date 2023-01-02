import { Buffer } from "buffer";
import { ServerRoutes } from "../const";
import { decrypt, encrypt } from "../crypto/cipher";
import { generateWrappedKey } from "../crypto/password";
import { arrayBufferToString, uuid } from "../crypto/utils";
import { createCustomFileThumbnail } from "../misc/thumbnails";
import { Response } from "../types/API";
import {
  FileRef,
  FileUploadDetails,
  FolderContents,
  UploadInitResponse,
  UploadPartsResponse,
  UUID,
} from "../types/Files";
import { jsonFetch } from "./helpers";

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
  const encryptedFileName = await encrypt(
    Buffer.from(fileUpload.file.name, "utf-8"),
    fileKey
  );
  const thumbnail = await createCustomFileThumbnail(fileUpload.file);
  const initResponse: UploadInitResponse = await (
    await fetch(ServerRoutes.uploadInit, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        total_chunks: totalChunks,
        metadata: {
          parent_folder: fileUpload.parentFolder,
          thumbnail: thumbnail
            ? arrayBufferToString(await encrypt(thumbnail, fileKey), "hex")
            : null,
          key: arrayBufferToString(encryptedFileKey, "hex"),
          name: arrayBufferToString(encryptedFileName, "hex"),
          type: fileUpload.file.type,
          id: fileID,
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
            id: fileID,
            name: fileUpload.file.name,
            parentFolder: fileUpload.parentFolder,
            mimetype: fileUpload.file.type,
            fileKey,
          });
        }
      });
  }
}

export async function getFolderContents(
  folderID: UUID | null,
  accountKey: ArrayBuffer
): Promise<FolderContents> {
  let url = ServerRoutes.listFolder;
  if (folderID) {
    url += `?id=${folderID}`;
  }
  const response = await jsonFetch(url);
  if (!response.success) {
    throw new Error(response.data);
  }
  for (const f of response.data.files) {
    const fileKey = await decrypt(Buffer.from(f.fileKey, "hex"), accountKey);
    if (!fileKey) {
      throw new Error("key cannot be decrypted");
    }
    f.fileKey = fileKey;
    const fileName = await decrypt(Buffer.from(f.name, "hex"), fileKey);
    if (!fileName) {
      throw new Error("file name cannot be decrypted");
    }
    f.name = arrayBufferToString(fileName, "utf-8");
  }
  return response.data;
}

export async function getThumbnail(file: FileRef): Promise<string | null> {
  const response: Response<string | null> = await jsonFetch(
    `${ServerRoutes.thumbnail}/${file.id}`
  );
  if (!response.success) {
    throw new Error(response.data);
  }
  if (!response.data) {
    return null; // No thumbnail
  }
  const encryptedThumbnail = Buffer.from(response.data, "hex");
  const thumbnailDataURI = await decrypt(encryptedThumbnail, file.fileKey);
  if (!thumbnailDataURI) {
    throw new Error("file cannot be decrypted");
  }
  const dataURI = arrayBufferToString(thumbnailDataURI, "base64");
  return "data:image/jpeg;base64," + dataURI;
}

export async function getFileDownload(file: FileRef): Promise<ArrayBuffer> {
  const url = `${ServerRoutes.file}/${file.id}`;
  const responseBytes = await (await fetch(url)).arrayBuffer();
  // TODO: Find a new scheme to decrypt chunked large files.
  const fileBytes = await decrypt(responseBytes, file.fileKey);
  if (!fileBytes) {
    throw new Error("file cannot be decrypted");
  }
  return fileBytes;
}

export async function deleteFileOnServer(file: FileRef): Promise<null> {
  const url = `${ServerRoutes.file}/${file.id}`;
  const response: Response<null> = await jsonFetch(url, {
    method: "DELETE",
  });
  if (!response.success) {
    throw new Error(response.data);
  }
  return response.data;
}
