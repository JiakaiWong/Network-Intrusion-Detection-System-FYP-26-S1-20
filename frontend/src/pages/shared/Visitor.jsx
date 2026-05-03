import { useNavigate } from "react-router-dom";
import PublicNavbar from "../../components/PublicNavbar";

const STEPS = [
  {
    icon: "📡",
    num: "1",
    title: "Ingest",
    text: "Snort, Suricata, Zeek & Kismet generate logs. The ingestion engine parses and normalizes them automatically.",
  },
  {
    icon: "🔎",
    num: "2",
    title: "Detect",
    text: "Alerts are classified by severity. High-severity threats trigger instant Telegram notifications to your team.",
  },
  {
    icon: "⚡",
    num: "3",
    title: "Respond",
    text: "Analysts investigate incidents, attach notes, and export evidence reports as PDF or CSV — from anywhere.",
  },
];

const HIGHLIGHTS = [
  { icon: "🚨", title: "Real-time Alerts",       text: "Instant visibility across all your IDS sensors in one place." },
  { icon: "🗺️", title: "Threat Map",             text: "See attack origins plotted live on an interactive world map." },
  { icon: "📄", title: "Evidence Reports",       text: "Export PDF/CSV reports for audit trails and compliance." },
  { icon: "🔔", title: "Telegram Notifications", text: "High-severity alerts pushed directly to your phone." },
];

function Visitor() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <PublicNavbar active="Home" />

      {/* ── Hero ── */}
      <div style={styles.hero}>
        <div style={styles.heroLeft}>
          <div style={styles.heroBadge}>
            <span style={styles.liveDot} />
            Network Intrusion Detection System
          </div>
          <h1 style={styles.heroTitle}>
            Visualize &amp; Analyze{" "}
            <span style={styles.heroAccent}>Network Security</span>{" "}
            Threats
          </h1>
          <p style={styles.heroSubtitle}>
            A unified dashboard for Snort, Suricata, Zeek and Kismet — monitor,
            triage, and respond to threats in real time.
          </p>
          <div style={styles.heroButtons}>
            <button style={styles.registerButton} onClick={() => navigate("/register")}>
              Get Started
            </button>
            <button style={styles.signinButton} onClick={() => navigate("/login")}>
              Sign In
            </button>
            <button style={styles.demoButton} onClick={() => navigate("/demo")}>
              View Demo →
            </button>
          </div>
        </div>
        <div style={styles.heroRight}>
          <div style={styles.imageWrap}>
            <img
              src="/securityimage.jpeg"
              alt="IDS Dashboard Preview"
              style={styles.heroImage}
            />
          </div>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div style={styles.statsBar}>
        {[
          { icon: "🛡️", number: "4",         label: "IDS Tools Supported" },
          { icon: "⚡", number: "Real-time", label: "Alert Detection" },
          { icon: "📄", number: "PDF/CSV",   label: "Export Reports" },
          { icon: "🔔", number: "Telegram",  label: "Instant Notifications" },
        ].map((s, i, arr) => (
          <>
            <div key={s.label} style={styles.statItem}>
              <span style={styles.statIcon}>{s.icon}</span>
              <span style={styles.statNumber}>{s.number}</span>
              <span style={styles.statLabel}>{s.label}</span>
            </div>
            {i < arr.length - 1 && <div key={`div-${i}`} style={styles.statDivider} />}
          </>
        ))}
      </div>

      {/* ── How it works ── */}
      <div style={styles.howSection}>
        <p style={styles.sectionEyebrow}>The process</p>
        <h2 style={styles.howTitle}>How it works</h2>
        <div style={styles.howSteps}>
          {STEPS.map((step, i) => (
            <>
              <div key={step.title} style={styles.howStep}>
                <div style={styles.howStepTop}>
                  <div style={styles.howNumber}>{step.num}</div>
                  <span style={styles.howIcon}>{step.icon}</span>
                </div>
                <h3 style={styles.howStepTitle}>{step.title}</h3>
                <p style={styles.howStepText}>{step.text}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div key={`arrow-${i}`} style={styles.howArrow}>→</div>
              )}
            </>
          ))}
        </div>
      </div>

      <hr style={styles.divider} />

      {/* ── Highlights Grid ── */}
      <div style={styles.highlightSection}>
        <p style={styles.sectionEyebrow}>Key capabilities</p>
        <h2 style={styles.howTitle}>Everything you need</h2>
        <div style={styles.highlightGrid}>
          {HIGHLIGHTS.map((h) => (
            <div key={h.title} style={styles.highlightCard}>
              <span style={styles.highlightIcon}>{h.icon}</span>
              <h3 style={styles.highlightTitle}>{h.title}</h3>
              <p style={styles.highlightText}>{h.text}</p>
            </div>
          ))}
        </div>
      </div>

      <hr style={styles.divider} />

      {/* ── CTA strip ── */}
      <div style={styles.ctaStrip}>
        <div>
          <h2 style={styles.ctaTitle}>Ready to start monitoring?</h2>
          <p style={styles.ctaSubtitle}>Create a free account and connect your IDS in minutes.</p>
        </div>
        <button style={styles.ctaButton} onClick={() => navigate("/register")}>
          Get Started Free
        </button>
      </div>

      {/* ── Footer ── */}
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

  // Hero
  hero: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "4rem",
    gap: "2rem",
  },
  heroLeft: {
    maxWidth: "580px",
    flex: 1,
    minWidth: "280px",
  },
  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    backgroundColor: "rgba(59,130,246,0.12)",
    border: "1px solid rgba(59,130,246,0.3)",
    color: "#60a5fa",
    borderRadius: "999px",
    padding: "0.3rem 0.9rem",
    fontSize: "0.8rem",
    fontWeight: 600,
    marginBottom: "1.25rem",
    letterSpacing: "0.03em",
  },
  liveDot: {
    display: "inline-block",
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    backgroundColor: "#22c55e",
    boxShadow: "0 0 0 2px rgba(34,197,94,0.3)",
    flexShrink: 0,
  },
  heroTitle: {
    fontSize: "2.6rem",
    fontWeight: 900,
    marginBottom: "1rem",
    lineHeight: 1.25,
    letterSpacing: "-0.02em",
  },
  heroAccent: {
    color: "#38bdf8",
  },
  heroSubtitle: {
    color: "#94a3b8",
    marginBottom: "2rem",
    fontSize: "1rem",
    lineHeight: 1.75,
  },
  heroButtons: {
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap",
    alignItems: "center",
  },
  registerButton: {
    padding: "0.7rem 1.6rem",
    backgroundColor: "#06b6d4",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.95rem",
    cursor: "pointer",
    fontWeight: 700,
  },
  signinButton: {
    padding: "0.7rem 1.6rem",
    backgroundColor: "transparent",
    color: "#10b981",
    border: "1px solid #10b981",
    borderRadius: "8px",
    fontSize: "0.95rem",
    cursor: "pointer",
    fontWeight: 700,
  },
  demoButton: {
    padding: "0.7rem 1.2rem",
    backgroundColor: "transparent",
    color: "#64748b",
    border: "none",
    fontSize: "0.9rem",
    cursor: "pointer",
    fontWeight: 600,
  },
  heroRight: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    minWidth: "280px",
  },
  imageWrap: {
    position: "relative",
    borderRadius: "16px",
    padding: "3px",
    background: "linear-gradient(135deg, #1e40af, #0e7490)",
  },
  heroImage: {
    width: "100%",
    maxWidth: "560px",
    borderRadius: "14px",
    objectFit: "cover",
    display: "block",
  },

  // Stats bar
  statsBar: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111c33",
    borderTop: "1px solid #1e3a5f",
    borderBottom: "1px solid #1e3a5f",
    padding: "1.25rem 2rem",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0 2.5rem",
    gap: "0.15rem",
  },
  statIcon: {
    fontSize: "1.1rem",
    marginBottom: "0.15rem",
  },
  statNumber: {
    fontSize: "1.25rem",
    fontWeight: 900,
    color: "#38bdf8",
  },
  statLabel: {
    fontSize: "0.72rem",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  statDivider: {
    width: "1px",
    height: "2.5rem",
    backgroundColor: "#1e3a5f",
  },

  divider: {
    borderColor: "#1e293b",
    margin: "0 3rem",
  },

  // Section labels
  sectionEyebrow: {
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "#38bdf8",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginBottom: "0.4rem",
  },

  // How it works
  howSection: {
    padding: "3rem 4rem",
  },
  howTitle: {
    fontSize: "1.6rem",
    fontWeight: 800,
    marginBottom: "2rem",
    color: "#f1f5f9",
    marginTop: 0,
  },
  howSteps: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-start",
    gap: "1rem",
  },
  howStep: {
    flex: 1,
    minWidth: "200px",
    backgroundColor: "#111c33",
    border: "1px solid #1e3a5f",
    borderRadius: "14px",
    padding: "1.5rem",
  },
  howStepTop: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    marginBottom: "0.75rem",
  },
  howNumber: {
    width: "1.75rem",
    height: "1.75rem",
    borderRadius: "50%",
    backgroundColor: "#1e40af",
    color: "#fff",
    fontWeight: 900,
    fontSize: "0.85rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  howIcon: {
    fontSize: "1.2rem",
  },
  howStepTitle: {
    fontSize: "1rem",
    fontWeight: 700,
    marginBottom: "0.4rem",
    color: "#f1f5f9",
    margin: "0 0 0.4rem 0",
  },
  howStepText: {
    color: "#94a3b8",
    fontSize: "0.875rem",
    lineHeight: 1.7,
    margin: 0,
  },
  howArrow: {
    fontSize: "1.4rem",
    color: "#334155",
    alignSelf: "center",
    flexShrink: 0,
  },

  // Highlights
  highlightSection: {
    padding: "3rem 4rem",
  },
  highlightGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1rem",
  },
  highlightCard: {
    backgroundColor: "#111c33",
    border: "1px solid #1e3a5f",
    borderRadius: "14px",
    padding: "1.4rem",
  },
  highlightIcon: {
    fontSize: "1.6rem",
    display: "block",
    marginBottom: "0.6rem",
  },
  highlightTitle: {
    fontSize: "0.95rem",
    fontWeight: 700,
    color: "#f1f5f9",
    marginBottom: "0.4rem",
    margin: "0 0 0.4rem 0",
  },
  highlightText: {
    color: "#94a3b8",
    fontSize: "0.85rem",
    lineHeight: 1.65,
    margin: 0,
  },

  // CTA strip
  ctaStrip: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1.5rem",
    margin: "3rem 4rem",
    padding: "2rem 2.5rem",
    backgroundColor: "#111c33",
    border: "1px solid #1e3a5f",
    borderRadius: "16px",
  },
  ctaTitle: {
    fontSize: "1.3rem",
    fontWeight: 800,
    margin: "0 0 0.3rem 0",
    color: "#f1f5f9",
  },
  ctaSubtitle: {
    color: "#94a3b8",
    fontSize: "0.9rem",
    margin: 0,
  },
  ctaButton: {
    padding: "0.8rem 2rem",
    backgroundColor: "#06b6d4",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },

  footer: {
    textAlign: "right",
    padding: "1rem 2rem",
    color: "#475569",
    fontSize: "0.8rem",
    borderTop: "1px solid #1e293b",
    marginTop: "auto",
  },
};

export default Visitor;
