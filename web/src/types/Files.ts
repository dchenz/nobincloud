export type FileUploadDetails = {
  id?: string
  file: File
  key: ArrayBuffer
}

type BaseFolderObject = {
  id: number
  name: string
  owner: string
  parentFolder: string | null
}

export type FileRef = BaseFolderObject & {
  type: "f"
}

export type FolderRef = BaseFolderObject & {
  type: "d"
  color: string | null
}

export type FileNodeRef = FileRef | FolderRef