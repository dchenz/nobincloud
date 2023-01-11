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
      title={folder.metadata.name}
      style={{ width: 200 }}
      className="file-tile-container"
      onClick={onSelect}
      data-test-id={`folder_${folder.id}`}
    >
      <Image
        src="/static/media/folder-icon.png"
        alt={folder.metadata.name}
        width="96px"
        margin="0 auto"
      />
      <Box p={3}>
        <Text className="file-tile-name">{folder.metadata.name}</Text>
      </Box>
    </Box>
  );
};

export default FolderTile;
