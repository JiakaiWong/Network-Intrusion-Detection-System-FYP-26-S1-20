import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Helper to read user from storage
const readUser = () => JSON.parse(localStorage.getItem("user") || "{}");

const AnalystSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();


  const [user, setUser] = useState(readUser);

  useEffect(() => {
    const handleUserUpdated = () => setUser(readUser());
    window.addEventListener("user-updated", handleUserUpdated);
    window.addEventListener("storage", handleUserUpdated);
    return () => {
      window.removeEventListener("user-updated", handleUserUpdated);
      window.removeEventListener("storage", handleUserUpdated);
    };
  }, []);

  const analystName = user.full_name || "Security Analyst";

  const isActive = (path, { prefix = false } = {}) => {
    if (prefix) return location.pathname === path || location.pathname.startsWith(path + "/");
    return location.pathname === path;
  };


  const handleLogout = () => {
    navigate("/logout");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        {/* You can add your Shield emoji or Logo here */}
        🛡️ NIDS Analyst
      </div>

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

            <li className={isActive("/analyst/profile") ? "active" : ""}>
              <Link to="/analyst/profile">Profile</Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="sidebar-user">
        <div className="user-info">
          {/* 3. FIXED: Dynamic Name and Avatar logic */}
          <div className="user-details" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="avatar" style={{
              width: "32px", height: "32px", borderRadius: "50%",
              backgroundColor: "#3b82f6", display: "flex",
              alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold"
            }}>
              {analystName.charAt(0).toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="user-name" style={{ fontWeight: '600', color: '#f1f5f9' }}>{analystName}</span>
              <span className="user-role" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Analyst</span>
            </div>
          </div>
        </div>
        
        {/* 4. FIXED logout button */}
        <button className="logout-btn" onClick={handleLogout} title="Log out" style={{
          marginTop: '15px', display: 'flex', alignItems: 'center', gap: '8px',
          background: 'transparent', border: '1px solid #334155', color: '#94a3b8',
          padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', width: '100%'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AnalystSidebar;