import { useNavigate } from "react-router-dom";
import PublicNavbar from "../../components/PublicNavbar";

const TECH_STACK = [
  { name: "React",     color: "#61dafb" },
  { name: "FastAPI",   color: "#009688" },
  { name: "MongoDB",   color: "#4db33d" },
  { name: "Suricata",  color: "#f97316" },
  { name: "Snort",     color: "#ef4444" },
  { name: "Zeek",      color: "#8b5cf6" },
  { name: "Kismet",    color: "#06b6d4" },
  { name: "Telegram",  color: "#2ca5e0" },
];

function About() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <PublicNavbar active="About" />

      <section style={styles.hero}>
        <div style={styles.heroLeft}>
          <div style={styles.heroBadge}>Final Year Project</div>
          <h1 style={styles.heroTitle}>A lightweight IDS dashboard for fast, remote monitoring</h1>
          <p style={styles.heroSubtitle}>
            MyIDS centralizes alerts from Snort, Suricata, Zeek & Kismet into one modern interface —
            with cloud-assisted notifications for analysts on the move.
          </p>
          <div style={styles.heroCtas}>
            <button style={styles.primaryBtn} onClick={() => navigate("/demo")}>View Demo</button>
            <button style={styles.secondaryBtn} onClick={() => navigate("/register")}>Register</button>
          </div>
        </div>

        <div style={styles.heroRight}>
          <div style={styles.heroCard}>
            <div style={styles.heroCardTitle}>What you get</div>
            <ul style={styles.heroList}>
              <li>Real-time alert visibility</li>
              <li>Incident grouping & notes</li>
              <li>Traffic log search by IP/port</li>
              <li>Reports (PDF/CSV) for evidence</li>
              <li>Hybrid cloud notifications</li>
            </ul>
          </div>
        </div>
      </section>

      <div style={styles.sectionWrap}>

        {/* Problem vs Solution */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Why this project exists</h2>
          <div style={styles.twoCol}>
            <div style={{ ...styles.panel, borderColor: "#7f1d1d", borderLeftWidth: "3px" }}>
              <div style={{ ...styles.panelTitle, color: "#f87171" }}>The Problem</div>
              <ul style={styles.list}>
                <li>Hard to monitor multiple IDS tools in one place</li>
                <li>Limited visibility when analysts are away from their workstation</li>
                <li>Noise and alert fatigue without grouping/correlation</li>
                <li>Manual reporting and inconsistent incident records</li>
              </ul>
            </div>
            <div style={{ ...styles.panel, borderColor: "#14532d", borderLeftWidth: "3px" }}>
              <div style={{ ...styles.panelTitle, color: "#4ade80" }}>Our Solution</div>
              <ul style={styles.list}>
                <li>Single dashboard for Snort / Suricata / Zeek / Kismet</li>
                <li>Notifications via cloud service (mobile / email / telegram)</li>
                <li>Severity filtering, triage views, and investigation notes</li>
                <li>Exportable reports for evidence handling and audit</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Architecture */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>High-level architecture</h2>
          <div style={styles.arch}>
            <div style={styles.archNode}>
              <div style={styles.archTitle}>IDS Sensors</div>
              <div style={styles.archText}>Snort • Suricata • Zeek • Kismet</div>
            </div>
            <div style={styles.archArrow}>→</div>
            <div style={styles.archNode}>
              <div style={styles.archTitle}>Ingestion Engine</div>
              <div style={styles.archText}>Parse • normalize • store</div>
            </div>
            <div style={styles.archArrow}>→</div>
            <div style={styles.archNode}>
              <div style={styles.archTitle}>Web Dashboard</div>
              <div style={styles.archText}>Alerts • traffic • reports</div>
            </div>
            <div style={styles.archArrow}>→</div>
            <div style={styles.archNode}>
              <div style={styles.archTitle}>Cloud Notifications</div>
              <div style={styles.archText}>Mobile • email • telegram</div>
            </div>
          </div>
          <div style={styles.archHint}>
            This split keeps local analysis fast while allowing remote notification delivery.
          </div>
        </section>

        {/* Core capabilities */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Core capabilities</h2>
          <div style={styles.cards}>
            <FeatureCard title="Alert Visualization" desc="Filter by severity, source, time, and investigate with detail views." />
            <FeatureCard title="Traffic Log Search" desc="Search and pivot network traffic by IP, port, protocol, and IDS source." />
            <FeatureCard title="Incident Handling" desc="Group related alerts, attach notes, and track progress over time." />
            <FeatureCard title="Reporting" desc="Generate PDF/CSV reports with notes to support evidence and audit." />
          </div>
        </section>

        {/* Tech stack */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Tech stack</h2>
          <div style={styles.techRow}>
            {TECH_STACK.map((t) => (
              <div key={t.name} style={{ ...styles.techBadge, borderColor: t.color, color: t.color }}>
                {t.name}
              </div>
            ))}
          </div>
        </section>

      </div>

      <footer style={styles.footer}>© 2026 Intrusion Detection Dashboard</footer>
    </div>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <div style={styles.featureCard}>
      <div style={styles.featureTitle}>{title}</div>
      <div style={styles.featureDesc}>{desc}</div>
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
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr",
    gap: "1rem",
    alignItems: "stretch",
    padding: "3.5rem 2rem",
  },
  heroLeft: { maxWidth: "760px" },
  heroBadge: {
    display: "inline-block",
    backgroundColor: "rgba(59,130,246,0.12)",
    border: "1px solid rgba(59,130,246,0.3)",
    color: "#60a5fa",
    borderRadius: "999px",
    padding: "0.3rem 0.9rem",
    fontSize: "0.8rem",
    fontWeight: 600,
    marginBottom: "0.75rem",
    letterSpacing: "0.03em",
  },
  heroTitle: {
    fontSize: "2.4rem",
    fontWeight: 900,
    lineHeight: 1.2,
    marginBottom: "1rem",
    color: "#f1f5f9",
  },
  heroSubtitle: {
    color: "#94a3b8",
    fontSize: "1.05rem",
    margin: 0,
    lineHeight: 1.6,
  },
  heroCtas: { display: "flex", gap: "0.75rem", marginTop: "1.5rem", flexWrap: "wrap" },
  primaryBtn: {
    padding: "0.8rem 1.2rem",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: 800,
  },
  secondaryBtn: {
    padding: "0.8rem 1.2rem",
    backgroundColor: "transparent",
    color: "#e2e8f0",
    border: "1px solid #334155",
    borderRadius: "10px",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: 800,
  },
  heroRight: { display: "flex", justifyContent: "flex-end" },
  heroCard: {
    width: "100%",
    backgroundColor: "#111c33",
    border: "1px solid #24324f",
    borderRadius: "14px",
    padding: "1.1rem",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  },
  heroCardTitle: { fontWeight: 900, marginBottom: "0.6rem" },
  heroList: { margin: 0, paddingLeft: "1.15rem", color: "#cbd5e1", lineHeight: 1.8 },

  sectionWrap: { padding: "0 2rem 2.5rem" },
  section: { marginTop: "1.75rem" },
  sectionTitle: { fontSize: "1.35rem", marginBottom: "0.9rem" },

  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" },
  panel: {
    backgroundColor: "#111c33",
    border: "1px solid #24324f",
    borderRadius: "14px",
    padding: "1.1rem",
  },
  panelTitle: { fontWeight: 900, marginBottom: "0.7rem" },
  list: { margin: 0, paddingLeft: "1.15rem", color: "#cbd5e1", lineHeight: 1.8 },

  arch: {
    display: "flex",
    alignItems: "stretch",
    gap: "0.75rem",
    flexWrap: "wrap",
  },
  archNode: {
    backgroundColor: "#111c33",
    border: "1px solid #24324f",
    borderRadius: "14px",
    padding: "1rem",
    minWidth: "210px",
    flex: "1",
  },
  archTitle: { fontWeight: 900, marginBottom: "0.35rem" },
  archText: { color: "#94a3b8", lineHeight: 1.6 },
  archArrow: { display: "flex", alignItems: "center", color: "#64748b", fontWeight: 900 },
  archHint: { marginTop: "0.8rem", color: "#94a3b8" },

  cards: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" },
  featureCard: {
    backgroundColor: "#111c33",
    border: "1px solid #24324f",
    borderRadius: "14px",
    padding: "1.1rem",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
  featureTitle: { fontWeight: 900, marginBottom: "0.45rem" },
  featureDesc: { color: "#94a3b8", lineHeight: 1.7 },

  // Tech stack badges
  techRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.6rem",
  },
  techBadge: {
    padding: "0.4rem 0.9rem",
    borderRadius: "999px",
    border: "1px solid",
    fontSize: "0.85rem",
    fontWeight: 700,
    backgroundColor: "rgba(255,255,255,0.04)",
    letterSpacing: "0.02em",
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

export default About;
