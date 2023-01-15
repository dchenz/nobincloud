import { Avatar, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { PageRoutes } from "../const";
import { useLogout } from "../misc/hooks";

const ProfileMenu = () => {
  const location = useLocation();
  const logout = useLogout(
    location.pathname === PageRoutes.home ? PageRoutes.home : PageRoutes.login
  );
  return (
    <Menu>
      <MenuButton>
        <Avatar size="sm" />
      </MenuButton>
      <MenuList>
        {!location.pathname.startsWith(PageRoutes.dashboard) ? (
          <MenuItem as={Link} to={PageRoutes.dashboard}>
            Dashboard
          </MenuItem>
        ) : null}
        <MenuItem onClick={logout}>Logout</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default ProfileMenu;
