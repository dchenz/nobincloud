import { Box, Image } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

export default function NavBrand(): JSX.Element {
  return (
    <Link to="/">
      <Box className="nav-brand">
        <Image src="/static/media/logo-black.png" height="32px" />
      </Box>
    </Link>
  );
}