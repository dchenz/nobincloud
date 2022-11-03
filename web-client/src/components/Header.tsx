import { SettingsIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Image, Spacer } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

export default function Header(): JSX.Element {
  return (
    <Flex backgroundColor="#2f2f33" px={12} py={3} align="center">
      <Box>
        <Link to="/">
          <Image src="/static/media/logo.png" height="32px" />
        </Link>
      </Box>
      <Spacer />
      <Box>
        <IconButton
          icon={<SettingsIcon />}
          aria-label="Settings"
          colorScheme="blackAlpha"
        />
      </Box>
    </Flex>
  );
}