import { Box, Button, HStack, IconButton, useToast } from "@chakra-ui/react";
import React, { ChangeEvent, useContext, useState } from "react";
import { Folder2, Upload } from "react-bootstrap-icons";
import { encryptAndUploadFile } from "../../../api/files";
import NewFolderModal from "../../../components/NewFolderModal";
import ViewModeSelector from "../../../components/ViewModeSelector";
import { MaxUploadSize } from "../../../const";
import AuthContext from "../../../context/AuthContext";
import FolderContext from "../../../context/FolderContext";
import { useMobileView } from "../../../misc/hooks";
import "./styles.sass";

export default function Header(): JSX.Element {
  const isMobileView = useMobileView();
  const toast = useToast();
  const [isCreatingFolder, setCreatingFolder] = useState(false);
  const { accountKey } = useContext(AuthContext);
  const { addFile, pwd } = useContext(FolderContext);
  // TODO: Improve the typescript types.
  if (!accountKey) {
    throw new Error();
  }

  const onUploadButtonClick = () => {
    const fileForm = document.createElement("input");
    fileForm.type = "file";
    fileForm.click();
    // @ts-ignore
    fileForm.onchange = (e: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (!selectedFile) {
        return;
      }
      if (selectedFile.size < MaxUploadSize) {
        const uploadRequest = {
          file: selectedFile,
          parentFolder: pwd.parents.length > 0 ? pwd.current.id : null,
        };
        encryptAndUploadFile(uploadRequest, accountKey, addFile);
      } else {
        toast({
          title: "Upload failed",
          description: "Exceeded max upload limit of 32MB",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };
  };

  return (
    <Box className="file-browser-header">
      <HStack gap={2} width="100%">
        {isMobileView ? (
          <IconButton onClick={onUploadButtonClick} aria-label="upload">
            <Upload />
          </IconButton>
        ) : (
          <Button leftIcon={<Upload />} onClick={onUploadButtonClick}>
            Upload
          </Button>
        )}
        {isMobileView ? (
          <IconButton aria-label="create-folder" data-test-id="create-folder">
            <Folder2 />
          </IconButton>
        ) : (
          <Button
            leftIcon={<Folder2 />}
            onClick={() => setCreatingFolder(true)}
            data-test-id="create-folder"
          >
            New
          </Button>
        )}
        <Box flexGrow={1}></Box>
        <ViewModeSelector />
      </HStack>
      {isCreatingFolder ? (
        <NewFolderModal
          onClose={() => setCreatingFolder(false)}
          parentFolder={pwd.parents.length > 0 ? pwd.current.id : null}
        />
      ) : null}
    </Box>
  );
}
