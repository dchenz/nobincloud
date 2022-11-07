import { createContext } from "react";

export type AuthCtxType = {
  loggedIn: boolean
  accountKey: ArrayBuffer | null
  setLoggedIn: (_: boolean) => void
  setAccountKey: (_: ArrayBuffer | null) => void
}

export const initState: AuthCtxType = {
  loggedIn: false,
  accountKey: null,
  setLoggedIn: (_) => undefined,
  setAccountKey: (_) => undefined,
};

export default createContext<AuthCtxType>(initState);
