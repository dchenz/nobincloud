import { Avatar, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { PAGE_ROUTES } from "../const";
import { useLogout } from "../misc/hooks";

const ProfileMenu = () => {
  const location = useLocation();
  const logout = useLogout(
    location.pathname === PAGE_ROUTES.home
      ? PAGE_ROUTES.home
      : PAGE_ROUTES.login
  );
  return (
    <Menu>
      <MenuButton>
        <Avatar size="sm" />
      </MenuButton>
      <MenuList>
        {!location.pathname.startsWith(PAGE_ROUTES.dashboard) ? (
          <MenuItem as={Link} to={PAGE_ROUTES.dashboard}>
            Dashboard
          </MenuItem>
        ) : null}
        <MenuItem onClick={logout}>Logout</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default ProfileMenu;
