import { useNavigate } from "react-router-dom";

function Features() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      {/* Navbar - EXACT Visitor.jsx style */}
      <nav style={styles.navbar}>
        <h2 style={styles.logo}>Intrusion Detection</h2>  
        <div style={styles.navLinks}>
          <span style={styles.navLink} onClick={() => navigate("/")}>Home</span>
          <span style={styles.navLink} onClick={() => navigate("/about")}>About</span>
          <span style={styles.navActive} onClick={() => navigate("/features")}>Features</span>
          <span style={styles.navLink} onClick={() => navigate("/demo")}>Demo</span>
          <span style={styles.navLink} onClick={() => navigate("/login")}>Login</span>
        </div>
      </nav>

      {/* Hero Section - Visitor style */}
      <div style={styles.hero}>
        <div style={styles.heroLeft}>
          <h1 style={styles.heroTitle}>Powerful Features for Network Security</h1>
          <p style={styles.heroSubtitle}>Everything you need to detect, analyse, and respond to threats</p>
          <div style={styles.heroButtons}>
            <button style={styles.primaryButton} onClick={() => navigate("/demo")}>
              Try Demo
            </button>
            <button style={styles.secondaryButton} onClick={() => navigate("/register")}>
              Get Started
            </button>
          </div>
        </div>
        <div style={styles.heroRight}>
          <img
            src="/DashboardDemo.png"
            alt="IDS Dashboard Preview"
            style={styles.heroImage}  
          />
        </div>
      </div>
      <hr style={styles.divider} />

      {/* Features Grid */}
      <div style={styles.featuresGrid}>
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>🚨</div>
          <h3 style={styles.featureTitle}>Real-time Alerts</h3>
          <p style={styles.featureText}>Monitor threats from Snort, Suricata, Zeek, and Kismet in real-time</p>
        </div>
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>🔍</div>
          <h3 style={styles.featureTitle}>Advanced Analytics</h3>
          <p style={styles.featureText}>Visualize attack patterns and threat intelligence with interactive charts</p>
        </div>
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>⚙️</div>
          <h3 style={styles.featureTitle}>Multi-IDS Support</h3>
          <p style={styles.featureText}>Unified interface for all your intrusion detection systems</p>
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        © 2026 Intrusion Detection Dashboard
      </footer>
    </div>
  );
}

// ✅ Complete Visitor.jsx styles
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
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "4rem 2rem",
    flex: 1,
    gap: "4rem",
    maxWidth: "1200px",
    margin: "0 auto",
  },
 // Just change the heroImage style:
heroImage: {
  width: "100%",
  maxWidth: "550px",  
  height: "auto", 
  borderRadius: "20px",
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
},

  heroLeft: {
    flex: 1,
    minWidth: "300px",
  },
  heroTitle: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    lineHeight: "1.3",
    marginBottom: "1.5rem",
    color: "#f1f5f9",
  },
  heroSubtitle: {
    color: "#94a3b8",
    fontSize: "1.2rem",
    marginBottom: "2rem",
    lineHeight: "1.6",
  },
  heroButtons: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
  },
  primaryButton: {
    padding: "1rem 2rem",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  secondaryButton: {
    padding: "1rem 2rem",
    backgroundColor: "transparent",
    color: "#60a5fa",
    border: "2px solid #60a5fa",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  heroRight: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minWidth: "300px",
  },
  featurePreview: {
    width: "400px",
    height: "300px",
    background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    border: "2px dashed #60a5fa",
  },
  divider: {
    borderColor: "#334155",
    margin: "0 2rem",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
    padding: "4rem 2rem",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  featureCard: {
    backgroundColor: "#1e293b",
    padding: "2rem",
    borderRadius: "16px",
    border: "1px solid #334155",
    textAlign: "center",
    transition: "all 0.3s",
  },
  featureIcon: {
    fontSize: "3rem",
    marginBottom: "1rem",
  },
  featureTitle: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#f1f5f9",
    marginBottom: "1rem",
  },
  featureText: {
    color: "#94a3b8",
    lineHeight: "1.6",
  },
  footer: {
    marginTop: "auto",
    textAlign: "right",
    padding: "2rem",
    color: "#475569",
    fontSize: "0.9rem",
    borderTop: "1px solid #1e293b",
    backgroundColor: "#1e293b",
  },
};

export default Features;
