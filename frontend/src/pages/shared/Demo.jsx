import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import PublicNavbar from "../../components/PublicNavbar";

const ALL_ALERTS = [
  { id: "AL-1001", sev: "HIGH", type: "SQL Injection",   src: "192.168.1.12", dst: "10.0.0.45",  when: "3 mins ago",  ids: "Suricata" },
  { id: "AL-1002", sev: "MED",  type: "Suspicious DNS",  src: "192.168.1.52", dst: "8.8.8.8",    when: "12 mins ago", ids: "Zeek" },
  { id: "AL-1003", sev: "LOW",  type: "Port Scan",       src: "172.16.8.12",  dst: "10.0.0.12",  when: "30 mins ago", ids: "Snort" },
  { id: "AL-1004", sev: "HIGH", type: "Brute Force",     src: "10.0.0.45",    dst: "10.0.0.12",  when: "1 hr ago",    ids: "Suricata" },
  { id: "AL-1005", sev: "MED",  type: "Beacon Activity", src: "10.0.0.77",    dst: "45.33.12.88",when: "2 hrs ago",   ids: "Zeek" },
  { id: "AL-1006", sev: "LOW",  type: "ICMP Flood",      src: "192.168.5.3",  dst: "10.0.0.1",   when: "3 hrs ago",   ids: "Snort" },
];

const STAT_TARGETS = [
  { label: "Total Alerts", target: 1245, tone: null },
  { label: "High",         target: 12,   tone: "HIGH" },
  { label: "Medium",       target: 58,   tone: "MED" },
  { label: "Low",          target: 175,  tone: "LOW" },
];

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return value;
}

function StatCard({ label, target, tone }) {
  const value = useCountUp(target);
  const toneStyle = tone ? statTone(tone) : {};
  return (
    <div style={{ ...styles.stat, ...toneStyle }}>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>{value.toLocaleString()}</div>
    </div>
  );
}

function statTone(t) {
  if (t === "HIGH") return { borderColor: "#ef4444" };
  if (t === "MED")  return { borderColor: "#f59e0b" };
  if (t === "LOW")  return { borderColor: "#10b981" };
  return {};
}

function sevStyle(sev) {
  if (sev === "HIGH") return { backgroundColor: "#7f1d1d", borderColor: "#ef4444" };
  if (sev === "MED")  return { backgroundColor: "#78350f", borderColor: "#f59e0b" };
  return { backgroundColor: "#064e3b", borderColor: "#10b981" };
}

function Kv({ k, v, mono }) {
  return (
    <div style={styles.kv}>
      <div style={styles.kvKey}>{k}</div>
      <div style={{ ...styles.kvVal, ...(mono ? styles.mono : {}) }}>{v}</div>
    </div>
  );
}

const SEV_FILTERS = ["ALL", "HIGH", "MED", "LOW"];

function Demo() {
  const navigate = useNavigate();
  const [open, setOpen]         = useState(false);
  const [active, setActive]     = useState(null);
  const [sevFilter, setSevFilter] = useState("ALL");

  const filtered = sevFilter === "ALL"
    ? ALL_ALERTS
    : ALL_ALERTS.filter((a) => a.sev === sevFilter);

  const openAlert = (a) => { setActive(a); setOpen(true); };

  return (
    <div style={styles.page}>
      <PublicNavbar active="Demo" />

      <section style={styles.hero}>
        <div style={styles.heroLeft}>
          <div style={styles.heroBadge}>Interactive Preview</div>
          <h1 style={styles.heroTitle}>Interactive Demo</h1>
          <p style={styles.heroSubtitle}>
            Explore a sample analyst dashboard with demo data. Some actions are disabled until you log in.
          </p>
          <div style={styles.heroCtas}>
            <button style={styles.primaryBtn} onClick={() => navigate("/login")}>Login to Full System</button>
            <button style={styles.secondaryBtn} onClick={() => navigate("/register")}>Register</button>
          </div>
        </div>
        <div style={styles.heroRight}>
          <div style={styles.watermarkCard}>
            <div style={styles.watermarkTitle}>Demo Data</div>
            <div style={styles.watermarkText}>Login required for live ingestion & incident actions.</div>
          </div>
        </div>
      </section>

      <div style={styles.demoWrap}>
        <div style={styles.demoGrid}>
          <aside style={styles.sidebar}>
            <div style={styles.sideTitle}>Demo Menu</div>
            <div style={styles.sideItemActive}>Dashboard</div>
            <div style={styles.sideItem}>Alerts</div>
            <div style={styles.sideItem}>Reports</div>
            <div style={styles.sideItem}>Traffic Logs</div>
            <div style={styles.sideItem}>Notifications</div>
            <div style={styles.sideHint}>Disabled navigation (demo)</div>
          </aside>

          <main style={styles.main}>
            {/* Animated stat cards */}
            <div style={styles.cards}>
              {STAT_TARGETS.map((s) => (
                <StatCard key={s.label} label={s.label} target={s.target} tone={s.tone} />
              ))}
            </div>

            <div style={styles.row}>
              <div style={styles.panel}>
                <div style={styles.panelTitle}>Threat Trend (placeholder)</div>
                <div style={styles.chartPlaceholder}>
                  Add charts later (Chart.js / Recharts).
                </div>
              </div>
              <div style={styles.panel}>
                <div style={styles.panelTitle}>Alerts Distribution (placeholder)</div>
                <div style={styles.chartPlaceholder}>Pie chart placeholder</div>
              </div>
            </div>

            <div style={styles.panel}>
              <div style={styles.panelHeader}>
                <div style={styles.panelTitle}>Recent Alerts</div>
                <button style={styles.ghostBtn} onClick={() => navigate("/login")}>Open Analyst View →</button>
              </div>

              {/* Severity filter tabs */}
              <div style={styles.filterRow}>
                {SEV_FILTERS.map((f) => (
                  <button
                    key={f}
                    style={sevFilter === f ? styles.filterTabActive : styles.filterTab}
                    onClick={() => setSevFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Severity</th>
                      <th style={styles.th}>Type</th>
                      <th style={styles.th}>Source IP</th>
                      <th style={styles.th}>Destination IP</th>
                      <th style={styles.th}>IDS</th>
                      <th style={styles.th}>Time</th>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ ...styles.td, textAlign: "center", color: "#64748b", padding: "2rem" }}>
                          No alerts for this filter.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((a) => (
                        <tr key={a.id} style={styles.tr}>
                          <td style={styles.td}>
                            <span style={{ ...styles.badge, ...sevStyle(a.sev) }}>{a.sev}</span>
                          </td>
                          <td style={styles.td}>{a.type}</td>
                          <td style={styles.tdMono}>{a.src}</td>
                          <td style={styles.tdMono}>{a.dst}</td>
                          <td style={styles.td}><span style={styles.tag}>{a.ids}</span></td>
                          <td style={styles.td}>{a.when}</td>
                          <td style={styles.td}>
                            <button style={styles.smallBtn} onClick={() => openAlert(a)}>View</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>

      <footer style={styles.footer}>© 2026 Intrusion Detection Dashboard</footer>

      {open && active && (
        <div style={styles.modalOverlay} onClick={() => setOpen(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <div style={styles.modalTitle}>Alert Detail (Demo)</div>
                <div style={styles.modalSubtitle}>{active.id} • {active.type}</div>
              </div>
              <button style={styles.modalClose} onClick={() => setOpen(false)}>×</button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.kvGrid}>
                <Kv k="Severity"       v={active.sev} />
                <Kv k="IDS Source"     v={active.ids} />
                <Kv k="Source IP"      v={active.src} mono />
                <Kv k="Destination IP" v={active.dst} mono />
                <Kv k="Time"           v={active.when} />
              </div>
              <div style={styles.divider} />
              <div style={styles.noteTitle}>Investigation Notes (demo)</div>
              <textarea
                style={styles.textarea}
                placeholder="Add notes... (login required)"
                disabled
                value="Demo mode: login required to create incidents or save notes."
              />
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.secondaryBtn} onClick={() => setOpen(false)}>Close</button>
              <button style={styles.primaryBtn} onClick={() => navigate("/login")}>Login to Investigate</button>
            </div>
          </div>
        </div>
      )}
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
    justifyContent: "space-between",
    gap: "1rem",
    flexWrap: "wrap",
    padding: "3rem 2rem",
  },
  heroLeft: { maxWidth: "720px" },
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
  heroTitle: { fontSize: "2.4rem", fontWeight: 900, marginBottom: "0.8rem" },
  heroSubtitle: { color: "#94a3b8", fontSize: "1.05rem", margin: 0, lineHeight: 1.6 },
  heroCtas: { display: "flex", gap: "0.75rem", marginTop: "1.3rem", flexWrap: "wrap" },
  heroRight: { flex: 1, display: "flex", justifyContent: "flex-end" },
  watermarkCard: {
    backgroundColor: "#111c33",
    border: "1px solid #24324f",
    borderRadius: "14px",
    padding: "1rem",
    minWidth: "260px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  },
  watermarkTitle: { fontWeight: 900 },
  watermarkText: { color: "#94a3b8", marginTop: "0.35rem", lineHeight: 1.6 },

  demoWrap: { padding: "0 2rem 2rem" },
  demoGrid: {
    display: "grid",
    gridTemplateColumns: "240px 1fr",
    gap: "1rem",
    alignItems: "start",
  },
  sidebar: {
    backgroundColor: "#111c33",
    border: "1px solid #24324f",
    borderRadius: "14px",
    padding: "1rem",
    position: "sticky",
    top: "1rem",
  },
  sideTitle: { fontWeight: 900, marginBottom: "0.8rem" },
  sideItem: {
    padding: "0.65rem 0.75rem",
    borderRadius: "10px",
    border: "1px solid #24324f",
    backgroundColor: "#0b1224",
    color: "#cbd5e1",
    marginBottom: "0.6rem",
    opacity: 0.8,
  },
  sideItemActive: {
    padding: "0.65rem 0.75rem",
    borderRadius: "10px",
    border: "1px solid #3b82f6",
    backgroundColor: "#0b1224",
    color: "#ffffff",
    marginBottom: "0.6rem",
    fontWeight: 900,
  },
  sideHint: { color: "#64748b", fontSize: "0.85rem", marginTop: "0.5rem" },

  main: { display: "flex", flexDirection: "column", gap: "1rem" },
  cards: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" },
  stat: {
    backgroundColor: "#111c33",
    border: "2px solid #24324f",
    borderRadius: "14px",
    padding: "1rem",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
  statLabel: { color: "#94a3b8", fontWeight: 800 },
  statValue: { fontSize: "1.8rem", fontWeight: 900, marginTop: "0.5rem" },

  row: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" },
  panel: {
    backgroundColor: "#111c33",
    border: "1px solid #24324f",
    borderRadius: "14px",
    padding: "1rem",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
  panelHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" },
  panelTitle: { fontWeight: 900 },
  chartPlaceholder: {
    marginTop: "0.8rem",
    backgroundColor: "#0b1224",
    border: "1px dashed #334155",
    borderRadius: "12px",
    padding: "1.2rem",
    color: "#94a3b8",
  },

  // Severity filter tabs
  filterRow: {
    display: "flex",
    gap: "0.4rem",
    marginTop: "0.9rem",
    flexWrap: "wrap",
  },
  filterTab: {
    padding: "0.3rem 0.9rem",
    borderRadius: "999px",
    border: "1px solid #334155",
    backgroundColor: "transparent",
    color: "#94a3b8",
    fontSize: "0.8rem",
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.04em",
  },
  filterTabActive: {
    padding: "0.3rem 0.9rem",
    borderRadius: "999px",
    border: "1px solid #3b82f6",
    backgroundColor: "rgba(59,130,246,0.15)",
    color: "#60a5fa",
    fontSize: "0.8rem",
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.04em",
  },

  tableWrap: { overflowX: "auto", borderRadius: "12px", border: "1px solid #24324f", marginTop: "0.8rem" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: "860px", backgroundColor: "#0b1224" },
  th: {
    textAlign: "left",
    fontSize: "0.8rem",
    color: "#a7b4c7",
    padding: "0.75rem 0.9rem",
    borderBottom: "1px solid #24324f",
    backgroundColor: "#0c1630",
  },
  tr: { borderBottom: "1px solid #152545" },
  td: { padding: "0.75rem 0.9rem", fontSize: "0.9rem", color: "#e2e8f0" },
  tdMono: { padding: "0.75rem 0.9rem", fontSize: "0.9rem", color: "#e2e8f0", fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" },
  tag: {
    display: "inline-block",
    padding: "0.25rem 0.55rem",
    borderRadius: "10px",
    backgroundColor: "#111827",
    border: "1px solid #24324f",
    color: "#cbd5e1",
    fontSize: "0.8rem",
    fontWeight: 800,
  },
  badge: {
    display: "inline-block",
    padding: "0.25rem 0.6rem",
    borderRadius: "999px",
    border: "1px solid",
    fontSize: "0.75rem",
    fontWeight: 900,
    color: "#fff",
  },
  smallBtn: {
    backgroundColor: "#1e293b",
    border: "1px solid #24324f",
    color: "#e2e8f0",
    padding: "0.45rem 0.75rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 800,
  },
  primaryBtn: {
    padding: "0.8rem 1.2rem",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: 900,
  },
  secondaryBtn: {
    padding: "0.8rem 1.2rem",
    backgroundColor: "transparent",
    color: "#e2e8f0",
    border: "1px solid #334155",
    borderRadius: "10px",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: 900,
  },
  ghostBtn: {
    backgroundColor: "transparent",
    border: "1px dashed #334155",
    color: "#cbd5e1",
    padding: "0.55rem 0.85rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 800,
  },
  footer: {
    marginTop: "auto",
    textAlign: "right",
    padding: "1rem 2rem",
    color: "#475569",
    fontSize: "0.8rem",
    borderTop: "1px solid #1e293b",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    zIndex: 50,
  },
  modal: {
    width: "min(800px, 95vw)",
    backgroundColor: "#111c33",
    border: "1px solid #24324f",
    borderRadius: "14px",
    boxShadow: "0 18px 60px rgba(0,0,0,0.5)",
    overflow: "hidden",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "1rem",
    borderBottom: "1px solid #24324f",
  },
  modalTitle: { fontWeight: 900, fontSize: "1.1rem" },
  modalSubtitle: { color: "#94a3b8", marginTop: "0.25rem" },
  modalClose: { background: "transparent", border: "none", color: "#cbd5e1", fontSize: "1.6rem", cursor: "pointer", lineHeight: 1 },
  modalBody: { padding: "1rem" },
  kvGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" },
  kv: { backgroundColor: "#0b1224", border: "1px solid #24324f", borderRadius: "12px", padding: "0.85rem" },
  kvKey: { color: "#94a3b8", fontSize: "0.85rem" },
  kvVal: { fontWeight: 900, fontSize: "1rem", marginTop: "0.35rem" },
  mono: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" },
  divider: { height: "1px", backgroundColor: "#24324f", margin: "0.9rem 0" },
  noteTitle: { fontWeight: 900, marginBottom: "0.5rem" },
  textarea: {
    width: "100%",
    minHeight: "110px",
    backgroundColor: "#0b1224",
    border: "1px solid #24324f",
    borderRadius: "12px",
    padding: "0.85rem",
    color: "#94a3b8",
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
  },
  modalFooter: { display: "flex", justifyContent: "flex-end", gap: "0.6rem", padding: "1rem", borderTop: "1px solid #24324f", flexWrap: "wrap" },
};

export default Demo;
