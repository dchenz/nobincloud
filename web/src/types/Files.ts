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
  id: number;
  name: string;
  owner: string;
  parentFolder: string | null;
};

export type FileRef = BaseFolderObject & {
  type: "f";
};

export type FolderRef = BaseFolderObject & {
  type: "d";
  color: string | null;
};

export type FileNodeRef = FileRef | FolderRef;
