import { Box, HStack } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { ArrowsMove, Folder2, Trash } from "react-bootstrap-icons";
import { deleteFolderContents } from "../../../api/files";
import ConfirmPopup from "../../../components/ConfirmPopup";
import MoveItemsModal from "../../../components/MoveItemsModal";
import NewFolderModal from "../../../components/NewFolderModal";
import ResponsiveIconButton from "../../../components/ResponsiveIconButton";
import UploadMenuButton from "../../../components/UploadMenuButton";
import ViewModeSelector from "../../../components/ViewModeSelector";
import AuthContext from "../../../context/AuthContext";
import FolderContext from "../../../context/FolderContext";
import { FILE_TYPE } from "../../../types/Files";
import "./styles.sass";

export default function Header(): JSX.Element {
  const [isCreatingFolder, setCreatingFolder] = useState(false);
  const [isMoving, setMoving] = useState(false);
  const { accountKey } = useContext(AuthContext);
  const { pwd, selectedItems, setSelectedItems, deleteFile, deleteFolder } =
    useContext(FolderContext);
  // TODO: Improve the typescript types.
  if (!accountKey) {
    throw new Error();
  }

  const removeSelectedFromView = () => {
    selectedItems.forEach((item) =>
      item.type === FILE_TYPE ? deleteFile(item) : deleteFolder(item)
    );
    setSelectedItems([]);
  };

  const onDeleteSelected = () => {
    deleteFolderContents(selectedItems).then(removeSelectedFromView);
  };

  return (
    <Box className="file-browser-header">
      <HStack gap={2} width="100%">
        {selectedItems.length > 0 ? (
          <>
            <ConfirmPopup
              prompt="Delete selected?"
              onConfirm={onDeleteSelected}
            >
              <ResponsiveIconButton
                icon={<Trash />}
                ariaLabel="delete-selected"
                text="Delete"
                title="Delete selected items"
              />
            </ConfirmPopup>
            <ResponsiveIconButton
              icon={<ArrowsMove />}
              ariaLabel="move-selected"
              text="Move"
              title="Move selected items"
              onClick={() => setMoving(true)}
            />
          </>
        ) : (
          <>
            <UploadMenuButton />
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
          parentFolder={pwd.current.id}
        />
      ) : null}
      {isMoving ? (
        <MoveItemsModal
          movingItems={selectedItems}
          onClose={() => setMoving(false)}
          onMove={removeSelectedFromView}
        />
      ) : null}
    </Box>
  );
}
