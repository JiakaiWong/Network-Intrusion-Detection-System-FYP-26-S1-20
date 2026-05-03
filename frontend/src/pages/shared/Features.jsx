import { useNavigate } from "react-router-dom";
import PublicNavbar from "../../components/PublicNavbar";

const features = [
  {
    icon: "🚨",
    title: "Real-time Alerts",
    text: "Monitor threats from Snort, Suricata, Zeek, and Kismet the moment they occur.",
    tags: ["Real-time", "Multi-IDS"],
    accent: "#ef4444",
  },
  {
    icon: "🔍",
    title: "Advanced Analytics",
    text: "Visualize attack patterns and threat intelligence with interactive charts and filters.",
    tags: ["Charts", "Filtering"],
    accent: "#3b82f6",
  },
  {
    icon: "⚙️",
    title: "Multi-IDS Support",
    text: "A unified interface for all your intrusion detection systems — no more switching tools.",
    tags: ["Snort", "Suricata", "Zeek", "Kismet"],
    accent: "#8b5cf6",
  },
  {
    icon: "📄",
    title: "Evidence Reports",
    text: "Export incidents and alert data as PDF or CSV for audit trails and compliance.",
    tags: ["PDF", "CSV"],
    accent: "#10b981",
  },
  {
    icon: "🔔",
    title: "Instant Notifications",
    text: "High-severity alerts push directly to your Telegram — stay informed away from the desk.",
    tags: ["Telegram", "High-severity"],
    accent: "#f59e0b",
  },
  {
    icon: "📝",
    title: "Incident Management",
    text: "Group related alerts, attach investigation notes, and track triage progress over time.",
    tags: ["Notes", "Triage"],
    accent: "#06b6d4",
  },
];

function Features() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <PublicNavbar active="Features" />

      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroLeft}>
          <div style={styles.heroBadge}>What's inside</div>
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
        {features.map((f) => (
          <div key={f.title} style={styles.featureCard}>
            <div style={{ ...styles.featureAccentBar, backgroundColor: f.accent }} />
            <div style={styles.featureIcon}>{f.icon}</div>
            <h3 style={styles.featureTitle}>{f.title}</h3>
            <p style={styles.featureText}>{f.text}</p>
            <div style={styles.tagRow}>
              {f.tags.map((tag) => (
                <span key={tag} style={{ ...styles.tag, borderColor: f.accent, color: f.accent }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

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
  hero: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "4rem 2rem",
    gap: "4rem",
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  },
  heroLeft: {
    flex: 1,
    minWidth: "300px",
  },
  heroBadge: {
    display: "inline-block",
    backgroundColor: "rgba(59,130,246,0.12)",
    border: "1px solid rgba(59,130,246,0.3)",
    color: "#60a5fa",
    borderRadius: "999px",
    padding: "0.3rem 0.9rem",
    fontSize: "0.8rem",
    fontWeight: 600,
    marginBottom: "1rem",
    letterSpacing: "0.03em",
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
    fontSize: "1.1rem",
    marginBottom: "2rem",
    lineHeight: "1.6",
  },
  heroButtons: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
  },
  primaryButton: {
    padding: "0.75rem 1.75rem",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "0.75rem 1.75rem",
    backgroundColor: "transparent",
    color: "#60a5fa",
    border: "2px solid #60a5fa",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  heroRight: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minWidth: "300px",
  },
  heroImage: {
    width: "100%",
    maxWidth: "550px",
    height: "auto",
    borderRadius: "20px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
  },
  divider: {
    borderColor: "#334155",
    margin: "0 2rem",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1.5rem",
    padding: "3rem 2rem",
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  },
  featureCard: {
    backgroundColor: "#111c33",
    padding: "1.75rem",
    paddingTop: "0",
    borderRadius: "16px",
    border: "1px solid #1e3a5f",
    overflow: "hidden",
    position: "relative",
  },
  featureAccentBar: {
    height: "3px",
    margin: "0 -1.75rem 1.5rem",
    borderRadius: "0",
  },
  featureIcon: {
    fontSize: "2rem",
    marginBottom: "0.75rem",
  },
  featureTitle: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#f1f5f9",
    marginBottom: "0.6rem",
  },
  featureText: {
    color: "#94a3b8",
    lineHeight: "1.6",
    fontSize: "0.9rem",
    marginBottom: "1rem",
  },
  tagRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.4rem",
  },
  tag: {
    fontSize: "0.72rem",
    fontWeight: 600,
    padding: "0.2rem 0.55rem",
    borderRadius: "999px",
    border: "1px solid",
    backgroundColor: "rgba(255,255,255,0.04)",
    letterSpacing: "0.03em",
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
