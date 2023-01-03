import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { SquareFill } from "react-bootstrap-icons";
import { CompactPicker } from "react-color";
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
  const [color, setColor] = useState<string>("#000000");
  const { addFolder } = useContext(FolderContext);

  const onSubmit = () => {
    const newFolder = {
      id: uuid(),
      name,
      color: color.substring(1), // Remove leading # from hex
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
          <Popover>
            <PopoverTrigger>
              <Button
                leftIcon={<SquareFill color={color} />}
                fontFamily="monospace"
              >
                {color}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverBody>
                <CompactPicker
                  color={color}
                  onChangeComplete={(c) => setColor(c.hex)}
                />
              </PopoverBody>
            </PopoverContent>
          </Popover>
          <Box flexGrow={1}></Box>
          <Button type="submit" onClick={onSubmit}>
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NewFolderModal;
