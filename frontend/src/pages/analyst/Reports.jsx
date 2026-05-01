import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import './analyst.css';
import { useTheme } from "../../contexts/ThemeContext";

function Reports() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // 1. Define Theme-Aware Colors
  const colors = {
    bg: isDark ? "#0b1224" : "#f8fafc",
    cardBg: isDark ? "#111c33" : "#ffffff",
    border: isDark ? "#24324f" : "#e2e8f0",
    text: isDark ? "#f1f5f9" : "#1e293b",
    subtext: isDark ? "#94a3b8" : "#64748b",
    inputBg: isDark ? "#0b1224" : "#f1f5f9",
    tableHeader: isDark ? "#0c1630" : "#f1f5f9",
    btnSecondary: isDark ? "#1e293b" : "#e2e8f0",
    btnSecondaryText: isDark ? "#e2e8f0" : "#1e293b",
    modalOverlay: isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.4)",
  };

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
    const next = String(reports.length + 1).padStart(3, "0");
    const id = `RPT-${next}`;
    setReports((prev) => [
      { id, date: to, scope: severityLabel, by: idsSource === "ALL" ? "Mixed" : idsSource, format },
      ...prev,
    ]);
  };

  const reset = () => {
    setFrom("2024-04-01"); setTo("2024-04-24"); setSeverity("HIGH_ONLY");
    setIncludeAlerts(true); setIncludeTimeline(true); setIncludeEnrichment(true);
    setFormat("PDF"); setIdsSource("ALL"); setViewing(null);
  };

  const includedText = useMemo(() => {
    const parts = [];
    if (includeAlerts) parts.push("Alerts");
    if (includeTimeline) parts.push("Timeline");
    if (includeEnrichment) parts.push("Enrichment");
    return parts.length ? parts.join(", ") : "None";
  }, [includeAlerts, includeTimeline, includeEnrichment]);

  // 2. Map colors to style object
  const s = getDynamicStyles(colors);

  return (
    <main className="dashboard-main" style={{ ...s.main, backgroundColor: colors.bg }}>
      <div style={s.headerRow}>
        <h1 className="page-title">Reports</h1>
        <button style={s.primaryBtn} onClick={generate}>Generate New Report</button>
      </div>

      <div style={{ ...s.card, backgroundColor: colors.cardBg, borderColor: colors.border }}>
        <div style={{ ...s.sectionTitle, color: colors.text }}>Generate Report</div>

        <div style={s.formRow}>
          <div style={s.field}>
            <label style={{ ...s.label, color: colors.subtext }}>Filter date range</label>
            <div style={s.inline}>
              <input style={{ ...s.input, backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }} type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
              <span style={{ color: colors.subtext }}>to</span>
              <input style={{ ...s.input, backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }} type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>
        </div>

        <div style={s.formRow}>
          <div style={s.field}>
            <label style={{ ...s.label, color: colors.subtext }}>Severity scope</label>
            <div style={{ ...s.radioRow, backgroundColor: colors.inputBg, borderColor: colors.border }}>
              {["HIGH_ONLY", "HIGH_MED", "ALL"].map((val) => (
                <label key={val} style={{ ...s.radioItem, color: colors.text }}>
                  <input type="radio" name="sev" checked={severity === val} onChange={() => setSeverity(val)} />
                  <span>{val.replace("_", " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={s.field}>
            <label style={{ ...s.label, color: colors.subtext }}>IDS source</label>
            <select style={{ ...s.select, backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }} value={idsSource} onChange={(e) => setIdsSource(e.target.value)}>
              <option value="ALL">All sources</option>
              <option value="Suricata">Suricata</option>
              <option value="Snort">Snort</option>
            </select>
          </div>
        </div>

        <div style={s.formRow}>
          <div style={s.field}>
            <label style={{ ...s.label, color: colors.subtext }}>Include</label>
            <div style={s.checkRow}>
              {[
                { label: "Alerts", state: includeAlerts, set: setIncludeAlerts },
                { label: "Timeline", state: includeTimeline, set: setIncludeTimeline },
                { label: "IP Enrichment", state: includeEnrichment, set: setIncludeEnrichment }
              ].map((item) => (
                <label key={item.label} style={{ ...s.checkItem, backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }}>
                  <input type="checkbox" checked={item.state} onChange={(e) => item.set(e.target.checked)} />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div style={s.actions}>
          <button style={s.primaryBtn} onClick={generate} disabled={!isRangeValid}>Generate Report</button>
          <button style={{ ...s.secondaryBtn, backgroundColor: colors.btnSecondary, color: colors.btnSecondaryText, borderColor: colors.border }} onClick={reset}>Reset</button>
        </div>
      </div>

      {/* Table Section */}
      <div style={{ ...s.card, backgroundColor: colors.cardBg, borderColor: colors.border }}>
        <div style={{ ...s.sectionTitle, color: colors.text }}>Generated Reports</div>
        <div style={{ ...s.tableWrap, borderColor: colors.border }}>
          <table style={{ ...s.table, backgroundColor: colors.inputBg }}>
            <thead>
              <tr>
                {["Report ID", "Date Generated", "Severity Scope", "Source", "Format", "Actions"].map((h) => (
                  <th key={h} style={{ ...s.th, backgroundColor: colors.tableHeader, color: colors.subtext, borderColor: colors.border }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} style={{ ...s.tr, borderBottomColor: colors.border }}>
                  <td style={{ ...s.td, color: colors.text }}><span style={s.mono}>{r.id}</span></td>
                  <td style={{ ...s.td, color: colors.text }}>{r.date}</td>
                  <td style={{ ...s.td, color: colors.text }}>{r.scope}</td>
                  <td style={{ ...s.td, color: colors.text }}>{r.by}</td>
                  <td style={s.td}><span style={{ ...s.tag, backgroundColor: colors.bg, borderColor: colors.border, color: colors.text }}>{r.format}</span></td>
                  <td style={s.td}>
                    <button style={{ ...s.smallBtn, backgroundColor: colors.btnSecondary, color: colors.btnSecondaryText, borderColor: colors.border }} onClick={() => setViewing(r)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Section */}
      {viewing && (
        <div style={{ ...s.modalOverlay, backgroundColor: colors.modalOverlay }} onClick={() => setViewing(null)}>
          <div style={{ ...s.modal, backgroundColor: colors.cardBg, borderColor: colors.border }} onClick={(e) => e.stopPropagation()}>
            <div style={{ ...s.modalHeader, borderBottomColor: colors.border }}>
              <div>
                <div style={{ ...s.modalTitle, color: colors.text }}>Report Viewer</div>
                <div style={{ ...s.modalSubtitle, color: colors.subtext }}>{viewing.id} • {viewing.scope}</div>
              </div>
              <button style={{ ...s.modalClose, color: colors.subtext }} onClick={() => setViewing(null)}>×</button>
            </div>
            <div style={s.modalBody}>
              <div style={s.summaryGrid}>
                {[{ k: "Total Alerts", v: "1,245" }, { k: "High", v: "12" }].map(item => (
                  <div key={item.k} style={{ ...s.summaryCard, backgroundColor: colors.inputBg, borderColor: colors.border }}>
                    <div style={{ ...s.summaryKey, color: colors.subtext }}>{item.k}</div>
                    <div style={{ ...s.summaryVal, color: colors.text }}>{item.v}</div>
                  </div>
                ))}
              </div>
              <textarea style={{ ...s.textarea, backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }} defaultValue="Analyst summary notes here..." />
            </div>
            <div style={{ ...s.modalFooter, borderTopColor: colors.border }}>
              <button style={{ ...s.secondaryBtn, backgroundColor: colors.btnSecondary, color: colors.btnSecondaryText, borderColor: colors.border }} onClick={() => setViewing(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

const getDynamicStyles = (colors) => ({
  main: { flex: 1, padding: "2rem", overflowY: "auto", transition: "background-color 0.3s ease" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" },
  heading: { fontSize: "1.5rem", margin: 0 },
  card: { border: "1px solid", borderRadius: "6px", padding: "1rem", marginBottom: "1rem", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" },
  sectionTitle: { fontWeight: 900, marginBottom: "0.9rem" },
  formRow: { display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "0.9rem" },
  field: { display: "flex", flexDirection: "column", gap: "0.35rem", minWidth: "260px", flex: 1 },
  label: { fontSize: "0.8rem" },
  inline: { display: "flex", gap: "0.6rem", alignItems: "center" },
  input: { border: "1px solid", borderRadius: "10px", padding: "0.75rem", outline: "none" },
  select: { border: "1px solid", borderRadius: "10px", padding: "0.75rem", outline: "none" },
  radioRow: { display: "flex", gap: "1rem", padding: "0.75rem", border: "1px solid", borderRadius: "12px" },
  radioItem: { display: "flex", gap: "0.5rem", alignItems: "center", fontWeight: 400 },
  checkRow: { display: "flex", gap: "0.8rem", flexWrap: "wrap" },
  checkItem: { display: "flex", gap: "0.5rem", alignItems: "center", padding: "0.65rem 0.85rem", border: "1px solid", borderRadius: "12px", fontWeight: 400 },
  actions: { display: "flex", gap: "0.6rem", justifyContent: "flex-end" },
  primaryBtn: { backgroundColor: "#16a34a", border: "none", color: "#fff", padding: "0.75rem 1rem", borderRadius: "10px", cursor: "pointer", fontWeight: 800 },
  secondaryBtn: { border: "1px solid", padding: "0.75rem 1rem", borderRadius: "10px", cursor: "pointer", fontWeight: 800 },
  tableWrap: { overflowX: "auto", borderRadius: "12px", border: "1px solid" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", fontSize: "0.8rem", padding: "0.75rem 0.9rem", borderBottom: "1px solid" },
  tr: { borderBottom: "1px solid" },
  td: { padding: "0.75rem 0.9rem", fontSize: "0.9rem" },
  smallBtn: { border: "1px solid", padding: "0.45rem 0.75rem", borderRadius: "10px", cursor: "pointer", fontWeight: 700 },
  tag: { display: "inline-block", padding: "0.25rem 0.55rem", borderRadius: "10px", border: "1px solid", fontSize: "0.8rem", fontWeight: 800 },
  mono: { fontFamily: "monospace", fontWeight: 900 },
  modalOverlay: { position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 },
  modal: { width: "min(800px, 95vw)", border: "1px solid", borderRadius: "14px", overflow: "hidden" },
  modalHeader: { display: "flex", justifyContent: "space-between", padding: "1rem", borderBottom: "1px solid" },
  modalTitle: { fontWeight: 900 },
  modalSubtitle: { fontSize: "0.85rem" },
  modalClose: { background: "transparent", border: "none", fontSize: "1.5rem", cursor: "pointer" },
  modalBody: { padding: "1rem" },
  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem" },
  summaryCard: { border: "1px solid", borderRadius: "12px", padding: "0.85rem" },
  summaryKey: { fontSize: "0.8rem" },
  summaryVal: { fontWeight: 900, fontSize: "1.2rem" },
  textarea: { width: "100%", minHeight: "100px", marginTop: "1rem", border: "1px solid", borderRadius: "12px", padding: "0.5rem" },
  modalFooter: { display: "flex", justifyContent: "flex-end", padding: "1rem", borderTop: "1px solid" },
});

export default Reports;