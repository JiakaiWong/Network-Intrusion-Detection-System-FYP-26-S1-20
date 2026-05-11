import { useEffect, useMemo, useState } from "react";
import { getAlerts } from "../../services/api";
import './analyst.css';

function Reports() {
  /* ── Live alert data from API ──────────────────────────────── */
  const [liveAlerts, setLiveAlerts] = useState([]);

  useEffect(() => {
    getAlerts()
      .then((data) => {
        const items = Array.isArray(data) ? data : (data.items ?? data.alerts ?? []);
        setLiveAlerts(items);
      })
      .catch(() => {});
  }, []);

  /* ── Generate-form state ───────────────────────────────────── */
  const [from, setFrom] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  });
  const [to, setTo]         = useState(() => new Date().toISOString().slice(0, 10));
  const [severity, setSeverity]   = useState("HIGH_ONLY");
  const [format, setFormat]       = useState("PDF");
  const [idsSource, setIdsSource] = useState("ALL");

  /* ── History table ─────────────────────────────────────────── */
  const [reports, setReports] = useState([]);

  /* ── Table filters ─────────────────────────────────────────── */
  const [filterScope,  setFilterScope]  = useState("ALL");
  const [filterFormat, setFilterFormat] = useState("ALL");

  /* ── Derived ───────────────────────────────────────────────── */
  const severityLabel = useMemo(() => {
    if (severity === "HIGH_ONLY") return "High Only";
    if (severity === "HIGH_MED")  return "Medium & High";
    return "All";
  }, [severity]);

  const isRangeValid = useMemo(() => {
    try { return new Date(from).getTime() <= new Date(to).getTime(); }
    catch { return false; }
  }, [from, to]);

  /* Filter alerts by date range + severity + IDS source */
  const filterAlerts = (alerts, scope, srcFilter, fromDate, toDate) => {
    const start = new Date(fromDate);
    const end   = new Date(toDate); end.setHours(23, 59, 59, 999);

    return alerts.filter((a) => {
      // Date range
      if (a.timestamp) {
        const t = new Date(a.timestamp);
        if (t < start || t > end) return false;
      }
      // Severity scope
      const sev = (a.severity_label || '').toLowerCase();
      if (scope === "High Only"     && sev !== 'high') return false;
      if (scope === "Medium & High" && !['high','medium'].includes(sev)) return false;
      // IDS source (best-effort on proto/ids field)
      if (srcFilter !== "ALL" && a.proto !== srcFilter && a.ids !== srcFilter) return false;
      return true;
    });
  };

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const scopeMatch  = filterScope  === "ALL" || r.scope  === filterScope;
      const fmtMatch    = filterFormat === "ALL" || r.format === filterFormat;
      return scopeMatch && fmtMatch;
    });
  }, [reports, filterScope, filterFormat]);

  /* ── Generate — filter, download, log ─────────────────────── */
  const generate = () => {
    if (!isRangeValid) return;

    const scopedAlerts = filterAlerts(liveAlerts, severityLabel, idsSource, from, to);
    const by = idsSource === "ALL" ? "All Sources" : idsSource;
    const generatedAt = new Date().toLocaleDateString();

    const newReport = {
      id: `RPT-${String(reports.length + 1).padStart(3, '0')}`,
      generatedAt,
      dateFrom: from,
      dateTo: to,
      scope: severityLabel,
      by,
      format,
      alertCount: scopedAlerts.length,
    };

    // Download immediately
    if (format === "CSV") {
      triggerCSV(newReport, scopedAlerts);
    } else {
      triggerPDF(newReport, scopedAlerts);
    }

    // Log to history
    setReports((prev) => [newReport, ...prev]);
  };

  const resetForm = () => {
    const d = new Date(); d.setDate(d.getDate() - 30);
    setFrom(d.toISOString().slice(0, 10));
    setTo(new Date().toISOString().slice(0, 10));
    setSeverity("HIGH_ONLY");
    setFormat("PDF");
    setIdsSource("ALL");
  };

  /* ── Download helpers ──────────────────────────────────────── */
  const downloadRow = (r) => {
    const scopedAlerts = filterAlerts(liveAlerts, r.scope, r.by === "All Sources" ? "ALL" : r.by, r.dateFrom, r.dateTo);
    if (r.format === "CSV") triggerCSV(r, scopedAlerts);
    else triggerPDF(r, scopedAlerts);
  };

  const triggerCSV = (report, alerts) => {
    const headers = ["Alert ID", "Severity", "Signature", "Source IP", "Destination IP", "Port", "Status", "Timestamp"];
    const dataRows = alerts.length > 0
      ? alerts.map((a) => [
          a.id ?? "", a.severity_label ?? "", a.signature ?? "",
          a.src_ip ?? "", a.dest_ip ?? "", a.dest_port ?? "",
          a.status ?? "", a.timestamp ?? "",
        ])
      : [["No alerts matched the selected filters", "", "", "", "", "", "", ""]];

    const csvContent = [
      `# Report: ${report.id} | Generated: ${report.generatedAt} | Period: ${report.dateFrom} to ${report.dateTo}`,
      `# Scope: ${report.scope} | Source: ${report.by} | Total matching alerts: ${alerts.length}`,
      "",
      headers.join(","),
      ...dataRows.map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob(["﻿" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${report.id}_${report.dateFrom}_${report.dateTo}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const triggerPDF = (report, alerts) => {
    const tableRows = alerts.map((a) => `
      <tr>
        <td>${a.severity_label ?? ""}</td>
        <td>${(a.signature ?? "").replace(/</g, "&lt;")}</td>
        <td style="font-family:monospace">${a.src_ip ?? ""}</td>
        <td style="font-family:monospace">${a.dest_ip ?? ""}</td>
        <td>${a.dest_port ?? ""}</td>
        <td>${a.status ?? ""}</td>
        <td>${a.timestamp ? new Date(a.timestamp).toLocaleString() : ""}</td>
      </tr>`).join("");

    const highCount = alerts.filter(a => (a.severity_label || '').toLowerCase() === 'high').length;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${report.id} - Security Report</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 2rem; color: #111; font-size: 13px; }
    h1 { font-size: 1.4rem; border-bottom: 2px solid #333; padding-bottom: 0.5rem; margin-bottom: 1rem; }
    .meta { display: flex; gap: 2rem; margin: 0.75rem 0 1rem; font-size: 0.88rem; color: #444; flex-wrap: wrap; }
    .stats { display: flex; gap: 1rem; margin: 1rem 0; }
    .stat { background: #f3f4f6; border-radius: 8px; padding: 0.75rem 1.5rem; text-align: center; min-width: 100px; }
    .stat-val { font-size: 1.8rem; font-weight: bold; color: #111; }
    .stat-val.red { color: #dc2626; }
    .stat-lbl { font-size: 0.7rem; color: #666; text-transform: uppercase; letter-spacing: 0.05em; }
    table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; font-size: 0.8rem; }
    th { background: #e5e7eb; text-align: left; padding: 0.5rem 0.75rem; }
    td { padding: 0.4rem 0.75rem; border-bottom: 1px solid #e5e7eb; }
    tr:nth-child(even) td { background: #f9fafb; }
    .empty { color: #888; font-style: italic; margin-top: 1rem; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <h1>Security Alert Report - ${report.id}</h1>
  <div class="meta">
    <span><strong>Generated:</strong> ${new Date().toLocaleString()}</span>
    <span><strong>Period:</strong> ${report.dateFrom} to ${report.dateTo}</span>
    <span><strong>Scope:</strong> ${report.scope}</span>
    <span><strong>IDS Source:</strong> ${report.by}</span>
  </div>
  <div class="stats">
    <div class="stat"><div class="stat-val">${alerts.length}</div><div class="stat-lbl">Matching Alerts</div></div>
    <div class="stat"><div class="stat-val red">${highCount}</div><div class="stat-lbl">High Severity</div></div>
  </div>
  ${alerts.length > 0 ? `
  <table>
    <thead>
      <tr><th>Severity</th><th>Signature</th><th>Src IP</th><th>Dst IP</th><th>Port</th><th>Status</th><th>Time</th></tr>
    </thead>
    <tbody>${tableRows}</tbody>
  </table>` : `<p class="empty">No alerts matched the selected filters for this period.</p>`}
  <script>window.onload = function(){ window.print(); }<\/script>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (win) win.focus();
    setTimeout(() => URL.revokeObjectURL(url), 15000);
  };

  /* ─────────────────────────────────────────────────────────── */
  return (
    <main className="dashboard-main">
      <div className="dashboard-status-bar">
        <h1 className="page-title">Reports</h1>
        <button className="view-btn" onClick={generate} disabled={!isRangeValid}>
          + Generate &amp; Download
        </button>
      </div>

      {/* ── Generate form ── */}
      <div className="card">
        <h2 className="section-title">Generate Report</h2>

        <div className="filters">
          {/* Date range */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label className="nav-section-title">Alert Date Range</label>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <input className="time-filter" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>to</span>
              <input className="time-filter" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            {!isRangeValid && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>End date must be after start date</span>}
          </div>

          {/* Severity */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label className="nav-section-title">Severity Scope</label>
            <select className="time-filter" value={severity} onChange={(e) => setSeverity(e.target.value)}>
              <option value="HIGH_ONLY">High Only</option>
              <option value="HIGH_MED">Medium &amp; High</option>
              <option value="ALL">All Severities</option>
            </select>
          </div>

          {/* IDS Source */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label className="nav-section-title">IDS Source</label>
            <select className="time-filter" value={idsSource} onChange={(e) => setIdsSource(e.target.value)}>
              <option value="ALL">All Sources</option>
              <option value="Suricata">Suricata</option>
              <option value="Snort">Snort</option>
              <option value="Zeek">Zeek</option>
            </select>
          </div>

          {/* Format */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label className="nav-section-title">Output Format</label>
            <select className="time-filter" value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="PDF">PDF</option>
              <option value="CSV">CSV</option>
            </select>
          </div>
        </div>

        {/* Form actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.75rem' }}>
          <button className="export-btn" onClick={resetForm}>Reset</button>
          <button className="view-btn" onClick={generate} disabled={!isRangeValid}>
            Generate &amp; Download
          </button>
        </div>
      </div>

      <div className="divider" />

      {/* ── History table ── */}
      <div className="recent-alerts-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h2 className="section-title" style={{ margin: 0 }}>
            Report History
            <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.85rem', marginLeft: '0.5rem' }}>
              ({filteredReports.length} of {reports.length})
            </span>
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <select className="time-filter" value={filterScope} onChange={(e) => setFilterScope(e.target.value)}>
              <option value="ALL">All Scopes</option>
              <option value="High Only">High Only</option>
              <option value="Medium & High">Medium &amp; High</option>
              <option value="All">All Severities</option>
            </select>
            <select className="time-filter" value={filterFormat} onChange={(e) => setFilterFormat(e.target.value)}>
              <option value="ALL">All Formats</option>
              <option value="PDF">PDF</option>
              <option value="CSV">CSV</option>
            </select>
            {(filterScope !== "ALL" || filterFormat !== "ALL") && (
              <button className="export-btn" onClick={() => { setFilterScope("ALL"); setFilterFormat("ALL"); }}>Clear</button>
            )}
          </div>
        </div>

        <div className="table-scroll">
          <table className="alerts-table">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Generated</th>
                <th>Period</th>
                <th>Scope</th>
                <th>Source</th>
                <th>Alerts</th>
                <th>Format</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-text">No reports generated yet. Use the form above to generate one.</td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-text">No reports match the current filters.</td>
                </tr>
              ) : (
                filteredReports.map((r) => (
                  <tr key={r.id}>
                    <td><span className="mono">{r.id}</span></td>
                    <td>{r.generatedAt}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.dateFrom} → {r.dateTo}</td>
                    <td>{r.scope}</td>
                    <td>{r.by}</td>
                    <td>{r.alertCount}</td>
                    <td><span className="tag">{r.format}</span></td>
                    <td>
                      <button className="export-btn" onClick={() => downloadRow(r)}>
                        ↓ {r.format}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default Reports;
