import { Button, HStack, Text } from "@chakra-ui/react";
import React, { useContext } from "react";
import { ChevronRight } from "react-bootstrap-icons";
import FolderContext from "../../../context/FolderContext";

const PathViewer: React.FC = () => {
  const { pwd } = useContext(FolderContext);
  return (
    <HStack>
      {pwd.parents.map((folder, k) => (
        <React.Fragment key={k}>
          {k > 0 ? <ChevronRight /> : null}
          <Button variant="link">
            <Text fontSize="xl">{folder.name === "" ? "/" : folder.name}</Text>
          </Button>
        </React.Fragment>
      ))}
    </HStack>
  );
};

export default PathViewer;
