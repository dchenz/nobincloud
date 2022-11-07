import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

type RedirectSignedOutProps = {
  to: string
  children?: React.ReactNode
}

export default function RedirectSignedOut(props: RedirectSignedOutProps): JSX.Element {
  const { loggedIn } = useContext(AuthContext);
  if (!loggedIn) {
    return <Navigate to={props.to} />;
  }
  return <>{props.children}</>;
}