import { Box, SimpleGrid } from "@chakra-ui/react";
import React, { useContext } from "react";
import FolderContext from "../../../context/FolderContext";
import Header from "./Header";
import PathViewer from "./PathViewer";
import "./styles.scss";

export default function MyFilesDashboard(): JSX.Element {
  const { contents } = useContext(FolderContext);
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
            <Box key={k}>{file.name}</Box>
          ))}
        </SimpleGrid>
      </div>
    </div>
  );
}
