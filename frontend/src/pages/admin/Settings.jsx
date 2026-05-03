import React from "react";
import ThemePicker from "../../components/ThemePicker";

function Settings() {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Themes</h1>
        <p>Manage application preferences.</p>
      </div>

      <div className="admin-card" style={{ maxWidth: "520px" }}>
        <h3 style={{ marginBottom: "0.3rem" }}>Appearance</h3>
        <p style={{ color: "var(--admin-secondary, #64748b)", fontSize: "0.85rem" }}>
          Choose your preferred dashboard theme. Changes apply instantly.
        </p>
        <ThemePicker />
      </div>
    </div>
  );
}

export default Settings;
