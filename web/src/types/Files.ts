export type FileUploadDetails = {
  file: File;
  parentFolder: UUID | null;
};

export type FolderCreationDetails = {
  name: string;
  parentFolder: UUID | null;
};

export type FileMetadata = {
  name: string;
  type: string;
  size: number;
  thumbnail: string | null;
};

export type FolderMetadata = {
  name: string;
};

type BaseFolderObject = {
  id: UUID;
  parentFolder: UUID | null;
  encryptionKey: ArrayBuffer;
};

export type FileRef = BaseFolderObject & {
  metadata: FileMetadata;
};

export type FolderRef = BaseFolderObject & {
  metadata: FolderMetadata;
};

export type FilePath = {
  parents: FolderRef[];
  current: FileRef | FolderRef;
};

export type UUID = string;

export type FolderContents = {
  files: FileRef[];
  folders: FolderRef[];
};
