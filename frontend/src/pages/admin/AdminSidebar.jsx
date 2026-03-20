import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { styles } from "./AdminSidebar.styles";

const readUser = () => JSON.parse(localStorage.getItem("user") || "{}");

function AdminSidebar() {
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

  const adminName  = user.full_name || "Administrator";
  const adminEmail = user.email     || "";

  const navItems = [
    { path: ".",           label: "Dashboard"       },
    { path: "users",       label: "User Management" },
    { path: "maintenance", label: "Maintenance"  },
    { path: "settings",    label: "Settings"        },
    { path: "profile",     label: "Profile"         },
  ];

  const isActive = (path) => {
    if (path === ".") return location.pathname === "/admin";
    return location.pathname === `/admin/${path}`;
  };

  const handleLogout = () => navigate("/logout");

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        {/* Logo */}
        <div style={styles.logo}>NIDS Dashboard</div>

        {/* Nav Links */}
        <nav style={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.navItem,
                ...(isActive(item.path) ? styles.navItemActive : {})
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Admin User + Logout */}
        <div style={styles.footer}>
          <div style={styles.userCard}>
            <div style={styles.avatar}>
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div style={styles.userInfo}>
              <span style={styles.userName}>{adminName}</span>
              <span style={styles.userEmail}>{adminEmail}</span>
            </div>
          </div>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.main}>
        <Outlet />
      </div>
    </div>
  );
}

export default AdminSidebar;