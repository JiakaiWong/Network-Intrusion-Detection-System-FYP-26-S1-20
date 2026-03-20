import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000";

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  page: {
    flex: 1, padding: "2rem",
    backgroundColor: "#0f172a", color: "#f1f5f9",
    overflowY: "auto", height: "100vh", boxSizing: "border-box",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  toast: (type) => ({
    position: "fixed", top: "1.5rem", right: "1.5rem", zIndex: 9999,
    display: "flex", alignItems: "center", gap: "0.6rem",
    padding: "0.75rem 1.25rem", borderRadius: "10px",
    fontSize: "0.9rem", fontWeight: 500,
    backgroundColor: type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#3b82f6",
    color: "#fff", boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
  }),
  pageTitle: { fontSize: "2rem", fontWeight: 700, margin: "0 0 0.25rem 0" },
  subtitle:  { fontSize: "0.9rem", color: "#64748b", margin: "0 0 2rem 0" },
  sectionLabel: {
    fontSize: "0.72rem", fontWeight: 700, color: "#64748b",
    textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 1rem 0",
  },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "24px" },
  card: {
    backgroundColor: "#1e293b", border: "1px solid #334155",
    borderRadius: "12px", padding: "1.5rem",
  },
  statCard: (color) => ({
    backgroundColor: "#1e293b", border: `1px solid ${color}30`,
    borderRadius: "12px", padding: "1.25rem",
    borderLeft: `4px solid ${color}`,
  }),
  statLabel: { fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" },
  statValue: (color) => ({ fontSize: "1.8rem", fontWeight: 700, color: color || "#f1f5f9", lineHeight: 1 }),
  statSub:   { fontSize: "0.75rem", color: "#475569", marginTop: "4px" },

  dot: (ok) => ({
    display: "inline-block", width: "10px", height: "10px", borderRadius: "50%",
    backgroundColor: ok ? "#10b981" : "#ef4444",
    boxShadow: ok ? "0 0 6px #10b981" : "none",
    marginRight: "8px",
  }),
  statusRow: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "10px 0", borderBottom: "1px solid #1e293b",
  },
  statusLabel: { fontSize: "0.88rem", color: "#94a3b8" },
  statusValue: (ok) => ({ fontSize: "0.88rem", fontWeight: 600, color: ok ? "#10b981" : "#ef4444" }),

  btn: (variant) => ({
    padding: "0.65rem 1.25rem", borderRadius: "8px", border: "none",
    fontSize: "0.88rem", fontWeight: 600, cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: "6px",
    backgroundColor:
      variant === "primary" ? "#3b82f6" :
      variant === "success" ? "#10b981" :
      variant === "danger"  ? "#ef4444" :
      variant === "warning" ? "#f97316" : "#334155",
    color: "white",
    opacity: 1,
  }),
  btnDisabled: { opacity: 0.5, cursor: "not-allowed" },

  input: {
    padding: "0.6rem 0.9rem", backgroundColor: "#0f172a",
    border: "1px solid #334155", borderRadius: "8px",
    color: "#f1f5f9", fontSize: "0.9rem", width: "80px",
  },
  table:  { width: "100%", borderCollapse: "collapse" },
  th:     { padding: "0.7rem 1rem", textAlign: "left", color: "#64748b", fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", borderBottom: "1px solid #334155" },
  tr:     { borderBottom: "1px solid #1e293b" },
  td:     { padding: "0.8rem 1rem", fontSize: "0.85rem", color: "#f1f5f9" },

  logBadge: (status) => ({
    display: "inline-block", padding: "2px 8px", borderRadius: "9999px",
    fontSize: "0.7rem", fontWeight: 600,
    backgroundColor: status === "success" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
    color:           status === "success" ? "#10b981"               : "#ef4444",
    border: `1px solid ${status === "success" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
  }),

  overlay: {
    position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(4px)", zIndex: 1000,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  modal: {
    backgroundColor: "#1e293b", borderRadius: "16px", padding: "2rem",
    width: "100%", maxWidth: "420px", border: "1px solid #334155",
    boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
  },
  modalTitle:  { margin: "0 0 0.75rem 0", fontSize: "1.1rem", fontWeight: 700, color: "#f1f5f9" },
  modalText:   { color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.6, margin: "0 0 1.5rem 0" },
  modalFooter: { display: "flex", gap: "10px", justifyContent: "flex-end" },

  warningBox: {
    padding: "12px 16px", backgroundColor: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px",
    fontSize: "0.82rem", color: "#fca5a5", marginBottom: "1.25rem", lineHeight: 1.5,
  },
  infoBox: {
    padding: "12px 16px", backgroundColor: "rgba(59,130,246,0.08)",
    border: "1px solid rgba(59,130,246,0.2)", borderRadius: "8px",
    fontSize: "0.82rem", color: "#93c5fd", marginBottom: "1.25rem", lineHeight: 1.5,
  },
};

// ── Component ─────────────────────────────────────────────────────────────────
function DatabaseMaintenance() {
  const [health, setHealth]       = useState(null);
  const [stats, setStats]         = useState(null);
  const [backups, setBackups]     = useState([]);
  const [logs, setLogs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [toast, setToast]         = useState(null);

  // Action states
  const [isBackingUp, setIsBackingUp]     = useState(false);
  const [isRestoring, setIsRestoring]     = useState(false);
  const [isPurging, setIsPurging]         = useState(false);
  const [purgeDays, setPurgeDays]         = useState(90);

  // Confirm modal
  const [confirmModal, setConfirmModal] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // ── Fetch all data ──────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [healthRes, statsRes, backupsRes, logsRes] = await Promise.all([
        axios.get(`${API_BASE}/api/maintenance/health`,  getAuthHeader()),
        axios.get(`${API_BASE}/api/maintenance/stats`,   getAuthHeader()),
        axios.get(`${API_BASE}/api/maintenance/backups`, getAuthHeader()),
        axios.get(`${API_BASE}/api/maintenance/logs`,    getAuthHeader()),
      ]);
      setHealth(healthRes.data);
      setStats(statsRes.data.stats);
      setBackups(backupsRes.data.backups);
      setLogs(logsRes.data.logs);
    } catch (err) {
      showToast(err.response?.data?.detail || "Failed to load maintenance data", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Backup ──────────────────────────────────────────────────────────────────
  const handleBackup = async () => {
    setIsBackingUp(true);
    try {
      const res = await axios.post(`${API_BASE}/api/maintenance/backup`, {}, getAuthHeader());
      showToast(`Backup created: ${res.data.filename} (${res.data.documents} docs, ${res.data.size_kb} KB)`);
      fetchAll();
    } catch (err) {
      showToast(err.response?.data?.detail || "Backup failed", "error");
    } finally {
      setIsBackingUp(false);
    }
  };

  // ── Restore ─────────────────────────────────────────────────────────────────
  const handleRestore = async (filename) => {
    setIsRestoring(true);
    try {
      const res = await axios.post(`${API_BASE}/api/maintenance/restore`, { filename }, getAuthHeader());
      showToast(`Restore verified — ${filename} restored to test collections successfully`);
      fetchAll();
    } catch (err) {
      showToast(err.response?.data?.detail || "Restore failed", "error");
    } finally {
      setIsRestoring(false);
      setConfirmModal(null);
    }
  };

  // ── Purge ───────────────────────────────────────────────────────────────────
  const handlePurge = async () => {
    setIsPurging(true);
    try {
      const res = await axios.delete(`${API_BASE}/api/maintenance/alerts/old`, {
        ...getAuthHeader(),
        data: { days: purgeDays },
      });
      showToast(`Purged ${res.data.deleted} alert(s) older than ${purgeDays} days`);
      fetchAll();
    } catch (err) {
      showToast(err.response?.data?.detail || "Purge failed", "error");
    } finally {
      setIsPurging(false);
      setConfirmModal(null);
    }
  };

  const formatDate = (iso) => {
    try { return new Date(iso).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }); }
    catch { return iso; }
  };

  if (loading) return (
    <div style={{ ...s.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#64748b" }}>Loading maintenance data...</div>
    </div>
  );

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={s.page}>

      {/* Toast */}
      {toast && (
        <div style={s.toast(toast.type)}>
          <span>{toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "ℹ"}</span>
          {toast.message}
        </div>
      )}

      {/* Confirm Modal */}
      {confirmModal && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <h2 style={s.modalTitle}>{confirmModal.title}</h2>
            {confirmModal.warning && <div style={s.warningBox}>⚠ {confirmModal.warning}</div>}
            <p style={s.modalText}>{confirmModal.message}</p>
            <div style={s.modalFooter}>
              <button style={s.btn("secondary")} onClick={() => setConfirmModal(null)}>Cancel</button>
              <button
                style={s.btn(confirmModal.variant || "danger")}
                onClick={confirmModal.onConfirm}
              >
                {confirmModal.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <h1 style={s.pageTitle}>Database Maintenance</h1>
      <p style={s.subtitle}>Monitor health, manage backups, and perform housekeeping tasks</p>

      {/* ── Health Indicators ─────────────────────────────────────────────── */}
      <p style={s.sectionLabel}>System Health</p>
      <div style={{ ...s.card, marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#f1f5f9" }}>Current Status</span>
          <button style={s.btn("secondary")} onClick={fetchAll}>↻ Refresh</button>
        </div>

        <div style={s.statusRow}>
          <span style={s.statusLabel}>Database Connection</span>
          <span>
            <span style={s.dot(health?.db_connected)} />
            <span style={s.statusValue(health?.db_connected)}>
              {health?.db_connected ? "Connected" : "Disconnected"}
            </span>
          </span>
        </div>
        <div style={s.statusRow}>
          <span style={s.statusLabel}>Total Documents</span>
          <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "#f1f5f9" }}>
            {health?.total_documents?.toLocaleString() ?? "—"}
          </span>
        </div>
        <div style={s.statusRow}>
          <span style={s.statusLabel}>Backups Available</span>
          <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "#f1f5f9" }}>
            {health?.backup_count ?? 0}
          </span>
        </div>
        <div style={{ ...s.statusRow, borderBottom: "none" }}>
          <span style={s.statusLabel}>Latest Backup</span>
          <span style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
            {health?.latest_backup ?? "No backups yet"}
          </span>
        </div>
      </div>

      {/* ── Collection Stats ──────────────────────────────────────────────── */}
      <p style={s.sectionLabel}>Collection Statistics</p>
      <div style={s.grid3}>
        <div style={s.statCard("#3b82f6")}>
          <div style={s.statLabel}>Users</div>
          <div style={s.statValue("#3b82f6")}>{stats?.users?.count ?? 0}</div>
          <div style={s.statSub}>Registered accounts</div>
        </div>
        <div style={s.statCard("#8b5cf6")}>
          <div style={s.statLabel}>Log Sources</div>
          <div style={s.statValue("#8b5cf6")}>{stats?.logs?.count ?? 0}</div>
          <div style={s.statSub}>Configured IDS connections</div>
        </div>
        <div style={s.statCard("#f97316")}>
          <div style={s.statLabel}>Total Alerts</div>
          <div style={s.statValue("#f97316")}>{stats?.alerts?.count ?? 0}</div>
          <div style={s.statSub}>
            {stats?.alerts
              ? `High: ${stats.alerts.high}  Med: ${stats.alerts.medium}  Low: ${stats.alerts.low}`
              : "—"
            }
          </div>
        </div>
      </div>

      {/* Alert status breakdown */}
      {stats?.alerts && (
        <div style={{ ...s.grid3, marginBottom: "28px" }}>
          <div style={s.statCard("#ef4444")}>
            <div style={s.statLabel}>New Alerts</div>
            <div style={s.statValue("#ef4444")}>{stats.alerts.new}</div>
            <div style={s.statSub}>Awaiting review</div>
          </div>
          <div style={s.statCard("#eab308")}>
            <div style={s.statLabel}>Investigating</div>
            <div style={s.statValue("#eab308")}>{stats.alerts.investigating}</div>
            <div style={s.statSub}>Under investigation</div>
          </div>
          <div style={s.statCard("#10b981")}>
            <div style={s.statLabel}>Resolved</div>
            <div style={s.statValue("#10b981")}>{stats.alerts.resolved}</div>
            <div style={s.statSub}>Closed alerts</div>
          </div>
        </div>
      )}

      {/* ── Backup & Restore ──────────────────────────────────────────────── */}
      <p style={s.sectionLabel}>Backup & Restore</p>
      <div style={{ ...s.card, marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "1.25rem" }}>
          <div>
            <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#f1f5f9", marginBottom: "4px" }}>Create Backup</div>
            <div style={{ fontSize: "0.82rem", color: "#64748b" }}>
              Exports all collections (users, logs, alerts) to a compressed backup file stored on the server.
            </div>
          </div>
          <button
            style={{ ...s.btn("success"), ...(isBackingUp ? s.btnDisabled : {}) }}
            onClick={handleBackup}
            disabled={isBackingUp}
          >
            {isBackingUp ? "⏳ Backing up…" : "⬇ Run Backup"}
          </button>
        </div>

        <div style={s.infoBox}>
          ℹ Restore verifies recoverability by loading a backup into test collections (restore_test_*). Live data is never overwritten.
        </div>

        {backups.length === 0 ? (
          <div style={{ color: "#475569", textAlign: "center", padding: "24px", fontSize: "0.88rem" }}>
            No backups found. Run a backup to get started.
          </div>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Filename</th>
                <th style={s.th}>Size</th>
                <th style={s.th}>Created</th>
                <th style={s.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {backups.map((b) => (
                <tr key={b.filename} style={s.tr}>
                  <td style={{ ...s.td, fontFamily: "monospace", fontSize: "0.8rem", color: "#94a3b8" }}>{b.filename}</td>
                  <td style={s.td}>{b.size_kb} KB</td>
                  <td style={s.td}>{formatDate(b.created_at)}</td>
                  <td style={s.td}>
                    <button
                      style={{ ...s.btn("primary"), fontSize: "0.78rem", padding: "4px 12px", ...(isRestoring ? s.btnDisabled : {}) }}
                      disabled={isRestoring}
                      onClick={() => setConfirmModal({
                        title:        "Verify Backup Restore",
                        message:      `This will load "${b.filename}" into test collections to verify recoverability. Your live data will not be affected.`,
                        warning:      null,
                        confirmLabel: "Verify Restore",
                        variant:      "primary",
                        onConfirm:    () => handleRestore(b.filename),
                      })}
                    >
                      ↺ Verify Restore
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Housekeeping ──────────────────────────────────────────────────── */}
      <p style={s.sectionLabel}>Housekeeping</p>
      <div style={{ ...s.card, marginBottom: "24px" }}>
        <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#f1f5f9", marginBottom: "4px" }}>
          Purge Old Alerts
        </div>
        <div style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "1.25rem" }}>
          Permanently delete alerts older than a specified number of days to keep the database performant.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.88rem", color: "#94a3b8" }}>Delete alerts older than</span>
          <input
            type="number"
            min="1"
            max="3650"
            value={purgeDays}
            onChange={(e) => setPurgeDays(Number(e.target.value))}
            style={s.input}
          />
          <span style={{ fontSize: "0.88rem", color: "#94a3b8" }}>days</span>
          <button
            style={{ ...s.btn("danger"), ...(isPurging ? s.btnDisabled : {}) }}
            disabled={isPurging}
            onClick={() => setConfirmModal({
              title:        "Confirm Alert Purge",
              message:      `This will permanently delete all alerts older than ${purgeDays} days. This action cannot be undone.`,
              warning:      "We strongly recommend running a backup before purging data.",
              confirmLabel: "Purge Alerts",
              variant:      "danger",
              onConfirm:    handlePurge,
            })}
          >
            {isPurging ? "⏳ Purging…" : "🗑 Purge Old Alerts"}
          </button>
        </div>
      </div>

      {/* ── Maintenance Logs ──────────────────────────────────────────────── */}
      <p style={s.sectionLabel}>Maintenance Activity Log</p>
      <div style={s.card}>
        {logs.length === 0 ? (
          <div style={{ color: "#475569", textAlign: "center", padding: "24px", fontSize: "0.88rem" }}>
            No maintenance activity recorded yet.
          </div>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Time</th>
                <th style={s.th}>Action</th>
                <th style={s.th}>Detail</th>
                <th style={s.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={i} style={s.tr}>
                  <td style={{ ...s.td, fontSize: "0.78rem", color: "#64748b" }}>{formatDate(log.timestamp)}</td>
                  <td style={{ ...s.td, textTransform: "capitalize", fontWeight: 600 }}>{log.action}</td>
                  <td style={{ ...s.td, color: "#94a3b8", fontSize: "0.82rem" }}>{log.detail}</td>
                  <td style={s.td}><span style={s.logBadge(log.status)}>{log.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default DatabaseMaintenance;