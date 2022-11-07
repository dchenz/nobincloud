import { ChakraProvider } from "@chakra-ui/react";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import RedirectSignedIn from "./components/RedirectSignedIn";
import RedirectSignedOut from "./components/RedirectSignedOut";
import AuthContext, { initState } from "./context/AuthContext";
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
            <Route path="/dashboard/*" element={null} />
            <Route path="*" element={<Header />} />
          </Routes>
          <Routes>
            <Route path="/login" element={
              <RedirectSignedIn to="/dashboard">
                <LoginPage />
              </RedirectSignedIn>
            } />
            <Route path="/register" element={
              <RedirectSignedIn to="/dashboard">
                <RegisterPage />
              </RedirectSignedIn>
            } />
            <Route path="/dashboard" element={
              <RedirectSignedOut to="/login">
                <DashboardPage />
              </RedirectSignedOut>
            }>
              <Route path="me" element={<MyFilesDashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ChakraProvider>
  );
}

function AuthProvider(props: { children: React.ReactNode }): JSX.Element {
  const [cookies] = useCookies();
  const [loggedIn, setLoggedIn] = useState<boolean>(!!cookies.session_token || initState.loggedIn);
  const [accountKey, setAccountKey] = useState<ArrayBuffer | null>(initState.accountKey);
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
