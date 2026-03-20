import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Logout Component
 * This page acts as a "Gatekeeper" to prevent accidental logouts.
 * It should NOT clear any data until the user clicks 'Logout'.
 */
function Logout() {
  const navigate = useNavigate();

  // ── LOGIC: KEEP BROWSING ──────────────────────────────────────
  // This function only redirects. It does NOT touch localStorage.
  const handleCancel = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const role = user.role?.toLowerCase() || "";
      
      // Redirect back to the appropriate dashboard based on role
      if (role.includes("admin")) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      // Fallback if JSON parsing fails
      navigate("/");
    }
  };

  // ── LOGIC: ACTUAL LOGOUT ──────────────────────────────────────
  // This is the ONLY place where data is destroyed.
  const handleLogout = () => {
    // 1. Clear specific auth items
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // 2. Clear everything else 
    localStorage.clear();

    // 3. Force navigation to the landing/login page
    // 'replace: true' prevents the user from hitting 'back' to see the logout screen again
    navigate("/", { replace: true });
    
    // 4. Optional: Reload the page to reset any global Javascript states
    window.location.reload();
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconWrapper}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </div>

        <h2 style={styles.title}>Confirm Logout</h2>
        <p style={styles.subtitle}>
          Are you sure you want to log out? You will need to enter your credentials to access your account again.
        </p>

        <div style={styles.buttonStack}>
          <button 
            style={styles.logoutButton} 
            onClick={handleLogout}
          >
            Yes, Logout
          </button>
          
          <button 
            style={styles.cancelButton} 
            onClick={handleCancel}
          >
            Keep Browsing
          </button>
        </div>
      </div>
    </div>
  );
}

// ── STYLES ──────────────────────────────────────────────────
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#0f172a", // Dark slate background
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    backgroundColor: "#1e293b",
    padding: "2.5rem",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    border: "1px solid #334155",
  },
  iconWrapper: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto 1.5rem auto",
  },
  title: {
    color: "#f1f5f9",
    fontSize: "1.5rem",
    fontWeight: "700",
    margin: "0 0 0.5rem 0",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: "0.95rem",
    lineHeight: "1.6",
    marginBottom: "2rem",
  },
  buttonStack: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  logoutButton: {
    padding: "0.8rem",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  cancelButton: {
    padding: "0.8rem",
    backgroundColor: "transparent",
    color: "#94a3b8",
    border: "1px solid #334155",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
  },
};

export default Logout;