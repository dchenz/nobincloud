import { UUID } from "./Files";

export type Success<T> = {
  success: true;
  data: T;
};

export type Failure = {
  success: false;
  data: string;
};

export type Response<T = undefined> = Success<T> | Failure;

type BaseFolderResponseObject = {
  id: UUID;
  parentFolder: UUID | null;
  encryptionKey: string;
  metadata: string;
};

export type FileResponse = BaseFolderResponseObject;

export type FolderResponse = BaseFolderResponseObject;

export type FolderContentsResponse = {
  files: FileResponse[];
  folders: FolderResponse[];
};

export type SuccessfulLoginResponse = {
  accountKey: string;
};
