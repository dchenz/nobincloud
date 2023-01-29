import { Image, Td, Tr } from "@chakra-ui/react";
import classNames from "classnames";
import React, { useContext, useMemo } from "react";
import FolderContext from "../../context/FolderContext";
import { formatBinarySize, formatRelativeTime } from "../../misc/fileutils";
import { loadFileThumbnail } from "../../misc/thumbnails";
import { FileRef, FILE_TYPE, FolderRef } from "../../types/Files";
import FileSelectCheckbox from "../FileSelectCheckbox";
import "./styles.sass";

type ListViewItemProps = {
  item: FileRef | FolderRef;
  onItemOpen: () => void;
  selectSingleItem?: boolean;
  disabled?: boolean;
};

const ListViewItem: React.FC<ListViewItemProps> = ({
  item,
  onItemOpen,
  selectSingleItem,
  disabled,
}) => {
  const { selectedItems, toggleSelectedItem, setSelectedItems } =
    useContext(FolderContext);

  const selected = useMemo(() => {
    const s = selectedItems.find((f) => f.id === item.id);
    return s !== undefined;
  }, [item, selectedItems]);

  const onSelect = () => {
    if (selectSingleItem && !selected) {
      setSelectedItems([item]);
    } else {
      toggleSelectedItem(item);
    }
  };

  const onCellClick = !disabled ? onItemOpen : undefined;

  return (
    <Tr
      className={classNames({
        "file-list-item": true,
        hoverable: !disabled,
        disabled,
      })}
      data-test-id={`${item.type}_${item.id}`}
    >
      <Td>
        {!disabled ? (
          <FileSelectCheckbox
            selected={selected}
            onSelect={onSelect}
            permanent={selectedItems.length > 0}
          />
        ) : null}
      </Td>
      <Td className="file-list-item-icon" onClick={onCellClick}>
        <Image
          src={
            item.type === FILE_TYPE
              ? loadFileThumbnail(item)
              : "/static/media/folder-icon.png"
          }
        />
      </Td>
      <Td onClick={onCellClick}>{item.metadata.name}</Td>
      <Td onClick={onCellClick}>
        {item.type === FILE_TYPE
          ? formatRelativeTime(item.metadata.createdAt)
          : null}
      </Td>
      <Td onClick={onCellClick} isNumeric>
        {item.type === FILE_TYPE ? formatBinarySize(item.metadata.size) : null}
      </Td>
    </Tr>
  );
};

export default ListViewItem;
