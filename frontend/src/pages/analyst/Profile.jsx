import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import AnalystLayout from "../../components/AnalystLayout";

function Profile() {

  const [tab, setTab] = useState("PERSONAL");
  const [fullName, setFullName] = useState("Analyst 1");
  const [email, setEmail] = useState("analyst1@example.com");
  const [phone, setPhone] = useState("+65 9000 0000");

  const [notifMobile, setNotifMobile] = useState(true);
  const [notifTelegram, setNotifTelegram] = useState(true);
  const [notifEmail, setNotifEmail] = useState(false);
  const [severityPref, setSeverityPref] = useState("HIGH_ONLY");

  const sessions = useMemo(
    () => [
      { when: "04/23/2024 14:45", ip: "192.168.1.12", agent: "Chrome • Singapore", ok: true },
      { when: "04/23/2024 19:30", ip: "10.0.0.45", agent: "Firefox • Singapore", ok: true },
      { when: "04/21/2024 17:15", ip: "172.16.8.21", agent: "Edge • Singapore", ok: true },
    ],
    []
  );

  const save = () => alert("Saved (mock). Hook this up to your backend later.");

  return (
    <AnalystLayout>
  
      <div style={styles.main}>
        <h1 style={styles.heading}>Analyst Profile</h1>

        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.avatarWrap}>
              <div style={styles.avatar}>
                <span style={{ fontWeight: 900 }}>A1</span>
              </div>
            </div>
            <div style={styles.name}>Analyst1</div>
            <div style={styles.role}>Security Analyst</div>
            <div style={styles.metaLine}>
              <span style={styles.metaKey}>Last login</span>
              <span style={styles.metaVal}>04/23/2024 14:45</span>
            </div>
            <div style={styles.metaLine}>
              <span style={styles.metaKey}>Last IP</span>
              <span style={styles.metaVal}>192.168.1.12</span>
            </div>

            <div style={styles.divider} />

            <div style={styles.smallTitle}>Recent Sessions</div>
            <div style={styles.sessionList}>
              {sessions.map((s, i) => (
                <div key={i} style={styles.sessionItem}>
                  <div style={styles.sessionWhen}>{s.when}</div>
                  <div style={styles.sessionMeta}>
                    <span style={styles.mono}>{s.ip}</span> • {s.agent}
                  </div>
                </div>
              ))}
            </div>

            <button
              style={styles.secondaryBtn}
              onClick={() => alert("Log out other sessions (mock)")}
            >
              Log out other sessions
            </button>
          </div>

          <div style={styles.card}>
            <div style={styles.tabs}>
              <button
                style={{ ...styles.tabBtn, ...(tab === "PERSONAL" ? styles.tabActive : {}) }}
                onClick={() => setTab("PERSONAL")}
              >
                Personal Info
              </button>
              <button
                style={{ ...styles.tabBtn, ...(tab === "SECURITY" ? styles.tabActive : {}) }}
                onClick={() => setTab("SECURITY")}
              >
                Security Settings
              </button>
              <button
                style={{ ...styles.tabBtn, ...(tab === "NOTIF" ? styles.tabActive : {}) }}
                onClick={() => setTab("NOTIF")}
              >
                Notification Preferences
              </button>
            </div>

            {tab === "PERSONAL" && (
              <div style={styles.panel}>
                <div style={styles.formRow}>
                  <div style={styles.field}>
                    <label style={styles.label}>Full Name</label>
                    <input
                      style={styles.input}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Email</label>
                    <input
                      style={styles.input}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div style={styles.formRow}>
                  <div style={styles.field}>
                    <label style={styles.label}>Phone</label>
                    <input
                      style={styles.input}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Department</label>
                    <input style={styles.input} defaultValue="SOC" />
                  </div>
                </div>
                <div style={styles.actions}>
                  <button style={styles.primaryBtn} onClick={save}>
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {tab === "SECURITY" && (
              <div style={styles.panel}>
                <div style={styles.formRow}>
                  <div style={styles.field}>
                    <label style={styles.label}>Current Password</label>
                    <input style={styles.input} type="password" placeholder="••••••••" />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>New Password</label>
                    <input style={styles.input} type="password" placeholder="••••••••" />
                  </div>
                </div>
                <div style={styles.formRow}>
                  <div style={styles.field}>
                    <label style={styles.label}>Confirm Password</label>
                    <input style={styles.input} type="password" placeholder="••••••••" />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>MFA</label>
                    <div style={styles.toggleRow}>
                      <input type="checkbox" defaultChecked />
                      <span style={{ color: "#cbd5e1" }}>
                        Enable multi-factor authentication
                      </span>
                    </div>
                  </div>
                </div>
                <div style={styles.actions}>
                  <button style={styles.primaryBtn} onClick={save}>
                    Update Password
                  </button>
                  <button
                    style={styles.secondaryInlineBtn}
                    onClick={() => alert("Show QR setup modal (mock)")}
                  >
                    Setup MFA
                  </button>
                </div>
              </div>
            )}

            {tab === "NOTIF" && (
              <div style={styles.panel}>
                <div style={styles.prefRow}>
                  <label style={styles.checkItem}>
                    <input
                      type="checkbox"
                      checked={notifMobile}
                      onChange={(e) => setNotifMobile(e.target.checked)}
                    />
                    <span>Mobile Push</span>
                  </label>
                  <label style={styles.checkItem}>
                    <input
                      type="checkbox"
                      checked={notifTelegram}
                      onChange={(e) => setNotifTelegram(e.target.checked)}
                    />
                    <span>Telegram</span>
                  </label>
                  <label style={styles.checkItem}>
                    <input
                      type="checkbox"
                      checked={notifEmail}
                      onChange={(e) => setNotifEmail(e.target.checked)}
                    />
                    <span>Email</span>
                  </label>
                </div>

                <div style={styles.divider} />

                <div style={styles.field}>
                  <label style={styles.label}>Severity Selection</label>
                  <select
                    style={styles.select}
                    value={severityPref}
                    onChange={(e) => setSeverityPref(e.target.value)}
                  >
                    <option value="HIGH_ONLY">High only</option>
                    <option value="HIGH_MED">High & Medium</option>
                    <option value="ALL">All severities</option>
                  </select>
                </div>

                <div style={styles.actions}>
                  <button style={styles.primaryBtn} onClick={save}>
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AnalystLayout>
  );
}

const styles = {

  main: { flex: 1, padding: "2rem", overflowY: "auto" },
  heading: { fontSize: "1.5rem", marginBottom: "1rem", color: "#f1f5f9" },
  grid: {
    display: "grid",
    gridTemplateColumns: "360px 1fr",
    gap: "1rem",
  },
  card: {
    backgroundColor: "#111c33",
    border: "1px solid #24324f",
    borderRadius: "12px",
    padding: "1rem",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  },
  avatarWrap: { display: "flex", justifyContent: "center", marginTop: "0.5rem" },
  avatar: {
    width: "96px",
    height: "96px",
    borderRadius: "999px",
    backgroundColor: "#0b1224",
    border: "1px solid #24324f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.2rem",
  },
  name: { textAlign: "center", fontSize: "1.4rem", fontWeight: 900, marginTop: "0.8rem" },
  role: { textAlign: "center", color: "#94a3b8", marginTop: "0.2rem" },
  metaLine: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.55rem 0",
  },
  metaKey: { color: "#94a3b8", fontSize: "0.85rem" },
  metaVal: { fontWeight: 800, fontSize: "0.9rem" },
  divider: { height: "1px", backgroundColor: "#24324f", margin: "0.9rem 0" },
  smallTitle: { fontWeight: 900, marginBottom: "0.5rem" },
  sessionList: { display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "0.9rem" },
  sessionItem: { backgroundColor: "#0b1224", border: "1px solid #24324f", borderRadius: "12px", padding: "0.75rem" },
  sessionWhen: { fontWeight: 900 },
  sessionMeta: { color: "#94a3b8", marginTop: "0.25rem", fontSize: "0.9rem" },
  mono: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" },
  tabs: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
    borderBottom: "1px solid #24324f",
    paddingBottom: "0.75rem",
    marginBottom: "0.9rem",
  },
  tabBtn: {
    backgroundColor: "transparent",
    border: "1px solid #24324f",
    color: "#cbd5e1",
    padding: "0.55rem 0.8rem",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: 800,
  },
  tabActive: {
    borderColor: "#3b82f6",
    color: "#ffffff",
    backgroundColor: "#0b1224",
  },
  panel: { paddingTop: "0.25rem" },
  formRow: { display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "0.9rem" },
  field: { display: "flex", flexDirection: "column", gap: "0.35rem", minWidth: "240px", flex: 1 },
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
  toggleRow: {
    display: "flex",
    gap: "0.6rem",
    alignItems: "center",
    padding: "0.75rem 0.9rem",
    border: "1px solid #24324f",
    borderRadius: "10px",
    backgroundColor: "#0b1224",
  },
  prefRow: { display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "0.75rem" },
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
  actions: { display: "flex", gap: "0.6rem", justifyContent: "flex-end", flexWrap: "wrap" },
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
    width: "100%",
  },

  secondaryInlineBtn: {
    backgroundColor: "#1e293b",
    border: "1px solid #24324f",
    color: "#e2e8f0",
    padding: "0.75rem 1rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 800,
    width: "auto",
  },
};

export default Profile;