import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { MaxUploadSize } from "../const";

type UploadMenuButtonProps = {
  onFileUpload: (_: File) => void;
  onFolderUpload: (_: File[]) => void;
};

const UploadMenuButton: React.FC<UploadMenuButtonProps> = ({
  onFileUpload,
  onFolderUpload,
}) => {
  const toast = useToast();

  const selectFileInput = () => {
    const fileForm = document.createElement("input");
    fileForm.type = "file";
    fileForm.click();
    fileForm.onchange = (e: Event) => {
      const selectedFile = (e.target as HTMLInputElement).files?.[0];
      if (!selectedFile) {
        return;
      }
      if (selectedFile.size >= MaxUploadSize) {
        toast({
          title: `Upload failed: ${selectedFile.name}`,
          description: "Exceeded maximum file size of 32MB",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        onFileUpload(selectedFile);
      }
    };
  };

  const selectFolderInput = () => {
    const fileForm = document.createElement("input");
    fileForm.type = "file";
    fileForm.webkitdirectory = true;
    fileForm.click();
    fileForm.onchange = (e: Event) => {
      const fileList = (e.target as HTMLInputElement).files;
      if (!fileList || fileList.length === 0) {
        return;
      }
      const selectedFiles = [];
      for (const f of fileList) {
        if (f.size >= MaxUploadSize) {
          toast({
            title: `Upload failed: ${f.name}`,
            description: "Exceeded maximum file size of 32MB",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return;
        }
        selectedFiles.push(f);
      }
      onFolderUpload(selectedFiles);
    };
  };

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        Upload
      </MenuButton>
      <MenuList>
        <MenuItem onClick={selectFileInput}>File</MenuItem>
        <MenuItem onClick={selectFolderInput}>Folder</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default UploadMenuButton;
