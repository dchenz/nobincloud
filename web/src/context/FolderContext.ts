import { createContext } from "react";
import { FilePath, FileRef, FolderContents, FolderRef } from "../types/Files";

type FolderCtxType = {
  pwd: FilePath;
  setPwd: (_: FilePath) => void;
  contents: FolderContents;
  setContents: (_: FolderContents) => void;
  loading: boolean;
  setLoading: (_: boolean) => void;
  addFile: (_: FileRef) => void;
  addFolder: (_: FolderRef) => void;
};

export const initState: FolderCtxType = {
  pwd: {
    current: {
      id: "00000000-0000-0000-0000-000000000000",
      name: "",
      parentFolder: null,
      fileKey: new ArrayBuffer(0),
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
  addFile: (_) => undefined,
  addFolder: (_) => undefined,
};

export default createContext<FolderCtxType>(initState);
