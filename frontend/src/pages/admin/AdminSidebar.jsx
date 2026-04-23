import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const readUser = () => JSON.parse(localStorage.getItem("user") || "{}");

function AdminSidebar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(readUser());

  useEffect(() => {
    const handleUserUpdated = () => setUser(readUser());
    window.addEventListener("user-updated", handleUserUpdated);
    window.addEventListener("storage", handleUserUpdated);

    return () => {
      window.removeEventListener("user-updated", handleUserUpdated);
      window.removeEventListener("storage", handleUserUpdated);
    };
  }, []);

  const adminName = user.full_name || "Administrator";
  const adminEmail = user.email || "";

const navItems = [
  { path: "/admin", label: "Dashboard", end: true },
  { path: "/admin/users", label: "User Management" },
  { path: "/admin/maintenance", label: "Maintenance" },
  { path: "/admin/log-management", label: "Log Management" },
  { path: "/admin/settings", label: "Settings" },
  { path: "/admin/profile", label: "Profile" },
];
  const handleLogout = () => navigate("/logout");

  return (
    <div className="admin-container">
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-logo">🛡️ NIDS Dashboard</div>

          <nav className="admin-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `admin-nav-item${isActive ? " active" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="admin-footer">
            <div className="admin-user-card">
              <div className="admin-avatar">
                {adminName.charAt(0).toUpperCase()}
              </div>

              <div className="admin-user-info">
                <span className="admin-user-name">{adminName}</span>
                <span className="admin-user-email">{adminEmail}</span>
              </div>
            </div>

            <button className="admin-logout-btn" onClick={handleLogout} type="button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0 }}
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        </aside>

        <main className="admin-main">
          <div className="admin-content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminSidebar;