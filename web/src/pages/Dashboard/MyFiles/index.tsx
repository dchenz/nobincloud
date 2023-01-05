import { Divider, SimpleGrid } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import AuthContext from "../../../context/AuthContext";
import FolderContext from "../../../context/FolderContext";
import { FileRef } from "../../../types/Files";
import ContentModal from "../ContentModal";
import FileTile from "./FileTile";
import FolderTile from "./FolderTile";
import Header from "./Header";
import PathViewer from "./PathViewer";
import "./styles.scss";

export default function MyFilesDashboard(): JSX.Element {
  const [selectedFile, setSelectedFile] = useState<FileRef | null>(null);
  const { contents, pwd, setPwd } = useContext(FolderContext);
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
        <SimpleGrid columns={[1, 2, 3, 4, 5, 6]} spacing={8}>
          {contents.folders.map((folder) => (
            <FolderTile
              key={folder.id}
              folder={folder}
              onSelect={() =>
                setPwd({
                  ...pwd,
                  parents: [...pwd.parents, pwd.current],
                  current: folder,
                })
              }
            />
          ))}
          {contents.files.map((file) => (
            <FileTile
              key={file.id}
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
