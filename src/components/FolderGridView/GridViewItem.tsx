import { Box, Image, Text } from "@chakra-ui/react";
import React from "react";
import { loadFileThumbnail } from "../../misc/thumbnails";
import { FileRef, FILE_TYPE, FolderRef } from "../../types/Files";
import FileSelectCheckbox from "../FileSelectCheckbox";
import "./styles.sass";

type GridViewItemProps = {
  item: FileRef | FolderRef;
  onItemOpen: () => void;
};

const GridViewItem: React.FC<GridViewItemProps> = ({ item, onItemOpen }) => (
  <div className="file-tile-item">
    <FileSelectCheckbox item={item} />
    <Box
      title={item.metadata.name}
      onClick={onItemOpen}
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
        <Text className="file-tile-item-name">{item.metadata.name}</Text>
      </Box>
    </Box>
  </div>
);

export default GridViewItem;
