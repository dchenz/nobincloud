import { Button, HStack, Text } from "@chakra-ui/react";
import React, { useContext } from "react";
import { ChevronRight } from "react-bootstrap-icons";
import FolderContext from "../../../context/FolderContext";
import { uuidZero } from "../../../crypto/utils";
import { FolderRef } from "../../../types/Files";

const PathViewer: React.FC = () => {
  const { pwd, setPwd } = useContext(FolderContext);

  const changeToPreviousFolder = (folder: FolderRef) => {
    // Folder should be one of the parent folders.
    const parents = [];
    for (const f of pwd.parents) {
      if (f.id === folder.id) {
        break;
      }
      parents.push(f);
    }
    setPwd({ parents, current: folder });
  };

  return (
    <HStack minHeight="40px">
      {pwd.parents.map((folder, k) => (
        <React.Fragment key={k}>
          <Button
            variant="link"
            size="sm"
            onClick={() => changeToPreviousFolder(folder)}
          >
            <Text fontSize="xl" data-test-id={`parent_${folder.id}`}>
              {folder.id === uuidZero() ? "My Files" : folder.metadata.name}
            </Text>
          </Button>
          <ChevronRight />
        </React.Fragment>
      ))}
      <Text fontSize="xl" data-test-id={`pwd_${pwd.current.id}`}>
        {pwd.current.id === uuidZero() ? "My Files" : pwd.current.metadata.name}
      </Text>
    </HStack>
  );
};

export default PathViewer;
