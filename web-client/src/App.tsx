import { ChakraProvider } from "@chakra-ui/react";
import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
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
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />}>
              <Route path="me" element={<MyFilesDashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ChakraProvider>
  );
}

function AuthProvider(props: { children: React.ReactNode }): JSX.Element {
  const [loggedIn, setLoggedIn] = useState<boolean>(initState.loggedIn);
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
