import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const AnalystSidebar = () => {
  const location = useLocation();
  // ADDED: needed for handleLogout
  const navigate = useNavigate();

  const isActive = (path, { prefix = false } = {}) => {
    if (prefix) return location.pathname === path || location.pathname.startsWith(path + "/");
    return location.pathname === path;
  };

  // NEW: clears auth tokens then redirects to logout page
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/logout");
  };

  return (
    <aside className="sidebar">
      {/* CHANGED: added shield emoji */}
      <div className="sidebar-header"></div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <ul>
            <li className={isActive("/dashboard") ? "active" : ""}>
              <Link to="/dashboard">Dashboard</Link>
            </li>

            <li className={isActive("/alerts", { prefix: true }) ? "active" : ""}>
              <Link to="/alerts">Alerts</Link>
            </li>

            <li className={isActive("/network-traffic") ? "active" : ""}>
              <Link to="/network-traffic">Network Traffic</Link>
            </li>

            <li className={isActive("/reports", { prefix: true }) ? "active" : ""}>
              <Link to="/reports">Reports</Link>
            </li>

            <li className={isActive("/notifications") ? "active" : ""}>
              <Link to="/notifications">Notifications</Link>
            </li>

            {/* CHANGED: /profile → /analyst/profile to match App.jsx route */}
            <li className={isActive("/analyst/profile") ? "active" : ""}>
              <Link to="/analyst/profile">Profile</Link>
            </li>

          <li className={isActive("/logout") ? "active" : ""}>
              <Link to="/logout">Logout</Link>
            </li>
            
          </ul>
        </div>
      </nav>

      <div className="sidebar-user">
        <div className="user-info">
          <span className="user-role">Analyst</span>
          <span className="user-name">Security Analyst 1</span>
        </div>
        {/* NEW: logout button — clears localStorage before navigating */}
        <button className="logout-btn" onClick={handleLogout} title="Log out">
          🚪 Logout
        </button>
      </div>
    </aside>
  );
};

export default AnalystSidebar;
