import { Box, Divider } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import "./styles.sass";

type NavListProps = {
  routes: {
    name: string;
    href?: string;
    onClick?: () => void;
  }[];
};

export default function NavList(props: NavListProps): JSX.Element {
  return (
    <Box className="nav-list">
      {props.routes.map((route, k) => (
        <React.Fragment key={k}>
          {k > 0 ? <Divider /> : null}
          {route.href ? (
            <Link to={route.href}>
              {
                <Box className="nav-list-item" onClick={route.onClick}>
                  {route.name}
                </Box>
              }
            </Link>
          ) : (
            <Box
              className="nav-list-item"
              onClick={route.onClick}
              cursor="pointer"
            >
              {route.name}
            </Box>
          )}
        </React.Fragment>
      ))}
      <Box></Box>
    </Box>
  );
}
