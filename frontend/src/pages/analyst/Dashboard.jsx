import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [telegramMessage, setTelegramMessage] = useState("");
  const [trendTimeRange, setTrendTimeRange] = useState("24 hours");

  // ---------- BASE ALERTS (static) ----------
  const baseAlerts = [
    { id: 1, severity: 'High', type: 'SQLI', src: '192.168.1.100', dst: '10.0.0.12', ids: 'Snort', time: '30s ago', progress: 'New' },
    { id: 2, severity: 'High', type: 'Malware', src: '192.168.1.120', dst: '10.0.0.5', ids: 'Suricata', time: '1m ago', progress: 'New' },
    { id: 3, severity: 'Medium', type: 'Suspicious login', src: '203.45.67.89', dst: '45.67.89.12', ids: 'Zeek', time: '2m ago', progress: 'In Progress' },
    { id: 4, severity: 'Low', type: 'Phishing', src: '192.168.1.92', dst: '10.0.0.10', ids: 'Snort', time: '5m ago', progress: 'Resolved' },
    { id: 5, severity: 'Low', type: 'Port scan', src: '178.23.156.42', dst: '8.8.8.8', ids: 'Kismet', time: '10m ago', progress: 'Resolved' },
    { id: 6, severity: 'High', type: 'Ransomware', src: '192.168.1.45', dst: '10.0.0.22', ids: 'Suricata', time: '15m ago', progress: 'In Progress' },
    { id: 7, severity: 'Medium', type: 'Brute Force', src: '104.28.12.34', dst: '192.168.1.1', ids: 'Snort', time: '22m ago', progress: 'New' },
    { id: 8, severity: 'Low', type: 'Port scan', src: '8.8.8.8', dst: '192.168.1.100', ids: 'Kismet', time: '32m ago', progress: 'Resolved' },
    { id: 9, severity: 'High', type: 'C2 Beacon', src: '45.33.22.11', dst: '10.0.0.50', ids: 'Zeek', time: '45m ago', progress: 'In Progress' },
    { id: 10, severity: 'Medium', type: 'SQL Injection', src: '203.0.113.5', dst: '10.0.0.15', ids: 'Snort', time: '1h ago', progress: 'Resolved' },
    { id: 11, severity: 'Low', type: 'Failed Login', src: '192.168.1.200', dst: '10.0.0.8', ids: 'Zeek', time: '2h ago', progress: 'Resolved' },
    { id: 12, severity: 'High', type: 'Data Exfiltration', src: '198.51.100.77', dst: '10.0.0.99', ids: 'Suricata', time: '3h ago', progress: 'In Progress' },
    { id: 13, severity: 'Medium', type: 'DDoS', src: '192.168.1.150', dst: '10.0.0.20', ids: 'Snort', time: '4h ago', progress: 'In Progress' },
    { id: 14, severity: 'Low', type: 'Reconnaissance', src: '104.16.45.33', dst: '192.168.1.10', ids: 'Zeek', time: '5h ago', progress: 'Resolved' },
  ];

  // ---------- STATE FOR ALERTS (merged with localStorage) ----------
  const [recentAlerts, setRecentAlerts] = useState([]);

  // Load alerts from localStorage on mount
  useEffect(() => {
    const merged = baseAlerts.map(alert => {
      const saved = localStorage.getItem(`alert_${alert.id}`);
      return saved ? JSON.parse(saved) : alert;
    });
    setRecentAlerts(merged);
  }, []);

  // ---------- TELEGRAM FUNCTIONS (unchanged) ----------
  const TOKEN = "8500029016:AAG13AhvWboYuAQSG4CmTh8RppPgu8G2aKI";
  const CHAT_ID = "1733380706";

  const sendTelegramMessage = async () => {
    if (!telegramMessage.trim()) return;
    try {
      await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text: telegramMessage })
      });
      alert("Telegram alert sent!");
      setTelegramMessage("");
    } catch (err) {
      console.error(err);
      alert("Failed to send Telegram message.");
    }
  };

  const sendAlertToTelegram = async (alert) => {
    const message = `IDS ALERT\n\nType: ${alert.type}\nSource: ${alert.src || alert.source_ip || alert.source}\nDestination: ${alert.dst || alert.destination_ip || alert.dest}\nSeverity: ${alert.severity}\nIDS: ${alert.ids}\nTime: ${alert.time}`;
    try {
      await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text: message })
      });
      alert("Alert sent to Telegram!");
    } catch (err) {
      console.error(err);
      alert("Failed to send alert.");
    }
  };

  // ---------- DYNAMIC SEVERITY COUNTS (based on recentAlerts) ----------
  const severityCounts = useMemo(() => {
    return recentAlerts.reduce((counts, alert) => {
      if (alert.severity === 'High') counts.High++;
      else if (alert.severity === 'Medium') counts.Medium++;
      else if (alert.severity === 'Low') counts.Low++;
      return counts;
    }, { High: 0, Medium: 0, Low: 0 });
  }, [recentAlerts]);

  // ---------- PIE CHART (dynamic) ----------
  const PieChart = () => {
    const data = [
      { value: severityCounts.Low, color: '#4ade80', label: 'Low' },
      { value: severityCounts.Medium, color: '#fbbf24', label: 'Medium' },
      { value: severityCounts.High, color: '#f87171', label: 'High' },
    ].filter(d => d.value > 0);

    const total = data.reduce((sum, d) => sum + d.value, 0);
    if (total === 0) {
      return <div style={{ color: '#94a3b8', textAlign: 'center' }}>No data</div>;
    }

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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <svg viewBox="0 0 100 100" width="200" height="200">
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
              </filter>
            </defs>
            {data.map((d, i) => {
              const path = describeSegment(d.value, cumulativeAngle);
              cumulativeAngle += (d.value / total) * 2 * Math.PI;
              return (
                <path
                  key={i}
                  d={path}
                  fill={d.color}
                  stroke="#1e293b"
                  strokeWidth="0.8"
                  filter="url(#shadow)"
                />
              );
            })}
          </svg>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem' }}>
            {data.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ display: 'inline-block', width: '16px', height: '16px', backgroundColor: d.color, borderRadius: '3px' }} />
                <span style={{ color: '#e2e8f0', fontSize: '0.9rem', fontWeight: '500' }}>
                  {d.label} ({d.value})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ---------- TREND CHART (simplified) ----------
  const TrendChart = ({ timeRange }) => {
    const generateData = () => {
      if (timeRange === "24 hours") {
        return Array.from({ length: 24 }, (_, i) => ({
          label: `${i}:00`,
          value: Math.floor(Math.random() * 30) + 5,
        }));
      } else if (timeRange === "7 days") {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return days.map(day => ({
          label: day,
          value: Math.floor(Math.random() * 200) + 20,
        }));
      } else {
        return Array.from({ length: 30 }, (_, i) => ({
          label: i % 5 === 0 ? `Day ${i+1}` : '',
          value: Math.floor(Math.random() * 300) + 10,
        }));
      }
    };

    const data = generateData();
    const width = 600;
    const height = 200;
    const padding = 30;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue || 1;
    
    const points = data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((d.value - minValue) / range) * chartHeight;
      return { x, y };
    });

    const linePath = points.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(' ');

    const tickCount = 5;
    const ticks = [];
    for (let i = 0; i < tickCount; i++) {
      const value = minValue + (i / (tickCount - 1)) * range;
      const y = padding + chartHeight - ((value - minValue) / range) * chartHeight;
      ticks.push({ value: Math.round(value), y });
    }

    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        <rect x={padding} y={padding} width={chartWidth} height={chartHeight} fill="#0f172a" rx="4" />
        {ticks.map((tick, i) => (
          <line
            key={`grid-${i}`}
            x1={padding}
            y1={tick.y}
            x2={width - padding}
            y2={tick.y}
            stroke="#334155"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#475569" strokeWidth="1" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#475569" strokeWidth="1" />
        {ticks.map((tick, i) => (
          <text
            key={`y-${i}`}
            x={padding - 6}
            y={tick.y}
            textAnchor="end"
            dominantBaseline="middle"
            fill="#94a3b8"
            fontSize="9"
          >
            {tick.value}
          </text>
        ))}
        <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="3" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
        ))}
        {data.map((d, i) => {
          if (i % Math.floor(data.length / 5) === 0 || i === data.length - 1) {
            return (
              <text
                key={`x-${i}`}
                x={points[i].x}
                y={height - 8}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="10"
              >
                {d.label}
              </text>
            );
          }
          return null;
        })}
      </svg>
    );
  };

  // ---------- RENDER ----------
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">Intrusion Detection</div>
        <nav className="sidebar-nav">
          <ul>
            <li className={isActive('/') ? 'active' : ''}>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className={isActive('/alerts') ? 'active' : ''}>
              <Link to="/alerts">Alerts</Link>
            </li>
            <li className={isActive('/network-traffic') ? 'active' : ''}>
              <Link to="/network-traffic">Network Traffic</Link>
            </li>
            <li className={isActive('/reports') ? 'active' : ''}>
              <Link to="/reports">Reports</Link>
            </li>
            <li className={isActive('/notifications') ? 'active' : ''}>
              <Link to="/notifications">Notifications</Link>
            </li>
            <li className={isActive('/profile') ? 'active' : ''}>
              <Link to="/profile">Profile</Link>
            </li>
          </ul>
        </nav>
        <div className="sidebar-user">
          <hr className="divider" />
          <div className="user-info">
            <span className="user-role">Analyst</span>
            <span className="user-name">Security Analyst 1</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Summary Cards – now dynamic */}
        <div className="summary-cards">
          <div className="card card-total">
            <div className="card-label">Total Alerts</div>
            <hr />
            <div className="card-value">{recentAlerts.length}</div>
          </div>
          <div className="card card-high">
            <div className="card-label">High Severity</div>
            <hr />
            <div className="card-value">{severityCounts.High}</div>
          </div>
          <div className="card card-medium">
            <div className="card-label">Medium Severity</div>
            <hr />
            <div className="card-value">{severityCounts.Medium}</div>
          </div>
          <div className="card card-low">
            <div className="card-label">Low Severity</div>
            <hr />
            <div className="card-value">{severityCounts.Low}</div>
          </div>
        </div>

        {/* Threat Trends + Alerts Distribution */}
        <div className="trends-distribution-row">
          <div className="trends-card">
            <div className="trends-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Threat Trends</span>
              <select
                className="time-filter"
                value={trendTimeRange}
                onChange={(e) => setTrendTimeRange(e.target.value)}
              >
                <option>24 hours</option>
                <option>7 days</option>
                <option>30 days</option>
              </select>
            </div>
            <div className="chart-placeholder" style={{ marginTop: '1rem' }}>
              <TrendChart timeRange={trendTimeRange} />
            </div>
          </div>
          <div className="distribution-card">
            <div className="distribution-header">Alerts Distribution</div>
            <PieChart />
          </div>
        </div>

        {/* Recent Alerts Table with fallback fields */}
        <div className="recent-alerts-section">
          <h2>Recent Alerts</h2>
          <table className="alerts-table">
            <thead>
              <tr>
                <th>Severity</th>
                <th>Alert Type</th>
                <th>Source IP</th>
                <th>Destination IP</th>
                <th>IDS source</th>
                <th>Time</th>
                <th>Progress</th>
                <th>View</th>
                <th>Telegram</th>
              </tr>
            </thead>
            <tbody>
              {recentAlerts.map((alert) => (
                <tr key={alert.id}>
                  <td>
                    <span className={`severity-badge ${alert.severity.toLowerCase()}`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td>{alert.type}</td>
                  <td>{alert.src || alert.source_ip || alert.source || '—'}</td>
                  <td>{alert.dst || alert.destination_ip || alert.dest || '—'}</td>
                  <td>{alert.ids}</td>
                  <td>{alert.time}</td>
                  <td>
                    <span className={`progress-badge ${alert.progress.toLowerCase().replace(' ', '-')}`}>
                      {alert.progress}
                    </span>
                  </td>
                  <td>
                    <Link to={`/alert/${alert.id}`} state={{ alert }} style={{ textDecoration: 'none' }}>
                      <button className="small-btn">View</button>
                    </Link>
                  </td>
                  <td>
                    <button
                      className="telegram-btn"
                      onClick={() => sendAlertToTelegram(alert)}
                      title="Send to Telegram"
                    >
                      Send
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Telegram Alert Section */}
        <div style={{
          marginTop: "30px",
          padding: "20px",
          background: "#1e293b",
          borderRadius: "8px"
        }}>
          <h2>Telegram Alert Test</h2>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <input
              type="text"
              placeholder="Type Telegram message..."
              value={telegramMessage}
              onChange={(e) => setTelegramMessage(e.target.value)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #334155",
                background: "#0f172a",
                color: "white"
              }}
            />
            <button
              onClick={sendTelegramMessage}
              style={{
                padding: "10px 20px",
                background: "#3b82f6",
                border: "none",
                borderRadius: "6px",
                color: "white",
                cursor: "pointer"
              }}
            >
              Send
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="footer">
          <p>2026 Intrusion Detection Dashboard</p>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;