import { Image, Td, Tr } from "@chakra-ui/react";
import React from "react";
import { formatBinarySize, formatRelativeTime } from "../../misc/fileutils";
import { loadFileThumbnail } from "../../misc/thumbnails";
import { FileRef, FILE_TYPE, FolderRef } from "../../types/Files";
import "./styles.sass";

type ListViewItemProps = {
  item: FileRef | FolderRef;
  onSelect: () => void;
};

const ListViewItem: React.FC<ListViewItemProps> = ({ item, onSelect }) => {
  return (
    <Tr
      className="file-list-item"
      onClick={onSelect}
      data-test-id={`${item.type}_${item.id}`}
    >
      <Td className="file-list-item-icon">
        <Image
          src={
            item.type === FILE_TYPE
              ? loadFileThumbnail(item)
              : "/static/media/folder-icon.png"
          }
        />
      </Td>
      <Td>{item.metadata.name}</Td>
      <Td>
        {item.type === FILE_TYPE
          ? formatRelativeTime(item.metadata.createdAt)
          : null}
      </Td>
      <Td isNumeric>
        {item.type === FILE_TYPE ? formatBinarySize(item.metadata.size) : null}
      </Td>
    </Tr>
  );
};

export default ListViewItem;
