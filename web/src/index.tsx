import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Cannot find root element");
}

ReactDOM.createRoot(root).render(<App />);
