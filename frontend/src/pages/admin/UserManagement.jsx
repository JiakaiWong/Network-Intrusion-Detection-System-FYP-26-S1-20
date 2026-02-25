import { useNavigate } from "react-router-dom";

function UserManagement() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {/* Top Navbar */}
      <div style={styles.navbar}>
        <h2 style={styles.logo}>26-S1-20</h2>
        <nav style={styles.navLinks}>
          <p style={styles.navItem} onClick={() => navigate("/admin")}>Home</p>
          <p style={styles.navItem} onClick={() => navigate("/usermanagement")}>User Management</p>
          <p style={styles.navItem} onClick={() => navigate("/logout")}>Logout</p>
        </nav>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        <h1 style={styles.heading}>User Management</h1>
        <p style={styles.subtext}>Approve, manage, and assign roles to registered users.</p>

        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr style={styles.tableRow}>
              <td style={styles.td}>John Chan</td>
              <td style={styles.td}>john@company.com</td>
              <td style={styles.td}>Security Analyst</td>
              <td style={styles.td}>
                <span style={{ ...styles.badge, backgroundColor: "#f59e0b" }}>Pending</span>
              </td>
              <td style={styles.td}>
                <button style={styles.approveBtn}>Approve</button>
                <button style={styles.rejectBtn}>Reject</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",      
    height: "100vh",
    backgroundColor: "#0f172a",
    color: "#f1f5f9",
    fontFamily: "sans-serif",
  },
  navbar: {
    display: "flex",
    flexDirection: "row",          
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1e293b",
    padding: "1rem 2rem",
  },
  logo: {
    color: "#3b82f6",
    fontSize: "1.1rem",
    margin: 0,
  },
  navLinks: {
    display: "flex",
    flexDirection: "row",          
    gap: "0.5rem",
    margin: 0,
  },
  navItem: {
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#94a3b8",
    margin: 0,
  },
  main: {
    flex: 1,
    padding: "2rem",
    overflowY: "auto",
  },
  heading: {
    marginBottom: "0.5rem",
    fontSize: "1.5rem",
  },
  subtext: {
    color: "#94a3b8",
    fontSize: "0.9rem",
    marginBottom: "1.5rem",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    backgroundColor: "#1e293b",
  },
  th: {
    padding: "0.75rem 1rem",
    textAlign: "left",
    color: "#94a3b8",
    fontSize: "0.85rem",
    borderBottom: "1px solid #334155",
  },
  tableRow: {
    borderBottom: "1px solid #1e293b",
  },
  td: {
    padding: "0.75rem 1rem",
    fontSize: "0.9rem",
  },
  badge: {
    padding: "0.25rem 0.6rem",
    borderRadius: "999px",
    fontSize: "0.75rem",
    fontWeight: "bold",
    color: "#fff",
  },
  approveBtn: {
    marginRight: "0.5rem",
    padding: "0.3rem 0.75rem",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.8rem",
  },
  rejectBtn: {
    padding: "0.3rem 0.75rem",
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.8rem",
  },
};

export default UserManagement;
