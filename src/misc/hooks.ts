import { useCallback, useContext, useMemo, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { logoutAccount } from "../api/logoutAccount";
import { PageRoutes } from "../const";
import AuthContext from "../context/AuthContext";

export function useLocalStorageState<T>(
  name: string,
  defaultValue: T
): [T, (_: T) => void] {
  const [state, setState] = useState<T>(
    useMemo(() => {
      const v = localStorage.getItem(name);
      if (v === null) {
        return defaultValue;
      }
      try {
        return JSON.parse(v);
      } catch {
        return defaultValue;
      }
    }, [name, defaultValue])
  );

  // Cannot pass a function to access previous state like useState.
  const setNewState = useCallback(
    (newState: T) => {
      let v;
      try {
        v = JSON.stringify(newState);
      } catch {
        throw new Error(`Could not JSON serialize value for '${name}'`);
      }
      try {
        localStorage.setItem(name, v);
      } catch {
        throw new Error("Could not persist state to localStorage");
      }
      setState(newState);
    },
    [name, setState]
  );

  return [state, setNewState];
}

export function useLogout(redirect?: string) {
  const { setAccountKey, setLoggedIn } = useContext(AuthContext);
  const clearCookies = useCookies(["session", "signed_in"])[2];
  const navigate = useNavigate();
  return () => {
    logoutAccount().then(() => {
      clearCookies("session");
      clearCookies("signed_in");
      setAccountKey(null);
      setLoggedIn(false);
      navigate(redirect ?? PageRoutes.login);
    });
  };
}
