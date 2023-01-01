import { Box, ChakraProvider, Divider, Heading } from "@chakra-ui/react";
import React, { useState } from "react";
import { CookiesProvider, useCookies } from "react-cookie";
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
      <CookiesProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path={PageRoutes.dashboard + "*"} element={null} />
              <Route path="*" element={<Header />} />
            </Routes>
            <Routes>
              <Route path={PageRoutes.login} element={<LoginPage />} />
              <Route
                path={PageRoutes.register}
                element={
                  <RedirectSignedIn to={PageRoutes.dashboard}>
                    <RegisterPage />
                  </RedirectSignedIn>
                }
              />
              <Route
                path={PageRoutes.dashboard}
                element={
                  <RedirectSignedOut to={PageRoutes.login}>
                    <DashboardPage />
                  </RedirectSignedOut>
                }
              >
                <Route index element={<MyFilesDashboard />} />
              </Route>
              <Route
                path="/"
                element={
                  <Box p={8}>
                    <Heading>
                      Encrypted cloud storage. Server sees nothing!
                    </Heading>
                    <Divider my={5} />
                    <img
                      src="https://imgs.xkcd.com/comics/security.png"
                      width="600px"
                    />
                  </Box>
                }
              />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </CookiesProvider>
    </ChakraProvider>
  );
}

function AuthProvider(props: { children: React.ReactNode }): JSX.Element {
  const [cookies] = useCookies(["signed_in"]);
  const [accountKey, setAccountKey] = useState<ArrayBuffer | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean>(
    !!cookies.signed_in && !!accountKey
  );
  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        accountKey,
        setLoggedIn,
        setAccountKey,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
