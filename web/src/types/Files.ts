export type FileUploadDetails = {
  file: File;
  parentFolder: string | null;
};

export type UploadInitResponse = {
  id: number;
};

export type UploadPartsResponse = {
  have: number;
  want: number;
  error?: string;
};

type BaseFolderObject = {
  id: UUID;
  name: string;
  parentFolder: UUID | null;
};

export type FileRef = BaseFolderObject & {
  fileKey: ArrayBuffer;
};

export type FolderRef = BaseFolderObject & {
  color: string | null;
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
