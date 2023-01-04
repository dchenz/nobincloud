import { Box, Image, Text } from "@chakra-ui/react";
import React from "react";
import { FolderRef } from "../../../types/Files";

type FolderTileProps = {
  folder: FolderRef;
  onSelect: () => void;
};

const FolderTile: React.FC<FolderTileProps> = ({ folder, onSelect }) => {
  return (
    <Box
      title={folder.name}
      style={{ width: 200 }}
      className="file-tile-container"
      onClick={onSelect}
    >
      <Image
        src="/static/media/folder-icon.png"
        alt={folder.name}
        width="96px"
        margin="0 auto"
      />
      <Box p={3}>
        <Text className="file-tile-name">{folder.name}</Text>
      </Box>
    </Box>
  );
};

export default FolderTile;
