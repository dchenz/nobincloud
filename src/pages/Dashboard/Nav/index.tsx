import { Box, Stack } from "@chakra-ui/react";
import classNames from "classnames";
import React, { useContext } from "react";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import ProfileMenu from "../../../components/ProfileMenu";
import FolderContext, { initState } from "../../../context/FolderContext";
import { useLocalStorageState, useMobileView } from "../../../misc/hooks";
import NavBrand from "./NavBrand";
import NavList from "./NavList";
import "./styles.sass";

export default function DashboardPage(): JSX.Element {
  const { setPwd } = useContext(FolderContext);
  const [showNav, setShowNav] = useLocalStorageState("show-nav", true);
  const isMobileView = useMobileView({ onEnter: () => setShowNav(false) });

  return (
    <div
      className={classNames({
        "nav-drawer": true,
        collapsed: !showNav,
      })}
      style={{ position: isMobileView ? "absolute" : "relative" }}
    >
      <Stack as="nav" gap={2} flexGrow={1}>
        <NavBrand />
        <NavList
          routes={[{ name: "My Files", onClick: () => setPwd(initState.pwd) }]}
        />
      </Stack>
      <Box p={3}>
        <ProfileMenu />
      </Box>
      <button
        className={classNames({
          "toggle-nav-collapse": true,
          collapsed: !showNav,
        })}
        tabIndex={-1}
        onClick={() => setShowNav(!showNav)}
      >
        {showNav ? <ChevronLeft color="grey" /> : <ChevronRight color="grey" />}
      </button>
    </div>
  );
}
