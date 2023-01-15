import { Table, TableContainer, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
import React, { useContext } from "react";
import FolderContext from "../../context/FolderContext";
import ListViewItem from "./ListViewItem";
import "./styles.sass";

const ListView: React.FC = () => {
  const { contents, pwd, setPwd, setActiveFile } = useContext(FolderContext);
  return (
    <TableContainer className="file-list-container">
      <Table>
        <Thead>
          <Tr className="file-list-header">
            <Th width="70px"></Th>
            <Th>Name</Th>
            <Th width="20%">Created</Th>
            <Th width="10%" isNumeric>
              Size
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {contents.folders.map((folder) => (
            <ListViewItem
              key={folder.id}
              item={folder}
              onSelect={() =>
                setPwd({
                  ...pwd,
                  parents: [...pwd.parents, pwd.current],
                  current: folder,
                })
              }
            />
          ))}
          {contents.files.map((file) => (
            <ListViewItem
              key={file.id}
              item={file}
              onSelect={() => setActiveFile(file)}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default ListView;
