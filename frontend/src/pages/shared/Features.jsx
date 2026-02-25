import { useNavigate } from "react-router-dom";

function Features() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <h2 style={styles.logo}>26-S1-20</h2>
        <div style={styles.navLinks}>
          <span style={styles.navLink} onClick={() => navigate("/")}>Home</span>
          <span style={styles.navLink} onClick={() => navigate("/about")}>About</span>
          <span style={styles.navActive} onClick={() => navigate("/features")}>Features</span>
          <span style={styles.navLink} onClick={() => navigate("/demo")}>Demo</span>
          <span style={styles.navLink} onClick={() => navigate("/login")}>Login</span>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroLeft}>
          <h1 style={styles.heroTitle}>Powerful Features for Network Security</h1>
          <p style={styles.heroSubtitle}>Everything you need to detect, analyse, and respond to threats</p>
        </div>
      </div>

      <hr style={styles.divider} />

      {/* Footer */}
      <footer style={styles.footer}>
        © 2026 Intrusion Detection Dashboard
      </footer>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: "#0f172a",
    color: "#f1f5f9",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
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
  navLink: {
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#94a3b8",
    fontSize: "0.95rem",
  },
  navActive: {
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#f1f5f9",
    fontWeight: "bold",
    fontSize: "0.95rem",
    borderBottom: "2px solid #3b82f6",
    paddingBottom: "2px",
  },
  hero: {
    display: "flex",
    alignItems: "center",
    padding: "4rem",
    backgroundColor: "#0f172a",
  },
  heroLeft: {
    maxWidth: "650px",
  },
  heroTitle: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    lineHeight: "1.3",
    marginBottom: "1rem",
    color: "#f1f5f9",
  },
  heroSubtitle: {
    color: "#94a3b8",
    fontSize: "1.1rem",
    margin: 0,
  },
  divider: {
    borderColor: "#334155",
    margin: "0 4rem",
  },
  footer: {
    marginTop: "auto",
    textAlign: "right",
    padding: "1rem 2rem",
    color: "#475569",
    fontSize: "0.8rem",
    borderTop: "1px solid #1e293b",
  },
};

export default Features;
