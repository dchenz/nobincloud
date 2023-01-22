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
import { deleteFolderContents, getFileDownload } from "../../../api/files";
import ConfirmPopup from "../../../components/ConfirmPopup";
import FolderContext from "../../../context/FolderContext";
import {
  formatBinarySize,
  isImage,
  isPDF,
  saveFile,
} from "../../../misc/fileutils";
import { FileRef } from "../../../types/Files";
import ImageModal from "./ImageModal";
import PDFModal from "./PDFModal";
import "./styles.sass";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isImage(selectedFile) || isPDF(selectedFile)) {
      setLoading(true);
      getFileDownload(selectedFile)
        .then((buf) => setFileBytes(buf))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, []);

  const renderPreview = () => {
    if (!fileBytes) {
      return null;
    }
    if (isImage(selectedFile)) {
      return <ImageModal file={selectedFile} bytes={fileBytes} />;
    }
    if (isPDF(selectedFile)) {
      return <PDFModal file={selectedFile} bytes={fileBytes} />;
    }
    return null;
  };

  const onDeleteFile = () => {
    deleteFolderContents([selectedFile])
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
        {loading ? (
          <Spinner />
        ) : (
          <Box display={{ md: "block", lg: "flex" }}>
            <Box flexGrow={1} h="80vh" overflowY="scroll">
              {renderPreview()}
            </Box>
            <VStack
              px={4}
              py={8}
              backgroundColor="#f5f5f5"
              width={{ md: "100%", lg: "300px" }}
              alignItems="self-start"
            >
              <Text>{selectedFile.metadata.name}</Text>
              <div className="file-detail-item">
                {selectedFile.metadata.createdAt.toLocaleString()}
              </div>
              <div className="file-detail-item">
                {formatBinarySize(selectedFile.metadata.size)}
              </div>
              <Divider />
              <Box>
                <IconButton
                  title="Download"
                  icon={<Download />}
                  aria-label="download"
                  onClick={() =>
                    saveFile(
                      fileBytes as ArrayBuffer,
                      selectedFile.metadata.name
                    )
                  }
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
        )}
      </ModalContent>
    </Modal>
  );
};

export default ContentModal;
