import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiEye, FiRefreshCw } from 'react-icons/fi';
import './analyst.css';
import AnalystSidebar from './AnalystSidebar';

// ── PieChart ─────────────────────────────────────────────────────────────────
const PieChart = ({ high = 0, medium = 0, low = 0 }) => {
  const data = [
    { value: low, color: '#22c55e' },
    { value: medium, color: '#f59e0b' },
    { value: high, color: '#ef4444' },
  ];
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let cum = 0;
  const seg = (value, start) => {
    const angle = (value / total) * 2 * Math.PI;
    const end = start + angle;
    const x1 = 50 + 40 * Math.sin(start);
    const y1 = 50 - 40 * Math.cos(start);
    const x2 = 50 + 40 * Math.sin(end);
    const y2 = 50 - 40 * Math.cos(end);
    return `M 50,50 L ${x1},${y1} A 40,40 0 ${angle > Math.PI ? 1 : 0} 1 ${x2},${y2} Z`;
  };
  return (
    <div className="pie-chart-container">
      <svg viewBox="0 0 100 100" width="100%" height="120">
        {data.map((d, i) => {
          const path = seg(d.value, cum);
          cum += (d.value / total) * 2 * Math.PI;
          return <path key={i} d={path} fill={d.color} stroke="var(--bg-card)" strokeWidth="0.5" />;
        })}
        <circle cx="50" cy="50" r="20" fill="var(--bg-card)" stroke="var(--bg-card)" strokeWidth="1" />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.78rem' }}>
        {[['High', '#ef4444', high], ['Medium', '#f59e0b', medium], ['Low', '#22c55e', low]].map(([l, c, v]) => (
          <span key={l} style={{ color: c }}>● {l} ({v})</span>
        ))}
      </div>
    </div>
  );
};


// ── Dashboard ─────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState("Connecting…");
  const [telegramId, setTelegramId] = useState("");

  // Summary counts derived from live data
  const high = alerts.filter(a => a.severity_label === "high").length;
  const medium = alerts.filter(a => a.severity_label === "medium").length;
  const low = alerts.filter(a => a.severity_label === "low").length;
  const total = alerts.length;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/alerts");
      const data = await res.json();
      setAlerts(data.items || []);
      setBackendStatus(`✅ Connected — ${data.items?.length ?? 0} alert(s) loaded`);
    } catch (err) {
      setBackendStatus("⚠️ Backend offline — showing no live data");
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/api/users/profile", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        setTelegramId(data.telegram_id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
    fetchUser();
  }, []);

  const handleViewAlert = (alert) => navigate(`/alert/${alert.id}`, { state: { alert } });

  const sendTelegramMessage = async (alertData) => {
    if (!telegramId) {
      alert("No Telegram ID set in profile!");
      return;
    }
    const message = `🚨 IDS ALERT\n\nType: ${alertData.signature}\nSource: ${alertData.src_ip}\nDestination: ${alertData.dest_ip}\nSeverity: ${alertData.severity_label}\nIDS: ${alertData.proto}\nTime: ${alertData.timestamp ? new Date(alertData.timestamp).toLocaleString() : '—'}`;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/alerts/send-telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          chat_id: telegramId,
          text: message
        })
      });

      const data = await res.json();
      if (data.ok) {
        alert("Telegram message sent!");
      } else {
        alert("Failed to send Telegram message");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send Telegram message");
    }
  };

  return (
    <>
      {/* Status bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>Dashboard Overview</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: backendStatus.startsWith('✅') ? '#22c55e' : '#f59e0b' }}>
            {backendStatus}
          </span>
          <button onClick={fetchData}
            style={{ background: 'transparent', border: '1px solid var(--border-color)', borderRadius: 6, color: 'var(--text-muted)', padding: '0.35rem 0.6rem', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card card-total">
          <span className="card-icon">!</span>
          <div className="card-label">Total Alerts</div>
          <hr style={{ borderColor: 'var(--border-color)', opacity: 0.2 }} />
          <div className="card-value">{loading ? '…' : total}</div>
        </div>
        <div className="card card-high">
          <span className="card-icon">!</span>
          <div className="card-label">High Severity</div>
          <hr style={{ borderColor: 'var(--border-color)', opacity: 0.2 }} />
          <div className="card-value">{loading ? '…' : high}</div>
        </div>
        <div className="card card-medium">
          <span className="card-icon">!</span>
          <div className="card-label">Medium Severity</div>
          <hr style={{ borderColor: 'var(--border-color)', opacity: 0.2 }} />
          <div className="card-value">{loading ? '…' : medium}</div>
        </div>
        <div className="card card-low">
          <span className="card-icon">!</span>
          <div className="card-label">Low Severity</div>
          <hr style={{ borderColor: 'var(--border-color)', opacity: 0.2 }} />
          <div className="card-value">{loading ? '…' : low}</div>
        </div>
      </div>

      {/* Trends + Pie */}
      <div className="trends-distribution-row">
        <div className="trends-card" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="trends-header">
            <span style={{ color: 'var(--text-main)' }}>Threat Trends</span>
            <select className="time-filter" style={{ backgroundColor: 'var(--bg-sidebar)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
              <option>24 hours</option>
              <option>7 days</option>
              <option>30 days</option>
            </select>
          </div>
          <div className="chart-placeholder" style={{ color: 'var(--text-muted)' }}>📈 Live chart coming soon</div>
        </div>
        <div className="distribution-card" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="distribution-header" style={{ color: 'var(--text-main)' }}>Alerts Distribution</div>
          <PieChart high={high} medium={medium} low={low} />
        </div>
      </div>

      {/* Recent Alerts Table */}
      <div className="recent-alerts-section">
        <h2 style={{ color: 'var(--text-main)' }}>Recent Alerts</h2>
        {loading ? (
          <p style={{ color: 'var(--text-muted)', padding: '1rem 0' }}>Loading alerts…</p>
        ) : alerts.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', padding: '1rem 0' }}>
            No alerts found. Run <code>eve_ingestor.py</code> to ingest sample data.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="alerts-table">
              <thead>
                <tr>
                  <th>Severity</th>
                  <th>Alert Type</th>
                  <th>Source IP</th>
                  <th>Destination IP</th>
                  <th>Protocol</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>View</th>
                  <th>Telegram</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert) => (
                  <tr key={alert.id}>
                    <td><span className={`severity-badge ${alert.severity_label}`}>{alert.severity_label}</span></td>
                    <td style={{ color: 'var(--text-main)' }}>{alert.signature}</td>
                    <td style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{alert.src_ip}</td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--text-main)' }}>{alert.dest_ip}</td>
                    <td style={{ color: 'var(--text-main)' }}>{alert.proto}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString([], 
                        { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—'}
                    </td>
                    <td><span className={`progress-badge ${alert.status}`}>{alert.status}</span></td>
                    <td>
                      <button className="view-btn" onClick={() => handleViewAlert(alert)} title="View details">
                        <FiEye />
                      </button>
                    </td>
                    <td>
                      <button className="telegram-btn" onClick={() => sendTelegramMessage(alert)}>Send</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ marginTop: '1rem' }}>
          <Link to="/alerts" style={{ color: '#38bdf8', fontSize: '0.85rem', textDecoration: 'none' }}>
            View all alerts →
          </Link>
        </div>
      </div>

      <footer className="footer" style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)' }}>
        <p>© 2026 Intrusion Detection Dashboard</p>
      </footer>
    </>
  );
};

export default Dashboard;