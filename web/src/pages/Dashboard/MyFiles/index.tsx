import React from "react";
import Header from "./Header";
import PathViewer from "./PathViewer";
import "./styles.scss";

export default function MyFilesDashboard(): JSX.Element {
  return (
    <div className="file-browser-container">
      <Header />
      <div className="file-browser-content">
        <PathViewer pathComponents={["images", "memes", "funny"]} />
      </div>
    </div>
  );
}
