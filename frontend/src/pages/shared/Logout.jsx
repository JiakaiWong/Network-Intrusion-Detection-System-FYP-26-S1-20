import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  const handleCancel = () => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      navigate("/Admin");
    } else {
      navigate("/dashboard");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Confirm Logout</h2>
        <p style={styles.subtitle}>Are you sure you want to logout?</p>
        <div style={styles.buttonRow}>
          <button style={styles.cancelButton} onClick={handleCancel}>
            Cancel
          </button>
          <button style={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#0f172a",
  },
  card: {
    backgroundColor: "#1e293b",
    padding: "2rem",
    borderRadius: "8px",
    width: "360px",
    textAlign: "center",
    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
  },
  title: {
    color: "#f1f5f9",
    marginBottom: "0.5rem",
  },
  subtitle: {
    color: "#94a3b8",
    marginBottom: "2rem",
    fontSize: "0.95rem",
  },
  buttonRow: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
  },
  cancelButton: {
    padding: "0.65rem 1.5rem",
    backgroundColor: "#334155",
    color: "#f1f5f9",
    border: "none",
    borderRadius: "6px",
    fontSize: "0.95rem",
    cursor: "pointer",
  },
  logoutButton: {
    padding: "0.65rem 1.5rem",
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "0.95rem",
    cursor: "pointer",
  },
};

export default Logout;