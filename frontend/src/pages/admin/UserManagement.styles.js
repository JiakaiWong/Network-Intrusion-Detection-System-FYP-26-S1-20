export const styles = {
  content: {
    flex: 1,
    padding: "2rem",
    // Changed: 'initial' prevents the main container from creating 
    // nested scrollbars unless the whole page overflows.
    overflowY: "initial", 
    backgroundColor: "#0f172a",
    color: "#f1f5f9",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    position: "relative",
    minHeight: "100vh",
  },
  header: { marginBottom: "2rem" },
  pageTitle: { fontSize: "2rem", fontWeight: 700, margin: "0 0 0.5rem 0", color: "#f1f5f9" },
  subtitle: { color: "#94a3b8", fontSize: "1rem", margin: 0 },
  controls: { display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem" },
  searchInput: {
    flex: 1,
    padding: "0.875rem 1rem",
    backgroundColor: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "8px",
    color: "#f1f5f9",
    fontSize: "0.95rem",
  },
  addUserBtn: {
    padding: "0.875rem 1.5rem",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  // ── Filter bar ────────────────────────────────────────────
  filterBar: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    flexWrap: "wrap",
    marginBottom: "0.75rem",
    padding: "0.875rem 1.25rem",
    backgroundColor: "#1e293b",
    borderRadius: "10px",
    border: "1px solid #334155",
  },
  filterGroup: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
  },
  filterLabel: {
    fontSize: "0.78rem",
    fontWeight: 600,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    whiteSpace: "nowrap",
  },
  selectDropdown: {
    padding: "0.45rem 0.75rem",
    backgroundColor: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "6px",
    color: "#f1f5f9",
    fontSize: "0.85rem",
    cursor: "pointer",
    outline: "none",
  },
  clearBtn: {
    marginLeft: "auto",
    padding: "0.45rem 0.9rem",
    backgroundColor: "transparent",
    border: "1px solid #475569",
    borderRadius: "6px",
    color: "#94a3b8",
    fontSize: "0.82rem",
    cursor: "pointer",
    whiteSpace: "nowrap",
    fontFamily: "inherit",
  },
  resultsCount: {
    fontSize: "0.82rem",
    color: "#64748b",
    margin: "0 0 1rem 0",
  },

  // ── Table Section Updated ──────────────────────────────────
  tableSection: { 
    backgroundColor: "#1e293b", 
    padding: "1.5rem", 
    borderRadius: "12px",
    // Added paddingBottom: ensures the last row's dropdown has room to exist
    // without cutting off or forcing a scrollbar immediately.
    paddingBottom: "120px", 
    marginBottom: "2rem" 
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: "1rem",
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
  
  roleBadge: (role) => ({
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    fontSize: "0.8rem",
    fontWeight: 600,
    backgroundColor: role === "Administrator" ? "#3b82f6" : "#10b981",
    color: "#fff",
  }),
  statusBadge: (status) => {
    const s = status?.toLowerCase();
    let color = "#94a3b8";
    let bg = "rgba(148, 163, 184, 0.1)";

    if (s === "active") {
      color = "#10b981";
      bg = "rgba(16, 185, 129, 0.1)";
    } else if (s === "pending") {
      color = "#f59e0b";
      bg = "rgba(245, 158, 11, 0.1)";
    } else if (s === "suspended" || s === "rejected") {
      color = "#ef4444";
      bg = "rgba(239, 68, 68, 0.1)";
    }

    return {
      color,
      backgroundColor: bg,
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "0.85rem",
      textTransform: "capitalize",
    };
  },

  // ── Dropdown Fixes ────────────────────────────────────────
  menuTrigger: {
    padding: "0.4rem 0.85rem",
    backgroundColor: "#334155",
    color: "#94a3b8",
    border: "1px solid #475569",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1.1rem",
    fontWeight: 700,
  },
  dropdown: {
    position: "absolute",
    right: 0,
    // Using top: 100% ensures it drops down relative to the trigger
    top: "100%", 
    backgroundColor: "#1e293b",
    border: "1px solid #475569",
    borderRadius: "8px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
    zIndex: 1000,
    minWidth: "160px",
    overflow: "hidden",
    marginTop: "4px",
  },
  dropdownItem: {
    display: "block",
    width: "100%",
    padding: "0.75rem 1rem",
    background: "none",
    border: "none",
    borderBottom: "1px solid #334155",
    textAlign: "left",
    fontSize: "0.88rem",
    color: "#f1f5f9",
    cursor: "pointer",
  },

  // ── Toast & Modals (Rest of styles) ────────────────────────
  toast: (type) => ({
    position: "fixed",
    top: "1.5rem",
    right: "1.5rem",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    padding: "0.75rem 1.25rem",
    borderRadius: "10px",
    fontSize: "0.9rem",
    fontWeight: 500,
    backgroundColor: type === "success" ? "#10b981" : "#ef4444",
    color: "#fff",
    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
  }),
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#1e293b",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "480px",
    border: "1px solid #334155",
    boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
  },
  modalHeader: {
    padding: "1.5rem",
    borderBottom: "1px solid #334155",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: { margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#f1f5f9" },
  modalBody: { padding: "1.5rem" },
  modalFooter: {
    padding: "1.25rem 1.5rem",
    borderTop: "1px solid #334155",
    display: "flex",
    gap: "0.75rem",
    justifyContent: "flex-end",
  },
  inputField: { // Unified with your component's usage
    width: "100%",
    padding: "0.75rem 1rem",
    backgroundColor: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "8px",
    color: "#f1f5f9",
    fontSize: "0.95rem",
    marginBottom: "1rem",
    boxSizing: "border-box",
  },
  fieldLabel: {
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "#60a5fa",
    textTransform: "uppercase",
    marginBottom: "0.4rem",
    display: "block",
  },
  saveBtn: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  cancelBtn: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "transparent",
    color: "#94a3b8",
    border: "1px solid #334155",
    borderRadius: "8px",
    fontSize: "0.9rem",
    cursor: "pointer",
  },
};