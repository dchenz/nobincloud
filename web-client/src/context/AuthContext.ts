import { createContext } from "react";

export type AuthCtxType = {
  loggedIn: boolean
  masterKey: ArrayBuffer | null
  dataKey: ArrayBuffer | null
  setLoggedIn: (_: boolean) => void
  setMasterKey: (_: ArrayBuffer | null) => void
  setDataKey: (_: ArrayBuffer | null) => void
}

export const initState: AuthCtxType = {
  loggedIn: false,
  masterKey: null,
  dataKey: null,
  setLoggedIn: (_) => undefined,
  setMasterKey: (_) => undefined,
  setDataKey: (_) => undefined,
};

export default createContext<AuthCtxType>(initState);
