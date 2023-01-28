import { Box, CircularProgress, Tooltip } from "@chakra-ui/react";
import React from "react";

type ProgressIconProps = {
  current: number;
  total: number;
};

const ProgressIcon: React.FC<ProgressIconProps> = ({ current, total }) => (
  <Tooltip label={`${current}/${total}`} placement="left" hasArrow>
    <Box borderRadius="50%" padding="8px">
      <CircularProgress
        size="24px"
        thickness="12px"
        value={(current * 100) / total}
      />
    </Box>
  </Tooltip>
);

export default ProgressIcon;
