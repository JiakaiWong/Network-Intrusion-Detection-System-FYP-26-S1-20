import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import './analyst.css';
import { useTheme } from "../../contexts/ThemeContext";

function Notifications() {
  const navigate = useNavigate();
  const { theme } = useTheme(); // "light" or "dark"
  
  // 1. Create a dynamic theme object based on the current mode
  const isDark = theme === "dark";
  const colors = {
    bg: isDark ? "#0b1224" : "#f8fafc",
    cardBg: isDark ? "#111c33" : "#ffffff",
    border: isDark ? "#24324f" : "#e2e8f0",
    text: isDark ? "#e2e8f0" : "#1e293b",
    subtext: isDark ? "#94a3b8" : "#64748b",
    inputBg: isDark ? "#0b1224" : "#f1f5f9",
    btnSecondary: isDark ? "#1e293b" : "#e2e8f0",
    btnSecondaryText: isDark ? "#e2e8f0" : "#1e293b",
  };

  // State and Logic (remains the same)
  const [severity, setSeverity] = useState("ALL");
  const [status, setStatus] = useState("UNREAD");
  const [channel, setChannel] = useState("ALL");
  const [items, setItems] = useState([
    { id: "NTF-0001", sev: "HIGH", title: "SQL Injection attack detected", ip: "192.168.1.12", when: "5 mins ago", channel: "MOBILE", read: false, failed: false },
    { id: "NTF-0002", sev: "HIGH", title: "Brute Force attack detected", ip: "10.0.0.45", when: "10 mins ago", channel: "DASHBOARD", read: false, failed: true },
    { id: "NTF-0003", sev: "MED", title: "Command Injection attack detected", ip: "172.16.8.200", when: "1 hr ago", channel: "MOBILE", read: true },
    { id: "NTF-0004", sev: "LOW", title: "Phishing attempt blocked", ip: "172.16.8.12", when: "3 hrs ago", channel: "EMAIL", read: true },
  ]);

  const filtered = useMemo(() => {
    return items.filter((n) => {
      const sevMatch = severity === "ALL" || n.sev === severity;
      const statusMatch = status === "ALL" || (status === "UNREAD" ? !n.read : n.read);
      const chanMatch = channel === "ALL" || n.channel === channel;
      return sevMatch && statusMatch && chanMatch;
    });
  }, [items, severity, status, channel]);

  const acknowledge = (id) => setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const unreadCount = items.filter((n) => !n.read).length;

  // 2. Generate styles dynamically
  const s = getDynamicStyles(colors);

  return (
    <main className="dashboard-main" style={{...s.main, backgroundColor: colors.bg, color: colors.text}}>
      <div style={s.headerRow}>
        <div>
          <h1 style={s.heading}>Notifications</h1>
          <div style={{...s.subheading, color: colors.subtext}}>Unread: {unreadCount}</div>
        </div>
        <button
          style={{...s.secondaryBtn, backgroundColor: colors.btnSecondary, color: colors.btnSecondaryText}}
          onClick={() => setItems(prev => prev.map(n => ({ ...n, read: true })))}
        >
          Mark all as read
        </button>
      </div>

      <div style={{...s.card, backgroundColor: colors.cardBg, borderColor: colors.border}}>
        <div style={s.filtersRow}>
          {/* Severity Select */}
          <div style={s.field}>
            <label style={{...s.label, color: colors.subtext}}>Severity</label>
            <select
              style={{...s.select, backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border}}
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
            >
              <option value="ALL">All</option>
              <option value="HIGH">High</option>
              <option value="MED">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          {/* Status Select */}
          <div style={s.field}>
            <label style={{...s.label, color: colors.subtext}}>Status</label>
            <select
              style={{...s.select, backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border}}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="UNREAD">Unread</option>
              <option value="READ">Read</option>
              <option value="ALL">All</option>
            </select>
          </div>

          {/* Channel Select */}
          <div style={s.field}>
            <label style={{...s.label, color: colors.subtext}}>Channel</label>
            <select
              style={{...s.select, backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border}}
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
            >
              <option value="ALL">All</option>
              <option value="MOBILE">Mobile</option>
              <option value="EMAIL">Email</option>
              <option value="DASHBOARD">Dashboard</option>
            </select>
          </div>
        </div>
      </div>

      <div style={s.grid}>
        {filtered.map((n) => (
          <div
            key={n.id}
            style={{ 
              ...s.notice, 
              backgroundColor: colors.cardBg, 
              borderColor: colors.border,
              ...(n.read ? { opacity: 0.6, backgroundColor: colors.bg } : {}) 
            }}
          >
            <div style={s.noticeTop}>
              <span style={{ ...s.sevBadge, ...sevStyle(n.sev) }}>{n.sev}</span>
              {n.failed && <span style={s.failed}>Delivery failed</span>}
              <span style={{...s.noticeWhen, color: colors.subtext}}>{n.when}</span>
            </div>

            <div style={{...s.noticeTitle, color: colors.text}}>{n.title}</div>

            <div style={{...s.noticeMeta, color: colors.subtext}}>
              IP: <span style={{...s.mono, color: colors.text}}>{n.ip}</span> • Channel: {n.channel}
            </div>

            <div style={s.noticeActions}>
              {!n.read ? (
                <button style={s.primaryBtn} onClick={() => acknowledge(n.id)}>Acknowledge</button>
              ) : (
                <button style={{...s.secondaryBtn, backgroundColor: colors.btnSecondary, color: colors.btnSecondaryText}} onClick={() => alert("Mock modal")}>View</button>
              )}
              <button style={{...s.ghostBtn, color: colors.subtext}} onClick={() => navigate("/alerts")}>View Alert</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

// 3. Keep static structure separate from dynamic colors
const getDynamicStyles = (colors) => ({
  main: { flex: 1, padding: "2rem", overflowY: "auto", transition: "all 0.2s ease" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" },
  heading: { fontSize: "1.5rem", margin: 0 },
  subheading: { marginTop: "0.35rem" },
  card: { border: "1px solid", borderRadius: "12px", padding: "1rem", marginBottom: "1rem", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
  filtersRow: { display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" },
  field: { display: "flex", flexDirection: "column", gap: "0.35rem", minWidth: "220px", flex: "1" },
  label: { fontSize: "0.8rem" },
  select: { border: "1px solid", borderRadius: "10px", padding: "0.75rem 0.9rem", outline: "none" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1rem" },
  notice: { border: "1px solid", borderRadius: "12px", padding: "1rem", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
  noticeTop: { display: "flex", alignItems: "center", gap: "0.5rem" },
  sevBadge: { display: "inline-block", padding: "0.25rem 0.6rem", borderRadius: "999px", border: "1px solid", fontSize: "0.75rem", fontWeight: 800, color: "#fff" },
  failed: { color: "#f59e0b", fontSize: "0.85rem", fontWeight: 700 },
  noticeWhen: { marginLeft: "auto", fontSize: "0.85rem" },
  noticeTitle: { fontSize: "1.05rem", fontWeight: 900, marginTop: "0.6rem" },
  noticeMeta: { marginTop: "0.35rem", fontSize: "0.9rem" },
  mono: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" },
  noticeActions: { display: "flex", gap: "0.6rem", marginTop: "0.9rem", flexWrap: "wrap" },
  primaryBtn: { backgroundColor: "#16a34a", border: "none", color: "#fff", padding: "0.6rem 0.9rem", borderRadius: "10px", cursor: "pointer", fontWeight: 700 },
  secondaryBtn: { border: "1px solid transparent", padding: "0.6rem 0.9rem", borderRadius: "10px", cursor: "pointer", fontWeight: 700 },
  ghostBtn: { backgroundColor: "transparent", border: "1px dashed", padding: "0.6rem 0.9rem", borderRadius: "10px", cursor: "pointer", fontWeight: 700 },
});

function sevStyle(sev) {
  if (sev === "HIGH") return { backgroundColor: "#7f1d1d", borderColor: "#ef4444" };
  if (sev === "MED") return { backgroundColor: "#78350f", borderColor: "#f59e0b" };
  return { backgroundColor: "#064e3b", borderColor: "#10b981" };
}

export default Notifications;