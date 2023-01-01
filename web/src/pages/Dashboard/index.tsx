import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { getFolderContents } from "../../api/files";
import FolderContext, { initState } from "../../context/FolderContext";
import {
  FilePath,
  FileRef,
  FolderContents,
  FolderRef,
} from "../../types/Files";
import Nav from "./Nav";

export default function DashboardPage(): JSX.Element {
  return (
    <FoldersProvider>
      <div style={{ display: "flex" }}>
        <Nav />
        <Outlet />
      </div>
    </FoldersProvider>
  );
}

const FoldersProvider = (props: { children: React.ReactNode }): JSX.Element => {
  const [pwd, setPwd] = useState<FilePath>(initState.pwd);
  const [contents, setContents] = useState<FolderContents>(initState.contents);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    // Root directory has nothing above it.
    const contentsRequest = pwd.parents.length
      ? getFolderContents(pwd.current.id)
      : getFolderContents(null);
    contentsRequest
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

  return (
    <FolderContext.Provider
      value={{
        pwd,
        setPwd,
        contents,
        setContents,
        loading,
        setLoading,
        addFile,
        addFolder,
      }}
    >
      {props.children}
    </FolderContext.Provider>
  );
};
