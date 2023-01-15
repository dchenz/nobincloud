import { Table, TableContainer, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
import React, { useContext } from "react";
import FolderContext from "../../context/FolderContext";
import { FileRef, FolderRef } from "../../types/Files";
import FileSelectCheckbox from "../FileSelectCheckbox";
import ListViewItem from "./ListViewItem";
import "./styles.sass";

type ListViewProps = {
  items: (FileRef | FolderRef)[];
  onItemOpen: (_: FileRef | FolderRef) => void;
};

const ListView: React.FC<ListViewProps> = ({ items, onItemOpen }) => {
  const { selectedItems, setSelectedItems, contents } =
    useContext(FolderContext);

  const allSelected =
    contents.files.length + contents.folders.length > 0 &&
    selectedItems.length === contents.files.length + contents.folders.length;

  return (
    <TableContainer className="file-list-container">
      <Table>
        <Thead>
          <Tr className="file-list-header">
            <Th width="70px">
              <FileSelectCheckbox
                selected={allSelected}
                onSelect={() =>
                  allSelected
                    ? setSelectedItems([])
                    : setSelectedItems([...contents.folders, ...contents.files])
                }
                title={allSelected ? "Deselect all" : "Select all"}
                permanent
              />
            </Th>
            <Th width="70px"></Th>
            <Th>Name</Th>
            <Th width="20%">Created</Th>
            <Th width="10%" isNumeric>
              Size
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map((item) => (
            <ListViewItem
              key={item.id}
              item={item}
              onItemOpen={() => onItemOpen(item)}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default ListView;
