import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import FolderContext from "../../context/FolderContext";
import { FileRef, FolderRef, FOLDER_TYPE } from "../../types/Files";
import ListView from "../FolderListView";
import FoldersProvider from "../FoldersProvider";
import PathViewer from "../PathViewer";
import "./styles.sass";

type MoveItemsModalProps = {
  onClose: () => void;
};

const MoveItemsModal: React.FC<MoveItemsModalProps> = ({ onClose }) => {
  const { contents, pwd, setPwd } = useContext(FolderContext);

  const onItemOpen = (item: FileRef | FolderRef) => {
    if (item.type === FOLDER_TYPE) {
      setPwd({
        ...pwd,
        parents: [...pwd.parents, pwd.current],
        current: item,
      });
    }
  };

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
