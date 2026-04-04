import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiEye, FiRefreshCw } from 'react-icons/fi';
import './Dashboard.css';
import AnalystLayout from "./AnalystLayout";
import { useTheme, THEMES } from "./ThemeContext";

const TG_TOKEN   = import.meta.env.VITE_TG_TOKEN  || "";
const TG_CHAT_ID = import.meta.env.VITE_TG_CHAT_ID || "";

// ── Chart Components ──────────────────────────────────────────────────────────

const COLORS = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' };

// 1. Pie Chart (donut)
const PieChart = ({ high = 0, medium = 0, low = 0 }) => {
  const data = [
    { label: 'Low',    value: low,    color: COLORS.low },
    { label: 'Medium', value: medium, color: COLORS.medium },
    { label: 'High',   value: high,   color: COLORS.high },
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
      <svg viewBox="0 0 100 100" width="100%" height="130">
        {data.map((d, i) => {
          const path = seg(d.value, cum);
          cum += (d.value / total) * 2 * Math.PI;
          return <path key={i} d={path} fill={d.color} stroke="var(--bg-card)" strokeWidth="1" />;
        })}
        <circle cx="50" cy="50" r="22" fill="var(--bg-card)" />
        <text x="50" y="53" textAnchor="middle" fill="var(--text-primary)" fontSize="8" fontWeight="bold">
          {data.reduce((s,d) => s+d.value, 0)}
        </text>
      </svg>
      <div style={{ display:'flex', justifyContent:'center', gap:'1rem', fontSize:'0.78rem', flexWrap:'wrap' }}>
        {data.map(({ label, color, value }) => (
          <span key={label} style={{ color }}>● {label} ({value})</span>
        ))}
      </div>
    </div>
  );
};

// 2. Bar Chart
const BarChart = ({ high = 0, medium = 0, low = 0 }) => {
  const data = [
    { label: 'High',   value: high,   color: COLORS.high },
    { label: 'Medium', value: medium, color: COLORS.medium },
    { label: 'Low',    value: low,    color: COLORS.low },
  ];
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ padding: '0.5rem 0.5rem 0', height: 130 }}>
      <svg viewBox="0 0 120 90" width="100%" height="100%">
        {/* Grid lines */}
        {[0,25,50,75,100].map(p => (
          <line key={p} x1="18" y1={80 - p * 0.7} x2="115" y2={80 - p * 0.7}
            stroke="var(--border)" strokeWidth="0.4" strokeDasharray="2,2" />
        ))}
        {data.map(({ label, value, color }, i) => {
          const barH = (value / max) * 65;
          const x = 25 + i * 32;
          return (
            <g key={label}>
              <rect x={x} y={80 - barH} width="20" height={barH}
                fill={color} rx="2" opacity="0.9" />
              <text x={x + 10} y="88" textAnchor="middle" fill="var(--text-muted)" fontSize="6">
                {label}
              </text>
              <text x={x + 10} y={80 - barH - 3} textAnchor="middle" fill={color} fontSize="7" fontWeight="bold">
                {value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// 3. Horizontal Bar Chart
const HorizBarChart = ({ high = 0, medium = 0, low = 0 }) => {
  const data = [
    { label: 'High',   value: high,   color: COLORS.high },
    { label: 'Medium', value: medium, color: COLORS.medium },
    { label: 'Low',    value: low,    color: COLORS.low },
  ];
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ padding: '0.75rem 0.5rem', height: 130 }}>
      {data.map(({ label, value, color }) => (
        <div key={label} style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.8rem' }}>
          <span style={{ color:'var(--text-muted)', fontSize:'0.72rem', width:'3rem', flexShrink:0 }}>{label}</span>
          <div style={{ flex:1, background:'var(--bg-primary)', borderRadius:4, height:14, overflow:'hidden' }}>
            <div style={{
              width: `${(value / max) * 100}%`,
              height: '100%',
              background: color,
              borderRadius: 4,
              transition: 'width 0.5s ease',
              minWidth: value > 0 ? 6 : 0
            }} />
          </div>
          <span style={{ color, fontSize:'0.72rem', width:'1.5rem', textAlign:'right', fontWeight:700 }}>{value}</span>
        </div>
      ))}
    </div>
  );
};

const CHART_TYPES = ['Pie Chart', 'Bar Chart', 'Horizontal Bar'];

const ChartSelector = ({ type, onChange }) => (
  <select
    value={type}
    onChange={e => onChange(e.target.value)}
    style={{
      background: 'var(--bg-primary)',
      border: '1px solid var(--border)',
      borderRadius: 6,
      color: 'var(--text-muted)',
      padding: '0.25rem 0.5rem',
      fontSize: '0.75rem',
      cursor: 'pointer',
    }}
  >
    {CHART_TYPES.map(t => <option key={t}>{t}</option>)}
  </select>
);

// ── Theme Dropdown ─────────────────────────────────────────────────────────────
const ThemeDropdown = () => {
  const { theme, setTheme, themes } = useTheme();
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
      <span style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>Theme</span>
      <select
        value={theme}
        onChange={e => setTheme(e.target.value)}
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 6,
          color: 'var(--text-primary)',
          padding: '0.3rem 0.6rem',
          fontSize: '0.8rem',
          cursor: 'pointer',
        }}
      >
        {themes.map(t => <option key={t}>{t}</option>)}
      </select>
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
  const [telegramId, setTelegramId]       = useState("");
  const [chartType, setChartType]         = useState(
    () => localStorage.getItem("ids-chart-type") || "Pie Chart"
  );

  const high   = alerts.filter(a => a.severity_label === "high").length;
  const medium = alerts.filter(a => a.severity_label === "medium").length;
  const low    = alerts.filter(a => a.severity_label === "low").length;
  const total  = alerts.length;

  const handleChartChange = (type) => {
    setChartType(type);
    localStorage.setItem("ids-chart-type", type);
  };

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
    if (!telegramId) { alert("No Telegram ID set in profile!"); return; }
    const message = `🚨 IDS ALERT\n\nType: ${alertData.signature}\nSource: ${alertData.src_ip}\nDestination: ${alertData.dest_ip}\nSeverity: ${alertData.severity_label}\nProtocol: ${alertData.proto}\nTime: ${alertData.timestamp ? new Date(alertData.timestamp).toLocaleString() : '—'}`;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/alerts/send-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ chat_id: telegramId, text: message })
      });
      const data = await res.json();
      if (data.ok) { alert("Telegram message sent!"); }
      else { alert("Failed to send Telegram message"); }
    } catch (err) { alert("Failed to send Telegram message"); }
  };

  const renderChart = () => {
    const props = { high, medium, low };
    if (chartType === "Bar Chart") return <BarChart {...props} />;
    if (chartType === "Horizontal Bar") return <HorizBarChart {...props} />;
    return <PieChart {...props} />;
  };

  return (
    <AnalystLayout>
      {/* Status bar */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem', flexWrap:'wrap', gap:'0.5rem' }}>
        <h1 style={{ fontSize:'1.4rem', fontWeight:800, color:'var(--text-primary)' }}>Dashboard Overview</h1>
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', flexWrap:'wrap' }}>
          <ThemeDropdown />
          <span style={{ fontSize:'0.8rem', color: backendStatus.startsWith('✅') ? '#22c55e' : '#f59e0b' }}>
            {backendStatus}
          </span>
          <button onClick={fetchData}
            style={{ background:'transparent', border:'1px solid var(--border)', borderRadius:6, color:'var(--text-muted)', padding:'0.35rem 0.6rem', cursor:'pointer', fontSize:'0.8rem', display:'flex', alignItems:'center', gap:'0.3rem' }}>
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
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

      {/* Trends + Distribution */}
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
          <div className="distribution-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span>Alerts Distribution</span>
            <ChartSelector type={chartType} onChange={handleChartChange} />
          </div>
          {renderChart()}
        </div>
      </div>

      {/* Recent Alerts Table */}
      <div className="recent-alerts-section">
        <h2>Recent Alerts</h2>
        {loading ? (
          <p style={{ color:'var(--text-muted)', padding:'1rem 0' }}>Loading alerts…</p>
        ) : alerts.length === 0 ? (
          <p style={{ color:'var(--text-muted)', padding:'1rem 0' }}>
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
                    <td style={{ fontFamily:'monospace', color:'var(--accent)' }}>{alert.src_ip}</td>
                    <td style={{ fontFamily:'monospace' }}>{alert.dest_ip}</td>
                    <td>{alert.proto}</td>
                    <td style={{ color:'var(--text-muted)', fontSize:'0.8rem' }}>
                      {alert.timestamp ? new Date(alert.timestamp).toLocaleString() : '—'}
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
        <div style={{ marginTop:'1rem' }}>
          <Link to="/alerts" style={{ color:'var(--accent)', fontSize:'0.85rem', textDecoration:'none' }}>
            View all alerts →
          </Link>
        </div>
      </div>

      {/* Telegram Test */}
      <div style={{ marginTop:'1.5rem', padding:'1.25rem', background:'var(--bg-secondary)', borderRadius:12, border:'1px solid var(--border)' }}>
        <h2 style={{ fontSize:'0.95rem', fontWeight:700, marginBottom:'0.75rem', color:'var(--text-primary)' }}>Telegram Alert Test</h2>
        <div style={{ display:'flex', gap:'0.75rem' }}></div>
        <p style={{ color:'var(--text-muted)', fontSize:'0.75rem', marginTop:'0.5rem' }}>
          Set VITE_TG_TOKEN and VITE_TG_CHAT_ID in <code>.env</code> to enable.
        </p>
      </div>

      <footer className="footer"><p>© 2026 Intrusion Detection Dashboard</p></footer>
    </AnalystLayout>
  );
};

export default Dashboard;
