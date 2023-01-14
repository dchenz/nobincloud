import { createContext } from "react";
import { FilePath, FileRef, FolderContents, FolderRef } from "../types/Files";

type FolderCtxType = {
  pwd: FilePath;
  setPwd: (_: FilePath) => void;
  contents: FolderContents;
  setContents: (_: FolderContents) => void;
  loading: boolean;
  setLoading: (_: boolean) => void;
  viewingMode: string;
  setViewingMode: (_: string) => void;
  addFile: (_: FileRef) => void;
  addFolder: (_: FolderRef) => void;
  deleteFile: (_: FileRef) => void;
};

export const initState: FolderCtxType = {
  pwd: {
    current: {
      id: "00000000-0000-0000-0000-000000000000",
      parentFolder: null,
      encryptionKey: new ArrayBuffer(0),
      metadata: {
        name: "",
        createdAt: new Date(),
        type: "",
        size: 0,
        thumbnail: null,
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
  addFile: (_) => undefined,
  addFolder: (_) => undefined,
  deleteFile: (_) => undefined,
};

export default createContext<FolderCtxType>(initState);
