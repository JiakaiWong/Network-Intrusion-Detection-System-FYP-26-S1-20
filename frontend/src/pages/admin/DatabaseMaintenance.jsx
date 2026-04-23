  import React, { useState, useEffect, useCallback, useMemo } from "react";
  import axios from "axios";
  import { useTheme } from "../../contexts/ThemeContext";

  const API_BASE = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000";

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  // ── Theme Configuration ──────────────────────────────────────────────────────
  const themes = {
    dark: {
      bgPage: "#0f172a",
      bgCard: "#1e293b",
      bgInput: "#0f172a",
      textMain: "#f1f5f9",
      textMuted: "#64748b",
      textDim: "#94a3b8",
      border: "#334155",
      borderLight: "#1e293b",
      shadow: "rgba(0,0,0,0.4)",
    },
    light: {
      bgPage: "#f8fafc",
      bgCard: "#ffffff",
      bgInput: "#f1f5f9",
      textMain: "#1e293b",
      textMuted: "#64748b",
      textDim: "#475569",
      border: "#e2e8f0",
      borderLight: "#f1f5f9",
      shadow: "rgba(0,0,0,0.05)",
    },
  };

  // ── Dynamic Style Generator ──────────────────────────────────────────────────
  const getStyles = (mode) => {
    const c = themes[mode];
    return {
      page: {
        flex: 1, padding: "2rem",
        backgroundColor: c.bgPage, color: c.textMain,
        overflowY: "auto", height: "100vh", boxSizing: "border-box",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        transition: "background-color 0.2s, color 0.2s",
      },
      toast: (type) => ({
        position: "fixed", top: "1.5rem", right: "1.5rem", zIndex: 9999,
        display: "flex", alignItems: "center", gap: "0.6rem",
        padding: "0.75rem 1.25rem", borderRadius: "10px",
        fontSize: "0.9rem", fontWeight: 500,
        backgroundColor: type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#3b82f6",
        color: "#fff", boxShadow: `0 8px 24px ${c.shadow}`,
      }),
      pageTitle: { fontSize: "2rem", fontWeight: 700, margin: "0 0 0.25rem 0" },
      subtitle: { fontSize: "0.9rem", color: c.textMuted, margin: "0 0 2rem 0" },
      sectionLabel: {
        fontSize: "0.72rem", fontWeight: 700, color: c.textMuted,
        textTransform: "uppercase", letterSpacing: "0.08em", margin: "2rem 0 1rem 0",
      },
      grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "24px" },
      card: {
        backgroundColor: c.bgCard, border: `1px solid ${c.border}`,
        borderRadius: "12px", padding: "1.5rem", transition: "background-color 0.2s",
        boxShadow: mode === 'light' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
      },
      statCard: (color) => ({
        backgroundColor: c.bgCard, border: `1px solid ${color}30`,
        borderRadius: "12px", padding: "1.25rem",
        borderLeft: `4px solid ${color}`,
      }),
      statLabel: { fontSize: "0.75rem", color: c.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" },
      statValue: (color) => ({ fontSize: "1.8rem", fontWeight: 700, color: color || c.textMain, lineHeight: 1 }),
      statSub: { fontSize: "0.75rem", color: c.textDim, marginTop: "4px" },

      dot: (ok) => ({
        display: "inline-block", width: "10px", height: "10px", borderRadius: "50%",
        backgroundColor: ok ? "#10b981" : "#ef4444",
        boxShadow: ok ? "0 0 6px #10b981" : "none",
        marginRight: "8px",
      }),
      statusRow: {
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 0", borderBottom: `1px solid ${c.borderLight}`,
      },
      statusLabel: { fontSize: "0.88rem", color: c.textDim },
      statusValue: (ok) => ({ fontSize: "0.88rem", fontWeight: 600, color: ok ? "#10b981" : "#ef4444" }),

      btn: (variant) => ({
        padding: "0.65rem 1.25rem", borderRadius: "8px", border: "none",
        fontSize: "0.88rem", fontWeight: 600, cursor: "pointer",
        display: "inline-flex", alignItems: "center", gap: "6px",
        backgroundColor:
          variant === "primary" ? "#3b82f6" :
          variant === "success" ? "#10b981" :
          variant === "danger"  ? "#ef4444" :
          variant === "warning" ? "#f97316" :
          mode === "light" ? "#e2e8f0" : "#334155",
        color: (variant || mode === "dark") ? "white" : "#1e293b",
      }),
      btnDisabled: { opacity: 0.5, cursor: "not-allowed" },

      input: {
        padding: "0.6rem 0.9rem", backgroundColor: c.bgInput,
        border: `1px solid ${c.border}`, borderRadius: "8px",
        color: c.textMain, fontSize: "0.9rem", width: "80px",
      },
      table: { width: "100%", borderCollapse: "collapse" },
      th: { padding: "0.7rem 1rem", textAlign: "left", color: c.textMuted, fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", borderBottom: `1px solid ${c.border}` },
      tr: { borderBottom: `1px solid ${c.borderLight}` },
      td: { padding: "0.8rem 1rem", fontSize: "0.85rem", color: c.textMain },

      logBadge: (status) => ({
        display: "inline-block", padding: "2px 8px", borderRadius: "9999px",
        fontSize: "0.7rem", fontWeight: 600,
        backgroundColor: status === "success" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
        color: status === "success" ? "#10b981" : "#ef4444",
        border: `1px solid ${status === "success" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
      }),

      overlay: {
        position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)", zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
      },
      modal: {
        backgroundColor: c.bgCard, borderRadius: "16px", padding: "2rem",
        width: "100%", maxWidth: "420px", border: `1px solid ${c.border}`,
        boxShadow: `0 25px 60px rgba(0,0,0,0.3)`,
      },
      modalTitle: { margin: "0 0 0.75rem 0", fontSize: "1.1rem", fontWeight: 700, color: c.textMain },
      modalText: { color: c.textDim, fontSize: "0.88rem", lineHeight: 1.6, margin: "0 0 1.5rem 0" },
      modalFooter: { display: "flex", gap: "10px", justifyContent: "flex-end" },

      warningBox: {
        padding: "12px 16px", backgroundColor: "rgba(239,68,68,0.08)",
        border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px",
        fontSize: "0.82rem", color: "#ef4444", marginBottom: "1.25rem", lineHeight: 1.5,
      },
      infoBox: {
        padding: "12px 16px", backgroundColor: "rgba(59,130,246,0.08)",
        border: "1px solid rgba(59,130,246,0.2)", borderRadius: "8px",
        fontSize: "0.82rem", color: "#3b82f6", marginBottom: "1.25rem", lineHeight: 1.5,
      },
    };
  };

  // ── Component ─────────────────────────────────────────────────────────────────
  function DatabaseMaintenance() {
    const { theme } = useTheme();
    const s = useMemo(() => getStyles(theme), [theme]);

    const [health, setHealth]       = useState(null);
    const [stats, setStats]         = useState(null);
    const [backups, setBackups]     = useState([]);
    const [logs, setLogs]           = useState([]);
    const [loading, setLoading]     = useState(true);
    const [toast, setToast]         = useState(null);

    const [isBackingUp, setIsBackingUp]     = useState(false);
    const [isRestoring, setIsRestoring]     = useState(false);
    const [isPurging, setIsPurging]         = useState(false);
    const [purgeDays, setPurgeDays]         = useState(90);
    const [confirmModal, setConfirmModal]   = useState(null);

    const showToast = useCallback((message, type = "success") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 4000);
    }, []);

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
        showToast(err.response?.data?.detail || "Failed to load data", "error");
      } finally {
        setLoading(false);
      }
    }, [showToast]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const handleBackup = async () => {
      setIsBackingUp(true);
      try {
        const res = await axios.post(`${API_BASE}/api/maintenance/backup`, {}, getAuthHeader());
        showToast(`Backup created: ${res.data.filename}`);
        fetchAll();
      } catch (err) {
        showToast(err.response?.data?.detail || "Backup failed", "error");
      } finally {
        setIsBackingUp(false);
      }
    };

    const handleRestore = async (filename) => {
      setIsRestoring(true);
      try {
        await axios.post(`${API_BASE}/api/maintenance/restore`, { filename }, getAuthHeader());
        showToast(`Restore verified successfully`);
        fetchAll();
      } catch (err) {
        showToast(err.response?.data?.detail || "Restore failed", "error");
      } finally {
        setIsRestoring(false);
        setConfirmModal(null);
      }
    };

    const handlePurge = async () => {
      setIsPurging(true);
      try {
        const res = await axios.delete(`${API_BASE}/api/maintenance/alerts/old`, {
          ...getAuthHeader(),
          data: { days: purgeDays },
        });
        showToast(`Purged ${res.data.deleted} alert(s)`);
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
        <div style={{ color: themes[theme].textMuted }}>Loading maintenance data...</div>
      </div>
    );

    return (
      <div style={s.page}>
        {toast && (
          <div style={s.toast(toast.type)}>
            <span>{toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "ℹ"}</span>
            {toast.message}
          </div>
        )}

        {confirmModal && (
          <div style={s.overlay}>
            <div style={s.modal}>
              <h2 style={s.modalTitle}>{confirmModal.title}</h2>
              {confirmModal.warning && <div style={s.warningBox}>⚠ {confirmModal.warning}</div>}
              <p style={s.modalText}>{confirmModal.message}</p>
              <div style={s.modalFooter}>
                <button style={s.btn()} onClick={() => setConfirmModal(null)}>Cancel</button>
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

        <h1 style={s.pageTitle}>Database Maintenance</h1>
        <p style={s.subtitle}>Monitor health, manage backups, and perform housekeeping tasks</p>

        <p style={s.sectionLabel}>System Health</p>
        <div style={{ ...s.card, marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>Current Status</span>
            <button style={s.btn()} onClick={fetchAll}>↻ Refresh</button>
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
            <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>
              {health?.total_documents?.toLocaleString() ?? "—"}
            </span>
          </div>
          <div style={s.statusRow}>
            <span style={s.statusLabel}>Backups Available</span>
            <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>
              {health?.backup_count ?? 0}
            </span>
          </div>
          <div style={{ ...s.statusRow, borderBottom: "none" }}>
            <span style={s.statusLabel}>Latest Backup</span>
            <span style={{ fontSize: "0.82rem", color: themes[theme].textDim }}>
              {health?.latest_backup ?? "No backups yet"}
            </span>
          </div>
        </div>

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
            <div style={s.statSub}>IDS connections</div>
          </div>
          <div style={s.statCard("#f97316")}>
            <div style={s.statLabel}>Total Alerts</div>
            <div style={s.statValue("#f97316")}>{stats?.alerts?.count ?? 0}</div>
            <div style={s.statSub}>
              {stats?.alerts ? `H: ${stats.alerts.high} M: ${stats.alerts.medium} L: ${stats.alerts.low}` : "—"}
            </div>
          </div>
        </div>

        <p style={s.sectionLabel}>Backup & Restore</p>
        <div style={{ ...s.card, marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "1.25rem" }}>
            <div>
              <div style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "4px" }}>Create Backup</div>
              <div style={{ fontSize: "0.82rem", color: themes[theme].textMuted }}>
                Exports all collections to a compressed backup file stored on the server.
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
            ℹ Restore verifies recoverability by loading into test collections. Live data is never overwritten.
          </div>

          {backups.length === 0 ? (
            <div style={{ color: themes[theme].textMuted, textAlign: "center", padding: "24px", fontSize: "0.88rem" }}>
              No backups found.
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
                    <td style={{ ...s.td, fontFamily: "monospace", fontSize: "0.8rem", color: themes[theme].textDim }}>{b.filename}</td>
                    <td style={s.td}>{b.size_kb} KB</td>
                    <td style={s.td}>{formatDate(b.created_at)}</td>
                    <td style={s.td}>
                      <button
                        style={{ ...s.btn("primary"), fontSize: "0.78rem", padding: "4px 12px", ...(isRestoring ? s.btnDisabled : {}) }}
                        disabled={isRestoring}
                        onClick={() => setConfirmModal({
                          title: "Verify Backup Restore",
                          message: `Verify "${b.filename}" in test environment?`,
                          confirmLabel: "Verify Restore",
                          variant: "primary",
                          onConfirm: () => handleRestore(b.filename),
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

        <p style={s.sectionLabel}>Housekeeping</p>
        <div style={{ ...s.card, marginBottom: "24px" }}>
          <div style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "4px" }}>Purge Old Alerts</div>
          <div style={{ fontSize: "0.82rem", color: themes[theme].textMuted, marginBottom: "1.25rem" }}>
            Permanently delete alerts older than a specified number of days.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.88rem" }}>Delete alerts older than</span>
            <input
              type="number"
              value={purgeDays}
              onChange={(e) => setPurgeDays(Number(e.target.value))}
              style={s.input}
            />
            <span style={{ fontSize: "0.88rem" }}>days</span>
            <button
              style={{ ...s.btn("danger"), ...(isPurging ? s.btnDisabled : {}) }}
              disabled={isPurging}
              onClick={() => setConfirmModal({
                title: "Confirm Alert Purge",
                message: `Permanently delete alerts older than ${purgeDays} days?`,
                warning: "Action cannot be undone. Backup recommended.",
                confirmLabel: "Purge Alerts",
                variant: "danger",
                onConfirm: handlePurge,
              })}
            >
              {isPurging ? "⏳ Purging…" : "🗑 Purge Old Alerts"}
            </button>
          </div>
        </div>

        <p style={s.sectionLabel}>Maintenance Activity Log</p>
        <div style={s.card}>
          {logs.length === 0 ? (
            <div style={{ color: themes[theme].textMuted, textAlign: "center", padding: "24px", fontSize: "0.88rem" }}>
              No logs recorded.
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
                    <td style={{ ...s.td, fontSize: "0.78rem", color: themes[theme].textMuted }}>{formatDate(log.timestamp)}</td>
                    <td style={{ ...s.td, textTransform: "capitalize", fontWeight: 600 }}>{log.action}</td>
                    <td style={{ ...s.td, color: themes[theme].textDim, fontSize: "0.82rem" }}>{log.detail}</td>
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