import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { uploadFileList } from "../api/helpers";
import { MAX_UPLOAD_SIZE } from "../const";
import AuthContext from "../context/AuthContext";
import FolderContext from "../context/FolderContext";
import { uuid } from "../crypto/utils";
import { getUploadDisplayName } from "../misc/fileutils";
import { FileRef, FILE_TYPE, FolderRef } from "../types/Files";

const UploadMenuButton: React.FC = () => {
  const toast = useToast();
  const { addFile, addFolder, pwd, addUpload, incrementUpload } =
    useContext(FolderContext);
  const { accountKey } = useContext(AuthContext);
  if (!accountKey) {
    throw new Error();
  }

  const uploadFiles = (fileList: FileList, asFolder: boolean) => {
    const uploadID = uuid();
    for (const f of fileList) {
      if (f.size >= MAX_UPLOAD_SIZE) {
        toast({
          title: `Upload failed: ${f.name}`,
          description: "Exceeded maximum file size of 32MB",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }
    const onItemUpload = (item: FileRef | FolderRef) => {
      if (item.type === FILE_TYPE) {
        if (item.parentFolder === pwd.current.id) {
          addFile(item);
        }
        incrementUpload(uploadID);
      } else if (item.parentFolder === pwd.current.id) {
        addFolder(item);
      }
    };
    addUpload(
      uploadID,
      fileList.length,
      getUploadDisplayName(fileList, asFolder)
    );
    uploadFileList(fileList, pwd.current.id, accountKey, onItemUpload);
  };

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        Upload
      </MenuButton>
      <MenuList>
        <MenuItem
          onClick={() => {
            const fileForm = document.createElement("input");
            fileForm.type = "file";
            fileForm.multiple = true;
            fileForm.click();
            fileForm.onchange = (e: Event) => {
              const fileList = (e.target as HTMLInputElement).files;
              if (!fileList || fileList.length === 0) {
                return;
              }
              uploadFiles(fileList, false);
            };
          }}
        >
          File
        </MenuItem>
        <MenuItem
          onClick={() => {
            const fileForm = document.createElement("input");
            fileForm.type = "file";
            fileForm.webkitdirectory = true;
            fileForm.click();
            fileForm.onchange = (e: Event) => {
              const fileList = (e.target as HTMLInputElement).files;
              if (!fileList || fileList.length === 0) {
                return;
              }
              uploadFiles(fileList, true);
            };
          }}
        >
          Folder
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default UploadMenuButton;
