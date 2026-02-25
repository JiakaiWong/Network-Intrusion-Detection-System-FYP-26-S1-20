import React, { useState } from "react";

const activityData = [
  { icon: "🔐", title: "Successful login", time: "2 min ago" },
  { icon: "✏️", title: "Profile updated", time: "1 hour ago" },
  { icon: "👁️", title: "Viewed dashboard", time: "3 hours ago" },
];

const securityItems = [
  { icon: "🔑", label: "Change Password" },
  { icon: "🔐", label: "Two-Factor Authentication" },
  { icon: "📧", label: "Email & Notifications" },
  { icon: "🛡️", label: "Active Sessions" },
];

const styles = {
  content: {
    flex: 1,
    padding: "2rem",
    background: "#0f172a",
    color: "#f1f5f9",
    fontFamily: "'Inter', sans-serif",
    height: "100vh",
    overflowY: "auto",
  },
  header: { marginBottom: "2rem" },
  pageTitle: { fontSize: "2rem", fontWeight: "800", margin: 0 },
  subtitle: { color: "#94a3b8", fontSize: "1rem", margin: "0.5rem 0 0 0" },
  
  profileCard: {
    background: "#1e293b",
    borderRadius: "20px",
    padding: "2rem",
    border: "1px solid #334155",
    marginBottom: "1.5rem",
  },
  // NEW: Horizontal layout with badges on right
  avatarRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid #334155",
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  avatarSection: {
    position: "relative",
  },
  avatar: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "#3b82f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.375rem",
    fontWeight: "700",
    color: "white",
  },
  statusDot: {
    position: "absolute",
    bottom: "-2px",
    right: "-2px",
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    background: "#10b981",
    border: "3px solid #1e293b",
  },
  profileName: { 
    fontSize: "1.5rem", 
    fontWeight: "800", 
    margin: 0,
  },
  // Right side badges
  badgeRow: {
    display: "flex",
    gap: "0.5rem",
  },
  roleBadgeSmall: {
    padding: "0.25rem 0.6rem",
    background: "#3b82f6",
    color: "white",
    borderRadius: "6px",
    fontSize: "0.7rem",
    fontWeight: 600,
  },
  statusBadgeSmall: {
    padding: "0.25rem 0.6rem",
    background: "#10b981",
    color: "white",
    borderRadius: "6px",
    fontSize: "0.7rem",
    fontWeight: 600,
  },
  inputGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.25rem",
    marginBottom: "2rem",
  },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "0.375rem" },
  label: { 
    fontSize: "0.6875rem", 
    fontWeight: "700", 
    color: "#60a5fa", 
    textTransform: "uppercase",
  },
  input: (editing) => ({
    padding: "0.875rem 1rem",
    background: editing ? "#2d3748" : "#1a202c",
    border: editing ? "2px solid #3b82f6" : "1px solid #4a5568",
    borderRadius: "10px",
    color: "#f1f5f9",
    fontSize: "0.9375rem",
  }),
  actionSection: { 
    display: "flex", 
    justifyContent: "flex-end", 
    gap: "1rem",
    paddingTop: "1rem",
  },
  btn: {
    padding: "0.75rem 1.75rem",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "0.875rem",
  },
  editBtn: { background: "#3b82f6", color: "white" },
  saveBtn: { background: "#10b981", color: "white" },
  cancelBtn: { 
    background: "transparent", 
    color: "#94a3b8", 
    border: "1px solid #4a5568" 
  },
  section: {
    background: "#1e293b",
    borderRadius: "16px",
    padding: "1.5rem",
    border: "1px solid #334155",
    marginBottom: "1.5rem",
  },
  sectionTitle: { fontSize: "1.25rem", fontWeight: "700", margin: "0 0 1rem 0" },
  activityItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem",
    background: "#111827",
    borderRadius: "8px",
  },
  securityGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "0.75rem",
  },
  securityItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.875rem",
    background: "#111827",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

function Profile() {
  const [editing, setEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "Sarah Lim",
    email: "sarah.lim@company.com",
    phone: "+65 9123 4567",
    department: "Security Operations",
    status: "Active",
  });
  const [formData, setFormData] = useState(userData);

  const toggleEdit = () => {
    if (editing) setUserData({ ...formData });
    else setFormData({ ...userData });
    setEditing(!editing);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Saved:", formData);
    setUserData({ ...formData });
    setEditing(false);
  };

  return (
    <div style={styles.content}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Profile</h1>
        <p style={styles.subtitle}>Manage your account settings</p>
      </div>

      <div style={styles.profileCard}>
        {/* NEW LAYOUT: Name left, badges right */}
        <div style={styles.avatarRow}>
          <div style={styles.leftSection}>
            <div style={styles.avatarSection}>
              <div style={styles.avatar}>SL</div>
              <div style={styles.statusDot} />
            </div>
            <h2 style={styles.profileName}>{userData.name}</h2>
          </div>
          <div style={styles.badgeRow}>
            <span style={styles.roleBadgeSmall}>Admin</span>
            <span style={styles.statusBadgeSmall}>{userData.status}</span>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div style={styles.inputGrid}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Full Name</label>
              <input name="name" value={formData.name} onChange={handleChange} style={styles.input(editing)} readOnly={!editing} />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} style={styles.input(editing)} readOnly={!editing} />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Phone</label>
              <input name="phone" value={formData.phone} onChange={handleChange} style={styles.input(editing)} readOnly={!editing} />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Department</label>
              <input name="department" value={formData.department} onChange={handleChange} style={styles.input(editing)} readOnly={!editing} />
            </div>
          </div>

          <div style={styles.actionSection}>
            {editing ? (
              <>
                <button type="button" onClick={toggleEdit} style={{ ...styles.btn, ...styles.cancelBtn }}>Cancel</button>
                <button type="submit" style={{ ...styles.btn, ...styles.saveBtn }}>Save</button>
              </>
            ) : (
              <button type="button" onClick={toggleEdit} style={{ ...styles.btn, ...styles.editBtn }}>✏️ Edit Profile</button>
            )}
          </div>
        </form>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Recent Activity</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {activityData.map((item, i) => (
            <div key={i} style={styles.activityItem}>
              <span>{item.icon}</span>
              <span>{item.title}</span>
              <span style={{ color: "#94a3b8", marginLeft: "auto" }}>{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Security Settings</h2>
        <div style={styles.securityGrid}>
          {securityItems.map((item, i) => (
            <div key={i} style={styles.securityItem}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
              <span>›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
