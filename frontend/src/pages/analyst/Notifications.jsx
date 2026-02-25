import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnalystLayout from "../../components/AnalystLayout";

function Notifications() {
  const navigate = useNavigate();

  const [severity, setSeverity] = useState("ALL");
  const [status, setStatus] = useState("UNREAD");
  const [channel, setChannel] = useState("ALL");

  const [items, setItems] = useState([
    {
      id: "NTF-0001",
      sev: "HIGH",
      title: "SQL Injection attack detected",
      ip: "192.168.1.12",
      when: "5 mins ago",
      channel: "MOBILE",
      read: false,
      failed: false,
    },
    {
      id: "NTF-0002",
      sev: "HIGH",
      title: "Brute Force attack detected",
      ip: "10.0.0.45",
      when: "10 mins ago",
      channel: "DASHBOARD",
      read: false,
      failed: true,
    },
    {
      id: "NTF-0003",
      sev: "MED",
      title: "Command Injection attack detected",
      ip: "172.16.8.200",
      when: "1 hr ago",
      channel: "MOBILE",
      read: true,
      failed: false,
    },
    {
      id: "NTF-0004",
      sev: "LOW",
      title: "Phishing attempt blocked",
      ip: "172.16.8.12",
      when: "3 hrs ago",
      channel: "EMAIL",
      read: true,
      failed: false,
    },
  ]);

  const filtered = useMemo(() => {
    return items.filter((n) => {
      const sevMatch = severity === "ALL" || n.sev === severity;
      const statusMatch =
        status === "ALL" || (status === "UNREAD" ? !n.read : n.read);
      const chanMatch = channel === "ALL" || n.channel === channel;
      return sevMatch && statusMatch && chanMatch;
    });
  }, [items, severity, status, channel]);

  const acknowledge = (id) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const retry = (id) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, failed: false } : n))
    );
    alert("Retry request mocked – this would trigger re-send.");
  };

  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <AnalystLayout>


      <div style={styles.main}>
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.heading}>Notifications</h1>
            <div style={styles.subheading}>Unread: {unreadCount}</div>
          </div>
          <button
            style={styles.secondaryBtn}
            onClick={() => {
              setItems((prev) => prev.map((n) => ({ ...n, read: true })));
            }}
          >
            Mark all as read
          </button>
        </div>

        <div style={styles.card}>
          <div style={styles.filtersRow}>
            <div style={styles.field}>
              <label style={styles.label}>Severity</label>
              <select
                style={styles.select}
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
              >
                <option value="ALL">All</option>
                <option value="HIGH">High</option>
                <option value="MED">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Status</label>
              <select
                style={styles.select}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="UNREAD">Unread</option>
                <option value="READ">Read</option>
                <option value="ALL">All</option>
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Channel</label>
              <select
                style={styles.select}
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

        <div style={styles.grid}>
          {filtered.map((n) => (
            <div
              key={n.id}
              style={{ ...styles.notice, ...(n.read ? styles.noticeRead : {}) }}
            >
              <div style={styles.noticeTop}>
                <span style={{ ...styles.sevBadge, ...sevStyle(n.sev) }}>
                  {n.sev}
                </span>
                {n.failed && <span style={styles.failed}>Delivery failed</span>}
                <span style={styles.noticeWhen}>{n.when}</span>
              </div>

              <div style={styles.noticeTitle}>{n.title}</div>

              <div style={styles.noticeMeta}>
                IP: <span style={styles.mono}>{n.ip}</span> • Channel:{" "}
                {n.channel}
              </div>

              <div style={styles.noticeActions}>
                {!n.read ? (
                  <button
                    style={styles.primaryBtn}
                    onClick={() => acknowledge(n.id)}
                  >
                    Acknowledge
                  </button>
                ) : (
                  <button
                    style={styles.secondaryBtn}
                    onClick={() =>
                      alert("Open notification details modal (mock)")
                    }
                  >
                    View
                  </button>
                )}

                <button
                  style={styles.ghostBtn}
                  onClick={() => navigate("/alerts")}
                >
                  View Alert
                </button>

                {n.failed && (
                  <button
                    style={styles.retryBtn}
                    onClick={() => retry(n.id)}
                  >
                    Retry
                  </button>
                )}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ ...styles.notice, textAlign: "center" }}>
              <div style={{ color: "#94a3b8" }}>
                No notifications match your filters.
              </div>
            </div>
          )}
        </div>
      </div>
    </AnalystLayout>
  );
}

function sevStyle(sev) {
  if (sev === "HIGH")
    return { backgroundColor: "#7f1d1d", borderColor: "#ef4444" };
  if (sev === "MED")
    return { backgroundColor: "#78350f", borderColor: "#f59e0b" };
  return { backgroundColor: "#064e3b", borderColor: "#10b981" };
}

const styles = {


  main: { flex: 1, padding: "2rem", overflowY: "auto" },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "1rem",
    flexWrap: "wrap",
    marginBottom: "1rem",
  },
  heading: { fontSize: "1.5rem", margin: 0 },
  subheading: { color: "#94a3b8", marginTop: "0.35rem" },

  card: {
    backgroundColor: "#111c33",
    border: "1px solid #24324f",
    borderRadius: "12px",
    padding: "1rem",
    marginBottom: "1rem",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  },
  filtersRow: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
    alignItems: "flex-end",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.35rem",
    minWidth: "220px",
    flex: "1",
  },
  label: { fontSize: "0.8rem", color: "#94a3b8" },
  select: {
    backgroundColor: "#0b1224",
    border: "1px solid #24324f",
    color: "#e2e8f0",
    borderRadius: "10px",
    padding: "0.75rem 0.9rem",
    outline: "none",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "1rem",
  },
  notice: {
    backgroundColor: "#111c33",
    border: "1px solid #24324f",
    borderRadius: "12px",
    padding: "1rem",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
  noticeRead: {
    opacity: 0.8,
    backgroundColor: "#0b1224",
  },
  noticeTop: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  sevBadge: {
    display: "inline-block",
    padding: "0.25rem 0.6rem",
    borderRadius: "999px",
    border: "1px solid",
    fontSize: "0.75rem",
    fontWeight: 800,
    color: "#fff",
  },
  failed: {
    color: "#f59e0b",
    fontSize: "0.85rem",
    fontWeight: 700,
  },
  noticeWhen: {
    marginLeft: "auto",
    color: "#94a3b8",
    fontSize: "0.85rem",
  },
  noticeTitle: {
    fontSize: "1.05rem",
    fontWeight: 900,
    marginTop: "0.6rem",
  },
  noticeMeta: {
    marginTop: "0.35rem",
    color: "#94a3b8",
    fontSize: "0.9rem",
  },
  mono: {
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
  noticeActions: {
    display: "flex",
    gap: "0.6rem",
    marginTop: "0.9rem",
    flexWrap: "wrap",
  },
  primaryBtn: {
    backgroundColor: "#16a34a",
    border: "none",
    color: "#fff",
    padding: "0.6rem 0.9rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 700,
  },
  secondaryBtn: {
    backgroundColor: "#1e293b",
    border: "1px solid #24324f",
    color: "#e2e8f0",
    padding: "0.6rem 0.9rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 700,
  },
  ghostBtn: {
    backgroundColor: "transparent",
    border: "1px dashed #334155",
    color: "#cbd5e1",
    padding: "0.6rem 0.9rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 700,
  },
  retryBtn: {
    backgroundColor: "#f59e0b",
    border: "none",
    color: "#0b1224",
    padding: "0.6rem 0.9rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 900,
  },
};

export default Notifications;