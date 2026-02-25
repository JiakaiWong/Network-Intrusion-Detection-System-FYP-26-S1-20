import React, { useState } from "react";
import { FiEye, FiDownload, FiSearch } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import "./Alerts.css";

const Alerts = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Base alerts with unique id
  const baseAlerts = [
    {
      id: 1,
      severity: "High",
      type: "SQLI",
      src: "192.168.1.100",
      dest: "10.0.0.12",
      port: "443",
      ids: "Snort",
      time: "30s ago",
      progress: "New",
    },
    {
      id: 2,
      severity: "High",
      type: "Malware",
      src: "192.168.1.120",
      dest: "10.0.0.5",
      port: "80",
      ids: "Suricata",
      time: "1m ago",
      progress: "New",
    },
    {
      id: 3,
      severity: "Medium",
      type: "Suspicious Login",
      src: "203.45.67.89",
      dest: "45.67.89.12",
      port: "8080",
      ids: "Zeek",
      time: "2m ago",
      progress: "In Progress",
    },
    {
      id: 4,
      severity: "Low",
      type: "Phishing",
      src: "192.168.1.92",
      dest: "10.0.0.10",
      port: "53",
      ids: "Snort",
      time: "5m ago",
      progress: "Resolved",
    },
    {
      id: 5,
      severity: "Low",
      type: "Port Scan",
      src: "178.23.156.42",
      dest: "8.8.8.8",
      port: "Multiple",
      ids: "Kismet",
      time: "10m ago",
      progress: "Resolved",
    },
  ];

  // Create 1000 alerts (repeat the base set) with unique ids
  const alerts = Array.from({ length: 1000 }, (_, i) => ({
    ...baseAlerts[i % baseAlerts.length],
    id: i + 1,
    src: `192.168.${Math.floor(i / 10)}.${(i % 255) + 1}`,
    time: `${i + 1}m ago`,
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const alertsPerPage = 5;
  const totalAlerts = alerts.length;
  const totalPages = Math.ceil(totalAlerts / alertsPerPage);

  const getSeverityClass = (severity) => {
    if (severity === "High") return "high";
    if (severity === "Medium") return "medium";
    return "low";
  };

  const indexOfLastAlert = currentPage * alertsPerPage;
  const indexOfFirstAlert = indexOfLastAlert - alertsPerPage;
  const currentAlerts = alerts.slice(indexOfFirstAlert, indexOfLastAlert);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  // ----- EXPORT TO CSV FUNCTION -----
  const exportToCSV = () => {
    // Define CSV headers
    const headers = ["Severity", "Alert Type", "Source IP", "Destination IP", "Port", "IDS Source", "Time", "Progress"];

    // Convert alerts to array of arrays (each alert row)
    const rows = alerts.map(alert => [
      alert.severity,
      alert.type,
      alert.src,
      alert.dest,
      alert.port,
      alert.ids,
      alert.time,
      alert.progress
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')) // wrap in quotes to handle commas in fields
    ].join('\n');

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'alerts_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">Intrusion Detection</div>
        <nav className="sidebar-nav">
          <div className="nav-section">
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
            </ul>
          </div>
        </nav>
        <div className="sidebar-user">
          <hr className="divider" />
          <div className="user-info">
            <span className="user-role">Analyst</span>
            <span className="user-name">Security Analyst 1</span>
          </div>
        </div>
      </aside>

      <div className="alerts-container">
        <div className="alerts-header">
          <h1>Intrusion Detection Alerts</h1>
          <button className="export-btn" onClick={exportToCSV}>
            <FiDownload /> Export
          </button>
        </div>

        <div className="summary-cards">
          <div className="card total">
            <h3>Total Alerts</h3>
            <h2>1000</h2>
            <p className="green">(12% down from last week)</p>
          </div>
          <div className="card high-card">
            <h3>High Severity</h3>
            <h2>100</h2>
            <p className="green">(10% down from last week)</p>
          </div>
          <div className="card medium-card">
            <h3>Medium Severity</h3>
            <h2>300</h2>
            <p className="red">(2% up from last week)</p>
          </div>
          <div className="card low-card">
            <h3>Low Severity</h3>
            <h2>600</h2>
            <p className="orange">(60% of alerts this week)</p>
          </div>
        </div>

        <div className="filters">
          <select>
            <option>All Severities</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <select>
            <option>All Status</option>
            <option>New</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
          <select>
            <option>All IDS Sources</option>
            <option>Snort</option>
            <option>Zeek</option>
            <option>Kismet</option>
            <option>Suricata</option>
          </select>
          <select>
            <option>Time Range</option>
            <option>24H</option>
            <option>7D</option>
            <option>30D</option>
          </select>
          <div className="search-box">
            <FiSearch />
            <input placeholder="Search IP, Port, Type" />
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Severity</th>
                <th>Alert Type</th>
                <th>Source IP</th>
                <th>Destination IP</th>
                <th>Port</th>
                <th>IDS Source</th>
                <th>Time</th>
                <th>Progress</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentAlerts.map((alert) => (
                <tr key={alert.id}>
                  <td className={getSeverityClass(alert.severity)}>
                    {alert.severity}
                  </td>
                  <td>{alert.type}</td>
                  <td>{alert.src}</td>
                  <td>{alert.dest}</td>
                  <td>{alert.port}</td>
                  <td>{alert.ids}</td>
                  <td>{alert.time}</td>
                  <td>{alert.progress}</td>
                  <td>
                    <Link to={`/alert/${alert.id}`} state={{ alert }}>
                      <FiEye className="view-icon" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <p>
            Showing {indexOfFirstAlert + 1} to{" "}
            {Math.min(indexOfLastAlert, totalAlerts)} of {totalAlerts} alerts
          </p>
          <div className="pages">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="page-nav"
            >
              ‹
            </button>

            {pageNumbers.map((page, index) => (
              <button
                key={index}
                className={`page-number ${page === currentPage ? "active" : ""} ${
                  page === "..." ? "dots" : ""
                }`}
                onClick={() => page !== "..." && setCurrentPage(page)}
                disabled={page === "..."}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="page-nav"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;