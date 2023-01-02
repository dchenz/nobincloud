import { Image } from "@chakra-ui/react";
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
    <Image
      src={imageData}
      alt={file.name}
      width={{ md: "100%", lg: "auto" }}
      height={{ md: "auto", lg: "500px" }}
    />
  );
};

export default ImageModal;
