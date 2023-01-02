import {
  Button,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import React from "react";

type ConfirmDeleteProps = {
  prompt: string;
  onConfirm: () => void;
  onCancel?: () => void;
  // Should be whatever triggers this popup.
  children: React.ReactNode;
};

type PopoverProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ConfirmPopup: React.FC<ConfirmDeleteProps> = (props) => (
  <Popover>
    {({ onClose }: PopoverProps) => (
      <React.Fragment>
        <PopoverTrigger>{props.children}</PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>{props.prompt}</PopoverHeader>
          <PopoverBody>
            <HStack>
              <Button
                width="100%"
                onClick={() => {
                  props.onConfirm();
                  onClose();
                }}
              >
                OK
              </Button>
              <Button
                width="100%"
                onClick={() => {
                  if (props.onCancel) {
                    props.onCancel();
                  }
                  onClose();
                }}
              >
                Cancel
              </Button>
            </HStack>
          </PopoverBody>
        </PopoverContent>
      </React.Fragment>
    )}
  </Popover>
);

export default ConfirmPopup;
