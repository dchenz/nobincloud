import React from "react";
import { Outlet } from "react-router-dom";
import FoldersProvider from "../../components/FoldersProvider";
import Nav from "./Nav";

export default function DashboardPage(): JSX.Element {
  return (
    <FoldersProvider>
      <div style={{ display: "flex" }}>
        <Nav />
        <Outlet />
      </div>
    </FoldersProvider>
  );
}
