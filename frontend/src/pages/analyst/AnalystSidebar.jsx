import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const AnalystSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path, { prefix = false } = {}) => {
    if (prefix) return location.pathname === path || location.pathname.startsWith(path + "/");
    return location.pathname === path;
  };

  const handleLogout = () => {
    // Clear any auth tokens/localStorage
    localStorage.removeItem('token'); 
    navigate("/logout"); 
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">Intrusion Detection</div>

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

            <li className={isActive("/profile") ? "active" : ""}>
              <Link to="/profile">Profile</Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="sidebar-user">
        <hr className="divider" />
        <div className="user-info">
          <span className="user-role">Analyst</span>
          <span className="user-name">Security Analyst 1</span>
        </div>
        
        <button 
          className="logout-btn" 
          onClick={handleLogout}
          title="Log out of your account"
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
};

export default AnalystSidebar;
