import { useMemo, useState } from "react";
import './analyst.css';

function Reports() {
  const [from, setFrom] = useState("2024-04-01");
  const [to, setTo] = useState("2024-04-24");
  const [severity, setSeverity] = useState("HIGH_ONLY");
  const [includeAlerts, setIncludeAlerts] = useState(true);
  const [includeTimeline, setIncludeTimeline] = useState(true);
  const [includeEnrichment, setIncludeEnrichment] = useState(true);
  const [format, setFormat] = useState("PDF");
  const [idsSource, setIdsSource] = useState("ALL");

  const [reports, setReports] = useState([
    { id: "RPT-001", date: "2024-04-01", scope: "High Only", by: "Suricata", format: "PDF" },
    { id: "RPT-002", date: "2024-04-05", scope: "High Only", by: "Suricata", format: "PDF" },
    { id: "RPT-003", date: "2024-04-10", scope: "Medium & High", by: "Zeek", format: "CSV" },
    { id: "RPT-004", date: "2024-04-20", scope: "All", by: "Snort", format: "PDF" },
  ]);

  const [viewing, setViewing] = useState(null);

  const severityLabel = useMemo(() => {
    if (severity === "HIGH_ONLY") return "High Only";
    if (severity === "HIGH_MED") return "Medium & High";
    return "All";
  }, [severity]);

  const isRangeValid = useMemo(() => {
    try {
      return new Date(from).getTime() <= new Date(to).getTime();
    } catch { return false; }
  }, [from, to]);

  const generate = () => {
    if (!isRangeValid) return;
    const next = String(reports.length + 1).padStart(3, '0');
    const id = `RPT-${next}`;
    setReports((prev) => [
      { id, date: to, scope: severityLabel, by: idsSource === "ALL" ? "Mixed" : idsSource, format },
      ...prev,
    ]);
  };

  const reset = () => {
    setFrom("2024-04-01"); 
    setTo("2024-04-24"); 
    setSeverity("HIGH_ONLY");
    setIncludeAlerts(true); 
    setIncludeTimeline(true); 
    setIncludeEnrichment(true);
    setFormat("PDF"); 
    setIdsSource("ALL"); 
    setViewing(null);
  };

  return (
    <main className="dashboard-main">
      <div className="dashboard-status-bar">
        <h1 className="page-title">Reports</h1>
        <button className="view-btn" onClick={generate} disabled={!isRangeValid}>
          Generate New Report
        </button>
      </div>

      <div className="card">
        <h2 className="section-title">Generate Report</h2>

        <div className="filters">
          <div className="field">
            <label className="nav-section-title">Date Range</label>
            <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
              <input className="time-filter" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
              <span>to</span>
              <input className="time-filter" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>
          <select className="time-filter" value={severity} onChange={(e) => setSeverity(e.target.value)}>
            <option value="HIGH_ONLY">High Only</option>
            <option value="HIGH_MED">Medium & High</option>
            <option value="ALL">All</option>
          </select>
          <select className="time-filter" value={idsSource} onChange={(e) => setIdsSource(e.target.value)}>
            <option value="ALL">All sources</option>
            <option value="Suricata">Suricata</option>
            <option value="Snort">Snort</option>
          </select>
        </div>

        <div className="filters">
          <label className="nav-section-title">Include</label>
          <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
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

        <div className="pagination">
          <select className="time-filter" value={format} onChange={(e) => setFormat(e.target.value)}>
            <option value="PDF">PDF</option>
            <option value="CSV">CSV</option>
          </select>
          <button className="view-btn" onClick={reset}>Reset</button>
        </div>
      </div>

      <div className="divider"></div>

      <div className="recent-alerts-section">
        <h2 className="section-title">Generated Reports</h2>
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
              {reports.map((r) => (
                <tr key={r.id}>
                  <td><span className="mono">{r.id}</span></td>
                  <td>{r.date}</td>
                  <td>{r.scope}</td>
                  <td>{r.by}</td>
                  <td><span className="tag">{r.format}</span></td>
                  <td>
                    <button className="view-btn" onClick={() => setViewing(r)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {viewing && (
        <div className="modal-overlay" onClick={() => setViewing(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="modal-title">Report Viewer - {viewing.id}</div>
                <div className="text-muted">{viewing.scope} alerts</div>
              </div>
              <button className="back-icon" onClick={() => setViewing(null)} aria-label="Close">×</button>
            </div>
            <div className="modal-body">
              <div className="summary-grid">
                <div className="card-total summary-card">
                  <div className="text-muted">Total Alerts</div>
                  <div className="card-value">1,245</div>
                </div>
                <div className="card-high summary-card">
                  <div className="text-muted">High</div>
                  <div className="card-value">12</div>
                </div>
              </div>
              <textarea className="note-input" defaultValue="Analyst summary notes here..." />
            </div>
            <div className="modal-footer">
              <button className="modal-cancel">Close</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Reports;
