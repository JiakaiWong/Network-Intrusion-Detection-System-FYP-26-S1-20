import { useMemo, useState, useEffect } from "react"; 
import { getTrafficLogs } from "../../services/api"; 
import './analyst.css';

function NetworkTraffic() {
  const [ip, setIp] = useState("");
  const [port, setPort] = useState("");
  const [protocol, setProtocol] = useState("ALL");
  const [timeRange, setTimeRange] = useState("24H");
  const [idsSource, setIdsSource] = useState("ALL");
  const [selectedIp, setSelectedIp] = useState(null);

  const [liveRows, setLiveRows] = useState([]);
  const [backendOnline, setBackendOnline] = useState(false);

  useEffect(() => {
    getTrafficLogs()
      .then((data) => {
        if (data.items && data.items.length > 0) {
          setLiveRows(data.items);
          setBackendOnline(true);
        }
      })
      .catch(() => {}); 
  }, []);

  const rows = useMemo(
    () => backendOnline && liveRows.length > 0 ? liveRows : [
      { ts: "12:31:23", src: "192.168.1.12", dst: "10.0.0.45", sport: 443, dport: 3080, proto: "TCP", bytes: 1600, ids: "Suricata" },
      { ts: "12:25:10", src: "192.168.1.100", dst: "172.16.8.101", sport: 80, dport: 3200, proto: "TCP", bytes: 503, ids: "Suricata" },
      { ts: "12:22:30", src: "192.168.1.100", dst: "172.16.8.101", sport: 305, dport: 2320, proto: "UDP", bytes: 708, ids: "Zeek" },
      { ts: "12:24:42", src: "192.168.1.52", dst: "172.16.8.11", sport: 8970, dport: 3080, proto: "TCP", bytes: 692, ids: "Zeek" },
      { ts: "12:30:06", src: "192.168.1.100", dst: "172.16.8.05", sport: 8080, dport: 3200, proto: "UDP", bytes: 706, ids: "Snort" },
    ],
    [backendOnline, liveRows]
  );

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const ipMatch = ip.trim() === "" || r.src.includes(ip.trim()) || r.dst.includes(ip.trim());
      const portMatch = port.trim() === "" || String(r.sport) === String(port.trim()) || String(r.dport) === String(port.trim());
      const protoMatch = protocol === "ALL" || r.proto === protocol;
      const idsMatch = idsSource === "ALL" || r.ids === idsSource;
      return ipMatch && portMatch && protoMatch && idsMatch;
    });
  }, [rows, ip, port, protocol, idsSource]);

  const onReset = () => {
    setIp(""); setPort(""); setProtocol("ALL"); setTimeRange("24H"); setIdsSource("ALL"); setSelectedIp(null);
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
      ],
    });
  };

  return (
    <>
      <div style={styles.main}>
        <h1 className="page-title">Network Traffic Logs</h1>

        {/* Filters Card */}
        <div style={styles.card}>
          <div style={styles.filtersRow}>
            <div style={styles.field}>
              <label style={styles.label}>IP Address</label>
              <input
                style={styles.input}
                placeholder="Source or destination IP"
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
              <select style={styles.select} value={protocol} onChange={(e) => setProtocol(e.target.value)}>
                <option value="ALL">All Protocols</option>
                <option value="TCP">TCP</option>
                <option value="UDP">UDP</option>
                <option value="ICMP">ICMP</option>
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>IDS Source</label>
              <select style={styles.select} value={idsSource} onChange={(e) => setIdsSource(e.target.value)}>
                <option value="ALL">All Sources</option>
                <option value="Suricata">Suricata</option>
                <option value="Snort">Snort</option>
                <option value="Zeek">Zeek</option>
              </select>
            </div>
          </div>

          <div style={styles.filtersRow}>
             <div style={styles.actions}>
              <button style={styles.primaryBtn}>Apply Filter</button>
              <button style={styles.secondaryBtn} onClick={onReset}>Reset</button>
              <button style={styles.ghostBtn} onClick={() => alert("Exporting...")}>Export CSV</button>
            </div>
          </div>
        </div>

        <div style={styles.contentRow}>
          <div style={{ ...styles.card, flex: 1, overflow: "hidden" }}>
            <div style={styles.tableHeader}>
              Showing {filtered.length} results
            </div>

            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Timestamp</th>
                    <th style={styles.th}>Source IP</th>
                    <th style={styles.th}>Destination IP</th>
                    <th style={styles.th}>Ports</th>
                    <th style={styles.th}>Protocol</th>
                    <th style={styles.th}>Bytes</th>
                    <th style={styles.th}>Source</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, idx) => (
                    <tr key={idx} style={styles.tr}>
                      <td style={styles.td}>{r.ts}</td>
                      <td style={styles.tdLink} onClick={() => openIpDetails(r.src)}>{r.src}</td>
                      <td style={styles.tdLink} onClick={() => openIpDetails(r.dst)}>{r.dst}</td>
                      <td style={styles.td}>{r.sport} → {r.dport}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, ...badgeForProto(r.proto) }}>{r.proto}</span>
                      </td>
                      <td style={styles.td}>{r.bytes}</td>
                      <td style={styles.td}><span style={styles.tag}>{r.ids}</span></td>
                      <td style={styles.td}>
                        <button style={styles.smallBtn}>View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {selectedIp && (
            <div style={styles.drawer}>
              <div style={styles.drawerHeader}>
                <div>
                  <div style={styles.drawerTitle}>IP Details</div>
                  <div style={styles.drawerIp}>{selectedIp.ip}</div>
                </div>
                <button style={styles.drawerClose} onClick={() => setSelectedIp(null)}>×</button>
              </div>
              <div style={styles.drawerBody}>
                <div style={styles.kvRow}><span style={styles.kvKey}>Country</span><span style={styles.kvVal}>{selectedIp.country}</span></div>
                <div style={styles.kvRow}><span style={styles.kvKey}>ASN</span><span style={styles.kvVal}>{selectedIp.asn}</span></div>
                <div style={styles.divider} />
                <div style={styles.drawerSectionTitle}>Quick Links</div>
                <div style={styles.quickLinks}>
                  <button style={styles.linkBtn}>VirusTotal</button>
                  <button style={styles.linkBtn}>Whois</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function badgeForProto(proto) {
  switch (proto) {
    case "TCP": return { backgroundColor: "#1e40af", borderColor: "#3b82f6" };
    case "UDP": return { backgroundColor: "#92400e", borderColor: "#f59e0b" };
    case "ICMP": return { backgroundColor: "#064e3b", borderColor: "#10b981" };
    default: return { backgroundColor: "#334155", borderColor: "#64748b" };
  }
}

const styles = {
  main: { flex: 1, padding: "2rem", overflowY: "auto" },
  heading: { fontSize: "1.5rem", marginBottom: "1rem", color: "var(--text-main)" },
  card: { 
    backgroundColor: "var(--bg-card)", 
    border: "1px solid var(--border-color)", 
    borderRadius: "12px", 
    padding: "1rem", 
    marginBottom: "1rem" 
  },
  filtersRow: { display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end", marginBottom: "0.75rem" },
  field: { display: "flex", flexDirection: "column", gap: "0.35rem", flex: "1", minWidth: "150px" },
  label: { fontSize: "0.8rem", color: "var(--text-muted)" },
  input: { 
    backgroundColor: "var(--bg-main)", 
    border: "1px solid var(--border-color)", 
    color: "var(--text-main)", 
    borderRadius: "8px", 
    padding: "0.6rem" 
  },
  select: { 
    backgroundColor: "var(--bg-main)", 
    border: "1px solid var(--border-color)", 
    color: "var(--text-main)", 
    borderRadius: "8px", 
    padding: "0.6rem" 
  },
  actions: { display: "flex", gap: "0.6rem", flex: "1", justifyContent: "flex-end" },
  primaryBtn: { backgroundColor: "var(--accent-primary)", color: "#fff", border: "none", padding: "0.6rem 1.2rem", borderRadius: "8px", cursor: "pointer" },
  secondaryBtn: { backgroundColor: "var(--bg-main)", color: "var(--text-main)", border: "1px solid var(--border-color)", padding: "0.6rem 1.2rem", borderRadius: "8px", cursor: "pointer" },
  ghostBtn: { background: "none", border: "1px dashed var(--border-color)", color: "var(--text-muted)", padding: "0.6rem 1.2rem", borderRadius: "8px", cursor: "pointer" },
  contentRow: { display: "flex", gap: "1rem" },
  tableHeader: { color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "0.5rem" },
  tableWrap: { overflowX: "auto", borderRadius: "8px", border: "1px solid var(--border-color)" },
  table: { width: "100%", borderCollapse: "collapse", backgroundColor: "var(--bg-main)" },
  th: { textAlign: "left", padding: "0.75rem", borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)", fontSize: "0.8rem" },
  tr: { borderBottom: "1px solid var(--border-color)" },
  td: { padding: "0.75rem", color: "var(--text-main)", fontSize: "0.85rem" },
  tdLink: { padding: "0.75rem", color: "var(--accent-primary)", cursor: "pointer", textDecoration: "underline", fontSize: "0.85rem" },
  badge: { padding: "0.2rem 0.5rem", borderRadius: "10px", color: "#fff", fontSize: "0.7rem", fontWeight: "bold" },
  tag: { padding: "0.2rem 0.5rem", borderRadius: "6px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", color: "var(--text-muted)", fontSize: "0.75rem" },
  smallBtn: { backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", color: "var(--text-main)", padding: "0.3rem 0.6rem", borderRadius: "4px", cursor: "pointer" },
  drawer: { width: "320px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "1rem", position: "sticky", top: "0" },
  drawerHeader: { display: "flex", justifyContent: "space-between", marginBottom: "1rem" },
  drawerIp: { fontSize: "1.2rem", fontWeight: "bold", color: "var(--text-main)" },
  drawerTitle: { fontSize: "0.8rem", color: "var(--text-muted)" },
  drawerClose: { background: "none", border: "none", color: "var(--text-main)", fontSize: "1.5rem", cursor: "pointer" },
  kvRow: { display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" },
  kvKey: { color: "var(--text-muted)", fontSize: "0.85rem" },
  kvVal: { color: "var(--text-main)", fontSize: "0.85rem", fontWeight: "bold" },
  divider: { height: "1px", backgroundColor: "var(--border-color)", margin: "1rem 0" },
  drawerSectionTitle: { fontSize: "0.9rem", fontWeight: "bold", color: "var(--text-main)", marginBottom: "0.5rem" },
  quickLinks: { display: "flex", gap: "0.5rem" },
  linkBtn: { backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)", color: "var(--text-main)", padding: "0.4rem 0.6rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem" }
};

export default NetworkTraffic;