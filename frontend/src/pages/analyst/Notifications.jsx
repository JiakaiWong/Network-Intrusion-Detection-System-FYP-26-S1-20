import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import './analyst.css';

function Notifications() {
  const navigate = useNavigate();

  const [severity, setSeverity] = useState("ALL");
  const [status, setStatus] = useState("UNREAD");
  const [channel, setChannel] = useState("ALL");
  const [items, setItems] = useState([
    { id: "NTF-0001", sev: "HIGH", title: "SQL Injection attack detected",      ip: "192.168.1.12",  when: "5 mins ago",  channel: "MOBILE",    read: false, failed: false },
    { id: "NTF-0002", sev: "HIGH", title: "Brute Force attack detected",         ip: "10.0.0.45",     when: "10 mins ago", channel: "DASHBOARD", read: false, failed: true  },
    { id: "NTF-0003", sev: "MED",  title: "Command Injection attack detected",   ip: "172.16.8.200",  when: "1 hr ago",    channel: "MOBILE",    read: true,  failed: false },
    { id: "NTF-0004", sev: "LOW",  title: "Phishing attempt blocked",            ip: "172.16.8.12",   when: "3 hrs ago",   channel: "EMAIL",     read: true,  failed: false },
  ]);

  const filtered = useMemo(() => {
    return items.filter((n) => {
      const sevMatch    = severity === "ALL" || n.sev === severity;
      const statusMatch = status   === "ALL" || (status === "UNREAD" ? !n.read : n.read);
      const chanMatch   = channel  === "ALL" || n.channel === channel;
      return sevMatch && statusMatch && chanMatch;
    });
  }, [items, severity, status, channel]);

  const acknowledge = (id) =>
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const unreadCount = items.filter(n => !n.read).length;

  return (
    <main className="dashboard-main">
      {/* Header */}
      <div className="dashboard-status-bar">
        <div>
          <h1 className="page-title">Notifications</h1>
          <div className="text-sm text-muted">Unread: {unreadCount}</div>
        </div>
        <button
          className="export-btn"
          onClick={() => setItems(prev => prev.map(n => ({ ...n, read: true })))}
        >
          Mark all as read
        </button>
      </div>

      {/* Filter bar */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="filters" style={{ marginBottom: 0 }}>
          <span className="nav-section-title" style={{ alignSelf: 'center' }}>Filters</span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Severity</span>
            <select className="time-filter" value={severity} onChange={(e) => setSeverity(e.target.value)}>
              <option value="ALL">All</option>
              <option value="HIGH">High</option>
              <option value="MED">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status</span>
            <select className="time-filter" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="UNREAD">Unread</option>
              <option value="READ">Read</option>
              <option value="ALL">All</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Channel</span>
            <select className="time-filter" value={channel} onChange={(e) => setChannel(e.target.value)}>
              <option value="ALL">All</option>
              <option value="MOBILE">Mobile</option>
              <option value="EMAIL">Email</option>
              <option value="DASHBOARD">Dashboard</option>
            </select>
          </div>

          <div style={{ marginLeft: 'auto', alignSelf: 'flex-end', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {filtered.length} notification{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Notification cards — 2-column grid */}
      {filtered.length === 0 ? (
        <div className="empty-text">No notifications match the current filters.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          {filtered.map((n) => (
            <div
              key={n.id}
              className="card"
              style={{
                opacity: n.read ? 0.55 : 1,
                borderLeft: `3px solid ${sevColor(n.sev)}`,
                padding: '0.75rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
              }}
            >
              {/* Top row: badge + time */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '0.15rem 0.55rem',
                  borderRadius: '999px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  backgroundColor: sevBg(n.sev),
                  color: sevColor(n.sev),
                  border: `1px solid ${sevColor(n.sev)}`,
                  flexShrink: 0,
                }}>
                  {n.sev === 'MED' ? 'MEDIUM' : n.sev}
                </span>

                {n.failed && (
                  <span style={{ color: 'var(--color-yellow)', fontSize: '0.72rem', fontWeight: 700 }}>
                    ⚠ Delivery failed
                  </span>
                )}

                <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {n.when}
                </span>
              </div>

              {/* Title */}
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3 }}>
                {n.title}
              </div>

              {/* Meta */}
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                IP: <span className="src-ip mono" style={{ fontSize: '0.75rem' }}>{n.ip}</span>
                <span style={{ margin: '0 0.3rem' }}>•</span>
                {n.channel}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                {!n.read ? (
                  <button className="view-btn" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }} onClick={() => acknowledge(n.id)}>
                    ✓ Acknowledge
                  </button>
                ) : (
                  <button className="view-btn" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }} onClick={() => alert("Mock modal")}>
                    View
                  </button>
                )}
                <button className="export-btn" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }} onClick={() => navigate("/alerts")}>
                  View Alert →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

/* Severity colour helpers */
function sevColor(sev) {
  if (sev === 'HIGH') return '#ef4444';
  if (sev === 'MED')  return '#f59e0b';
  return '#22c55e';
}
function sevBg(sev) {
  if (sev === 'HIGH') return 'rgba(239,68,68,0.12)';
  if (sev === 'MED')  return 'rgba(245,158,11,0.12)';
  return 'rgba(34,197,94,0.12)';
}

export default Notifications;
