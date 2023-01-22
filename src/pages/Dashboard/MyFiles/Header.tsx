import { Box, HStack, useToast } from "@chakra-ui/react";
import React, { ChangeEvent, useContext, useState } from "react";
import { Folder2, Trash, Upload } from "react-bootstrap-icons";
import { deleteFolderContents, encryptAndUploadFile } from "../../../api/files";
import ConfirmPopup from "../../../components/ConfirmPopup";
import NewFolderModal from "../../../components/NewFolderModal";
import ResponsiveIconButton from "../../../components/ResponsiveIconButton";
import ViewModeSelector from "../../../components/ViewModeSelector";
import { MaxUploadSize } from "../../../const";
import AuthContext from "../../../context/AuthContext";
import FolderContext from "../../../context/FolderContext";
import { FILE_TYPE } from "../../../types/Files";
import "./styles.sass";

export default function Header(): JSX.Element {
  const toast = useToast();
  const [isCreatingFolder, setCreatingFolder] = useState(false);
  const { accountKey } = useContext(AuthContext);
  const {
    addFile,
    pwd,
    selectedItems,
    setSelectedItems,
    deleteFile,
    deleteFolder,
  } = useContext(FolderContext);
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

  const onDeleteSelected = () => {
    deleteFolderContents(selectedItems).then(() => {
      for (const f of selectedItems) {
        if (f.type === FILE_TYPE) {
          deleteFile(f);
        } else {
          deleteFolder(f);
        }
      }
      setSelectedItems([]);
    });
  };

  return (
    <Box className="file-browser-header">
      <HStack gap={2} width="100%">
        {selectedItems.length > 0 ? (
          <ConfirmPopup prompt="Delete selected?" onConfirm={onDeleteSelected}>
            <ResponsiveIconButton
              icon={<Trash />}
              ariaLabel="delete-selected"
              text="Delete"
              title="Delete selected items"
            />
          </ConfirmPopup>
        ) : (
          <>
            <ResponsiveIconButton
              icon={<Upload />}
              ariaLabel="upload"
              text="Upload"
              title="Upload file"
              onClick={onUploadButtonClick}
            />
            <ResponsiveIconButton
              icon={<Folder2 />}
              ariaLabel="create-folder"
              text="New"
              title="Create folder"
              onClick={() => setCreatingFolder(true)}
            />
          </>
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
