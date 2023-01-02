import {
  Box,
  Divider,
  IconButton,
  Modal,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { Download, Trash } from "react-bootstrap-icons";
import { deleteFileOnServer, getFileDownload } from "../../../api/files";
import ConfirmPopup from "../../../components/ConfirmPopup";
import FolderContext from "../../../context/FolderContext";
import { saveFile } from "../../../misc/fileutils";
import { FileRef } from "../../../types/Files";
import ImageModal from "./ImageModal";
import PDFModal from "./PDFModal";

type ContentModalProps = {
  selectedFile: FileRef;
  onClose: () => void;
};

const ContentModal: React.FC<ContentModalProps> = ({
  selectedFile,
  onClose,
}) => {
  const { deleteFile } = useContext(FolderContext);
  const [fileBytes, setFileBytes] = useState<ArrayBuffer | null>(null);

  useEffect(() => {
    getFileDownload(selectedFile)
      .then((buf) => setFileBytes(buf))
      .catch(console.error);
  }, []);

  const renderPreview = (bytes: ArrayBuffer, mimetype: string) => {
    if (mimetype.startsWith("image/")) {
      return <ImageModal file={selectedFile} bytes={bytes} />;
    }
    if (mimetype === "application/pdf") {
      return <PDFModal file={selectedFile} bytes={bytes} />;
    }
    return null;
  };

  const onDeleteFile = () => {
    deleteFileOnServer(selectedFile)
      .then(() => {
        deleteFile(selectedFile);
        onClose();
      })
      .catch(console.error);
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="80vw">
        {fileBytes ? (
          <Box display={{ md: "block", lg: "flex" }}>
            <Box flexGrow={1} h="80vh" overflowY="scroll">
              {renderPreview(fileBytes, selectedFile.mimetype)}
            </Box>
            <VStack
              px={4}
              py={8}
              gap={2}
              backgroundColor="#f5f5f5"
              width={{ md: "100%", lg: "300px" }}
              alignItems="self-start"
            >
              <Text>{selectedFile.name}</Text>
              <Divider />
              <Box>
                <IconButton
                  title="Download"
                  icon={<Download />}
                  aria-label="download"
                  onClick={() => saveFile(fileBytes, selectedFile.name)}
                />
                <ConfirmPopup prompt="Delete file?" onConfirm={onDeleteFile}>
                  <IconButton
                    title="Delete"
                    icon={<Trash />}
                    aria-label="delete"
                  />
                </ConfirmPopup>
              </Box>
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
