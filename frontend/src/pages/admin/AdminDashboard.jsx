import React, { useState } from "react";

function AdminDashboard() {
  const [hoveredRow, setHoveredRow] = useState(null);

  const nidsStatus = [
    { name: "Suricata", status: "running", icon: "success" },
    { name: "Zeek", status: "running", icon: "success" },
    { name: "Snort", status: "error", icon: "warning" },
    { name: "Kismet", status: "stopped", icon: "error" }
  ];

  const recentEvents = [
    { time: "14:23:56", status: "Low", category: "Recon", srcIP: "192.168.1.10" },
    { time: "14:22:45", status: "Medium", category: "Brute Force", srcIP: "10.0.0.5" },
    { time: "14:20:12", status: "High", category: "Exploit Attempt", srcIP: "172.16.0.20" }
  ];

  return (
    <div style={styles.content}>
      {/* NIDS Status Cards */}
      <div style={styles.statusGrid}>
        {nidsStatus.map((service, index) => (
          <div key={index} style={styles.statusCard(service.status)}>
            <div style={styles.statusHeader}>
              <span style={styles.serviceName}>{service.name}</span>
              <div style={styles.statusIcon(service.icon)} />
            </div>
            <div style={styles.statusText}>
              {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
            </div>
          </div>
        ))}
      </div>

      {/* System Resources */}
      <div style={styles.resourcesGrid}>
        <div style={styles.resourceCard}>
          <div style={styles.resourceLabel}>CPU Usage</div>
          <div style={styles.gauge}>45%</div>
          <div style={styles.gaugeBar}>
            <div style={styles.gaugeBarFill(45)} />
          </div>
        </div>
        <div style={styles.resourceCard}>
          <div style={styles.resourceLabel}>Memory Usage</div>
          <div style={styles.gauge}>62%</div>
          <div style={styles.gaugeBar}>
            <div style={styles.gaugeBarFill(62)} />
          </div>
        </div>
        <div style={styles.resourceCard}>
          <div style={styles.resourceLabel}>Disk Usage</div>
          <div style={styles.gauge}>38%</div>
          <div style={styles.gaugeBar}>
            <div style={styles.gaugeBarFill(38)} />
          </div>
        </div>
      </div>

      {/* Recent Events Table */}
      <div style={styles.tableSection}>
        <div style={styles.tableHeaderSection}>
          <h3 style={styles.tableTitle}>Recent System Events</h3>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Time</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Source IP</th>
              <th style={styles.th}>Log Status</th>
            </tr>
          </thead>
          <tbody>
            {recentEvents.map((event, index) => (
              <tr 
                key={index} 
                style={hoveredRow === index ? styles.trHover : styles.tr}
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td style={styles.td}>{event.time}</td>
                <td style={styles.statusBadge(event.status.toLowerCase())}>{event.status}</td>
                <td style={styles.td}>{event.category}</td>
                <td style={styles.td}>{event.srcIP}</td>
                <td style={styles.td}><span style={styles.success}>Success</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  content: {
    flex: 1,
    padding: "2rem",
    overflowY: "auto",
    backgroundColor: "#0f172a",
    color: "#f1f5f9",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  // Dashboard content styles ONLY (no sidebar styles)
  statusGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  statusCard: (status) => ({
    backgroundColor: "#1e293b",
    padding: "1.5rem",
    borderRadius: "12px",
    border: status === "running" ? "1px solid #10b981" : "1px solid #475569",
    transition: "all 0.2s",
  }),
  statusHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.5rem",
  },
  serviceName: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#f1f5f9",
  },
  statusIcon: (type) => ({
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: type === "success" ? "#10b981" : type === "warning" ? "#f59e0b" : "#ef4444",
  }),
  statusText: {
    color: "#94a3b8",
    fontSize: "0.9rem",
  },
  resourcesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  resourceCard: {
    backgroundColor: "#1e293b",
    padding: "1.5rem",
    borderRadius: "12px",
  },
  resourceLabel: {
    color: "#94a3b8",
    fontSize: "0.85rem",
    marginBottom: "0.75rem",
  },
  gauge: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#f1f5f9",
    marginBottom: "0.5rem",
  },
  gaugeBar: {
    height: "8px",
    backgroundColor: "#334155",
    borderRadius: "4px",
    overflow: "hidden",
  },
  gaugeBarFill: (percent) => ({
    height: "100%",
    backgroundColor: percent < 50 ? "#10b981" : percent < 75 ? "#f59e0b" : "#ef4444",
    width: `${percent}%`,
    transition: "width 0.3s ease",
  }),
  tableSection: {
    backgroundColor: "#1e293b",
    padding: "1.5rem",
    borderRadius: "12px",
  },
  tableHeaderSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  tableTitle: {
    fontSize: "1.25rem",
    fontWeight: 600,
    margin: 0,
    color: "#f1f5f9",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: "0.75rem 1rem",
    textAlign: "left",
    color: "#94a3b8",
    fontSize: "0.85rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  tr: {
    borderBottom: "1px solid #334155",
  },
  trHover: {
    backgroundColor: "#253549",
  },
  td: {
    padding: "1rem",
    fontSize: "0.9rem",
    color: "#f1f5f9",
  },
  statusBadge: (status) => ({
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    fontSize: "0.8rem",
    fontWeight: 600,
    backgroundColor: status === "low" ? "#10b981" : status === "medium" ? "#f59e0b" : "#ef4444",
    color: "#fff",
  }),
  success: {
    color: "#10b981",
    fontWeight: 500,
  },
};

export default AdminDashboard;
