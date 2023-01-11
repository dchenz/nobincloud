import {
  Center,
  IconButton,
  Popover,
  PopoverContent,
  PopoverProps,
  PopoverTrigger,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { Grid, ListUl } from "react-bootstrap-icons";
import FolderContext from "../context/FolderContext";

const ViewModeSelector = () => {
  const { viewingMode, setViewingMode } = useContext(FolderContext);
  return (
    <Popover placement="bottom-end">
      {({ onClose }: PopoverProps) => (
        <React.Fragment>
          <PopoverTrigger>
            <IconButton aria-label="select-view">
              {viewingMode === "grid" ? <Grid /> : <ListUl />}
            </IconButton>
          </PopoverTrigger>
          <PopoverContent width="110px" p={2}>
            <Center gap={2}>
              <IconButton
                aria-label="grid-mode"
                title="Grid"
                onClick={() => {
                  setViewingMode("grid");
                  if (onClose) {
                    onClose();
                  }
                }}
              >
                <Grid />
              </IconButton>
              <IconButton
                aria-label="list-mode"
                title="List"
                onClick={() => {
                  setViewingMode("list");
                  if (onClose) {
                    onClose();
                  }
                }}
              >
                <ListUl />
              </IconButton>
            </Center>
          </PopoverContent>
        </React.Fragment>
      )}
    </Popover>
  );
};

export default ViewModeSelector;
