import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FiEye } from 'react-icons/fi';
import AnalystSidebar from './AnalystSidebar';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  // Sample data for alerts table
  const recentAlerts = [
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

  const handleViewAlert = (alert) => {
    navigate(`/alert/${alert.id}`, { state: { alert } });
  };

  const PieChart = () => {
    const data = [
      { value: 175, color: '#28a745' }, // Low
      { value: 58, color: '#ffc107' },  // Medium
      { value: 12, color: '#dc3545' },  // High
    ];
    const total = data.reduce((sum, d) => sum + d.value, 0);
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
            return <path key={i} d={path} fill={d.color} stroke="#000" strokeWidth="0.5" />;
          })}
          <circle cx="50" cy="50" r="20" fill="white" stroke="#000" strokeWidth="1" />
        </svg>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      {/* Analyst Sidebar */}
      <AnalystSidebar />

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="summary-cards">
          <div className="card card-total">
            <span className="card-icon">!</span>
            <div className="card-label">Total Alerts</div>
            <hr />
            <div className="card-value">245</div>
          </div>
          <div className="card card-high">
            <span className="card-icon">!</span>
            <div className="card-label">High Severity</div>
            <hr />
            <div className="card-value">12</div>
          </div>
          <div className="card card-medium">
            <span className="card-icon">!</span>
            <div className="card-label">Medium Severity</div>
            <hr />
            <div className="card-value">58</div>
          </div>
          <div className="card card-low">
            <span className="card-icon">!</span>
            <div className="card-label">Low Severity</div>
            <hr />
            <div className="card-value">175</div>
          </div>
        </div>

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
            <div className="chart-placeholder">📈 Trend Chart</div>
          </div>
          <div className="distribution-card">
            <div className="distribution-header">Alerts Distribution</div>
            <PieChart />
          </div>
        </div>

        <div className="recent-alerts-section">
          <h2>Recent Alerts</h2>
          <table className="alerts-table">
            <thead>
              <tr>
                <th>Severity</th>
                <th>Alert Type</th>
                <th>Source IP</th>
                <th>Destination IP</th>
                <th>IDS Source</th>
                <th>Time</th>
                <th>Progress</th>
                <th>View</th>
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
                  <td>{alert.src}</td>
                  <td>{alert.dst}</td>
                  <td>{alert.ids}</td>
                  <td>{alert.time}</td>
                  <td>
                    <span className={`progress-badge ${alert.progress.toLowerCase().replace(' ', '-')}`}>
                      {alert.progress}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="footer">
          <p>2026 Intrusion Detection Dashboard</p>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;
