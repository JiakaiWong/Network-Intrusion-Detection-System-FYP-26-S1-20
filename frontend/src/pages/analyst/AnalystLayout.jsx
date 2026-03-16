import React from "react";
import AnalystSidebar from "./AnalystSidebar";
import "./Dashboard.css";

const AnalystLayout = ({ children }) => {
  return (
    <div className="dashboard-container">
      <AnalystSidebar />
      <main className="dashboard-main">{children}</main>
    </div>
  );
};

export default AnalystLayout;