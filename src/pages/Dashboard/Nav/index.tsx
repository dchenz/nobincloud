import { Box, Icon, IconButton, Stack, Tooltip } from "@chakra-ui/react";
import React, { useContext } from "react";
import { BoxArrowRight } from "react-bootstrap-icons";
import { useCookies } from "react-cookie";
import { logoutAccount } from "../../../api/logoutAccount";
import AuthContext from "../../../context/AuthContext";
import FolderContext, { initState } from "../../../context/FolderContext";
import NavBrand from "./NavBrand";
import NavList from "./NavList";
import "./styles.sass";

export default function DashboardPage(): JSX.Element {
  const { setLoggedIn, setAccountKey } = useContext(AuthContext);
  const { setPwd } = useContext(FolderContext);
  const clearCookies = useCookies(["session", "signed_in"])[2];
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
          <IconButton
            aria-label="logout"
            onClick={async () => {
              await logoutAccount();
              clearCookies("session");
              clearCookies("signed_in");
              setAccountKey(null);
              setLoggedIn(false);
            }}
          >
            <Icon as={BoxArrowRight} />
          </IconButton>
        </Tooltip>
      </Box>
    </div>
  );
}
