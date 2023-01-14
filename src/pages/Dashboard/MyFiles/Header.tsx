import { Box, Button, HStack } from "@chakra-ui/react";
import React, { ChangeEvent, useContext, useState } from "react";
import { Folder2, Upload } from "react-bootstrap-icons";
import { encryptAndUploadFile } from "../../../api/files";
import NewFolderModal from "../../../components/NewFolderModal";
import ViewModeSelector from "../../../components/ViewModeSelector";
import AuthContext from "../../../context/AuthContext";
import FolderContext from "../../../context/FolderContext";
import { FileRef } from "../../../types/Files";
import "./styles.sass";

export default function Header(): JSX.Element {
  const [isCreatingFolder, setCreatingFolder] = useState(false);
  const { accountKey } = useContext(AuthContext);
  const { addFile, pwd } = useContext(FolderContext);
  // TODO: Improve the typescript types.
  if (!accountKey) {
    throw new Error();
  }

  const onProgress = (currentChunks: number, totalChunks: number) =>
    console.log(currentChunks, totalChunks);

  const onComplete = (item: FileRef) => {
    addFile(item);
  };

  const onUploadButtonClick = () => {
    const fileForm = document.createElement("input");
    fileForm.type = "file";
    fileForm.click();
    // @ts-ignore
    fileForm.onchange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const uploadRequest = {
          file: e.target.files[0],
          parentFolder: pwd.current.id,
        };
        encryptAndUploadFile(uploadRequest, accountKey, onProgress, onComplete);
      }
    };
  };

  return (
    <Box className="file-browser-header">
      <HStack gap={2} width="100%">
        <Button
          leftIcon={<Upload />}
          color="black"
          onClick={onUploadButtonClick}
        >
          Upload
        </Button>
        <Button
          leftIcon={<Folder2 />}
          color="black"
          onClick={() => setCreatingFolder(true)}
          data-test-id="create-folder"
        >
          New
        </Button>
        <Box flexGrow={1}></Box>
        <ViewModeSelector />
      </HStack>
      {isCreatingFolder ? (
        <NewFolderModal
          onClose={() => setCreatingFolder(false)}
          parentFolder={pwd.current.id}
        />
      ) : null}
    </Box>
  );
}
