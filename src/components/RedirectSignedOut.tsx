import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

type RedirectSignedOutProps = {
  to: string;
  children?: React.ReactNode;
};

export default function RedirectSignedOut(
  props: RedirectSignedOutProps
): JSX.Element {
  const { loggedIn, accountKey, setLoggedIn, setAccountKey } =
    useContext(AuthContext);
  useEffect(() => {
    if (!loggedIn || !accountKey) {
      setLoggedIn(false);
      setAccountKey(null);
    }
  }, []);
  if (!loggedIn || !accountKey) {
    return <Navigate to={props.to} />;
  }
  return <>{props.children}</>;
}
