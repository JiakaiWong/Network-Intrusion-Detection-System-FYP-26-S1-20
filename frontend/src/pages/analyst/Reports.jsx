import { useMemo, useState } from "react";
import AnalystLayout from "./AnalystLayout";

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
    } catch {
      return false;
    }
  }, [from, to]);

  const generate = () => {
    if (!isRangeValid) {
      alert("Invalid date range: 'From' must be before 'To'.");
      return;
    }
    const next = String(reports.length + 1).padStart(3, "0");
    const id = `RPT-${next}`;
    setReports((prev) => [
      {
        id,
        date: to,
        scope: severityLabel,
        by: idsSource === "ALL" ? "Mixed" : idsSource,
        format,
      },
      ...prev,
    ]);
    alert("Report generated (mock). In a real system, backend produces PDF/CSV.");
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

  const includedText = useMemo(() => {
    const parts = [];
    if (includeAlerts) parts.push("Alerts");
    if (includeTimeline) parts.push("Timeline");
    if (includeEnrichment) parts.push("Enrichment");
    return parts.length ? parts.join(", ") : "None";
  }, [includeAlerts, includeTimeline, includeEnrichment]);

  return (
    <AnalystLayout>
      <div style={styles.main}>
        <div style={styles.headerRow}>
          <h1 style={styles.heading}>Reports</h1>
          <button style={styles.primaryBtn} onClick={generate}>
            Generate New Report
          </button>
        </div>

        <div style={styles.card}>
          <div style={styles.sectionTitle}>Generate Report</div>

          <div style={styles.formRow}>
            <div style={styles.field}>
              <label style={styles.label}>Filter date range</label>
              <div style={styles.inline}>
                <input
                  style={styles.input}
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                />
                <span style={{ color: "#94a3b8" }}>to</span>
                <input
                  style={styles.input}
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </div>
              {!isRangeValid && (
                <div style={styles.errorText}>From date must be before To date.</div>
              )}
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.field}>
              <label style={styles.label}>Severity scope</label>
              <div style={styles.radioRow}>
                <label style={styles.radioItem}>
                  <input
                    type="radio"
                    name="sev"
                    checked={severity === "HIGH_ONLY"}
                    onChange={() => setSeverity("HIGH_ONLY")}
                  />
                  <span>High only</span>
                </label>
                <label style={styles.radioItem}>
                  <input
                    type="radio"
                    name="sev"
                    checked={severity === "HIGH_MED"}
                    onChange={() => setSeverity("HIGH_MED")}
                  />
                  <span>Medium & High</span>
                </label>
                <label style={styles.radioItem}>
                  <input
                    type="radio"
                    name="sev"
                    checked={severity === "ALL"}
                    onChange={() => setSeverity("ALL")}
                  />
                  <span>All</span>
                </label>
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>IDS source</label>
              <select
                style={styles.select}
                value={idsSource}
                onChange={(e) => setIdsSource(e.target.value)}
              >
                <option value="ALL">All sources</option>
                <option value="Suricata">Suricata</option>
                <option value="Snort">Snort</option>
                <option value="Zeek">Zeek</option>
                <option value="Kismet">Kismet</option>
              </select>
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.field}>
              <label style={styles.label}>Include</label>
              <div style={styles.checkRow}>
                <label style={styles.checkItem}>
                  <input
                    type="checkbox"
                    checked={includeAlerts}
                    onChange={(e) => setIncludeAlerts(e.target.checked)}
                  />
                  <span>Alerts</span>
                </label>
                <label style={styles.checkItem}>
                  <input
                    type="checkbox"
                    checked={includeTimeline}
                    onChange={(e) => setIncludeTimeline(e.target.checked)}
                  />
                  <span>Incident timeline</span>
                </label>
                <label style={styles.checkItem}>
                  <input
                    type="checkbox"
                    checked={includeEnrichment}
                    onChange={(e) => setIncludeEnrichment(e.target.checked)}
                  />
                  <span>IP enrichment</span>
                </label>
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Format</label>
              <select
                style={styles.select}
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                <option value="PDF">PDF</option>
                <option value="CSV">CSV</option>
              </select>
            </div>
          </div>

          <div style={styles.actions}>
            <button style={styles.primaryBtn} onClick={generate} disabled={!isRangeValid}>
              Generate Report
            </button>
            <button style={styles.secondaryBtn} onClick={reset}>
              Reset
            </button>
          </div>

          <div style={styles.hint}>Included sections: {includedText}</div>
        </div>

        <div style={styles.card}>
          <div style={styles.sectionTitle}>Generated Reports</div>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Report ID</th>
                  <th style={styles.th}>Date Generated</th>
                  <th style={styles.th}>Severity Scope</th>
                  <th style={styles.th}>Generated By</th>
                  <th style={styles.th}>Format</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} style={styles.tr}>
                    <td style={styles.td}>
                      <span style={styles.mono}>{r.id}</span>
                    </td>
                    <td style={styles.td}>{r.date}</td>
                    <td style={styles.td}>{r.scope}</td>
                    <td style={styles.td}>{r.by}</td>
                    <td style={styles.td}>
                      <span style={styles.tag}>{r.format}</span>
                    </td>
                    <td style={styles.td}>
                      <button style={styles.smallBtn} onClick={() => setViewing(r)}>
                        View
                      </button>
                      <button style={styles.smallBtn} onClick={() => alert("Download mocked")}>
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
                {reports.length === 0 && (
                  <tr>
                    <td style={styles.td} colSpan={6}>
                      No reports generated yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {viewing && (
        <div style={styles.modalOverlay} onClick={() => setViewing(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <div style={styles.modalTitle}>Report Viewer</div>
                <div style={styles.modalSubtitle}>
                  <span style={styles.mono}>{viewing.id}</span> • {viewing.scope} • {viewing.format}
                </div>
              </div>
              <button style={styles.modalClose} onClick={() => setViewing(null)}>
                ×
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.summaryGrid}>
                <div style={styles.summaryCard}>
                  <div style={styles.summaryKey}>Total Alerts</div>
                  <div style={styles.summaryVal}>1,245</div>
                </div>
                <div style={styles.summaryCard}>
                  <div style={styles.summaryKey}>High</div>
                  <div style={styles.summaryVal}>12</div>
                </div>
                <div style={styles.summaryCard}>
                  <div style={styles.summaryKey}>Medium</div>
                  <div style={styles.summaryVal}>58</div>
                </div>
                <div style={styles.summaryCard}>
                  <div style={styles.summaryKey}>Low</div>
                  <div style={styles.summaryVal}>175</div>
                </div>
              </div>

              <div style={styles.fakeChart}>
                <div style={{ color: "#94a3b8", fontWeight: 800 }}>Charts (placeholder)</div>
                <div style={{ color: "#94a3b8", marginTop: "0.35rem" }}>
                  Add Chart.js/Recharts later if your team integrates visual charts.
                </div>
              </div>

              <div style={styles.modalSectionTitle}>Notes</div>
              <textarea
                style={styles.textarea}
                placeholder="Analyst notes summary..."
                defaultValue="High severity alerts were clustered around 192.168.1.12. Investigate SQL injection attempts and correlate with incidents."
              />
            </div>

            <div style={styles.modalFooter}>
              <button style={styles.secondaryBtn} onClick={() => setViewing(null)}>
                Close
              </button>
              <button style={styles.primaryBtn} onClick={() => alert("Export from viewer mocked")}>
                Export
              </button>
            </div>
          </div>
        </div>
      )}
    </AnalystLayout>
  );
}

const styles = {
  main: { flex: 1, padding: "2rem", overflowY: "auto" },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
    flexWrap: "wrap",
    marginBottom: "1rem",
  },
  heading: { fontSize: "1.5rem", margin: 0, color: "#f1f5f9" },
  card: {
    backgroundColor: "#111c33",
    border: "1px solid #24324f",
    borderRadius: "12px",
    padding: "1rem",
    marginBottom: "1rem",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  },
  sectionTitle: { fontWeight: 900, marginBottom: "0.9rem" },
  formRow: { display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "0.9rem" },
  field: { display: "flex", flexDirection: "column", gap: "0.35rem", minWidth: "260px", flex: 1 },
  label: { fontSize: "0.8rem", color: "#94a3b8" },
  inline: { display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap" },
  input: {
    backgroundColor: "#0b1224",
    border: "1px solid #24324f",
    color: "#e2e8f0",
    borderRadius: "10px",
    padding: "0.75rem 0.9rem",
    outline: "none",
  },
  select: {
    backgroundColor: "#0b1224",
    border: "1px solid #24324f",
    color: "#e2e8f0",
    borderRadius: "10px",
    padding: "0.75rem 0.9rem",
    outline: "none",
  },
  errorText: { color: "#fca5a5", fontSize: "0.85rem", marginTop: "0.25rem" },
  radioRow: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
    padding: "0.75rem 0.9rem",
    backgroundColor: "#0b1224",
    border: "1px solid #24324f",
    borderRadius: "12px",
  },
  radioItem: { display: "flex", gap: "0.5rem", alignItems: "center", fontWeight: 700, color: "#e2e8f0" },
  checkRow: { display: "flex", gap: "0.8rem", flexWrap: "wrap" },
  checkItem: {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
    padding: "0.65rem 0.85rem",
    backgroundColor: "#0b1224",
    border: "1px solid #24324f",
    borderRadius: "12px",
    color: "#e2e8f0",
    fontWeight: 800,
  },
  actions: { display: "flex", gap: "0.6rem", justifyContent: "flex-end", flexWrap: "wrap", marginTop: "0.4rem" },
  hint: { marginTop: "0.8rem", color: "#94a3b8", fontSize: "0.9rem" },
  primaryBtn: {
    backgroundColor: "#16a34a",
    border: "none",
    color: "#fff",
    padding: "0.75rem 1rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 800,
  },
  secondaryBtn: {
    backgroundColor: "#1e293b",
    border: "1px solid #24324f",
    color: "#e2e8f0",
    padding: "0.75rem 1rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 800,
  },
  tableWrap: { overflowX: "auto", borderRadius: "12px", border: "1px solid #24324f" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: "900px", backgroundColor: "#0b1224" },
  th: {
    textAlign: "left",
    fontSize: "0.8rem",
    color: "#a7b4c7",
    padding: "0.75rem 0.9rem",
    borderBottom: "1px solid #24324f",
    backgroundColor: "#0c1630",
  },
  tr: { borderBottom: "1px solid #152545" },
  td: { padding: "0.75rem 0.9rem", fontSize: "0.9rem", color: "#e2e8f0" },
  smallBtn: {
    backgroundColor: "#1e293b",
    border: "1px solid #24324f",
    color: "#e2e8f0",
    padding: "0.45rem 0.75rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 700,
    marginRight: "0.5rem",
  },
  tag: {
    display: "inline-block",
    padding: "0.25rem 0.55rem",
    borderRadius: "10px",
    backgroundColor: "#111827",
    border: "1px solid #24324f",
    color: "#cbd5e1",
    fontSize: "0.8rem",
    fontWeight: 800,
  },
  mono: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", fontWeight: 900 },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    zIndex: 50,
  },
  modal: {
    width: "min(900px, 95vw)",
    backgroundColor: "#111c33",
    border: "1px solid #24324f",
    borderRadius: "14px",
    boxShadow: "0 18px 60px rgba(0,0,0,0.5)",
    overflow: "hidden",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "1rem",
    borderBottom: "1px solid #24324f",
  },
  modalTitle: { fontWeight: 900, fontSize: "1.1rem" },
  modalSubtitle: { color: "#94a3b8", marginTop: "0.25rem" },
  modalClose: {
    background: "transparent",
    border: "none",
    color: "#cbd5e1",
    fontSize: "1.6rem",
    cursor: "pointer",
    lineHeight: 1,
  },
  modalBody: { padding: "1rem" },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "0.75rem",
  },
  summaryCard: {
    backgroundColor: "#0b1224",
    border: "1px solid #24324f",
    borderRadius: "12px",
    padding: "0.85rem",
  },
  summaryKey: { color: "#94a3b8", fontSize: "0.85rem" },
  summaryVal: { fontWeight: 900, fontSize: "1.4rem", marginTop: "0.35rem" },
  fakeChart: {
    marginTop: "0.9rem",
    backgroundColor: "#0b1224",
    border: "1px dashed #334155",
    borderRadius: "12px",
    padding: "1rem",
  },
  modalSectionTitle: { marginTop: "1rem", fontWeight: 900 },
  textarea: {
    width: "100%",
    minHeight: "120px",
    marginTop: "0.5rem",
    backgroundColor: "#0b1224",
    border: "1px solid #24324f",
    borderRadius: "12px",
    padding: "0.85rem",
    color: "#e2e8f0",
    outline: "none",
    resize: "vertical",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.6rem",
    padding: "1rem",
    borderTop: "1px solid #24324f",
  },
};

export default Reports;