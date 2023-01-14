import { Box, Icon, IconButton, Stack, Tooltip } from "@chakra-ui/react";
import React, { useContext } from "react";
import { BoxArrowRight } from "react-bootstrap-icons";
import FolderContext, { initState } from "../../../context/FolderContext";
import { useLogout } from "../../../misc/hooks";
import NavBrand from "./NavBrand";
import NavList from "./NavList";
import "./styles.sass";

export default function DashboardPage(): JSX.Element {
  const logout = useLogout();
  const { setPwd } = useContext(FolderContext);
  return (
    <div className="nav-drawer">
      <Stack as="nav" gap={2} flexGrow={1}>
        <NavBrand />
        <NavList
          routes={[{ name: "My Files", onClick: () => setPwd(initState.pwd) }]}
        />
      </Stack>
      <Box p={3}>
        <Tooltip label="Logout">
          <IconButton aria-label="logout" onClick={logout}>
            <Icon as={BoxArrowRight} />
          </IconButton>
        </Tooltip>
      </Box>
    </div>
  );
}
