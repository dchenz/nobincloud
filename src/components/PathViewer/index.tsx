import { Box, Button, HStack } from "@chakra-ui/react";
import React, { useContext } from "react";
import { ChevronRight } from "react-bootstrap-icons";
import FolderContext from "../../context/FolderContext";
import { FolderRef } from "../../types/Files";
import "./styles.sass";

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
    <HStack className="path-viewer">
      {pwd.parents.map((folder, k) => (
        <React.Fragment key={k}>
          <Button
            variant="link"
            minWidth={0}
            onClick={() => changeToPreviousFolder(folder)}
          >
            <Box
              className="path-viewer-item"
              data-test-id={`parent_${folder.id}`}
            >
              {folder.metadata.name}
            </Box>
          </Button>
          <div>
            <ChevronRight />
          </div>
        </React.Fragment>
      ))}
      <Box className="path-viewer-item" data-test-id={`pwd_${pwd.current.id}`}>
        {pwd.current.metadata.name}
      </Box>
    </HStack>
  );
};

export default PathViewer;
