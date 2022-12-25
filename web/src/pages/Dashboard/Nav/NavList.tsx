import { Box, Divider } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import "./styles.scss";

type NavListProps = {
  routes: {
    name: string
    href: string
  }[]
}

export default function NavList(props: NavListProps): JSX.Element {
  return (
    <Box className="nav-list">
      {
        props.routes.map((route, k) =>
          <React.Fragment key={k}>
            {
              k > 0 ? <Divider /> : null
            }
            <Link to={route.href}>
              <Box className="nav-list-item">
                {route.name}
              </Box>
            </Link>
          </React.Fragment>
        )
      }
      <Box>
      </Box>
    </Box>
  );
}