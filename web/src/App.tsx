import { ChakraProvider } from "@chakra-ui/react";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import RedirectSignedIn from "./components/RedirectSignedIn";
import RedirectSignedOut from "./components/RedirectSignedOut";
import { PageRoutes } from "./const";
import AuthContext from "./context/AuthContext";
import DashboardPage from "./pages/Dashboard";
import MyFilesDashboard from "./pages/Dashboard/MyFiles";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";

export default function App(): JSX.Element {
  return (
    <ChakraProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path={PageRoutes.dashboard + "*"} element={null} />
            <Route path="*" element={<Header />} />
          </Routes>
          <Routes>
            <Route path={PageRoutes.login} element={
              <RedirectSignedIn to={PageRoutes.dashboard}>
                <LoginPage />
              </RedirectSignedIn>
            } />
            <Route path={PageRoutes.register} element={
              <RedirectSignedIn to={PageRoutes.dashboard}>
                <RegisterPage />
              </RedirectSignedIn>
            } />
            <Route path={PageRoutes.dashboard} element={
              <RedirectSignedOut to={PageRoutes.login}>
                <DashboardPage />
              </RedirectSignedOut>
            }>
              <Route index element={<MyFilesDashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ChakraProvider>
  );
}

function AuthProvider(props: { children: React.ReactNode }): JSX.Element {
  const [cookies] = useCookies();
  const [accountKey, setAccountKey] = useState<ArrayBuffer | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean>(!!cookies.session_token && !!accountKey);
  return (
    <AuthContext.Provider value={{
      loggedIn,
      accountKey,
      setLoggedIn,
      setAccountKey
    }}>
      {props.children}
    </AuthContext.Provider>
  );
}
