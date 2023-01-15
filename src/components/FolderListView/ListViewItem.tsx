import { Image, Td, Tr } from "@chakra-ui/react";
import React from "react";
import { formatBinarySize, formatRelativeTime } from "../../misc/fileutils";
import { loadFileThumbnail } from "../../misc/thumbnails";
import { FileRef, FILE_TYPE, FolderRef } from "../../types/Files";
import FileSelectCheckbox from "../FileSelectCheckbox";
import "./styles.sass";

type ListViewItemProps = {
  item: FileRef | FolderRef;
  onItemOpen: () => void;
};

const ListViewItem: React.FC<ListViewItemProps> = ({ item, onItemOpen }) => (
  <Tr className="file-list-item" data-test-id={`${item.type}_${item.id}`}>
    <Td>
      <FileSelectCheckbox item={item} />
    </Td>
    <Td className="file-list-item-icon" onClick={onItemOpen}>
      <Image
        src={
          item.type === FILE_TYPE
            ? loadFileThumbnail(item)
            : "/static/media/folder-icon.png"
        }
      />
    </Td>
    <Td onClick={onItemOpen}>{item.metadata.name}</Td>
    <Td onClick={onItemOpen}>
      {item.type === FILE_TYPE
        ? formatRelativeTime(item.metadata.createdAt)
        : null}
    </Td>
    <Td onClick={onItemOpen} isNumeric>
      {item.type === FILE_TYPE ? formatBinarySize(item.metadata.size) : null}
    </Td>
  </Tr>
);

export default ListViewItem;
