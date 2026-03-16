import React, { useState, useEffect } from "react";
import { FiEye, FiDownload, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./Alerts.css";
import AnalystLayout from "./AnalystLayout";

const API_BASE = "http://127.0.0.1:8000";

const Alerts = () => {
  const [alerts, setAlerts]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");
  const [search, setSearch]               = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [statusFilter, setStatusFilter]   = useState("");
  const [currentPage, setCurrentPage]     = useState(1);
  const alertsPerPage = 5;

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        let url = `${API_BASE}/alerts`;
        const params = new URLSearchParams();

        if (severityFilter) {
          if (severityFilter === "High")   params.append("severity", "1");
          if (severityFilter === "Medium") params.append("severity", "2");
          if (severityFilter === "Low")    params.append("severity", "3");
        }
        if (statusFilter) params.append("status", statusFilter.toLowerCase());
        if (params.toString()) url += `?${params.toString()}`;

        const response = await fetch(url);
        const data = await response.json();
        setAlerts(data.items || []);
        setLoading(false);
      } catch (err) {
        setError("Could not reach backend — showing no live data.");
        setLoading(false);
      }
    };
    fetchAlerts();
  }, [severityFilter, statusFilter]);

  // Client-side search filter
  const filteredAlerts = alerts.filter((alert) => {
    const text = `${alert.src_ip || ""} ${alert.dest_ip || ""} ${alert.signature || ""} ${alert.dest_port || ""} ${alert.proto || ""}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  const totalAlerts = filteredAlerts.length;
  const totalPages  = Math.ceil(totalAlerts / alertsPerPage);

  // Live severity counts
  const highCount   = alerts.filter((a) => (a.severity_label || "").toLowerCase() === "high").length;
  const mediumCount = alerts.filter((a) => (a.severity_label || "").toLowerCase() === "medium").length;
  const lowCount    = alerts.filter((a) => (a.severity_label || "").toLowerCase() === "low").length;

  const getSeverityClass = (severity) => {
    if (!severity) return "low";
    const value = severity.toLowerCase();
    if (value === "high")   return "high";
    if (value === "medium") return "medium";
    return "low";
  };

  const indexOfLastAlert  = currentPage * alertsPerPage;
  const indexOfFirstAlert = indexOfLastAlert - alertsPerPage;
  const currentAlerts     = filteredAlerts.slice(indexOfFirstAlert, indexOfLastAlert);

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
        if (i - l === 2)      rangeWithDots.push(l + 1);
        else if (i - l !== 1) rangeWithDots.push("...");
      }
      rangeWithDots.push(i);
      l = i;
    });
    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  const exportToCSV = () => {
    const headers = ["Severity", "Alert Type", "Source IP", "Destination IP", "Port", "IDS Source", "Time", "Status"];
    const rows = alerts.map((alert) => [
      alert.severity_label || "",
      alert.signature      || "",
      alert.src_ip         || "",
      alert.dest_ip        || "",
      alert.dest_port      || "",
      alert.proto          || "",
      alert.timestamp      || "",
      alert.status         || "",
    ]);
    const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href  = url;
    link.setAttribute("download", "alerts_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AnalystLayout alerts>
      {/* Header */}
      <div className="alerts-header">
        <h1>Intrusion Detection Alerts</h1>
        <button className="export-btn" onClick={exportToCSV}>
          <FiDownload /> Export
        </button>
      </div>

      {/* Summary cards — same markup as Dashboard */}
      <div className="summary-cards">
        <div className="card card-total">
          <span className="card-icon">!</span>
          <div className="card-label">Total Alerts</div>
          <hr />
          <div className="card-value">{loading ? "…" : alerts.length}</div>
        </div>
        <div className="card card-high">
          <span className="card-icon">!</span>
          <div className="card-label">High Severity</div>
          <hr />
          <div className="card-value">{loading ? "…" : highCount}</div>
        </div>
        <div className="card card-medium">
          <span className="card-icon">!</span>
          <div className="card-label">Medium Severity</div>
          <hr />
          <div className="card-value">{loading ? "…" : mediumCount}</div>
        </div>
        <div className="card card-low">
          <span className="card-icon">!</span>
          <div className="card-label">Low Severity</div>
          <hr />
          <div className="card-value">{loading ? "…" : lowCount}</div>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", color: "#f59e0b", borderRadius: 8, padding: "0.65rem 1rem", marginBottom: "1rem", fontSize: "0.875rem" }}>
          ⚠️ {error}
        </div>
      )}

      {/* Filters */}
      <div className="filters">
        <select value={severityFilter} onChange={(e) => { setSeverityFilter(e.target.value); setCurrentPage(1); }}>
          <option value="">All Severities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="investigating">In Progress</option>
          <option value="resolved">Resolved</option>
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
          <input
            placeholder="Search IP, Port, Type"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <p style={{ padding: "2rem", color: "#94a3b8", textAlign: "center" }}>Loading alerts…</p>
        ) : currentAlerts.length === 0 ? (
          <p style={{ padding: "2rem", color: "#64748b", textAlign: "center" }}>
            No alerts found. Check filters or run <code>eve_ingestor.py</code> to load sample data.
          </p>
        ) : (
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
                  <td className={getSeverityClass(alert.severity_label)}>
                    {alert.severity_label || "-"}
                  </td>
                  <td>{alert.signature  || "-"}</td>
                  <td>{alert.src_ip     || "-"}</td>
                  <td>{alert.dest_ip    || "-"}</td>
                  <td>{alert.dest_port  || "-"}</td>
                  <td>{alert.proto      || "-"}</td>
                  <td>{alert.timestamp  || "-"}</td>
                  <td>{alert.status     || "new"}</td>
                  <td>
                    <Link to={`/alert/${alert.id}`} state={{ alert }}>
                      <FiEye className="view-icon" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <p>
          Showing {indexOfFirstAlert + 1} to {Math.min(indexOfLastAlert, totalAlerts)} of {totalAlerts} alerts
        </p>
        <div className="pages">
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="page-nav">‹</button>
          {pageNumbers.map((page, index) => (
            <button
              key={index}
              className={`page-number ${page === currentPage ? "active" : ""} ${page === "..." ? "dots" : ""}`}
              onClick={() => page !== "..." && setCurrentPage(page)}
              disabled={page === "..."}
            >
              {page}
            </button>
          ))}
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="page-nav">›</button>
        </div>
      </div>
    </AnalystLayout>
  );
};

export default Alerts;
