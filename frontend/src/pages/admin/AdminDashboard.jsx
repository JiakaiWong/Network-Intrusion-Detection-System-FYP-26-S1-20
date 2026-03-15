import React, { useState } from "react";
import { styles } from "./AdminDashboard.styles";

function AdminDashboard({ logs = [] }) {
  const [hoveredRow, setHoveredRow] = useState(null);

  // ── NIDS status from shared logs prop ─────────────────────
  const nidsServices = ["Suricata", "Snort", "Zeek", "Kismet"];

  const nidsStatus = nidsServices.map((serviceName) => {
    const match = logs.find((log) =>
      log.name.toLowerCase().includes(serviceName.toLowerCase())
    );
    if (!match) return { name: serviceName, status: "stopped" };
    return {
      name: serviceName,
      status: match.status === "Active" ? "running" : "stopped",
    };
  });

  // Derive overall log ingestion status from logs prop
  // Each event is associated with a NIDS service by category keyword.
  // We look up whether that service's log source is Active or not.
  const categoryToService = {
    "Recon": "Suricata",
    "Brute Force": "Snort",
    "Exploit Attempt": "Suricata",
  };

  const getLogStatus = (category) => {
    const serviceName = categoryToService[category];
    if (!serviceName) return { label: "Unknown", color: "#64748b" };

    const match = logs.find((log) =>
      log.name.toLowerCase().includes(serviceName.toLowerCase())
    );

    if (!match) return { label: "No Source", color: "#64748b" };
    if (match.status === "Active") return { label: "Success", color: "#10b981" };
    return { label: "Inactive", color: "#ef4444" };
  };

  const recentEvents = [
    { time: "14:23:56", status: "Low", category: "Recon", srcIP: "192.168.1.10" },
    { time: "14:22:45", status: "Medium", category: "Brute Force", srcIP: "10.0.0.5" },
    { time: "14:20:12", status: "High", category: "Exploit Attempt", srcIP: "172.16.0.20" },
  ];

  return (
    <div style={styles.content}>

      {/* NIDS Status Cards */}
      <div style={styles.sectionLabel}>NIDS Service Status</div>
      <div style={styles.statusGrid}>
        {nidsStatus.map((service, index) => (
          <div key={index} style={styles.statusCard(service.status)}>
            <div style={styles.statusHeader}>
              <span style={styles.serviceName}>{service.name}</span>
              <div style={styles.statusDot(service.status)} />
            </div>
            <div style={styles.statusText(service.status)}>
              {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
            </div>
          </div>
        ))}
      </div>

      {/* System Resources */}
      <div style={styles.sectionLabel}>System Resources</div>
      <div style={styles.resourcesGrid}>
        {[
          { label: "CPU Usage", value: 45 },
          { label: "Memory Usage", value: 62 },
          { label: "Disk Usage", value: 38 },
        ].map(({ label, value }) => (
          <div key={label} style={styles.resourceCard}>
            <div style={styles.resourceLabel}>{label}</div>
            <div style={styles.gauge}>{value}%</div>
            <div style={styles.gaugeBar}>
              <div style={styles.gaugeBarFill(value)} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Events Table */}
      <div style={styles.tableSection}>
        <div style={styles.tableHeaderSection}>
          <h3 style={styles.tableTitle}>Recent System Events</h3>
        </div>

        {/* ── Log source summary bar ── */}
        {logs.length > 0 && (
          <div style={styles.logSummaryBar}>
            <span style={styles.logSummaryLabel}>Active log sources:</span>
            {logs.map((log) => (
              <span key={log.id} style={styles.logSourceChip(log.status)}>
                <span style={styles.logSourceDot(log.status)} />
                {log.name}
              </span>
            ))}
          </div>
        )}

        {logs.length === 0 && (
          <div style={styles.noLogsWarning}>
            ⚠ No log sources configured. Go to Settings to add IDS log connections.
          </div>
        )}

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Time</th>
              <th style={styles.th}>Severity</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Source IP</th>
              <th style={styles.th}>Log Status</th>
            </tr>
          </thead>
          <tbody>
            {recentEvents.map((event, index) => {
              const logStatus = getLogStatus(event.category);
              return (
                <tr
                  key={index}
                  style={hoveredRow === index ? styles.trHover : styles.tr}
                  onMouseEnter={() => setHoveredRow(index)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td style={styles.td}>{event.time}</td>
                  <td style={styles.td}>
                    <span style={styles.statusBadge(event.status.toLowerCase())}>
                      {event.status}
                    </span>
                  </td>
                  <td style={styles.td}>{event.category}</td>
                  <td style={styles.td}>{event.srcIP}</td>
                  {/* Log Status now driven from logs prop */}
                  <td style={styles.td}>
                    <span style={{ color: logStatus.color, fontWeight: 500 }}>
                      {logStatus.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


export default AdminDashboard;