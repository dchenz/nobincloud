import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { createFolder } from "../api/files";
import FolderContext from "../context/FolderContext";
import { uuid } from "../crypto/utils";
import { UUID } from "../types/Files";

type NewFolderModalProps = {
  onClose: () => void;
  parentFolder: UUID | null;
};

const NewFolderModal: React.FC<NewFolderModalProps> = ({
  onClose,
  parentFolder,
}) => {
  const [name, setName] = useState("");
  const { addFolder } = useContext(FolderContext);

  const onSubmit = () => {
    const newFolder = {
      id: uuid(),
      name,
      parentFolder,
    };
    createFolder(newFolder)
      .then(() => {
        addFolder(newFolder);
        onClose();
      })
      .catch(console.error);
  };

  return (
    <Modal isOpen={true} onClose={onClose} size="2xl" isCentered>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={(e) => e.preventDefault()}>
        <ModalHeader>New folder</ModalHeader>
        <ModalBody>
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button type="submit" onClick={onSubmit}>
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NewFolderModal;
