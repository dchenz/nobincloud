import { Buffer } from "buffer";
import { ServerRoutes } from "../const";
import { decrypt, encrypt } from "../crypto/cipher";
import { generateWrappedKey } from "../crypto/password";
import { arrayBufferToString, uuidZero } from "../crypto/utils";
import { createCustomFileThumbnail } from "../misc/thumbnails";
import { FolderContentsResponse, Response } from "../types/API";
import {
  FileRef,
  FileUploadDetails,
  FolderContents,
  FolderCreationDetails,
  FolderRef,
  UUID,
} from "../types/Files";
import { decryptFileObject, decryptFolderObject, jsonFetch } from "./helpers";

export async function encryptAndUploadFile(
  fileUpload: FileUploadDetails,
  accountKey: ArrayBuffer,
  onComplete: (item: FileRef) => void
) {
  const [encryptedFileKey, fileKey] = await generateWrappedKey(accountKey);
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
  const fileData = await fileUpload.file.arrayBuffer();
  const form = new FormData();
  form.append("file", new Blob([await encrypt(fileData, fileKey)]));
  form.append("encryptionKey", arrayBufferToString(encryptedFileKey, "base64"));
  form.append("metadata", arrayBufferToString(encryptedFileMetadata, "base64"));
  if (fileUpload.parentFolder) {
    form.append("parentFolder", fileUpload.parentFolder ?? "");
  }

  const response: Response<string> = await (
    await fetch(ServerRoutes.file, {
      method: "POST",
      body: form,
    })
  ).json();
  onComplete({
    type: "f",
    id: response.data,
    encryptionKey: encryptedFileKey,
    parentFolder: fileUpload.parentFolder,
    metadata: fileMetadata,
  });
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
  const [encryptedFolderKey, folderKey] = await generateWrappedKey(accountKey);
  const folderMetadata = {
    name: folder.name,
    createdAt: new Date(),
  };
  const encryptedFolderMetadata = await encrypt(
    Buffer.from(JSON.stringify(folderMetadata)),
    folderKey
  );
  const id = await jsonFetch<string>(ServerRoutes.folder, {
    method: "POST",
    body: JSON.stringify({
      encryptionKey: arrayBufferToString(encryptedFolderKey, "base64"),
      parentFolder: folder.parentFolder,
      metadata: arrayBufferToString(encryptedFolderMetadata, "base64"),
    }),
  });
  return {
    id,
    type: "d",
    encryptionKey: folderKey,
    parentFolder: folder.parentFolder,
    metadata: folderMetadata,
  };
}
