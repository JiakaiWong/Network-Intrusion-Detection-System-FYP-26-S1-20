import React from "react";
import AnalystSidebar from "../pages/analyst/AnalystSidebar";
import "../pages/analyst/Dashboard.css";

const AnalystLayout = ({ children }) => {
  return (
    <div className="dashboard-container">
      <AnalystSidebar />
      <main className="dashboard-main">{children}</main>
    </div>
  );
};

export default AnalystLayout;