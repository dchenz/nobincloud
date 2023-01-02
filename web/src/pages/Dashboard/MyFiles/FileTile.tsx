import { Box, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { loadFileThumbnail } from "../../../misc/thumbnails";
import { FileRef } from "../../../types/Files";
import "./styles.scss";

type FileTileProps = {
  file: FileRef;
  onSelect: () => void;
};

const FileTile: React.FC<FileTileProps> = ({ file, onSelect }) => {
  const [thumbnail, setThumbnail] = useState<string>("");

  useEffect(() => {
    loadFileThumbnail(file).then((t) => setThumbnail(t ?? ""));
  }, []);

  return (
    <Box
      title={file.name}
      style={{ width: 200 }}
      className="file-tile-container"
      onClick={onSelect}
    >
      <Image src={thumbnail} alt={file.name} width="96px" margin="0 auto" />
      <Box p={3}>
        <Text className="file-tile-name">{file.name}</Text>
      </Box>
    </Box>
  );
};

export default FileTile;
