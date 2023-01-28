import { IconButton } from "@chakra-ui/react";
import React from "react";
import { CheckCircleFill } from "react-bootstrap-icons";

type CompletedIconProps = {
  onClick: () => void;
};

const CompletedIcon: React.FC<CompletedIconProps> = ({ onClick }) => (
  <IconButton
    variant="ghost"
    aria-label="close"
    onClick={onClick}
    borderRadius="50%"
  >
    <CheckCircleFill color="#3db535" size="24px" />
  </IconButton>
);

export default CompletedIcon;
