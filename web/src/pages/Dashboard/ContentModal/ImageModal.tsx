import { Box, Image } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { arrayBufferToString } from "../../../crypto/utils";
import { FileRef } from "../../../types/Files";

type ImageModalProps = {
  bytes: ArrayBuffer;
  file: FileRef;
};

const ImageModal: React.FC<ImageModalProps> = ({ file, bytes }) => {
  const imageData = useMemo(() => {
    const dataURI = arrayBufferToString(bytes, "base64");
    return "data:image/jpeg;base64," + dataURI;
  }, [bytes]);

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Image src={imageData} alt={file.name} maxW="100%" maxH="100%" />
    </Box>
  );
};

export default ImageModal;
