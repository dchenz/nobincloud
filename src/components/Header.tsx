import { Box, Button, Flex, Image, Spacer } from "@chakra-ui/react";
import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import ProfileMenu from "./ProfileMenu";

export default function Header(): JSX.Element {
  const { loggedIn } = useContext(AuthContext);
  const location = useLocation();
  const onLoginOrRegisterPage =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register");
  return (
    <Flex backgroundColor="#2f2f33" px={12} py={3} align="center">
      <Box>
        <Link to="/">
          <Image src="/static/media/logo-white.png" height="32px" />
        </Link>
      </Box>
      <Spacer />
      <Box>
        {loggedIn ? (
          <ProfileMenu />
        ) : !onLoginOrRegisterPage ? (
          <Button as={Link} to="/login" size="sm" colorScheme="blackAlpha">
            Get Started
          </Button>
        ) : null}
      </Box>
    </Flex>
  );
}
