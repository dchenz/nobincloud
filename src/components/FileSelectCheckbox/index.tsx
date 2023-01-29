import classNames from "classnames";
import React from "react";
import { Check } from "react-bootstrap-icons";
import "./styles.sass";

type FileSelectCheckboxProps = {
  selected: boolean;
  onSelect: () => void;
  permanent: boolean;
  title?: string;
};

const FileSelectCheckbox: React.FC<FileSelectCheckboxProps> = ({
  selected,
  onSelect,
  permanent,
  title,
}) => (
  <button
    className={classNames({
      "file-item-checkbox": true,
      selected,
      permanent,
    })}
    title={title}
    onClick={onSelect}
    role="checkbox"
  >
    {selected ? <Check /> : null}
  </button>
);

export default FileSelectCheckbox;
