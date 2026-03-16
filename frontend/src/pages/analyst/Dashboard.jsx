import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiEye, FiRefreshCw } from 'react-icons/fi';   // FiRefreshCw added
import './Dashboard.css';
import { getDashboardSummary, getAlerts } from "../../services/api"; // NEW

// CHANGED: moved out of component, uses .env instead of hardcoded values
const TG_TOKEN   = import.meta.env.VITE_TG_TOKEN  || "";
const TG_CHAT_ID = import.meta.env.VITE_TG_CHAT_ID || "";

// CHANGED: moved outside Dashboard(), now accepts live counts as props
// Original was inside component with hardcoded values
const PieChart = ({ high = 12, medium = 58, low = 175 }) => {
  const data = [
    { value: low,    color: '#22c55e' },
    { value: medium, color: '#f59e0b' },
    { value: high,   color: '#ef4444' },
  ];
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  let cumulativeAngle = 0;

  const describeSegment = (value, startAngle) => {
    const angle = (value / total) * 2 * Math.PI;
    const endAngle = startAngle + angle;
    const x1 = 50 + 40 * Math.sin(startAngle);
    const y1 = 50 - 40 * Math.cos(startAngle);
    const x2 = 50 + 40 * Math.sin(endAngle);
    const y2 = 50 - 40 * Math.cos(endAngle);
    const largeArcFlag = angle > Math.PI ? 1 : 0;
    return `M 50,50 L ${x1},${y1} A 40,40 0 ${largeArcFlag} 1 ${x2},${y2} Z`;
  };

  return (
    <div className="pie-chart-container">
      <svg viewBox="0 0 100 100" width="100%" height="120">
        {data.map((d, i) => {
          const path = describeSegment(d.value, cumulativeAngle);
          cumulativeAngle += (d.value / total) * 2 * Math.PI;
          // CHANGED: stroke color #000 → #1e293b, donut fill white → #1e293b
          return <path key={i} d={path} fill={d.color} stroke="#1e293b" strokeWidth="0.5" />;
        })}
        <circle cx="50" cy="50" r="20" fill="#1e293b" stroke="#1e293b" strokeWidth="1" />
      </svg>
      {/* NEW: live legend below chart */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.78rem' }}>
        {[['High', '#ef4444', high], ['Medium', '#f59e0b', medium], ['Low', '#22c55e', low]].map(([l, c, v]) => (
          <span key={l} style={{ color: c }}>● {l} ({v})</span>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  // REMOVED: useLocation + isActive — no longer needed now sidebar has proper Links

  // CHANGED: replaced hardcoded recentAlerts array with backend state
  const [summary, setSummary]             = useState({ total: 0, severity_summary: { high: 0, medium: 0, low: 0 } });
  const [alerts, setAlerts]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [backendStatus, setBackendStatus] = useState("Connecting…");
  // CHANGED: telegramMessage → tgMessage (shorter name)
  const [tgMessage, setTgMessage]         = useState("");

  // NEW: fetches live data from backend
  const fetchData = async () => {
    setLoading(true);
    try {
      const [sumData, alertData] = await Promise.all([
        getDashboardSummary(),
        getAlerts(),
      ]);
      setSummary(sumData);
      setAlerts(alertData.items || []);
      setBackendStatus(`✅ Connected — ${alertData.items?.length ?? 0} alert(s) loaded`);
    } catch (err) {
      setBackendStatus("⚠️ Backend offline — showing no live data");
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // UNCHANGED: same logic, same navigate call
  const handleViewAlert = (alert) => {
    navigate(`/alert/${alert.id}`, { state: { alert } });
  };

  // CHANGED: was sendTelegramMessage(), now sendToTelegram(text) — uses env vars
  const sendToTelegram = async (text) => {
    if (!TG_TOKEN || !TG_CHAT_ID) {
      alert("Telegram not configured (set VITE_TG_TOKEN and VITE_TG_CHAT_ID in .env)");
      return;
    }
    try {
      await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TG_CHAT_ID, text }),
      });
      alert("Telegram alert sent!");
    } catch {
      alert("Failed to send Telegram message.");
    }
  };

  // CHANGED: was async, now sync — uses backend field names (signature, src_ip, dest_ip)
  const sendAlertToTelegram = (alert) => {
    sendToTelegram(
      `🚨 IDS ALERT\n\nType: ${alert.signature}\nSource: ${alert.src_ip}\nDest: ${alert.dest_ip}\nSeverity: ${alert.severity_label}\nProtocol: ${alert.proto}\nTime: ${alert.timestamp}`
    );
  };

  const { high = 0, medium = 0, low = 0 } = summary.severity_summary || {};

  return (
    <div className="dashboard-container">
      {/* Sidebar — CHANGED: all items now have <Link>, added Notifications/Profile/logout */}
      <aside className="sidebar">
        <div className="sidebar-header"></div>
        <nav className="sidebar-nav">
          <div className="nav-section">
            <ul>
              <li className="active"><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/alerts">Alerts</Link></li>
              {/* CHANGED: was plain <li>Network Traffic</li> with no link */}
              <li><Link to="/network-traffic">Network Traffic</Link></li>
              {/* CHANGED: was plain <li>Reports</li> with no link */}
              <li><Link to="/reports">Reports</Link></li>
              {/* NEW: these two were missing entirely */}
              <li><Link to="/notifications">Notifications</Link></li>
              <li><Link to="/analyst/profile">Profile</Link></li>
            </ul>
          </div>
        </nav>
        <div className="sidebar-user">
          <hr className="divider" />
          <div className="user-info">
            <span className="user-role">Analyst</span>
            <span className="user-name">Security Analyst 1</span>
          </div>
          {/* NEW: logout button */}
          <button
            className="logout-btn"
            onClick={() => { localStorage.clear(); navigate("/logout"); }}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">

        {/* NEW: backend status bar + refresh button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f1f5f9' }}>Dashboard Overview</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: backendStatus.startsWith('✅') ? '#22c55e' : '#f59e0b' }}>
              {backendStatus}
            </span>
            <button
              onClick={fetchData}
              style={{ background: 'transparent', border: '1px solid #334155', borderRadius: 6, color: '#94a3b8', padding: '0.35rem 0.6rem', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              <FiRefreshCw /> Refresh
            </button>
          </div>
        </div>

        {/* Summary Cards — CHANGED: was hardcoded values, now live from backend */}
        <div className="summary-cards">
          <div className="card card-total">
            <div className="card-label">Total Alerts</div>
            <hr />
            {/* CHANGED: was 245, now live */}
            <div className="card-value">{loading ? '…' : (summary.total ?? (high + medium + low))}</div>
          </div>
          <div className="card card-high">
            <div className="card-label">High Severity</div>
            <hr />
            {/* CHANGED: was 12, now live */}
            <div className="card-value">{loading ? '…' : high}</div>
          </div>
          <div className="card card-medium">
            <div className="card-label">Medium Severity</div>
            <hr />
            {/* CHANGED: was 58, now live */}
            <div className="card-value">{loading ? '…' : medium}</div>
          </div>
          <div className="card card-low">
            <div className="card-label">Low Severity</div>
            <hr />
            {/* CHANGED: was 175, now live */}
            <div className="card-value">{loading ? '…' : low}</div>
          </div>
        </div>

        {/* Threat Trends + Alerts Distribution — UNCHANGED structure */}
        <div className="trends-distribution-row">
          <div className="trends-card">
            <div className="trends-header" style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              paddingBottom: '1rem'
            }}>
              <span style={{ fontSize: '1.2rem', fontWeight: '600', color: '#f1f5f9' }}>Threat Trends</span>
              <select
                className="time-filter"
                value={trendTimeRange}
                onChange={(e) => setTrendTimeRange(e.target.value)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid #334155',
                  background: '#1e293b',
                  color: '#e2e8f0',
                  fontSize: '0.9rem'
                }}
              >
                <option>24 hours</option>
                <option>7 days</option>
                <option>30 days</option>
              </select>
            </div>
            {/* CHANGED: text updated */}
            <div className="chart-placeholder">📈 Live chart coming soon</div>
          </div>
          
          <div className="distribution-card">
            <div className="distribution-header">Alerts Distribution</div>
            {/* CHANGED: now passes live counts as props */}
            <PieChart high={high} medium={medium} low={low} />
          </div>
        </div>

        {/* Recent Alerts Table — CHANGED: was recentAlerts (hardcoded), now alerts (backend) */}
        <div className="recent-alerts-section">
          <h2>Recent Alerts</h2>
          {/* NEW: loading and empty states */}
          {loading ? (
            <p style={{ color: '#64748b', padding: '1rem 0' }}>Loading alerts…</p>
          ) : alerts.length === 0 ? (
            <p style={{ color: '#64748b', padding: '1rem 0' }}>
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
                    {/* CHANGED: IDS source → Protocol (backend field is proto) */}
                    <th>Protocol</th>
                    <th>Time</th>
                    <th>Progress</th>
                    <th>View</th>
                    {/* NEW: Telegram column */}
                    <th>Telegram</th>
                  </tr>
                </thead>
                <tbody>
                  {/* CHANGED: was recentAlerts.map with alert.severity/type/src/dst/ids/time/progress */}
                  {/* Now alerts.map with backend fields: severity_label/signature/src_ip/dest_ip/proto/timestamp/status */}
                  {alerts.map((alert) => (
                    <tr key={alert.id}>
                      <td>
                        <span className={`severity-badge ${alert.severity_label}`}>
                          {alert.severity_label}
                        </span>
                      </td>
                      <td>{alert.signature}</td>
                      <td>{alert.src_ip}</td>
                      <td>{alert.dest_ip}</td>
                      <td>{alert.proto}</td>
                      <td>{alert.timestamp ? new Date(alert.timestamp).toLocaleString() : '—'}</td>
                      <td>
                        <span className={`progress-badge ${alert.status}`}>
                          {alert.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="view-btn"
                          onClick={() => handleViewAlert(alert)}
                          title="View alert details"
                        >
                          <FiEye />
                        </button>
                      </td>
                      {/* NEW: Telegram send button per row */}
                      <td>
                        <button
                          className="telegram-btn"
                          onClick={() => sendAlertToTelegram(alert)}
                        >
                          Send
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* NEW: link to full alerts page */}
          <div style={{ marginTop: '1rem' }}>
            <Link to="/alerts" style={{ color: '#38bdf8', fontSize: '0.85rem', textDecoration: 'none' }}>
              View all alerts →
            </Link>
          </div>
        </div>

        {/* Telegram Test Section — CHANGED: telegramMessage → tgMessage, sendTelegramMessage → sendToTelegram */}
        <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: '#1e293b', borderRadius: 12, border: '1px solid #334155' }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: '#f1f5f9' }}>Telegram Alert Test</h2>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              type="text"
              placeholder="Type a message to send to Telegram…"
              value={tgMessage}
              onChange={(e) => setTgMessage(e.target.value)}
              style={{ flex: 1, padding: '0.65rem 0.9rem', borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', fontSize: '0.875rem', outline: 'none' }}
            />
            <button
              onClick={() => { if (tgMessage.trim()) { sendToTelegram(tgMessage); setTgMessage(""); } }}
              style={{ padding: '0.65rem 1.25rem', background: '#3b82f6', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontWeight: 600 }}
            >
              Send
            </button>
          </div>
          {/* NEW: env var hint */}
          <p style={{ color: '#475569', fontSize: '0.75rem', marginTop: '0.5rem' }}>
            Set VITE_TG_TOKEN and VITE_TG_CHAT_ID in <code>.env</code> to enable.
          </p>
        </div>

        {/* Footer — UNCHANGED */}
        <footer className="footer">
          <p>© 2026 Intrusion Detection Dashboard</p>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;
