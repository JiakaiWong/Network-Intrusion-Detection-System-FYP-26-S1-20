import { useNavigate } from "react-router-dom";
import PublicNavbar from "../../components/PublicNavbar";

const STEPS = [
  {
    icon: "📡",
    num: "01",
    title: "Ingest",
    text: "Snort, Suricata, Zeek and Kismet logs are parsed and normalized automatically into a unified pipeline.",
  },
  {
    icon: "🔎",
    num: "02",
    title: "Detect",
    text: "Alerts are classified by severity so analysts can focus quickly on the highest-priority threats.",
  },
  {
    icon: "⚡",
    num: "03",
    title: "Respond",
    text: "Investigate incidents, attach notes, and export PDF or CSV evidence reports from one dashboard.",
  },
];

const HIGHLIGHTS = [
  {
    icon: "🚨",
    title: "Real-time Alerts",
    text: "Instant visibility across all IDS sensors from a single monitoring view.",
  },
  {
    icon: "🗺️",
    title: "Threat Map",
    text: "Track suspicious traffic geographically through a live interactive map.",
  },
  {
    icon: "📄",
    title: "Evidence Reports",
    text: "Generate PDF and CSV reports for audits, reviews, and incident documentation.",
  },
  {
    icon: "🔔",
    title: "Telegram Notifications",
    text: "Receive high-severity alerts immediately on your phone for faster response.",
  },
];

const STATS = [
  { icon: "🛡️", number: "4", label: "IDS Tools Supported" },
  { icon: "⚡", number: "Real-time", label: "Alert Detection" },
  { icon: "📄", number: "PDF / CSV", label: "Report Export" },
  { icon: "🔔", number: "Telegram", label: "Notifications" },
];

function Visitor() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <PublicNavbar active="Home" />

      <main style={styles.main}>
        <section style={styles.heroSection}>
          <div style={styles.heroGrid}>
            <div style={styles.heroLeft}>
              <div style={styles.heroBadge}>
                <span style={styles.liveDot} />
                Network Intrusion Detection System
              </div>

              <h1 style={styles.heroTitle}>
                Visualize and analyze{" "}
                <span style={styles.heroAccent}>network security</span> threats
              </h1>

              <p style={styles.heroSubtitle}>
                A unified platform for Snort, Suricata, Zeek and Kismet to monitor,
                triage, and respond to threats in real time.
              </p>

              <div style={styles.heroButtons}>
                <button
                  style={styles.primaryButton}
                  onClick={() => navigate("/register")}
                >
                  Get Started
                </button>
                <button
                  style={styles.secondaryButton}
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </button>
                <button
                  style={styles.ghostButton}
                  onClick={() => navigate("/demo")}
                >
                  View Demo →
                </button>
              </div>
            </div>

            <div style={styles.heroRight}>
              <div style={styles.heroVisual}>
                <img
                  src="/securityimage.jpeg"
                  alt="IDS Dashboard Preview"
                  style={styles.heroImage}
                />
              </div>
            </div>
          </div>
        </section>

        <section style={styles.statsSection}>
          <div style={styles.statsGrid}>
            {STATS.map((item) => (
              <div key={item.label} style={styles.statCard}>
                <div style={styles.statIcon}>{item.icon}</div>
                <div style={styles.statNumber}>{item.number}</div>
                <div style={styles.statLabel}>{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.section}>
          <p style={styles.sectionEyebrow}>The process</p>
          <div style={styles.sectionHeadingRow}>
            <h2 style={styles.sectionTitle}>How it works</h2>
            <p style={styles.sectionIntro}>
              From data ingestion to incident response, the workflow is designed
              to keep detection fast and investigation simple.
            </p>
          </div>

          <div style={styles.stepsGrid}>
            {STEPS.map((step) => (
              <div key={step.title} style={styles.stepCard}>
                <div style={styles.stepTop}>
                  <span style={styles.stepNumber}>{step.num}</span>
                  <span style={styles.stepIcon}>{step.icon}</span>
                </div>
                <h3 style={styles.stepTitle}>{step.title}</h3>
                <p style={styles.stepText}>{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.section}>
          <p style={styles.sectionEyebrow}>Key capabilities</p>
          <div style={styles.sectionHeadingRow}>
            <h2 style={styles.sectionTitle}>Everything you need</h2>
            <p style={styles.sectionIntro}>
              Built for monitoring, alerting, reporting, and analyst workflows in
              one streamlined environment.
            </p>
          </div>

          <div style={styles.highlightsGrid}>
            {HIGHLIGHTS.map((item) => (
              <div key={item.title} style={styles.highlightCard}>
                <div style={styles.highlightIcon}>{item.icon}</div>
                <h3 style={styles.highlightTitle}>{item.title}</h3>
                <p style={styles.highlightText}>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.ctaSection}>
          <div style={styles.ctaCard}>
            <div>
              <h2 style={styles.ctaTitle}>Ready to start monitoring?</h2>
              <p style={styles.ctaSubtitle}>
                Create a free account and connect your IDS tools in minutes.
              </p>
            </div>

            <button
              style={styles.primaryButton}
              onClick={() => navigate("/register")}
            >
              Get Started Free
            </button>
          </div>
        </section>
      </main>

      <footer style={styles.footer}>© 2026 Intrusion Detection Dashboard</footer>
    </div>
  );
}

const styles = {
  page: {
    background: "linear-gradient(180deg, #0b1220 0%, #0f172a 100%)",
    color: "#e2e8f0",
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
  },

  main: {
    width: "100%",
    maxWidth: "1240px",
    margin: "0 auto",
    padding: "0 24px 80px",
  },

  heroSection: {
    padding: "64px 0 56px",
  },

  heroGrid: {
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    alignItems: "center",
    gap: "56px",
  },

  heroLeft: {
    maxWidth: "620px",
  },

  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 14px",
    borderRadius: "999px",
    backgroundColor: "rgba(56, 189, 248, 0.08)",
    border: "1px solid rgba(56, 189, 248, 0.18)",
    color: "#7dd3fc",
    fontSize: "13px",
    fontWeight: 600,
    marginBottom: "20px",
  },

  liveDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#22c55e",
    boxShadow: "0 0 0 4px rgba(34,197,94,0.14)",
  },

  heroTitle: {
    fontSize: "3.3rem",
    lineHeight: 1.1,
    fontWeight: 800,
    letterSpacing: "-0.03em",
    margin: "0 0 20px",
    color: "#f8fafc",
  },

  heroAccent: {
    color: "#38bdf8",
  },

  heroSubtitle: {
    fontSize: "1.05rem",
    lineHeight: 1.9,
    color: "#94a3b8",
    maxWidth: "56ch",
    marginBottom: "30px",
  },

  heroButtons: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    alignItems: "center",
  },

  primaryButton: {
    padding: "13px 22px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#06b6d4",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: "0.95rem",
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(6,182,212,0.18)",
  },

  secondaryButton: {
    padding: "13px 22px",
    borderRadius: "10px",
    backgroundColor: "transparent",
    border: "1px solid rgba(16,185,129,0.45)",
    color: "#34d399",
    fontWeight: 700,
    fontSize: "0.95rem",
    cursor: "pointer",
  },

  ghostButton: {
    padding: "13px 10px",
    borderRadius: "10px",
    backgroundColor: "transparent",
    color: "#94a3b8",
    fontWeight: 600,
    fontSize: "0.95rem",
    cursor: "pointer",
  },

  heroRight: {
    display: "flex",
    justifyContent: "center",
  },

  heroVisual: {
    width: "100%",
    maxWidth: "520px",
    padding: "10px",
    borderRadius: "24px",
    background:
      "linear-gradient(135deg, rgba(59,130,246,0.35), rgba(6,182,212,0.16))",
    border: "1px solid rgba(96,165,250,0.2)",
    boxShadow: "0 24px 70px rgba(2, 8, 23, 0.45)",
  },

  heroImage: {
    width: "100%",
    display: "block",
    borderRadius: "18px",
    objectFit: "cover",
  },

  statsSection: {
    padding: "12px 0 40px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "16px",
  },

  statCard: {
    backgroundColor: "rgba(15, 23, 42, 0.68)",
    border: "1px solid rgba(148, 163, 184, 0.12)",
    borderRadius: "18px",
    padding: "24px 20px",
    textAlign: "center",
    backdropFilter: "blur(8px)",
  },

  statIcon: {
    fontSize: "1.2rem",
    marginBottom: "8px",
  },

  statNumber: {
    color: "#38bdf8",
    fontSize: "1.3rem",
    fontWeight: 800,
    marginBottom: "6px",
  },

  statLabel: {
    color: "#94a3b8",
    fontSize: "0.82rem",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },

  section: {
    padding: "72px 0",
    borderTop: "1px solid rgba(148, 163, 184, 0.08)",
  },

  sectionEyebrow: {
    color: "#38bdf8",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    fontSize: "0.78rem",
    fontWeight: 700,
    marginBottom: "14px",
  },

  sectionHeadingRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "end",
    gap: "24px",
    flexWrap: "wrap",
    marginBottom: "32px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "2rem",
    fontWeight: 800,
    color: "#f8fafc",
  },

  sectionIntro: {
    margin: 0,
    maxWidth: "520px",
    color: "#94a3b8",
    lineHeight: 1.8,
  },

  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "20px",
  },

  stepCard: {
    backgroundColor: "#111c33",
    border: "1px solid rgba(148, 163, 184, 0.1)",
    borderRadius: "18px",
    padding: "28px",
    minHeight: "220px",
  },

  stepTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "22px",
  },

  stepNumber: {
    fontSize: "0.82rem",
    fontWeight: 800,
    color: "#60a5fa",
    letterSpacing: "0.08em",
  },

  stepIcon: {
    fontSize: "1.25rem",
  },

  stepTitle: {
    margin: "0 0 10px",
    fontSize: "1.1rem",
    color: "#f8fafc",
  },

  stepText: {
    margin: 0,
    color: "#94a3b8",
    lineHeight: 1.8,
    fontSize: "0.95rem",
  },

  highlightsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "20px",
  },

  highlightCard: {
    backgroundColor: "#111c33",
    border: "1px solid rgba(148, 163, 184, 0.1)",
    borderRadius: "18px",
    padding: "28px",
    minHeight: "200px",
  },

  highlightIcon: {
    fontSize: "1.5rem",
    marginBottom: "14px",
  },

  highlightTitle: {
    margin: "0 0 10px",
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "#f8fafc",
  },

  highlightText: {
    margin: 0,
    color: "#94a3b8",
    lineHeight: 1.8,
    fontSize: "0.95rem",
  },

  ctaSection: {
    paddingTop: "72px",
  },

  ctaCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "24px",
    flexWrap: "wrap",
    background:
      "linear-gradient(180deg, rgba(17,28,51,1) 0%, rgba(15,23,42,1) 100%)",
    border: "1px solid rgba(56, 189, 248, 0.16)",
    borderRadius: "24px",
    padding: "34px 32px",
    boxShadow: "0 20px 50px rgba(2, 8, 23, 0.28)",
  },

  ctaTitle: {
    margin: "0 0 8px",
    fontSize: "1.6rem",
    color: "#f8fafc",
  },

  ctaSubtitle: {
    margin: 0,
    color: "#94a3b8",
    lineHeight: 1.8,
  },

  footer: {
    borderTop: "1px solid rgba(148, 163, 184, 0.08)",
    color: "#64748b",
    fontSize: "0.85rem",
    textAlign: "center",
    padding: "22px",
    marginTop: "48px",
  },
};

export default Visitor;