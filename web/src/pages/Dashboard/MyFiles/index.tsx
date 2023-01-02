import { Box, SimpleGrid } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import AuthContext from "../../../context/AuthContext";
import FolderContext from "../../../context/FolderContext";
import { FileRef } from "../../../types/Files";
import ContentModal from "../ContentModal";
import FileTile from "./FileTile";
import Header from "./Header";
import PathViewer from "./PathViewer";
import "./styles.scss";

export default function MyFilesDashboard(): JSX.Element {
  const [selectedFile, setSelectedFile] = useState<FileRef | null>(null);
  const { contents } = useContext(FolderContext);
  const { accountKey } = useContext(AuthContext);
  if (!accountKey) {
    throw new Error();
  }

  return (
    <div className="file-browser-container">
      <Header />
      <div className="file-browser-content">
        <PathViewer />
        <SimpleGrid columns={4} spacing={8}>
          {contents.folders.map((folder, k) => (
            <Box key={k}>{folder.name}</Box>
          ))}
          {contents.files.map((file, k) => (
            <FileTile
              key={k}
              file={file}
              onSelect={() => setSelectedFile(file)}
            />
          ))}
        </SimpleGrid>
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
