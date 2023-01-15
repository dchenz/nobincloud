import { Box, Image, Text } from "@chakra-ui/react";
import React, { useContext, useMemo } from "react";
import FolderContext from "../../context/FolderContext";
import { loadFileThumbnail } from "../../misc/thumbnails";
import { FileRef, FILE_TYPE, FolderRef } from "../../types/Files";
import FileSelectCheckbox from "../FileSelectCheckbox";
import "./styles.sass";

type GridViewItemProps = {
  item: FileRef | FolderRef;
  onItemOpen: () => void;
};

const GridViewItem: React.FC<GridViewItemProps> = ({ item, onItemOpen }) => {
  const { selectedItems, toggleSelectedItem } = useContext(FolderContext);

  const selected = useMemo(() => {
    const s = selectedItems.find((f) => f.id === item.id);
    return s !== undefined;
  }, [item, selectedItems]);

  return (
    <div className="file-tile-item">
      <FileSelectCheckbox
        selected={selected}
        onSelect={() => toggleSelectedItem(item)}
        permanent={selectedItems.length > 0}
      />
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
};

export default GridViewItem;
