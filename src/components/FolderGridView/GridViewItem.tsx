import { Box, Image, Text } from "@chakra-ui/react";
import React from "react";
import { loadFileThumbnail } from "../../misc/thumbnails";
import { FileRef, FILE_TYPE, FolderRef } from "../../types/Files";
import "./styles.sass";

type GridViewItemProps = {
  item: FileRef | FolderRef;
  onSelect: () => void;
};

const GridViewItem: React.FC<GridViewItemProps> = ({ item, onSelect }) => {
  return (
    <Box
      title={item.metadata.name}
      style={{ width: 200 }}
      className="file-tile-container"
      onClick={onSelect}
      data-test-id={`${item.type}_${item.id}`}
    >
      <Image
        src={
          item.type === FILE_TYPE
            ? loadFileThumbnail(item)
            : "/static/media/folder-icon.png"
        }
        alt={item.metadata.name}
        width="96px"
        margin="0 auto"
      />
      <Box p={3}>
        <Text className="file-tile-name">{item.metadata.name}</Text>
      </Box>
    </Box>
  );
};

export default GridViewItem;
