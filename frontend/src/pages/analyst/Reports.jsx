import { useNavigate } from "react-router-dom";

function Reports() {
    const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h2 style={styles.logo}>26-S1-20</h2>
        <nav style={styles.navLinks}>
          <p style={styles.navItem} onClick={() => navigate("/dashboard")}>Dashboard</p>
          <p style={styles.navItem} onClick={() => navigate("/alerts")}>Alerts</p>
          <p style={styles.navItem} onClick={() => navigate("/reports")}>Reports</p>
          <p style={styles.navItem} onClick={() => navigate("/logout")}>Logout</p>
        </nav>
      </div>

      <div style={styles.main}>
        <h1 style={styles.heading}>Reports</h1>
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
    color: "#38bdf8",
    fontSize: "1.2rem",
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
    color: "#cbd5e1",
    margin: 0,
  },
  main: {
    flex: 1,
    padding: "2rem",
    overflowY: "auto",
  },
  heading: {
    fontSize: "1.5rem",
    marginBottom: "1.5rem",
    color: "#f1f5f9",
  },
};

export default Reports;
