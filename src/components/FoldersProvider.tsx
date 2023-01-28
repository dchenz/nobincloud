import React, { useContext, useEffect, useState } from "react";
import { getFolderContents } from "../api/files";
import { LS_FILE_VIEW_MODE } from "../const";
import AuthContext from "../context/AuthContext";
import FolderContext, { initState } from "../context/FolderContext";
import { useLocalStorageState } from "../misc/hooks";
import {
  FilePath,
  FileRef,
  FolderContents,
  FolderRef,
  UploadProgress,
} from "../types/Files";

const FoldersProvider = (props: { children: React.ReactNode }): JSX.Element => {
  const [pwd, setPwd] = useState<FilePath>(initState.pwd);
  const [contents, setContents] = useState<FolderContents>(initState.contents);
  const [loading, setLoading] = useState<boolean>(false);
  const [viewingMode, setViewingMode] = useLocalStorageState<string>(
    LS_FILE_VIEW_MODE,
    initState.viewingMode
  );
  const [activeFile, setActiveFile] = useState<FileRef | null>(null);
  const [selectedItems, setSelectedItems] = useState<(FileRef | FolderRef)[]>(
    []
  );
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const { accountKey } = useContext(AuthContext);
  if (!accountKey) {
    throw new Error();
  }

  useEffect(() => {
    setLoading(true);
    // Root directory has nothing above it.
    getFolderContents(pwd.current.id, accountKey)
      .then((contentsResult) => setContents(contentsResult))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [pwd]);

  const addFile = (item: FileRef) => {
    setContents((prev) => ({ ...prev, files: [...prev.files, item] }));
  };

  const addFolder = (item: FolderRef) => {
    setContents((prev) => ({ ...prev, folders: [...prev.folders, item] }));
  };

  const deleteFile = (item: FileRef) => {
    setContents((prev) => ({
      ...prev,
      files: prev.files.filter((f) => f.id !== item.id),
    }));
  };

  const deleteFolder = (item: FolderRef) => {
    setContents((prev) => ({
      ...prev,
      folders: prev.folders.filter((f) => f.id !== item.id),
    }));
  };

  const changePwd = (item: FilePath) => {
    // Selected items reset per folder.
    setSelectedItems([]);
    setPwd(item);
  };

  const toggleSelectedItem = (item: FileRef | FolderRef) => {
    const s = [...selectedItems.filter((f) => f.id !== item.id)];
    // Not selected yet, add the item.
    if (s.length === selectedItems.length) {
      s.push(item);
    }
    setSelectedItems(s);
  };

  const addUpload = (key: string, total: number, title: string) => {
    setUploads((prev) => [...prev, { id: key, current: 0, total, title }]);
  };

  const removeUpload = (key: string) => {
    setUploads((prev) => prev.filter((x) => x.id !== key));
  };

  const incrementUpload = (key: string) => {
    setUploads((prev) => {
      const us = [];
      for (const u of prev) {
        if (u.id === key) {
          u.current += 1;
        }
        us.push(u);
      }
      return us;
    });
  };

  return (
    <FolderContext.Provider
      value={{
        pwd,
        setPwd: changePwd,
        contents,
        setContents,
        loading,
        setLoading,
        viewingMode,
        setViewingMode,
        activeFile,
        setActiveFile,
        selectedItems,
        setSelectedItems,
        toggleSelectedItem,
        addFile,
        addFolder,
        deleteFile,
        deleteFolder,
        uploads,
        addUpload,
        removeUpload,
        incrementUpload,
      }}
    >
      {props.children}
    </FolderContext.Provider>
  );
};

export default FoldersProvider;
