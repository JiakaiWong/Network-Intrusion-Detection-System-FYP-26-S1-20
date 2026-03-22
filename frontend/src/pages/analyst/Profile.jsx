import { useMemo, useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "./Dashboard.css";

function Profile() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const isActive  = (path) => location.pathname === path;

  const [tab, setTab]                 = useState("PERSONAL");
  const [fullName, setFullName]       = useState("Analyst 1");
  const [email, setEmail]             = useState("analyst1@example.com");
  const [phone, setPhone]             = useState("+65 9000 0000");
  const [notifMobile, setNotifMobile] = useState(true);
  const [notifTelegram, setNotifTelegram] = useState(true);
  const [notifEmail, setNotifEmail]   = useState(false);
  const [severityPref, setSeverityPref] = useState("HIGH_ONLY");
  const [telegramId, setTelegramId] = useState("");

  const sessions = useMemo(() => [
    { when: "04/23/2024 14:45", ip: "192.168.1.12", agent: "Chrome • Singapore" },
    { when: "04/23/2024 19:30", ip: "10.0.0.45",    agent: "Firefox • Singapore" },
    { when: "04/21/2024 17:15", ip: "172.16.8.21",  agent: "Edge • Singapore" },
  ], []);

  const save = () => alert("Saved (mock). Hook this up to your backend later.");

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId"); // or store user ID on login

      const res = await fetch(`http://localhost:8000/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          full_name: fullName,
          telegram_id: telegramId
        })
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Backend error:", data);
        throw new Error(data.message || "Failed to update profile");
      }
      console.log("Sending telegram_id:", telegramId);
      console.log(JSON.stringify(data, null, 2));
    console.log("Updated profile:", data);
      alert("Profile saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving profile: " + err.message);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/api/users/profile", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();

        setFullName(data.full_name);
        setPhone(data.phone || "");
        setTelegramId(data.telegram_id || ""); 
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="dashboard-container">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-header">🛡️ IDS Monitor</div>
        <nav className="sidebar-nav">
          <ul>
            <li className={isActive("/dashboard") ? "active" : ""}>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className={isActive("/alerts") ? "active" : ""}>
              <Link to="/alerts">Alerts</Link>
            </li>
            <li className={isActive("/network-traffic") ? "active" : ""}>
              <Link to="/network-traffic">Network Traffic</Link>
            </li>
            <li className={isActive("/reports") ? "active" : ""}>
              <Link to="/reports">Reports</Link>
            </li>
            <li className={isActive("/notifications") ? "active" : ""}>
              <Link to="/notifications">Notifications</Link>
            </li>
            <li className={isActive("/analyst/profile") ? "active" : ""}>
              <Link to="/analyst/profile">Profile</Link>
            </li>
          </ul>
        </nav>
        <div className="sidebar-user">
          <hr className="divider" />
          <div className="user-info">
            <span className="user-role">Analyst</span>
            <span className="user-name">Security Analyst 1</span>
          </div>
          <button className="logout-btn"
            onClick={() => { localStorage.clear(); navigate("/logout"); }}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="dashboard-main">
        <h1 style={styles.heading}>Analyst Profile</h1>

        <div style={styles.grid}>
          {/* Left card */}
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
            <button style={styles.secondaryBtn}
              onClick={() => alert("Log out other sessions (mock)")}>
              Log out other sessions
            </button>
          </div>

          {/* Right card — tabs */}
          <div style={styles.card}>
            <div style={styles.tabs}>
              {[["PERSONAL","Personal Info"],["SECURITY","Security Settings"],["NOTIF","Notification Preferences"]].map(([key, label]) => (
                <button key={key}
                  style={{ ...styles.tabBtn, ...(tab === key ? styles.tabActive : {}) }}
                  onClick={() => setTab(key)}>
                  {label}
                </button>
              ))}
            </div>

            {tab === "PERSONAL" && (
              <div style={styles.panel}>
                <div style={styles.formRow}>
                  <div style={styles.field}>
                    <label style={styles.label}>Full Name</label>
                    <input style={styles.input} value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Email</label>
                    <input style={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
                <div style={styles.formRow}>
                  <div style={styles.field}>
                    <label style={styles.label}>Phone</label>
                    <input style={styles.input} value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Department</label>
                    <input style={styles.input} defaultValue="SOC" />
                  </div>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Telegram ID</label>
                  <input
                    style={styles.input}
                    value={telegramId}
                    onChange={(e) => setTelegramId(e.target.value)}
                  />
                </div>
                <div style={styles.actions}>
                  <button style={styles.primaryBtn} onClick={saveProfile}>Save Changes</button>
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
                      <span style={{ color: "#cbd5e1" }}>Enable multi-factor authentication</span>
                    </div>
                  </div>
                </div>
                <div style={styles.actions}>
                  <button style={styles.primaryBtn} onClick={save}>Update Password</button>
                  <button style={styles.secondaryInlineBtn} onClick={() => alert("Show QR setup modal (mock)")}>Setup MFA</button>
                </div>
              </div>
            )}

            {tab === "NOTIF" && (
              <div style={styles.panel}>
                <div style={styles.prefRow}>
                  {[["notifMobile", notifMobile, setNotifMobile, "Mobile Push"],
                    ["notifTelegram", notifTelegram, setNotifTelegram, "Telegram"],
                    ["notifEmail", notifEmail, setNotifEmail, "Email"]
                  ].map(([key, val, setter, label]) => (
                    <label key={key} style={styles.checkItem}>
                      <input type="checkbox" checked={val} onChange={(e) => setter(e.target.checked)} />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
                <div style={styles.divider} />
                <div style={styles.field}>
                  <label style={styles.label}>Severity Selection</label>
                  <select style={styles.select} value={severityPref} onChange={(e) => setSeverityPref(e.target.value)}>
                    <option value="HIGH_ONLY">High only</option>
                    <option value="HIGH_MED">High & Medium</option>
                    <option value="ALL">All severities</option>
                  </select>
                </div>
                <div style={styles.actions}>
                  <button style={styles.primaryBtn} onClick={save}>Save Preferences</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  heading:    { fontSize: "1.5rem", marginBottom: "1rem", color: "#f1f5f9" },
  grid:       { display: "grid", gridTemplateColumns: "360px 1fr", gap: "1rem" },
  card:       { backgroundColor: "#111c33", border: "1px solid #24324f", borderRadius: "12px", padding: "1rem", boxShadow: "0 10px 30px rgba(0,0,0,0.25)" },
  avatarWrap: { display: "flex", justifyContent: "center", marginTop: "0.5rem" },
  avatar:     { width: "96px", height: "96px", borderRadius: "999px", backgroundColor: "#0b1224", border: "1px solid #24324f", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" },
  name:       { textAlign: "center", fontSize: "1.4rem", fontWeight: 900, marginTop: "0.8rem", color: "#f1f5f9" },
  role:       { textAlign: "center", color: "#94a3b8", marginTop: "0.2rem" },
  metaLine:   { display: "flex", justifyContent: "space-between", padding: "0.55rem 0" },
  metaKey:    { color: "#94a3b8", fontSize: "0.85rem" },
  metaVal:    { fontWeight: 800, fontSize: "0.9rem", color: "#f1f5f9" },
  divider:    { height: "1px", backgroundColor: "#24324f", margin: "0.9rem 0" },
  smallTitle: { fontWeight: 900, marginBottom: "0.5rem", color: "#f1f5f9" },
  sessionList:{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "0.9rem" },
  sessionItem:{ backgroundColor: "#0b1224", border: "1px solid #24324f", borderRadius: "12px", padding: "0.75rem" },
  sessionWhen:{ fontWeight: 900, color: "#f1f5f9" },
  sessionMeta:{ color: "#94a3b8", marginTop: "0.25rem", fontSize: "0.9rem" },
  mono:       { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" },
  tabs:       { display: "flex", gap: "0.5rem", flexWrap: "wrap", borderBottom: "1px solid #24324f", paddingBottom: "0.75rem", marginBottom: "0.9rem" },
  tabBtn:     { backgroundColor: "transparent", border: "1px solid #24324f", color: "#cbd5e1", padding: "0.55rem 0.8rem", borderRadius: "999px", cursor: "pointer", fontWeight: 800 },
  tabActive:  { borderColor: "#3b82f6", color: "#ffffff", backgroundColor: "#0b1224" },
  panel:      { paddingTop: "0.25rem" },
  formRow:    { display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "0.9rem" },
  field:      { display: "flex", flexDirection: "column", gap: "0.35rem", minWidth: "240px", flex: 1 },
  label:      { fontSize: "0.8rem", color: "#94a3b8" },
  input:      { backgroundColor: "#0b1224", border: "1px solid #24324f", color: "#e2e8f0", borderRadius: "10px", padding: "0.75rem 0.9rem", outline: "none" },
  select:     { backgroundColor: "#0b1224", border: "1px solid #24324f", color: "#e2e8f0", borderRadius: "10px", padding: "0.75rem 0.9rem", outline: "none" },
  toggleRow:  { display: "flex", gap: "0.6rem", alignItems: "center", padding: "0.75rem 0.9rem", border: "1px solid #24324f", borderRadius: "10px", backgroundColor: "#0b1224" },
  prefRow:    { display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "0.75rem" },
  checkItem:  { display: "flex", gap: "0.5rem", alignItems: "center", padding: "0.65rem 0.85rem", backgroundColor: "#0b1224", border: "1px solid #24324f", borderRadius: "12px", color: "#e2e8f0", fontWeight: 800 },
  actions:    { display: "flex", gap: "0.6rem", justifyContent: "flex-end", flexWrap: "wrap" },
  primaryBtn: { backgroundColor: "#16a34a", border: "none", color: "#fff", padding: "0.75rem 1rem", borderRadius: "10px", cursor: "pointer", fontWeight: 800 },
  secondaryBtn: { backgroundColor: "#1e293b", border: "1px solid #24324f", color: "#e2e8f0", padding: "0.75rem 1rem", borderRadius: "10px", cursor: "pointer", fontWeight: 800, width: "100%" },
  secondaryInlineBtn: { backgroundColor: "#1e293b", border: "1px solid #24324f", color: "#e2e8f0", padding: "0.75rem 1rem", borderRadius: "10px", cursor: "pointer", fontWeight: 800, width: "auto" },
};

export default Profile;
