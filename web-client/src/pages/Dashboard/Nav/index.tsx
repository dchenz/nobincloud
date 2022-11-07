import { Stack } from "@chakra-ui/react";
import React from "react";
import NavBrand from "./NavBrand";
import NavList from "./NavList";
import "./styles.scss";

export default function DashboardPage(): JSX.Element {
  return (
    <div className="nav-drawer">
      <Stack as="nav" gap={2}>
        <NavBrand />
        <NavList routes={[
          { name: "My Files", href: "me" }
        ]} />
      </Stack>
    </div>
  );
}