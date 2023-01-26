import { Box, Image } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import { PAGE_ROUTES } from "../../../const";

export default function NavBrand(): JSX.Element {
  return (
    <Link to={PAGE_ROUTES.home}>
      <Box p="1em" mb={4}>
        <Image src="/static/media/logo-white.png" height="32px" />
      </Box>
    </Link>
  );
}
