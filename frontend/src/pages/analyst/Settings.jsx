import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Settings</h1>
        <p>Manage application preferences.</p>
      </div>

      <div className="admin-card">
        <h3>Appearance</h3>
        <p>Choose your preferred dashboard theme.</p>

        <div style={{ marginTop: "16px" }}>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="theme-dropdown"
            style={{
              padding: "8px 12px",
              borderRadius: "2px",
              border: "1px solid #ccc",
              fontSize: "14px",
              width: "200px"
            }}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Settings;