import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiEye, FiRefreshCw } from 'react-icons/fi';
import './Dashboard.css';
import AnalystLayout from "./AnalystLayout";

const TG_TOKEN   = import.meta.env.VITE_TG_TOKEN  || "";
const TG_CHAT_ID = import.meta.env.VITE_TG_CHAT_ID || "";

// ── PieChart ─────────────────────────────────────────────────────────────────
const PieChart = ({ high = 0, medium = 0, low = 0 }) => {
  const data = [
    { value: low,    color: '#22c55e' },
    { value: medium, color: '#f59e0b' },
    { value: high,   color: '#ef4444' },
  ];
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let cum = 0;
  const seg = (value, start) => {
    const angle = (value / total) * 2 * Math.PI;
    const end   = start + angle;
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
          return <path key={i} d={path} fill={d.color} stroke="#1e293b" strokeWidth="0.5" />;
        })}
        <circle cx="50" cy="50" r="20" fill="#1e293b" stroke="#1e293b" strokeWidth="1" />
      </svg>
      <div style={{ display:'flex', justifyContent:'center', gap:'1rem', fontSize:'0.78rem' }}>
        {[['High','#ef4444',high],['Medium','#f59e0b',medium],['Low','#22c55e',low]].map(([l,c,v]) => (
          <span key={l} style={{ color:c }}>● {l} ({v})</span>
        ))}
      </div>
    </div>
  );
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();

  const [alerts, setAlerts]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [backendStatus, setBackendStatus] = useState("Connecting…");
  const [tgMessage, setTgMessage]         = useState("");

  // Summary counts derived from live data
  const high   = alerts.filter(a => a.severity_label === "high").length;
  const medium = alerts.filter(a => a.severity_label === "medium").length;
  const low    = alerts.filter(a => a.severity_label === "low").length;
  const total  = alerts.length;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res  = await fetch("http://127.0.0.1:8000/alerts");
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

  useEffect(() => { fetchData(); }, []);

  const handleViewAlert = (alert) => navigate(`/alert/${alert.id}`, { state: { alert } });

  const sendToTelegram = async (text) => {
    if (!TG_TOKEN || !TG_CHAT_ID) {
      alert("Telegram not configured. Set VITE_TG_TOKEN and VITE_TG_CHAT_ID in .env");
      return;
    }
    try {
      await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TG_CHAT_ID, text }),
      });
      alert("Telegram alert sent!");
    } catch { alert("Failed to send Telegram message."); }
  };

  const sendAlertToTelegram = (alert) => sendToTelegram(
    `🚨 IDS ALERT\n\nType: ${alert.signature}\nSource: ${alert.src_ip}\nDest: ${alert.dest_ip}\nSeverity: ${alert.severity_label}\nProtocol: ${alert.proto}\nTime: ${alert.timestamp}`
  );

  return (
    <AnalystLayout>
      {/* Status bar */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem', flexWrap:'wrap', gap:'0.5rem' }}>
        <h1 style={{ fontSize:'1.4rem', fontWeight:800, color:'#f1f5f9' }}>Dashboard Overview</h1>
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
          <span style={{ fontSize:'0.8rem', color: backendStatus.startsWith('✅') ? '#22c55e' : '#f59e0b' }}>
            {backendStatus}
          </span>
          <button onClick={fetchData}
            style={{ background:'transparent', border:'1px solid #334155', borderRadius:6, color:'#94a3b8', padding:'0.35rem 0.6rem', cursor:'pointer', fontSize:'0.8rem', display:'flex', alignItems:'center', gap:'0.3rem' }}>
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards — live from backend */}
      <div className="summary-cards">
        <div className="card card-total">
          <span className="card-icon">!</span>
          <div className="card-label">Total Alerts</div>
          <hr />
          <div className="card-value">{loading ? '…' : total}</div>
        </div>
        <div className="card card-high">
          <span className="card-icon">!</span>
          <div className="card-label">High Severity</div>
          <hr />
          <div className="card-value">{loading ? '…' : high}</div>
        </div>
        <div className="card card-medium">
          <span className="card-icon">!</span>
          <div className="card-label">Medium Severity</div>
          <hr />
          <div className="card-value">{loading ? '…' : medium}</div>
        </div>
        <div className="card card-low">
          <span className="card-icon">!</span>
          <div className="card-label">Low Severity</div>
          <hr />
          <div className="card-value">{loading ? '…' : low}</div>
        </div>
      </div>

      {/* Trends + Pie */}
      <div className="trends-distribution-row">
        <div className="trends-card">
          <div className="trends-header">
            <span>Threat Trends</span>
            <select className="time-filter">
              <option>24 hours</option>
              <option>7 days</option>
              <option>30 days</option>
            </select>
          </div>
          <div className="chart-placeholder">📈 Live chart coming soon</div>
        </div>
        <div className="distribution-card">
          <div className="distribution-header">Alerts Distribution</div>
          <PieChart high={high} medium={medium} low={low} />
        </div>
      </div>

      {/* Recent Alerts Table */}
      <div className="recent-alerts-section">
        <h2>Recent Alerts</h2>
        {loading ? (
          <p style={{ color:'#64748b', padding:'1rem 0' }}>Loading alerts…</p>
        ) : alerts.length === 0 ? (
          <p style={{ color:'#64748b', padding:'1rem 0' }}>
            No alerts found. Run <code>eve_ingestor.py</code> to ingest sample data.
          </p>
        ) : (
          <div style={{ overflowX:'auto' }}>
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
                    <td>{alert.signature}</td>
                    <td style={{ fontFamily:'monospace', color:'#38bdf8' }}>{alert.src_ip}</td>
                    <td style={{ fontFamily:'monospace' }}>{alert.dest_ip}</td>
                    <td>{alert.proto}</td>
                    <td style={{ color:'#64748b', fontSize:'0.8rem' }}>
                      {alert.timestamp ? new Date(alert.timestamp).toLocaleString() : '—'}
                    </td>
                    <td><span className={`progress-badge ${alert.status}`}>{alert.status}</span></td>
                    <td>
                      <button className="view-btn" onClick={() => handleViewAlert(alert)} title="View details">
                        <FiEye />
                      </button>
                    </td>
                    <td>
                      <button className="telegram-btn" onClick={() => sendAlertToTelegram(alert)}>Send</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ marginTop:'1rem' }}>
          <Link to="/alerts" style={{ color:'#38bdf8', fontSize:'0.85rem', textDecoration:'none' }}>
            View all alerts →
          </Link>
        </div>
      </div>

      {/* Telegram Test */}
      <div style={{ marginTop:'1.5rem', padding:'1.25rem', background:'#1e293b', borderRadius:12, border:'1px solid #334155' }}>
        <h2 style={{ fontSize:'0.95rem', fontWeight:700, marginBottom:'0.75rem', color:'#f1f5f9' }}>Telegram Alert Test</h2>
        <div style={{ display:'flex', gap:'0.75rem' }}>
          <input type="text" placeholder="Type a message to send to Telegram…"
            value={tgMessage} onChange={(e) => setTgMessage(e.target.value)}
            style={{ flex:1, padding:'0.65rem 0.9rem', borderRadius:8, border:'1px solid #334155', background:'#0f172a', color:'#f1f5f9', fontSize:'0.875rem', outline:'none' }}
          />
          <button onClick={() => { if (tgMessage.trim()) { sendToTelegram(tgMessage); setTgMessage(""); } }}
            style={{ padding:'0.65rem 1.25rem', background:'#3b82f6', border:'none', borderRadius:8, color:'#fff', cursor:'pointer', fontWeight:600 }}>
            Send
          </button>
        </div>
        <p style={{ color:'#475569', fontSize:'0.75rem', marginTop:'0.5rem' }}>
          Set VITE_TG_TOKEN and VITE_TG_CHAT_ID in <code>.env</code> to enable.
        </p>
      </div>

      <footer className="footer"><p>© 2026 Intrusion Detection Dashboard</p></footer>
    </AnalystLayout>
  );
};

export default Dashboard;
