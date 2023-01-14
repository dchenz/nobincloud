import { Divider } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import AuthContext from "../../../context/AuthContext";
import FolderContext from "../../../context/FolderContext";
import { FileRef } from "../../../types/Files";
import ContentModal from "../ContentModal";
import GridView from "./GridView";
import Header from "./Header";
import ListView from "./ListView";
import PathViewer from "./PathViewer";
import "./styles.sass";

export default function MyFilesDashboard(): JSX.Element {
  const [selectedFile, setSelectedFile] = useState<FileRef | null>(null);
  const { viewingMode } = useContext(FolderContext);
  const { accountKey } = useContext(AuthContext);
  if (!accountKey) {
    throw new Error();
  }

  return (
    <div className="file-browser-container">
      <Header />
      <div className="file-browser-content">
        <PathViewer />
        <Divider my={2} />
        {viewingMode === "grid" ? (
          <GridView selectFile={setSelectedFile} />
        ) : (
          <ListView selectFile={setSelectedFile} />
        )}
        {selectedFile ? (
          <ContentModal
            selectedFile={selectedFile}
            onClose={() => setSelectedFile(null)}
          />
        ) : null}
      </div>
    </div>
  );
}
