import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";

function AdminLayout() {
  const location = useLocation();

  const navItems = [
    { path: ".", label: "Dashboard" },
    { path: "users", label: "User Management" },
    { path: "profile", label: "Profile" },
    { path: "settings", label: "Settings" },
    { path: "/logout", label: "Logout" }
  ];

  const isActive = (path) => {
    if (path === ".") return location.pathname === "/admin";
    return location.pathname === `/admin/${path}`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.logo}>NIDS Dashboard</div>
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
      </div>
      <div style={styles.main}>
        <Outlet />
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", height: "100vh", backgroundColor: "#0f172a", color: "#f1f5f9" },
  sidebar: { width: "260px", backgroundColor: "#0f172a", borderRight: "1px solid #1e293b", display: "flex", flexDirection: "column", padding: "1.5rem 0" },
  logo: { padding: "0 1.5rem 2rem", fontSize: "1.1rem", fontWeight: 700, color: "#f1f5f9", borderBottom: "1px solid #1e293b", marginBottom: "1rem" },
  nav: { flex: 1, padding: "0 1rem" },
  navItem: { display: "flex", alignItems: "center", padding: "0.875rem 1rem", color: "#94a3b8", textDecoration: "none", borderRadius: "8px", fontSize: "0.95rem", marginBottom: "0.25rem", cursor: "pointer" },
  navItemActive: { backgroundColor: "#1e293b", color: "#60a5fa", fontWeight: 500 },
  main: { flex: 1, overflow: "hidden" }
};

export default AdminLayout;
