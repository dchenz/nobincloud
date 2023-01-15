import React, { useContext, useMemo } from "react";
import { Check } from "react-bootstrap-icons";
import FolderContext from "../../context/FolderContext";
import { FileRef, FolderRef } from "../../types/Files";
import "./styles.sass";

type FileSelectCheckboxProps = {
  item: FileRef | FolderRef;
};

const FileSelectCheckbox: React.FC<FileSelectCheckboxProps> = ({ item }) => {
  const { selectedItems, toggleSelectedItem } = useContext(FolderContext);

  const selected = useMemo(() => {
    const s = selectedItems.find((f) => f.id === item.id);
    return s !== undefined;
  }, [item, selectedItems]);

  return (
    <div
      className={
        "file-item-checkbox" +
        (selected ? " selected" : "") +
        (selectedItems.length > 0 ? " selection-mode" : "")
      }
      onClick={() => toggleSelectedItem(item)}
      role="checkbox"
    >
      {selected ? <Check /> : null}
    </div>
  );
};

export default FileSelectCheckbox;
