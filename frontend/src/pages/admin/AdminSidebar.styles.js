export const styles = {
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#0f172a",
    color: "#f1f5f9"
  },
  sidebar: {
    width: "260px",
    backgroundColor: "#0f172a",
    borderRight: "1px solid #1e293b",
    display: "flex",
    flexDirection: "column",
    padding: "1.5rem 0"
  },
  logo: {
    padding: "0 1.5rem 2rem",
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#f1f5f9",
    borderBottom: "1px solid #1e293b",
    marginBottom: "1rem"
  },
  nav: {
    flex: 1,
    padding: "0 1rem"
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    padding: "0.875rem 1rem",
    color: "#94a3b8",
    textDecoration: "none",
    borderRadius: "8px",
    fontSize: "0.95rem",
    marginBottom: "0.25rem",
    cursor: "pointer"
  },
  navItemActive: {
    backgroundColor: "#1e293b",
    color: "#60a5fa",
    fontWeight: 500
  },
  footer: {
    padding: "1rem",
    borderTop: "1px solid #1e293b",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem"
  },
  userCard: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.5rem",
    borderRadius: "8px",
    backgroundColor: "#1e293b"
  },
  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    backgroundColor: "#3b82f6",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.9rem",
    fontWeight: 700,
    flexShrink: 0
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  },
  userName: {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "#f1f5f9",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  userEmail: {
    fontSize: "0.72rem",
    color: "#64748b",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    width: "100%",
    padding: "0.6rem",
    backgroundColor: "transparent",
    border: "1px solid #334155",
    borderRadius: "8px",
    color: "#94a3b8",
    fontSize: "0.875rem",
    cursor: "pointer"
  },
  main: {
    flex: 1,
    overflow: "hidden"
  }
};