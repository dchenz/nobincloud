import { createContext } from "react";
import {
  FilePath,
  FileRef,
  FolderContents,
  FolderRef,
  FOLDER_TYPE,
} from "../types/Files";

type FolderCtxType = {
  pwd: FilePath;
  setPwd: (_: FilePath) => void;
  contents: FolderContents;
  setContents: (_: FolderContents) => void;
  loading: boolean;
  setLoading: (_: boolean) => void;
  viewingMode: string;
  setViewingMode: (_: string) => void;
  activeFile: FileRef | null;
  setActiveFile: (_: FileRef | null) => void;
  selectedItems: (FileRef | FolderRef)[];
  setSelectedItems: (_: (FileRef | FolderRef)[]) => void;
  toggleSelectedItem: (_: FileRef | FolderRef) => void;
  addFile: (_: FileRef) => void;
  addFolder: (_: FolderRef) => void;
  deleteFile: (_: FileRef) => void;
  deleteFolder: (_: FolderRef) => void;
};

export const initState: FolderCtxType = {
  pwd: {
    current: {
      type: FOLDER_TYPE,
      id: "00000000-0000-0000-0000-000000000000",
      parentFolder: null,
      encryptionKey: new ArrayBuffer(0),
      metadata: {
        name: "",
        createdAt: new Date(),
      },
    },
    parents: [],
  },
  setPwd: (_) => undefined,
  contents: {
    files: [],
    folders: [],
  },
  setContents: (_) => undefined,
  loading: false,
  setLoading: (_) => undefined,
  viewingMode: "grid",
  setViewingMode: (_) => undefined,
  activeFile: null,
  setActiveFile: (_) => undefined,
  selectedItems: [],
  setSelectedItems: (_) => undefined,
  toggleSelectedItem: (_) => undefined,
  addFile: (_) => undefined,
  addFolder: (_) => undefined,
  deleteFile: (_) => undefined,
  deleteFolder: (_) => undefined,
};

export default createContext<FolderCtxType>(initState);
