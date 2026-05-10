import { useMemo, useState } from "react";
import './analyst.css';

function Reports() {
  /* ── Generate-form state ─────────────────────────────────────── */
  const [from, setFrom] = useState("2024-04-01");
  const [to, setTo] = useState("2024-04-24");
  const [severity, setSeverity] = useState("HIGH_ONLY");
  const [includeAlerts, setIncludeAlerts] = useState(true);
  const [includeTimeline, setIncludeTimeline] = useState(true);
  const [includeEnrichment, setIncludeEnrichment] = useState(true);
  const [format, setFormat] = useState("PDF");
  const [idsSource, setIdsSource] = useState("ALL");

  /* ── Table filter state (separate from generate-form) ────────── */
  const [filterSource, setFilterSource] = useState("ALL");
  const [filterScope, setFilterScope] = useState("ALL");
  const [filterFormat, setFilterFormat] = useState("ALL");

  /* ── Reports list ────────────────────────────────────────────── */
  const [reports, setReports] = useState([
    { id: "RPT-001", date: "2024-04-01", scope: "High Only",     by: "Suricata", format: "PDF" },
    { id: "RPT-002", date: "2024-04-05", scope: "High Only",     by: "Suricata", format: "PDF" },
    { id: "RPT-003", date: "2024-04-10", scope: "Medium & High", by: "Zeek",     format: "CSV" },
    { id: "RPT-004", date: "2024-04-20", scope: "All",           by: "Snort",    format: "PDF" },
  ]);

  const [viewing, setViewing] = useState(null);

  /* ── Derived ─────────────────────────────────────────────────── */
  const severityLabel = useMemo(() => {
    if (severity === "HIGH_ONLY") return "High Only";
    if (severity === "HIGH_MED") return "Medium & High";
    return "All";
  }, [severity]);

  const isRangeValid = useMemo(() => {
    try { return new Date(from).getTime() <= new Date(to).getTime(); }
    catch { return false; }
  }, [from, to]);

  /* Filter the reports table */
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const sourceMatch = filterSource === "ALL" || r.by === filterSource;
      const scopeMatch  = filterScope  === "ALL" || r.scope === filterScope;
      const fmtMatch    = filterFormat === "ALL" || r.format === filterFormat;
      return sourceMatch && scopeMatch && fmtMatch;
    });
  }, [reports, filterSource, filterScope, filterFormat]);

  /* ── Handlers ────────────────────────────────────────────────── */
  const generate = () => {
    if (!isRangeValid) return;
    const next = String(reports.length + 1).padStart(3, '0');
    setReports((prev) => [
      {
        id: `RPT-${next}`,
        date: to,
        scope: severityLabel,
        by: idsSource === "ALL" ? "Mixed" : idsSource,
        format,
      },
      ...prev,
    ]);
  };

  const resetForm = () => {
    setFrom("2024-04-01");
    setTo("2024-04-24");
    setSeverity("HIGH_ONLY");
    setIncludeAlerts(true);
    setIncludeTimeline(true);
    setIncludeEnrichment(true);
    setFormat("PDF");
    setIdsSource("ALL");
  };

  const resetTableFilters = () => {
    setFilterSource("ALL");
    setFilterScope("ALL");
    setFilterFormat("ALL");
  };

  /* ─────────────────────────────────────────────────────────────── */
  return (
    <main className="dashboard-main">
      <div className="dashboard-status-bar">
        <h1 className="page-title">Reports</h1>
        <button className="view-btn" onClick={generate} disabled={!isRangeValid}>
          + Generate Report
        </button>
      </div>

      {/* ── Generate form ── */}
      <div className="card">
        <h2 className="section-title">Generate Report</h2>

        <div className="filters">
          {/* Date range */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label className="nav-section-title">Date Range</label>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <input className="time-filter" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>to</span>
              <input className="time-filter" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
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

        {/* Include checkboxes */}
        <div className="filters" style={{ marginTop: '0.5rem' }}>
          <label className="nav-section-title">Include</label>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <label className="checkItem">
              <input type="checkbox" checked={includeAlerts} onChange={(e) => setIncludeAlerts(e.target.checked)} />
              Alerts
            </label>
            <label className="checkItem">
              <input type="checkbox" checked={includeTimeline} onChange={(e) => setIncludeTimeline(e.target.checked)} />
              Timeline
            </label>
            <label className="checkItem">
              <input type="checkbox" checked={includeEnrichment} onChange={(e) => setIncludeEnrichment(e.target.checked)} />
              IP Enrichment
            </label>
          </div>
        </div>

        {/* Form actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.75rem' }}>
          <button className="export-btn" onClick={resetForm}>Reset</button>
          <button className="view-btn" onClick={generate} disabled={!isRangeValid}>
            Generate Report
          </button>
        </div>
      </div>

      <div className="divider" />

      {/* ── Reports table ── */}
      <div className="recent-alerts-section">
        {/* Table header + filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h2 className="section-title" style={{ margin: 0 }}>
            Generated Reports
            <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.85rem', marginLeft: '0.5rem' }}>
              ({filteredReports.length} of {reports.length})
            </span>
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <select className="time-filter" value={filterSource} onChange={(e) => setFilterSource(e.target.value)}>
              <option value="ALL">All Sources</option>
              <option value="Suricata">Suricata</option>
              <option value="Snort">Snort</option>
              <option value="Zeek">Zeek</option>
              <option value="Mixed">Mixed</option>
            </select>
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
            {(filterSource !== "ALL" || filterScope !== "ALL" || filterFormat !== "ALL") && (
              <button className="export-btn" onClick={resetTableFilters}>Clear</button>
            )}
          </div>
        </div>

        <div className="table-scroll">
          <table className="alerts-table">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Date</th>
                <th>Scope</th>
                <th>Source</th>
                <th>Format</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-text">No reports match the current filters.</td>
                </tr>
              ) : (
                filteredReports.map((r) => (
                  <tr key={r.id}>
                    <td><span className="mono">{r.id}</span></td>
                    <td>{r.date}</td>
                    <td>{r.scope}</td>
                    <td>{r.by}</td>
                    <td><span className="tag">{r.format}</span></td>
                    <td>
                      <button className="view-btn" onClick={() => setViewing(r)}>View</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── View modal ── */}
      {viewing && (
        <div className="modal-overlay" onClick={() => setViewing(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="modal-title">Report Viewer — {viewing.id}</div>
                <div className="text-muted">{viewing.scope} · {viewing.by} · {viewing.format}</div>
              </div>
              <button className="back-icon" onClick={() => setViewing(null)} aria-label="Close">×</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="card card-total">
                  <div className="text-muted">Total Alerts</div>
                  <div className="card-value">1,245</div>
                </div>
                <div className="card card-high">
                  <div className="text-muted">High Severity</div>
                  <div className="card-value">12</div>
                </div>
              </div>
              <textarea className="note-input" defaultValue="Analyst summary notes here..." />
            </div>
            <div className="modal-footer">
              <button className="modal-cancel" onClick={() => setViewing(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Reports;
