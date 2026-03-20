import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { styles } from "./AdminDashboard.styles";

// ── Config ────────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000";

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

// ── Helpers ───────────────────────────────────────────────────────────────────
// Backend: 1 = high, 2 = medium, 3 = low
const SEVERITY_ORDER  = { high: 0, medium: 1, low: 2 };

const SEVERITY_COLORS = {
  high:   "#f97316",
  medium: "#eab308",
  low:    "#3b82f6",
};

const SEVERITY_LABELS = ["high", "medium", "low"];

// Map backend severity_label → display label
const SEVERITY_DISPLAY = { high: "High", medium: "Medium", low: "Low" };

// ── Sub-components ────────────────────────────────────────────────────────────
function SummaryCard({ label, value, sub, color }) {
  return (
    <div style={{
      background: "#0f172a", border: "1px solid #1e293b",
      borderRadius: "10px", padding: "20px 24px", flex: 1, minWidth: 0,
    }}>
      <div style={{ fontSize: "0.78rem", color: "#64748b", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </div>
      <div style={{ fontSize: "2rem", fontWeight: "700", color: color || "white", lineHeight: 1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: "0.75rem", color: "#475569", marginTop: "6px" }}>{sub}</div>}
    </div>
  );
}

function SeverityBar({ label, count, max, color }) {
  const pct = max > 0 ? (count / max) * 100 : 0;
  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
        <span style={{ fontSize: "0.82rem", color: "#94a3b8" }}>{label}</span>
        <span style={{ fontSize: "0.82rem", color, fontWeight: "600" }}>{count}</span>
      </div>
      <div style={{ background: "#1e293b", borderRadius: "4px", height: "6px" }}>
        <div style={{ width: `${pct}%`, background: color, borderRadius: "4px", height: "6px", transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
function AdminDashboard({ logs: logsProp = [], onRefreshLogs }) {
  const [alerts, setAlerts]         = useState([]);
  const [summary, setSummary]       = useState({ total: 0, severity_summary: { high: 0, medium: 0, low: 0 } });
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  // Local logs state so the component always reflects the latest value,
  // even if the parent's logsProp was still empty on first render.
  const [logs, setLogs]             = useState(logsProp);
  const PAGE_SIZE = 10;

  // Keep local logs in sync whenever the parent updates logsProp after mount
  useEffect(() => { setLogs(logsProp); }, [logsProp]);

  // ── Fetch alerts + summary ─────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [alertsRes, summaryRes] = await Promise.all([
        axios.get(`${API_BASE}/alerts`, getAuthHeader()),
        axios.get(`${API_BASE}/dashboard/summary`, getAuthHeader()),
      ]);
      setAlerts(alertsRes.data.items || []);
      setCurrentPage(1);
      setSummary(summaryRes.data);
    } catch (err) {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  // On mount: fetch dashboard data AND ask the parent to refresh logs so the
  // NIDS status reflects the current state immediately without needing
  // the user to navigate away and back.
  useEffect(() => {
    fetchData();
    if (typeof onRefreshLogs === "function") onRefreshLogs();
  }, [fetchData, onRefreshLogs]);

  // ── NIDS service status from logs prop ─────────────────────────────────────
  const nidsServices = ["Suricata", "Snort", "Zeek", "Kismet"];

  const nidsStatus = nidsServices.map((serviceName) => {
    const match = logs.find((log) =>
      log.name.toLowerCase().includes(serviceName.toLowerCase())
    );
    return {
      name:   serviceName,
      status: match?.status === "Active" ? "running" : "stopped",
    };
  });

  const activeCount  = nidsStatus.filter((s) => s.status === "running").length;
  const stoppedCount = nidsStatus.filter((s) => s.status === "stopped").length;

  // ── Derived stats from real alerts ─────────────────────────────────────────
  const severityCounts = summary.severity_summary;
  const maxSeverityCount = Math.max(...Object.values(severityCounts), 1);

  const categoryCounts = alerts.reduce((acc, a) => {
    if (a.category) acc[a.category] = (acc[a.category] || 0) + 1;
    return acc;
  }, {});

  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];

  // Sort alerts by severity (high → medium → low), then by time descending
  const sortedAlerts = [...alerts].sort((a, b) => {
    const sevDiff = (SEVERITY_ORDER[a.severity_label] ?? 99) - (SEVERITY_ORDER[b.severity_label] ?? 99);
    if (sevDiff !== 0) return sevDiff;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  // Format timestamp for display
  const formatTime = (iso) => {
    try {
      return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    } catch {
      return iso;
    }
  };

  // ── Pagination ────────────────────────────────────────────────────────────
  const totalPages  = Math.ceil(sortedAlerts.length / PAGE_SIZE);
  const pagedAlerts = sortedAlerts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ color: "white", padding: "50px", textAlign: "center" }}>Loading dashboard...</div>
  );

  if (error) return (
    <div style={{ color: "#ef4444", padding: "50px", textAlign: "center" }}>
      {error} <button onClick={fetchData} style={{ marginLeft: "10px", color: "#3b82f6", background: "none", border: "none", cursor: "pointer" }}>Retry</button>
    </div>
  );

  return (
    <div style={styles.content}>

      {/* ── Summary Cards ──────────────────────────────────────────────────── */}
      <div style={styles.sectionLabel}>Overview</div>
      <div style={{ display: "flex", gap: "16px", marginBottom: "28px", flexWrap: "wrap" }}>
        <SummaryCard
          label="Total Alerts"
          value={summary.total}
          sub="All time"
        />
        <SummaryCard
          label="High Severity"
          value={severityCounts.high || 0}
          sub="Requires immediate attention"
          color="#f97316"
        />
        <SummaryCard
          label="Active NIDS Services"
          value={`${activeCount} / ${nidsServices.length}`}
          sub={stoppedCount > 0 ? `${stoppedCount} service(s) stopped` : "All services running"}
          color={activeCount === nidsServices.length ? "#10b981" : "#f97316"}
        />
        <SummaryCard
          label="Top Threat Category"
          value={topCategory ? topCategory[0] : "—"}
          sub={topCategory ? `${topCategory[1]} alert(s)` : "No alerts"}
          color="#a78bfa"
        />
      </div>

      {/* ── Middle panels ───────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "28px", flexWrap: "wrap" }}>

        {/* NIDS Status */}
        <div style={{ flex: 1, minWidth: "220px", background: "#0f172a", border: "1px solid #1e293b", borderRadius: "10px", padding: "20px" }}>
          <div style={styles.sectionLabel}>NIDS Service Status</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {nidsStatus.map((service) => (
              <div key={service.name} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 14px", background: "#0c1a2e",
                borderRadius: "8px", border: "1px solid #1e293b",
              }}>
                <span style={{ color: "#e2e8f0", fontSize: "0.88rem", fontWeight: "500" }}>{service.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{
                    width: "8px", height: "8px", borderRadius: "50%",
                    background: service.status === "running" ? "#10b981" : "#ef4444",
                    boxShadow: service.status === "running" ? "0 0 6px #10b981" : "none",
                  }} />
                  <span style={{
                    fontSize: "0.75rem", fontWeight: "600", textTransform: "capitalize",
                    color: service.status === "running" ? "#10b981" : "#ef4444",
                  }}>
                    {service.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Severity Breakdown */}
        <div style={{ flex: 1, minWidth: "220px", background: "#0f172a", border: "1px solid #1e293b", borderRadius: "10px", padding: "20px" }}>
          <div style={styles.sectionLabel}>Severity Breakdown</div>
          {SEVERITY_LABELS.map((sev) => (
            <SeverityBar
              key={sev}
              label={SEVERITY_DISPLAY[sev]}
              count={severityCounts[sev] || 0}
              max={maxSeverityCount}
              color={SEVERITY_COLORS[sev]}
            />
          ))}
        </div>

        {/* Threat Categories */}
        <div style={{ flex: 1, minWidth: "220px", background: "#0f172a", border: "1px solid #1e293b", borderRadius: "10px", padding: "20px" }}>
          <div style={styles.sectionLabel}>Threat Categories</div>
          {Object.keys(categoryCounts).length === 0 ? (
            <div style={{ color: "#475569", fontSize: "0.85rem", marginTop: "10px" }}>No category data available.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {Object.entries(categoryCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, count]) => (
                  <div key={cat} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "10px 14px", background: "#0c1a2e",
                    borderRadius: "8px", border: "1px solid #1e293b",
                  }}>
                    <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>{cat}</span>
                    <span style={{
                      background: "#1e3a5f", color: "#60a5fa",
                      borderRadius: "12px", padding: "2px 10px",
                      fontSize: "0.75rem", fontWeight: "600",
                    }}>{count}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Recent Alerts Table ─────────────────────────────────────────────── */}
      <div style={styles.tableSection}>
        <div style={styles.tableHeaderSection}>
          <h3 style={styles.tableTitle}>Recent Alerts</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "0.78rem", color: "#475569" }}>Sorted by severity</span>
            <button
              onClick={fetchData}
              style={{ background: "transparent", border: "1px solid #1e293b", color: "#64748b", borderRadius: "6px", padding: "4px 10px", fontSize: "0.75rem", cursor: "pointer" }}
            >
              ↻ Refresh
            </button>
          </div>
        </div>

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

        {sortedAlerts.length === 0 ? (
          <div style={{ color: "#475569", textAlign: "center", padding: "40px", fontSize: "0.9rem" }}>
            No alerts ingested yet. Alerts will appear here once your IDS starts sending data.
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Time</th>
                <th style={styles.th}>Severity</th>
                <th style={styles.th}>Signature</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Source IP</th>
                <th style={styles.th}>Dest IP</th>
                <th style={styles.th}>Proto</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {pagedAlerts.map((alert, index) => (
                <tr
                  key={alert.id || index}
                  style={hoveredRow === index ? styles.trHover : styles.tr}
                  onMouseEnter={() => setHoveredRow(index)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td style={{ ...styles.td, fontSize: "0.8rem", color: "#64748b" }}>
                    {formatTime(alert.created_at)}
                  </td>
                  <td style={styles.td}>
                    <span style={styles.statusBadge(alert.severity_label)}>
                      {SEVERITY_DISPLAY[alert.severity_label] || alert.severity_label}
                    </span>
                  </td>
                  <td style={{ ...styles.td, maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {alert.signature || "—"}
                  </td>
                  <td style={styles.td}>{alert.category || "—"}</td>
                  <td style={{ ...styles.td, fontFamily: "monospace", fontSize: "0.82rem" }}>
                    {alert.src_ip}{alert.src_port ? `:${alert.src_port}` : ""}
                  </td>
                  <td style={{ ...styles.td, fontFamily: "monospace", fontSize: "0.82rem" }}>
                    {alert.dest_ip}{alert.dest_port ? `:${alert.dest_port}` : ""}
                  </td>
                  <td style={{ ...styles.td, textTransform: "uppercase", fontSize: "0.78rem", color: "#94a3b8" }}>
                    {alert.proto || "—"}
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      fontSize: "0.75rem", fontWeight: "600", textTransform: "capitalize",
                      color: alert.status === "new" ? "#f97316" : alert.status === "investigating" ? "#eab308" : "#10b981",
                    }}>
                      {alert.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 4px 4px" }}>
            <span style={{ fontSize: "0.78rem", color: "#475569" }}>
              Showing {((currentPage - 1) * PAGE_SIZE) + 1}–{Math.min(currentPage * PAGE_SIZE, sortedAlerts.length)} of {sortedAlerts.length} alerts
            </span>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  background: "transparent", border: "1px solid #1e293b", color: currentPage === 1 ? "#334155" : "#94a3b8",
                  borderRadius: "6px", padding: "5px 12px", fontSize: "0.8rem",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
              >
                ← Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === "..." ? (
                    <span key={`ellipsis-${idx}`} style={{ color: "#475569", padding: "0 4px", fontSize: "0.8rem" }}>…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      style={{
                        background: currentPage === p ? "#3b82f6" : "transparent",
                        border: `1px solid ${currentPage === p ? "#3b82f6" : "#1e293b"}`,
                        color: currentPage === p ? "white" : "#94a3b8",
                        borderRadius: "6px", padding: "5px 10px", fontSize: "0.8rem", cursor: "pointer",
                        minWidth: "32px",
                      }}
                    >
                      {p}
                    </button>
                  )
                )}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  background: "transparent", border: "1px solid #1e293b", color: currentPage === totalPages ? "#334155" : "#94a3b8",
                  borderRadius: "6px", padding: "5px 12px", fontSize: "0.8rem",
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                }}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;