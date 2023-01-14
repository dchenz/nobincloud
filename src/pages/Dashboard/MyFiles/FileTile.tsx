import { Box, Image, Text } from "@chakra-ui/react";
import React from "react";
import { loadFileThumbnail } from "../../../misc/thumbnails";
import { FileRef } from "../../../types/Files";
import "./styles.scss";

type FileTileProps = {
  file: FileRef;
  onSelect: () => void;
};

const FileTile: React.FC<FileTileProps> = ({ file, onSelect }) => {
  return (
    <Box
      title={file.metadata.name}
      style={{ width: 200 }}
      className="file-tile-container"
      onClick={onSelect}
      data-test-id={`file_${file.id}`}
    >
      <Image
        src={loadFileThumbnail(file)}
        alt={file.metadata.name}
        width="96px"
        margin="0 auto"
      />
      <Box p={3}>
        <Text className="file-tile-name">{file.metadata.name}</Text>
      </Box>
    </Box>
  );
};

export default FileTile;
