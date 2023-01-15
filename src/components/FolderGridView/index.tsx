import { SimpleGrid } from "@chakra-ui/react";
import React from "react";
import { FileRef, FolderRef } from "../../types/Files";
import GridViewItem from "./GridViewItem";
import "./styles.sass";

type GridViewProps = {
  items: (FileRef | FolderRef)[];
  onItemOpen: (_: FileRef | FolderRef) => void;
};

const GridView: React.FC<GridViewProps> = ({ items, onItemOpen }) => (
  <SimpleGrid columns={[1, 2, 3, 4, 5, 6]} spacing={8}>
    {items.map((item) => (
      <GridViewItem
        key={item.id}
        item={item}
        onItemOpen={() => onItemOpen(item)}
      />
    ))}
  </SimpleGrid>
);

export default GridView;
