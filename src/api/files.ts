import { Buffer } from "buffer";
import { SERVER_ROUTES } from "../const";
import { decrypt, encrypt } from "../crypto/cipher";
import { generateWrappedKey } from "../crypto/password";
import { arrayBufferToString, uuidZero } from "../crypto/utils";
import { createCustomFileThumbnail } from "../misc/thumbnails";
import { FolderContentsResponse, Response } from "../types/API";
import {
  FileRef,
  FILE_TYPE,
  FolderContents,
  FolderRef,
  UUID,
} from "../types/Files";
import { decryptFileObject, decryptFolderObject, jsonFetch } from "./helpers";

export async function encryptAndUploadFile(
  file: File,
  parentFolder: UUID | null,
  accountKey: ArrayBuffer
): Promise<FileRef> {
  const [encryptedFileKey, fileKey] = await generateWrappedKey(accountKey);
  const thumbnail = await createCustomFileThumbnail(file);
  const fileMetadata = {
    name: file.name,
    createdAt: new Date(), // Will show time when the upload started
    type: file.type,
    size: file.size,
    thumbnail: thumbnail ? arrayBufferToString(thumbnail, "base64") : null,
  };
  const encryptedFileMetadata = await encrypt(
    Buffer.from(JSON.stringify(fileMetadata)),
    fileKey
  );
  const fileData = await file.arrayBuffer();
  const form = new FormData();
  form.append("file", new Blob([await encrypt(fileData, fileKey)]));
  form.append("encryptionKey", arrayBufferToString(encryptedFileKey, "base64"));
  form.append("metadata", arrayBufferToString(encryptedFileMetadata, "base64"));
  if (parentFolder) {
    form.append("parentFolder", parentFolder ?? "");
  }

  const response: Response<string> = await (
    await fetch(SERVER_ROUTES.file, {
      method: "POST",
      body: form,
    })
  ).json();

  return {
    type: "f",
    id: response.data,
    encryptionKey: encryptedFileKey,
    parentFolder: parentFolder,
    metadata: fileMetadata,
  };
}

export async function getFolderContents(
  folderID: UUID | null,
  accountKey: ArrayBuffer
): Promise<FolderContents> {
  if (!folderID) {
    folderID = uuidZero();
  }
  const contents = await jsonFetch<FolderContentsResponse>(
    `${SERVER_ROUTES.folder}/${folderID}/list`
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
  const url = `${SERVER_ROUTES.file}/${file.id}`;
  const responseBytes = await (await fetch(url)).arrayBuffer();
  // TODO: Find a new scheme to decrypt chunked large files.
  const fileBytes = await decrypt(responseBytes, file.encryptionKey);
  if (!fileBytes) {
    throw new Error("file cannot be decrypted");
  }
  return fileBytes;
}

export async function deleteFolderContents(
  items: (FileRef | FolderRef)[]
): Promise<null> {
  const files = [];
  const folders = [];
  for (const f of items) {
    if (f.type === FILE_TYPE) {
      files.push(f.id);
    } else {
      folders.push(f.id);
    }
  }
  return await jsonFetch<null>(SERVER_ROUTES.batch, {
    method: "DELETE",
    body: JSON.stringify({
      files,
      folders,
    }),
  });
}

export async function createFolder(
  folderName: string,
  parentFolder: UUID | null,
  accountKey: ArrayBuffer
): Promise<FolderRef> {
  const [encryptedFolderKey, folderKey] = await generateWrappedKey(accountKey);
  const folderMetadata = {
    name: folderName,
    createdAt: new Date(),
  };
  const encryptedFolderMetadata = await encrypt(
    Buffer.from(JSON.stringify(folderMetadata)),
    folderKey
  );
  const id = await jsonFetch<string>(SERVER_ROUTES.folder, {
    method: "POST",
    body: JSON.stringify({
      encryptionKey: arrayBufferToString(encryptedFolderKey, "base64"),
      parentFolder,
      metadata: arrayBufferToString(encryptedFolderMetadata, "base64"),
    }),
  });
  return {
    id,
    type: "d",
    encryptionKey: folderKey,
    parentFolder,
    metadata: folderMetadata,
  };
}
