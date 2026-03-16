import React, { useState, useMemo } from "react";
import { FiDownload, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import AnalystLayout from "../../components/AnalystLayout";
import { Link, useLocation } from "react-router-dom";
import "./Alerts.css";

const Alerts = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  // ---------- FILTER STATE ----------
  const [selectedSeverity, setSelectedSeverity] = useState("All Severities");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedIds, setSelectedIds] = useState("All IDS Sources");
  const [selectedTime, setSelectedTime] = useState("Time Range");
  const [selectedSearch, setSelectedSearch] = useState("");

  // ---------- APPLIED FILTER STATE ----------
  const [appliedSeverity, setAppliedSeverity] = useState("All Severities");
  const [appliedStatus, setAppliedStatus] = useState("All Status");
  const [appliedIds, setAppliedIds] = useState("All IDS Sources");
  const [appliedTime, setAppliedTime] = useState("Time Range");
  const [appliedSearch, setAppliedSearch] = useState("");

  // ---------- BASE ALERTS ----------
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

  // Generate 1000 alerts
  const alerts = Array.from({ length: 1000 }, (_, i) => ({
    ...baseAlerts[i % baseAlerts.length],
    id: i + 1,
    src: `192.168.${Math.floor(i / 10)}.${(i % 255) + 1}`,
    time: `${i + 1}m ago`,
  }));

  // ---------- FILTERING ----------
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      if (appliedSeverity !== "All Severities" && alert.severity !== appliedSeverity) return false;
      if (appliedStatus !== "All Status" && alert.progress !== appliedStatus) return false;
      if (appliedIds !== "All IDS Sources" && alert.ids !== appliedIds) return false;
      if (appliedTime === "24H" && !alert.time.includes("m")) return false;
      if (appliedTime === "7D" && !alert.time.includes("h") && !alert.time.includes("d")) return false;
      if (appliedSearch.trim() !== "") {
        const lower = appliedSearch.toLowerCase();
        return (
          alert.src.toLowerCase().includes(lower) ||
          alert.dest.toLowerCase().includes(lower) ||
          alert.port.toLowerCase().includes(lower) ||
          alert.type.toLowerCase().includes(lower)
        );
      }
      return true;
    });
  }, [alerts, appliedSeverity, appliedStatus, appliedIds, appliedTime, appliedSearch]);

  // ---------- APPLY FILTER ----------
  const [currentPage, setCurrentPage] = useState(1);

  const applyFilters = () => {
    setAppliedSeverity(selectedSeverity);
    setAppliedStatus(selectedStatus);
    setAppliedIds(selectedIds);
    setAppliedTime(selectedTime);
    setAppliedSearch(selectedSearch);
    setCurrentPage(1);
  };

  // ---------- RESET FILTERS ----------
  const resetFilters = () => {
    setSelectedSeverity("All Severities");
    setSelectedStatus("All Status");
    setSelectedIds("All IDS Sources");
    setSelectedTime("Time Range");
    setSelectedSearch("");
    setAppliedSeverity("All Severities");
    setAppliedStatus("All Status");
    setAppliedIds("All IDS Sources");
    setAppliedTime("Time Range");
    setAppliedSearch("");
    setCurrentPage(1);
  };

  // ---------- PAGINATION ----------
  const alertsPerPage = 5;
  const totalFiltered = filteredAlerts.length;
  const totalPages = Math.ceil(totalFiltered / alertsPerPage);

  const indexOfLastAlert = currentPage * alertsPerPage;
  const indexOfFirstAlert = indexOfLastAlert - alertsPerPage;
  const currentAlerts = filteredAlerts.slice(indexOfFirstAlert, indexOfLastAlert);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i) && i !== 1 && i !== totalPages) pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("...");

      pages.push(totalPages);
    }
    return pages.filter((v, i, a) => a.indexOf(v) === i);
  };

  const pageNumbers = getPageNumbers();

  // ---------- EXPORT ----------
  const exportToCSV = () => {
    const headers = [
      "Severity",
      "Alert Type",
      "Source IP",
      "Destination IP",
      "Port",
      "IDS Source",
      "Time",
      "Progress",
    ];
    const rows = filteredAlerts.map((alert) => [
      alert.severity,
      alert.type,
      alert.src,
      alert.dest,
      alert.port,
      alert.ids,
      alert.time,
      alert.progress,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "alerts_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ---------- HELPER ----------
  const getSeverityClass = (severity) => {
    if (severity === "High") return "high";
    if (severity === "Medium") return "medium";
    return "low";
  };

  return (
    <AnalystLayout>
      <div className="dashboard-container">
        {/* Main Content */}
        <div className="alerts-container">
          <div className="alerts-header">
            <h1>Intrusion Detection Alerts</h1>
            <button className="export-btn" onClick={exportToCSV}>
              <FiDownload /> Export CSV
            </button>
          </div>

          {/* Filter Panel */}
          <div className="filter-panel">
            <div className="filter-row">
              <div className="filter-item">
                <label>Severity</label>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                >
                  <option>All Severities</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div className="filter-item">
                <label>Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option>All Status</option>
                  <option>New</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
              </div>
              <div className="filter-item">
                <label>IDS Source</label>
                <select
                  value={selectedIds}
                  onChange={(e) => setSelectedIds(e.target.value)}
                >
                  <option>All IDS Sources</option>
                  <option>Snort</option>
                  <option>Zeek</option>
                  <option>Kismet</option>
                  <option>Suricata</option>
                </select>
              </div>
              <div className="filter-item">
                <label>Time Range</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                >
                  <option>Time Range</option>
                  <option>24H</option>
                  <option>7D</option>
                  <option>30D</option>
                </select>
              </div>
            </div>

            <div className="filter-row">
              <div className="filter-item">
                <label>Search</label>
                <div className="search-wrapper">
                  <FiSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="IP, Port, Type"
                    value={selectedSearch}
                    onChange={(e) => setSelectedSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="filter-actions">
                <button className="btn-primary" onClick={applyFilters}>
                  Apply Filter
                </button>
                <button className="btn-secondary" onClick={resetFilters}>
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <div className="table-header">
              <div>Showing {totalFiltered} results</div>
              <div>
                Page {currentPage} of {totalPages}
              </div>
            </div>
            <div className="table-wrap">
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
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAlerts.map((alert) => (
                    <tr key={alert.id}>
                      <td className={getSeverityClass(alert.severity)}>{alert.severity}</td>
                      <td>{alert.type}</td>
                      <td>{alert.src}</td>
                      <td>{alert.dest}</td>
                      <td>{alert.port}</td>
                      <td>{alert.ids}</td>
                      <td>{alert.time}</td>
                      <td
                        className={
                          alert.progress === "New"
                            ? "progress-new"
                            : alert.progress === "In Progress"
                            ? "progress-in-progress"
                            : "progress-resolved"
                        }
                      >
                        {alert.progress}
                      </td>
                      <td>
                        <Link
                          to={`/alert/${alert.id}`}
                          state={{ alert }}
                          style={{ textDecoration: "none" }}
                        >
                          <button className="small-btn">View</button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {totalFiltered === 0 && (
                    <tr>
                      <td
                        colSpan="9"
                        style={{
                          textAlign: "center",
                          padding: "2rem",
                          color: "#94a3b8",
                        }}
                      >
                        No alerts match the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination (clean and compact) */}
          {totalFiltered > 0 && (
            <div className="pagination">
              <p>
                Showing {indexOfFirstAlert + 1} to{" "}
                {Math.min(indexOfLastAlert, totalFiltered)} of {totalFiltered} results
              </p>
              <div className="pages">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="page-nav"
                >
                  <FiChevronLeft />
                </button>

                {pageNumbers.map((page, index) => (
                  <button
                    key={index}
                    className={`page-number ${
                      page === currentPage ? "active" : ""
                    } ${page === "..." ? "dots" : ""}`}
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
                  <FiChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AnalystLayout>
  );
};

export default Alerts;
