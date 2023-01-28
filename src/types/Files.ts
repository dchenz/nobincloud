export type FileMetadata = {
  name: string;
  createdAt: Date;
  type: string;
  size: number;
  thumbnail: string | null;
};

export type FolderMetadata = {
  name: string;
  createdAt: Date;
};

type BaseFolderObject = {
  id: UUID;
  parentFolder: UUID;
  encryptionKey: ArrayBuffer;
};

export type FileRef = BaseFolderObject & {
  type: typeof FILE_TYPE;
  metadata: FileMetadata;
};

export type FolderRef = BaseFolderObject & {
  type: typeof FOLDER_TYPE;
  metadata: FolderMetadata;
};

export type FilePath = {
  parents: FolderRef[];
  current: FolderRef;
};

export type UUID = string;

export type FolderContents = {
  files: FileRef[];
  folders: FolderRef[];
};

// Used to determine file vs folder in FileRef | FolderRef union.
export const FILE_TYPE = "f";
export const FOLDER_TYPE = "d";

export type UploadProgress = {
  id: string;
  current: number;
  total: number;
  title: string;
};
