import { Divider } from "@chakra-ui/react";
import React, { useContext } from "react";
import GridView from "../../../components/FolderGridView";
import ListView from "../../../components/FolderListView";
import AuthContext from "../../../context/AuthContext";
import FolderContext from "../../../context/FolderContext";
import ContentModal from "../ContentModal";
import Header from "./Header";
import PathViewer from "./PathViewer";
import "./styles.sass";

export default function MyFilesDashboard(): JSX.Element {
  const { viewingMode, activeFile, setActiveFile } = useContext(FolderContext);
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
        {viewingMode === "grid" ? <GridView /> : <ListView />}
        {activeFile ? (
          <ContentModal
            selectedFile={activeFile}
            onClose={() => setActiveFile(null)}
          />
        ) : null}
      </div>
    </div>
  );
}
