import { Box, Divider, HStack } from "@chakra-ui/react";
import React, { useContext } from "react";
import GridView from "../../../components/FolderGridView";
import ListView from "../../../components/FolderListView";
import PathViewer from "../../../components/PathViewer";
import UploadsTracker from "../../../components/UploadsTracker";
import AuthContext from "../../../context/AuthContext";
import FolderContext from "../../../context/FolderContext";
import { FileRef, FolderRef, FOLDER_TYPE } from "../../../types/Files";
import ContentModal from "../ContentModal";
import Header from "./Header";
import "./styles.sass";

export default function MyFilesDashboard(): JSX.Element {
  const {
    viewingMode,
    activeFile,
    setActiveFile,
    contents,
    selectedItems,
    toggleSelectedItem,
    pwd,
    setPwd,
  } = useContext(FolderContext);
  const { accountKey } = useContext(AuthContext);
  if (!accountKey) {
    throw new Error();
  }

  const onItemOpen = (item: FileRef | FolderRef) => {
    if (selectedItems.length > 0) {
      toggleSelectedItem(item);
    } else if (item.type === FOLDER_TYPE) {
      setPwd({
        ...pwd,
        parents: [...pwd.parents, pwd.current],
        current: item,
      });
    } else {
      setActiveFile(item);
    }
  };

  return (
    <div className="file-browser-container">
      <Header />
      <div className="file-browser-content">
        {selectedItems.length > 0 ? (
          <HStack minHeight="40px">
            <Box>{selectedItems.length} selected</Box>
          </HStack>
        ) : (
          <PathViewer />
        )}
        <Divider my={2} />
        {viewingMode === "grid" ? (
          <GridView
            items={[...contents.folders, ...contents.files]}
            onItemOpen={onItemOpen}
          />
        ) : (
          <ListView
            items={[...contents.folders, ...contents.files]}
            onItemOpen={onItemOpen}
          />
        )}
        {activeFile ? (
          <ContentModal
            selectedFile={activeFile}
            onClose={() => setActiveFile(null)}
          />
        ) : null}
      </div>
      <UploadsTracker />
    </div>
  );
}
