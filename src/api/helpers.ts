import { Buffer } from "buffer";
import { decrypt } from "../crypto/cipher";
import { arrayBufferToString } from "../crypto/utils";
import { FileResponse, FolderResponse, Response } from "../types/API";
import { FileRef, FolderRef } from "../types/Files";

export async function jsonFetch<T>(
  url: RequestInfo | URL,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, options);
  const r: Response<T> = await response.json();
  if (!r.success) {
    throw new Error(r.data);
  }
  return r.data;
}

export async function decryptFileObject(
  resp: FileResponse,
  accountKey: ArrayBuffer
): Promise<FileRef> {
  const fileKey = await decrypt(
    Buffer.from(resp.encryptionKey, "base64"),
    accountKey
  );
  if (!fileKey) {
    throw new Error("could not decrypt file encryption key");
  }
  const metadataBytes = await decrypt(
    Buffer.from(resp.metadata, "base64"),
    fileKey
  );
  if (!metadataBytes) {
    throw new Error("could not decrypt file metadata");
  }
  const metadata = JSON.parse(arrayBufferToString(metadataBytes, "utf-8"));
  return {
    ...resp,
    encryptionKey: fileKey,
    metadata,
  };
}

export async function decryptFolderObject(
  resp: FolderResponse,
  accountKey: ArrayBuffer
): Promise<FolderRef> {
  const folderKey = await decrypt(
    Buffer.from(resp.encryptionKey, "base64"),
    accountKey
  );
  if (!folderKey) {
    throw new Error("could not decrypt folder encryption key");
  }
  const metadataBytes = await decrypt(
    Buffer.from(resp.metadata, "base64"),
    folderKey
  );
  if (!metadataBytes) {
    throw new Error("could not decrypt folder metadata");
  }
  const metadata = JSON.parse(arrayBufferToString(metadataBytes, "utf-8"));
  return {
    ...resp,
    encryptionKey: folderKey,
    metadata,
  };
}
