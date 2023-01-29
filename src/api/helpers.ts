import { Buffer } from "buffer";
import { UUID_NIL } from "../const";
import { decrypt } from "../crypto/cipher";
import { arrayBufferToString } from "../crypto/utils";
import { FileResponse, FolderResponse, Response } from "../types/API";
import { FileRef, FILE_TYPE, FolderRef, UUID } from "../types/Files";
import { createFolder, encryptAndUploadFile } from "./files";

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
  // Every file should have a creation date.
  const metadata = JSON.parse(arrayBufferToString(metadataBytes, "utf-8"));
  metadata.createdAt = new Date(metadata.createdAt);
  return {
    ...resp,
    parentFolder: resp.parentFolder ?? UUID_NIL,
    type: "f",
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
  // Every folder should have a creation date.
  const metadata = JSON.parse(arrayBufferToString(metadataBytes, "utf-8"));
  metadata.createdAt = new Date(metadata.createdAt);
  return {
    ...resp,
    parentFolder: resp.parentFolder ?? UUID_NIL,
    type: "d",
    encryptionKey: folderKey,
    metadata,
  };
}

export const uploadFileList = async (
  fileList: FileList,
  parentFolder: UUID,
  accountKey: ArrayBuffer,
  onItemUpload: (_: FileRef | FolderRef) => void
) => {
  const folderCache: Record<string, UUID> = {};
  for (const f of fileList) {
    const pathComponents = f.webkitRelativePath.split("/").slice(0, -1);
    let curFolderPath = "";
    let parentFolderID: UUID = parentFolder;
    for (const folderName of pathComponents) {
      if (folderName === "") {
        break;
      }
      curFolderPath += folderName;
      if (!Object.prototype.hasOwnProperty.call(folderCache, curFolderPath)) {
        const newFolder: FolderRef = await createFolder(
          folderName,
          parentFolderID,
          accountKey
        );
        onItemUpload(newFolder);
        folderCache[curFolderPath] = newFolder.id;
      }
      parentFolderID = folderCache[curFolderPath];
    }
    const newFile = await encryptAndUploadFile(f, parentFolderID, accountKey);
    onItemUpload(newFile);
  }
};

export function getFileAndFolderIDs(items: (FileRef | FolderRef)[]): {
  files: UUID[];
  folders: UUID[];
} {
  const files = [];
  const folders = [];
  for (const f of items) {
    if (f.type === FILE_TYPE) {
      files.push(f.id);
    } else {
      folders.push(f.id);
    }
  }
  return {
    files,
    folders,
  };
}
