import { SimpleGrid } from "@chakra-ui/react";
import React, { useContext } from "react";
import FolderContext from "../../../context/FolderContext";
import { FileRef } from "../../../types/Files";
import FileTile from "./FileTile";
import FolderTile from "./FolderTile";

type GridViewProps = {
  selectFile: (_: FileRef) => void;
};

const GridView: React.FC<GridViewProps> = ({ selectFile }) => {
  const { contents, pwd, setPwd } = useContext(FolderContext);
  return (
    <SimpleGrid columns={[1, 2, 3, 4, 5, 6]} spacing={8}>
      {contents.folders.map((folder) => (
        <FolderTile
          key={folder.id}
          folder={folder}
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
        <FileTile key={file.id} file={file} onSelect={() => selectFile(file)} />
      ))}
    </SimpleGrid>
  );
};

export default GridView;
