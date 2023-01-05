export type FileUploadDetails = {
  file: File;
  parentFolder: UUID | null;
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
  mimetype: string;
};

export type FolderRef = BaseFolderObject;

export type FilePath = {
  parents: FolderRef[];
  current: FileRef | FolderRef;
};

export type UUID = string;

export type FolderContents = {
  files: FileRef[];
  folders: FolderRef[];
};
