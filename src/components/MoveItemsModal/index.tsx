import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useCallback, useContext } from "react";
import FolderContext from "../../context/FolderContext";
import { isSubfolderOrEqual } from "../../misc/fileutils";
import { FileRef, FolderRef, FOLDER_TYPE } from "../../types/Files";
import ListView from "../FolderListView";
import FoldersProvider from "../FoldersProvider";
import PathViewer from "../PathViewer";
import "./styles.sass";

type MoveItemsModalProps = {
  movingItems: (FileRef | FolderRef)[];
  onClose: () => void;
};

const MoveItemsModal: React.FC<MoveItemsModalProps> = ({
  movingItems,
  onClose,
}) => {
  const { contents, pwd, setPwd } = useContext(FolderContext);

  const onItemOpen = useCallback(
    (item: FileRef | FolderRef) => {
      if (item.type === FOLDER_TYPE) {
        setPwd({
          ...pwd,
          parents: [...pwd.parents, pwd.current],
          current: item,
        });
      }
    },
    [pwd, setPwd]
  );

  const cannotMoveInto = useCallback(
    (testItem: FileRef | FolderRef) => {
      // Non-folders are hidden from view.
      if (testItem.type !== FOLDER_TYPE) {
        return true;
      }
      const itemPath = {
        current: testItem,
        parents: [...pwd.parents, pwd.current],
      };
      // Cannot move a folder into itself or its subfolders.
      for (const itemBeingMoved of movingItems) {
        if (
          itemBeingMoved.type === FOLDER_TYPE &&
          isSubfolderOrEqual(itemBeingMoved, itemPath)
        ) {
          return true;
        }
      }
      return false;
    },
    [pwd, movingItems]
  );

  return (
    <Modal isOpen={true} onClose={onClose} size="2xl" isCentered>
      <ModalOverlay />
      <ModalContent className="move-items-modal">
        <ModalHeader>Move items</ModalHeader>
        <ModalBody className="move-items-modal-body">
          <PathViewer />
          <ListView
            items={[...contents.folders]}
            onItemOpen={onItemOpen}
            selectSingleItem
            disableFunc={cannotMoveInto}
          />
        </ModalBody>
        <ModalFooter>
          <Button>Move here</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default (props: MoveItemsModalProps) => (
  <FoldersProvider>
    <MoveItemsModal {...props} />
  </FoldersProvider>
);
