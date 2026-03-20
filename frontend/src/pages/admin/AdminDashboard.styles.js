export const styles = {
  content: {
    flex: 1,
    padding: "2rem",
    overflowY: "auto",
    overflowX: "hidden",
    height: "100vh",        
    boxSizing: "border-box",
    backgroundColor: "#0f172a",
    color: "#f1f5f9",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  sectionLabel: {
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "1rem",
  },
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
    border: status === "running"
      ? "1px solid rgba(16,185,129,0.4)"
      : "1px solid rgba(239,68,68,0.3)",
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
  statusDot: (status) => ({
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: status === "running" ? "#10b981" : "#ef4444",
    boxShadow: status === "running" ? "0 0 6px #10b981" : "0 0 6px #ef4444",
  }),
  statusText: (status) => ({
    fontSize: "0.9rem",
    fontWeight: 500,
    color: status === "running" ? "#10b981" : "#ef4444",
  }),
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
    marginBottom: "2rem", 
  },
  tableHeaderSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  tableTitle: {
    fontSize: "1.25rem",
    fontWeight: 600,
    margin: 0,
    color: "#f1f5f9",
  },

  // ── Log source summary bar ─────────────────────────────────
  logSummaryBar: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "0.5rem",
    marginBottom: "1.25rem",
    padding: "0.75rem 1rem",
    backgroundColor: "#0f172a",
    borderRadius: "8px",
    border: "1px solid #334155",
  },
  logSummaryLabel: {
    fontSize: "0.78rem",
    color: "#64748b",
    fontWeight: 600,
    marginRight: "0.25rem",
  },
  logSourceChip: (status) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.2rem 0.65rem",
    borderRadius: "9999px",
    fontSize: "0.78rem",
    fontWeight: 500,
    backgroundColor: status === "Active" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
    color: status === "Active" ? "#10b981" : "#ef4444",
    border: `1px solid ${status === "Active" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
  }),
  logSourceDot: (status) => ({
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: status === "Active" ? "#10b981" : "#ef4444",
    flexShrink: 0,
  }),
  noLogsWarning: {
    padding: "0.875rem 1rem",
    marginBottom: "1.25rem",
    backgroundColor: "rgba(245,158,11,0.1)",
    border: "1px solid rgba(245,158,11,0.3)",
    borderRadius: "8px",
    fontSize: "0.88rem",
    color: "#f59e0b",
  },

  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: "0.75rem 1rem",
    textAlign: "left",
    color: "#94a3b8",
    fontSize: "0.85rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: "1px solid #334155",
  },
  tr: { borderBottom: "1px solid #334155" },
  trHover: { backgroundColor: "#253549", borderBottom: "1px solid #334155" },
  td: { padding: "1rem", fontSize: "0.9rem", color: "#f1f5f9" },
  statusBadge: (status) => ({
    display: "inline-block",
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    fontSize: "0.8rem",
    fontWeight: 600,
    backgroundColor:
      status === "low"    ? "rgba(59,130,246,0.15)"  :
      status === "medium" ? "rgba(245,158,11,0.15)"  :
                            "rgba(239,68,68,0.15)",
    color:
      status === "low"    ? "#3b82f6" :
      status === "medium" ? "#f59e0b" :
                            "#ef4444",
    border: `1px solid ${
      status === "low"    ? "rgba(59,130,246,0.3)"  :
      status === "medium" ? "rgba(245,158,11,0.3)"  :
                            "rgba(239,68,68,0.3)"
    }`,
  }),
};