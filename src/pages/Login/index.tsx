import React from "react";
import { useCookies } from "react-cookie";
import LockedOutForm from "./LockedOutForm";
import LoginFullForm from "./LoginFullForm";

const LoginForm: React.FC = () => {
  const [cookies] = useCookies(["signed_in"]);
  // Users can only navigate to the login form
  // while signed out or via the URL search bar.
  // Coming here through search bar will lock the session.
  if (cookies.signed_in === "true") {
    return <LockedOutForm />;
  }
  return <LoginFullForm />;
};

export default LoginForm;
