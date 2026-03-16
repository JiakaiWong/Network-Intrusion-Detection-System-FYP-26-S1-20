import { useMemo, useState } from "react";

import AnalystLayout from "../../components/AnalystLayout";

function NetworkTraffic() {

  const [ip, setIp] = useState("");
  const [port, setPort] = useState("");
  const [protocol, setProtocol] = useState("ALL");
  const [timeRange, setTimeRange] = useState("24H");
  const [idsSource, setIdsSource] = useState("ALL");
  const [selectedIp, setSelectedIp] = useState(null);

  const rows = useMemo(
    () => [
      {
        ts: "12:31:23",
        src: "192.168.1.12",
        dst: "10.0.0.45",
        sport: 443,
        dport: 3080,
        proto: "TCP",
        bytes: 1600,
        ids: "Suricata",
      },
      {
        ts: "12:25:10",
        src: "192.168.1.100",
        dst: "172.16.8.101",
        sport: 80,
        dport: 3200,
        proto: "TCP",
        bytes: 503,
        ids: "Suricata",
      },
      {
        ts: "12:22:30",
        src: "192.168.1.100",
        dst: "172.16.8.101",
        sport: 305,
        dport: 2320,
        proto: "UDP",
        bytes: 708,
        ids: "Zeek",
      },
      {
        ts: "12:24:42",
        src: "192.168.1.52",
        dst: "172.16.8.11",
        sport: 8970,
        dport: 3080,
        proto: "TCP",
        bytes: 692,
        ids: "Zeek",
      },
      {
        ts: "12:30:06",
        src: "192.168.1.100",
        dst: "172.16.8.05",
        sport: 8080,
        dport: 3200,
        proto: "UDP",
        bytes: 706,
        ids: "Snort",
      },
    ],
    []
  );

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const ipMatch =
        ip.trim() === "" ||
        r.src.includes(ip.trim()) ||
        r.dst.includes(ip.trim());
      const portMatch =
        port.trim() === "" ||
        String(r.sport) === String(port.trim()) ||
        String(r.dport) === String(port.trim());
      const protoMatch = protocol === "ALL" || r.proto === protocol;
      const idsMatch = idsSource === "ALL" || r.ids === idsSource;
      return ipMatch && portMatch && protoMatch && idsMatch;
    });
  }, [rows, ip, port, protocol, idsSource]);

  const onReset = () => {
    setIp("");
    setPort("");
    setProtocol("ALL");
    setTimeRange("24H");
    setIdsSource("ALL");
    setSelectedIp(null);
  };

  const openIpDetails = (ipAddr) => {
    setSelectedIp({
      ip: ipAddr,
      country: "United States",
      asn: "AS16509",
      volume: "34.5 GB",
      relatedAlerts: [
        { type: "SQL Injection", when: "1 week ago", source: "Suricata" },
        { type: "Command Injection", when: "3 weeks ago", source: "Suricata" },
        { type: "Brute Force", when: "1 month ago", source: "Suricata" },
      ],
    });
  };

  return (
    <AnalystLayout>

      <div style={styles.main}>
        <h1 style={styles.heading}>Network Traffic Logs</h1>

        <div style={styles.card}>
          <div style={styles.filtersRow}>
            <div style={styles.field}>
              <label style={styles.label}>IP Address</label>
              <input
                style={styles.input}
                placeholder="Enter source or destination IP"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Port</label>
              <input
                style={styles.input}
                placeholder="1 - 65535"
                value={port}
                onChange={(e) => setPort(e.target.value.replace(/[^0-9]/g, ""))}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Protocol</label>
              <select
                style={styles.select}
                value={protocol}
                onChange={(e) => setProtocol(e.target.value)}
              >
                <option value="ALL">All Protocols</option>
                <option value="TCP">TCP</option>
                <option value="UDP">UDP</option>
                <option value="ICMP">ICMP</option>
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>IDS Source</label>
              <select
                style={styles.select}
                value={idsSource}
                onChange={(e) => setIdsSource(e.target.value)}
              >
                <option value="ALL">All Sources</option>
                <option value="Suricata">Suricata</option>
                <option value="Snort">Snort</option>
                <option value="Zeek">Zeek</option>
                <option value="Kismet">Kismet</option>
              </select>
            </div>
          </div>

          <div style={styles.filtersRow}>
            <div style={styles.field}>
              <label style={styles.label}>Time Range</label>
              <select
                style={styles.select}
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="1H">Last 1 Hour</option>
                <option value="24H">Last 24 Hours</option>
                <option value="7D">Last 7 Days</option>
                <option value="CUSTOM">Custom (mock)</option>
              </select>
            </div>

            <div style={styles.actions}>
              <button style={styles.primaryBtn} onClick={() => {}}>
                Apply Filter
              </button>
              <button style={styles.secondaryBtn} onClick={onReset}>
                Reset
              </button>
              <button
                style={styles.ghostBtn}
                onClick={() => alert("CSV export is mocked in this demo UI.")}
              >
                Export CSV
              </button>
            </div>
          </div>
        </div>

        <div style={styles.contentRow}>
          <div style={{ ...styles.card, flex: 1, overflow: "hidden" }}>
            <div style={styles.tableHeader}>
              <div style={styles.tableHeaderLeft}>
                Showing {filtered.length} results
              </div>
              <div style={styles.tableHeaderRight}>Page 1</div>
            </div>

            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Timestamp</th>
                    <th style={styles.th}>Source IP</th>
                    <th style={styles.th}>Destination IP</th>
                    <th style={styles.th}>Src Port</th>
                    <th style={styles.th}>Dst Port</th>
                    <th style={styles.th}>Protocol</th>
                    <th style={styles.th}>Bytes</th>
                    <th style={styles.th}>IDS Source</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, idx) => (
                    <tr key={idx} style={styles.tr}>
                      <td style={styles.td}>{r.ts}</td>
                      <td
                        style={styles.tdLink}
                        onClick={() => openIpDetails(r.src)}
                      >
                        {r.src}
                      </td>
                      <td
                        style={styles.tdLink}
                        onClick={() => openIpDetails(r.dst)}
                      >
                        {r.dst}
                      </td>
                      <td style={styles.td}>{r.sport}</td>
                      <td style={styles.td}>{r.dport}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, ...badgeForProto(r.proto) }}>
                          {r.proto}
                        </span>
                      </td>
                      <td style={styles.td}>{r.bytes}</td>
                      <td style={styles.td}>
                        <span style={styles.tag}>{r.ids}</span>
                      </td>
                      <td style={styles.td}>
                        <button
                          style={styles.smallBtn}
                          onClick={() => alert("Row details modal can go here.")}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td style={styles.emptyTd} colSpan={9}>
                        No traffic logs found for the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {selectedIp && (
            <div style={styles.drawer}>
              <div style={styles.drawerHeader}>
                <div>
                  <div style={styles.drawerTitle}>Source IP Details</div>
                  <div style={styles.drawerIp}>{selectedIp.ip}</div>
                </div>
                <button
                  style={styles.drawerClose}
                  onClick={() => setSelectedIp(null)}
                >
                  ×
                </button>
              </div>

              <div style={styles.drawerBody}>
                <div style={styles.kvRow}>
                  <span style={styles.kvKey}>Country</span>
                  <span style={styles.kvVal}>{selectedIp.country}</span>
                </div>
                <div style={styles.kvRow}>
                  <span style={styles.kvKey}>ASN</span>
                  <span style={styles.kvVal}>{selectedIp.asn}</span>
                </div>
                <div style={styles.kvRow}>
                  <span style={styles.kvKey}>Traffic Volume</span>
                  <span style={styles.kvVal}>{selectedIp.volume}</span>
                </div>

                <div style={styles.divider} />

                <div style={styles.drawerSectionTitle}>Quick Links</div>
                <div style={styles.quickLinks}>
                  <button
                    style={styles.linkBtn}
                    onClick={() => alert("VirusTotal lookup mocked")}
                  >
                    VirusTotal
                  </button>
                  <button
                    style={styles.linkBtn}
                    onClick={() => alert("IPInfo lookup mocked")}
                  >
                    IPInfo
                  </button>
                  <button
                    style={styles.linkBtn}
                    onClick={() => alert("Whois lookup mocked")}
                  >
                    Whois
                  </button>
                </div>

                <div style={styles.divider} />

                <div style={styles.drawerSectionTitle}>Related Alerts</div>
                <div style={styles.alertList}>
                  {selectedIp.relatedAlerts.map((a, i) => (
                    <div key={i} style={styles.alertItem}>
                      <div style={styles.alertType}>{a.type}</div>
                      <div style={styles.alertMeta}>
                        {a.source} • {a.when}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AnalystLayout>
  );
}

function badgeForProto(proto) {
  switch (proto) {
    case "TCP":
      return { backgroundColor: "#1e40af", borderColor: "#3b82f6" };
    case "UDP":
      return { backgroundColor: "#92400e", borderColor: "#f59e0b" };
    case "ICMP":
      return { backgroundColor: "#064e3b", borderColor: "#10b981" };
    default:
      return { backgroundColor: "#334155", borderColor: "#64748b" };
  }
}

const styles = {

  main: {
    flex: 1,
    padding: "2rem",
    overflowY: "auto",
  },
  heading: {
    fontSize: "1.5rem",
    marginBottom: "1rem",
    color: "#f1f5f9",
  },


  card: {
    backgroundColor: "#111c33",
    border: "1px solid #24324f",
    borderRadius: "12px",
    padding: "1rem",
    marginBottom: "1rem",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  },
  filtersRow: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
    alignItems: "flex-end",
    marginBottom: "0.75rem",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.35rem",
    minWidth: "220px",
    flex: "1",
  },
  label: { fontSize: "0.8rem", color: "#94a3b8" },
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
  actions: {
    display: "flex",
    gap: "0.6rem",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    flex: "1",
  },
  primaryBtn: {
    backgroundColor: "#16a34a",
    border: "none",
    color: "#fff",
    padding: "0.75rem 1rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 600,
  },
  secondaryBtn: {
    backgroundColor: "#1e293b",
    border: "1px solid #24324f",
    color: "#e2e8f0",
    padding: "0.75rem 1rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 600,
  },
  ghostBtn: {
    backgroundColor: "transparent",
    border: "1px dashed #334155",
    color: "#cbd5e1",
    padding: "0.75rem 1rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 600,
  },
  contentRow: { display: "flex", gap: "1rem", alignItems: "flex-start" },
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem 0.25rem 0.75rem 0.25rem",
    color: "#94a3b8",
    fontSize: "0.9rem",
  },
  tableWrap: {
    overflowX: "auto",
    borderRadius: "12px",
    border: "1px solid #24324f",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "980px",
    backgroundColor: "#0b1224",
  },
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
  tdLink: {
    padding: "0.75rem 0.9rem",
    fontSize: "0.9rem",
    color: "#60a5fa",
    cursor: "pointer",
    textDecoration: "underline",
  },
  emptyTd: {
    padding: "1rem",
    color: "#94a3b8",
    fontSize: "0.95rem",
    textAlign: "center",
  },
  badge: {
    display: "inline-block",
    padding: "0.25rem 0.55rem",
    borderRadius: "999px",
    border: "1px solid",
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "#fff",
  },
  tag: {
    display: "inline-block",
    padding: "0.25rem 0.55rem",
    borderRadius: "10px",
    backgroundColor: "#111827",
    border: "1px solid #24324f",
    color: "#cbd5e1",
    fontSize: "0.8rem",
  },
  smallBtn: {
    backgroundColor: "#1e293b",
    border: "1px solid #24324f",
    color: "#e2e8f0",
    padding: "0.45rem 0.75rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 600,
  },
  drawer: {
    width: "340px",
    backgroundColor: "#111c33",
    border: "1px solid #24324f",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    position: "sticky",
    top: "1rem",
  },
  drawerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "1rem",
    borderBottom: "1px solid #24324f",
  },
  drawerTitle: {
    color: "#94a3b8",
    fontSize: "0.85rem",
    marginBottom: "0.25rem",
  },
  drawerIp: { fontSize: "1.15rem", fontWeight: 800 },
  drawerClose: {
    background: "transparent",
    border: "none",
    color: "#cbd5e1",
    fontSize: "1.5rem",
    cursor: "pointer",
    lineHeight: 1,
  },
  drawerBody: { padding: "1rem" },
  kvRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.4rem 0",
    color: "#cbd5e1",
  },
  kvKey: { color: "#94a3b8", fontSize: "0.85rem" },
  kvVal: { fontSize: "0.9rem", fontWeight: 700 },
  divider: { height: "1px", backgroundColor: "#24324f", margin: "0.9rem 0" },
  drawerSectionTitle: { fontWeight: 800, marginBottom: "0.6rem" },
  quickLinks: { display: "flex", gap: "0.5rem", flexWrap: "wrap" },
  linkBtn: {
    backgroundColor: "#0b1224",
    border: "1px solid #24324f",
    color: "#e2e8f0",
    padding: "0.5rem 0.7rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "0.85rem",
  },
  alertList: { display: "flex", flexDirection: "column", gap: "0.6rem" },
  alertItem: {
    padding: "0.75rem",
    borderRadius: "12px",
    backgroundColor: "#0b1224",
    border: "1px solid #24324f",
  },
  alertType: { fontWeight: 900, marginBottom: "0.2rem" },
  alertMeta: { color: "#94a3b8", fontSize: "0.85rem" },
};

export default NetworkTraffic;