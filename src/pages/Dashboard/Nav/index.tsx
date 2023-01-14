import { Box, Icon, IconButton, Stack, Tooltip } from "@chakra-ui/react";
import React, { useContext } from "react";
import {
  BoxArrowRight,
  ChevronLeft,
  ChevronRight,
} from "react-bootstrap-icons";
import FolderContext, { initState } from "../../../context/FolderContext";
import { useLocalStorageState, useLogout } from "../../../misc/hooks";
import NavBrand from "./NavBrand";
import NavList from "./NavList";
import "./styles.sass";

export default function DashboardPage(): JSX.Element {
  const logout = useLogout();
  const { setPwd } = useContext(FolderContext);
  const [showNav, setShowNav] = useLocalStorageState("show-nav", true);
  return (
    <div className={"nav-drawer" + (showNav ? "" : " collapsed")}>
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
      <button
        className={"toggle-nav-collapse" + (showNav ? "" : " collapsed")}
        tabIndex={-1}
        onClick={() => setShowNav(!showNav)}
      >
        {showNav ? <ChevronLeft color="grey" /> : <ChevronRight color="grey" />}
      </button>
    </div>
  );
}
