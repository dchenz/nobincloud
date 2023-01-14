import { Image, Table, TableContainer, Tbody, Td, Tr } from "@chakra-ui/react";
import React, { useContext } from "react";
import FolderContext from "../../../context/FolderContext";
import { formatBinarySize } from "../../../misc/fileutils";
import { loadFileThumbnail } from "../../../misc/thumbnails";
import { FileRef } from "../../../types/Files";
import "./styles.sass";

type ListViewProps = {
  selectFile: (_: FileRef) => void;
};

const ListView: React.FC<ListViewProps> = ({ selectFile }) => {
  const { contents, pwd, setPwd } = useContext(FolderContext);
  return (
    <TableContainer>
      <Table>
        <Tbody>
          {contents.folders.map((folder) => (
            <Tr
              key={folder.id}
              className="file-list-item"
              onClick={() => {
                setPwd({
                  ...pwd,
                  parents: [...pwd.parents, pwd.current],
                  current: folder,
                });
              }}
            >
              <Td className="file-list-item-icon">
                <Image src="/static/media/folder-icon.png" />
              </Td>
              <Td>{folder.metadata.name}</Td>
              <Td></Td>
            </Tr>
          ))}
          {contents.files.map((file) => (
            <Tr
              key={file.id}
              className="file-list-item"
              onClick={() => selectFile(file)}
            >
              <Td className="file-list-item-icon">
                <Image src={loadFileThumbnail(file)} />
              </Td>
              <Td>{file.metadata.name}</Td>
              <Td className="file-list-item-size">
                {formatBinarySize(file.metadata.size)}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default ListView;
