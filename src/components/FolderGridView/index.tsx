import { SimpleGrid } from "@chakra-ui/react";
import React, { useContext } from "react";
import FolderContext from "../../context/FolderContext";
import GridViewItem from "./GridViewItem";
import "./styles.sass";

const GridView: React.FC = () => {
  const { contents, pwd, setPwd, setActiveFile } = useContext(FolderContext);
  return (
    <SimpleGrid columns={[1, 2, 3, 4, 5, 6]} spacing={8}>
      {contents.folders.map((folder) => (
        <GridViewItem
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
        <GridViewItem
          key={file.id}
          item={file}
          onSelect={() => setActiveFile(file)}
        />
      ))}
    </SimpleGrid>
  );
};

export default GridView;
