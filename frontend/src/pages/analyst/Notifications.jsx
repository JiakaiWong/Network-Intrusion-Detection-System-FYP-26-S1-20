import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import './analyst.css';

function Notifications() {
  const navigate = useNavigate();

  // State and Logic
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

  return (
    <main className="dashboard-main">
      <div className="dashboard-status-bar">
        <div>
          <h1 className="page-title">Notifications</h1>
          <div className="text-sm text-muted">Unread: {unreadCount}</div>
        </div>
        <button
          className="refresh-btn"
          onClick={() => setItems(prev => prev.map(n => ({ ...n, read: true })))}
        >
          Mark all as read
        </button>
      </div>

      <div className="card">
        <div className="trends-header">
          <div className="nav-section-title">Filters</div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select className="time-filter" value={severity} onChange={(e) => setSeverity(e.target.value)}>
              <option value="ALL">All</option>
              <option value="HIGH">High</option>
              <option value="MED">Medium</option>
              <option value="LOW">Low</option>
            </select>
            <select className="time-filter" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="UNREAD">Unread</option>
              <option value="READ">Read</option>
              <option value="ALL">All</option>
            </select>
            <select className="time-filter" value={channel} onChange={(e) => setChannel(e.target.value)}>
              <option value="ALL">All</option>
              <option value="MOBILE">Mobile</option>
              <option value="EMAIL">Email</option>
              <option value="DASHBOARD">Dashboard</option>
            </select>
          </div>
        </div>
      </div>

      <div className="summary-cards">
        {filtered.map((n) => (
          <div
            key={n.id}
            className={`card ${n.read ? 'text-muted' : ''}`}
          >
            <div className={`card-icon severity-badge ${n.sev === 'MED' ? 'medium' : n.sev.toLowerCase()}`}>{n.sev}</div>
            {n.failed && <div style={{ color: 'var(--color-yellow)', fontSize: '0.85rem', fontWeight: 700 }}>Delivery failed</div>}
            <div className="card-label">{n.when}</div>
            <div className="card-value" style={{ fontSize: '1rem', fontWeight: 700 }}>{n.title}</div>
            <div className="text-sm">
              IP: <span className="src-ip mono">{n.ip}</span> • {n.channel}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              {!n.read ? (
                <button className="view-btn" onClick={() => acknowledge(n.id)}>Acknowledge</button>
              ) : (
                <button className="telegram-btn" onClick={() => alert("Mock modal")}>View</button>
              )}
              <button className="view-btn" onClick={() => navigate("/alerts")}>View Alert</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Notifications;
