import {
  Box,
  Center,
  Modal,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { getFileDownload } from "../../../api/files";
import AuthContext from "../../../context/AuthContext";
import { FileRef } from "../../../types/Files";
import ImageModal from "./ImageModal";

type ContentModalProps = {
  selectedFile: FileRef;
  onClose: () => void;
};

const ContentModal: React.FC<ContentModalProps> = (props) => {
  const [fileBytes, setFileBytes] = useState<ArrayBuffer | null>(null);
  const { accountKey } = useContext(AuthContext);
  if (!accountKey) {
    throw new Error();
  }

  useEffect(() => {
    getFileDownload(props.selectedFile, accountKey)
      .then((buf) => setFileBytes(buf))
      .catch(console.error);
  }, []);

  const renderPreview = (bytes: ArrayBuffer, mimetype: string) => {
    if (mimetype.startsWith("image/")) {
      return <ImageModal file={props.selectedFile} bytes={bytes} />;
    }
    return null;
  };

  return (
    <Modal isOpen={true} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent maxW="80vw">
        {fileBytes ? (
          <Box display={{ md: "block", lg: "flex" }}>
            <Center flexGrow={1}>
              {renderPreview(fileBytes, props.selectedFile.mimetype)}
            </Center>
            <VStack
              px={4}
              py={8}
              backgroundColor="#f5f5f5"
              width={{ md: "100%", lg: "300px" }}
              alignItems="self-start"
            >
              <Text>{props.selectedFile.name}</Text>
            </VStack>
          </Box>
        ) : (
          <Spinner />
        )}
      </ModalContent>
    </Modal>
  );
};

export default ContentModal;
