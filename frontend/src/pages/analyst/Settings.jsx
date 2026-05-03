import React from "react";
import ThemePicker from "../../components/ThemePicker";

function Settings() {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="page-title">Themes</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "0.25rem" }}>
          Manage application preferences.
        </p>
      </div>

      <div className="admin-card" style={{ maxWidth: "520px" }}>
        <h3 style={{ marginBottom: "0.3rem" }}>Appearance</h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
          Choose your preferred dashboard theme. Changes apply instantly.
        </p>
        <ThemePicker />
      </div>
    </div>
  );
}

export default Settings;
