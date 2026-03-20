import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000";

// ── Password strength logic ──────────────────────────────────────────────────
function getPasswordStrength(password) {
  if (!password) return null;
  const checks = {
    "8+ characters": password.length >= 8,
    "Uppercase letter": /[A-Z]/.test(password),
    "Lowercase letter": /[a-z]/.test(password),
    "Number": /[0-9]/.test(password),
    "Special character": /[^A-Za-z0-9]/.test(password),
  };
  const score = Object.values(checks).filter(Boolean).length;
  if (score <= 2) return { label: "Weak", color: "#ef4444", width: "20%", checks };
  if (score === 3) return { label: "Fair", color: "#f97316", width: "50%", checks };
  if (score === 4) return { label: "Good", color: "#eab308", width: "75%", checks };
  return { label: "Strong", color: "#10b981", width: "100%", checks };
}

// ── Unified Styles ──────────────────────────────────────────────────────────
const s = {
  page: {
    flex: 1, padding: "2rem",
    backgroundColor: "#0f172a", color: "#f1f5f9",
    overflowY: "auto", height: "100vh", boxSizing: "border-box",
    fontFamily: "'Inter', sans-serif",
  },
  toast: (type) => ({
    position: "fixed", top: "1.5rem", right: "1.5rem", zIndex: 9999,
    display: "flex", alignItems: "center", gap: "0.6rem",
    padding: "0.75rem 1.25rem", borderRadius: "10px",
    fontSize: "0.9rem", fontWeight: 500,
    backgroundColor: type === "success" ? "#10b981" : "#ef4444",
    color: "#fff", boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
  }),
  heroCard: {
    background: "linear-gradient(135deg, #1e3a5f 0%, #1e293b 60%, #0f172a 100%)",
    border: "1px solid #334155", borderRadius: "16px",
    padding: "2rem", marginBottom: "1.5rem",
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.5rem",
  },
  avatar: {
    width: "76px", height: "76px", borderRadius: "50%",
    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "1.7rem", fontWeight: 700, color: "white",
    position: "relative",
  },
  onlineDot: {
    position: "absolute", bottom: "4px", right: "4px",
    width: "14px", height: "14px", borderRadius: "50%",
    backgroundColor: "#10b981", border: "2px solid #0f172a",
  },
  badgeRow: { display: "flex", gap: "8px", marginTop: "10px" },
  roleBadge: {
    padding: "4px 12px", borderRadius: "99px", fontSize: "0.75rem",
    backgroundColor: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.3)",
  },
  card: {
    backgroundColor: "#1e293b", border: "1px solid #334155",
    borderRadius: "16px", padding: "1.75rem", marginBottom: "1.5rem",
  },
  inputGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" },
  input: (editable) => ({
    padding: "0.75rem 1rem", width: "100%", boxSizing: "border-box",
    backgroundColor: editable ? "#334155" : "#0f172a",
    border: `1px solid ${editable ? "#3b82f6" : "#334155"}`,
    borderRadius: "8px", color: editable ? "#fff" : "#94a3b8",
    outline: "none", transition: "all 0.2s ease",
  }),
  overlay: {
    position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
  },
  modal: {
    backgroundColor: "#1e293b", borderRadius: "16px", padding: "2rem",
    width: "90%", maxWidth: "440px", border: "1px solid #334155",
  },
  strengthBar: { height: "4px", backgroundColor: "#334155", borderRadius: "2px", margin: "8px 0" },
  btnPrimary: { padding: "0.7rem 1.4rem", borderRadius: "8px", border: "none", backgroundColor: "#3b82f6", color: "#fff", cursor: "pointer", fontWeight: 600 },
  btnSecondary: { padding: "0.7rem 1.4rem", borderRadius: "8px", border: "1px solid #334155", backgroundColor: "transparent", color: "#94a3b8", cursor: "pointer" }
};

function Profile() {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({ full_name: "", email: "", role: "", status: "active" });
  const [formData, setFormData] = useState({ full_name: "" });
  const [toast, setToast] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", newPass: "", confirm: "" });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  const toastTimer = useRef(null);

  // ── Helpers ──────────────────────────────────────────────────────
  const showToast = useCallback((message, type = "success") => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const getAuthHeader = useCallback(() => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  }), []);

  // ── Fetch Profile ────────────────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/api/users/profile`, getAuthHeader());
        setUserData(res.data);
        setFormData({ full_name: res.data.full_name });
      } catch (err) {
        showToast("Failed to load profile", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
    return () => { if (toastTimer.current) clearTimeout(toastTimer.current); };
  }, [getAuthHeader, showToast]);

  // ── Actions ──────────────────────────────────────────────────────
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!formData.full_name.trim()) return showToast("Name is required", "error");
    
    setIsSaving(true);
    try {
      await axios.put(`${API_BASE}/api/users/profile`, formData, getAuthHeader());
      setUserData(prev => ({ ...prev, ...formData }));
      setEditing(false);
      
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...stored, ...formData }));
      window.dispatchEvent(new Event("user-updated"));
      showToast("Profile updated!");
    } catch (err) {
      showToast(err.response?.data?.detail || "Update failed", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async () => {
    const errors = {};
    const strength = getPasswordStrength(passwordForm.newPass);

    if (!passwordForm.current) errors.current = "Required";
    if (strength?.label === "Weak") errors.newPass = "Password is too weak";
    if (passwordForm.newPass !== passwordForm.confirm) errors.confirm = "Passwords do not match";

    if (Object.keys(errors).length > 0) return setPasswordErrors(errors);

    setIsPasswordSubmitting(true);
    try {
      await axios.put(`${API_BASE}/api/users/profile/password`, {
        current_password: passwordForm.current,
        new_password: passwordForm.newPass,
      }, getAuthHeader());
      setShowPasswordModal(false);
      setPasswordForm({ current: "", newPass: "", confirm: "" });
      showToast("Password updated!");
    } catch (err) {
      showToast(err.response?.data?.detail || "Update failed", "error");
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  if (loading) return <div style={{...s.page, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Loading...</div>;

  const initials = userData.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const strength = getPasswordStrength(passwordForm.newPass);

  return (
    <div style={s.page}>
      {toast && <div style={s.toast(toast.type)}>{toast.message}</div>}

      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Profile</h1>
      <p style={{ color: "#64748b", marginBottom: "2rem" }}>Manage your account settings</p>

      {/* Hero */}
      <div style={s.heroCard}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={s.avatar}>
            {initials}
            <div style={s.onlineDot} />
          </div>
          <div>
            <h2 style={{ margin: 0 }}>{userData.full_name}</h2>
            <p style={{ color: "#64748b", margin: "4px 0" }}>{userData.email}</p>
            <div style={s.badgeRow}>
              <span style={s.roleBadge}>{userData.role}</span>
              <span style={{ ...s.roleBadge, color: "#10b981", borderColor: "#10b981" }}>{userData.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Card */}
      <div style={s.card}>
        <h3 style={{ fontSize: "0.8rem", color: "#64748b", textTransform: "uppercase", marginBottom: "1.5rem" }}>Account Details</h3>
        <form onSubmit={handleSaveProfile}>
          <div style={s.inputGrid}>
            <div>
              <label style={{ fontSize: "0.8rem", color: "#64748b" }}>Full Name</label>
              <input 
                style={s.input(editing)} 
                value={formData.full_name} 
                onChange={e => setFormData({full_name: e.target.value})}
                readOnly={!editing}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", color: "#64748b" }}>Email</label>
              <input style={s.input(false)} value={userData.email} readOnly />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem", borderTop: "1px solid #334155", paddingTop: "1.5rem" }}>
            <button type="button" style={s.btnSecondary} onClick={() => setShowPasswordModal(true)}>Change Password</button>
            <div>
              {editing ? (
                <>
                  <button type="button" style={{...s.btnSecondary, marginRight: "10px"}} onClick={() => setEditing(false)}>Cancel</button>
                  <button type="submit" style={s.btnPrimary} disabled={isSaving}>{isSaving ? "Saving..." : "Save Changes"}</button>
                </>
              ) : (
                <button type="button" style={s.btnPrimary} onClick={() => setEditing(true)}>Edit Profile</button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div style={s.overlay} onClick={() => setShowPasswordModal(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h2 style={{ marginTop: 0 }}>Change Password</h2>
            
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontSize: "0.8rem", color: "#64748b" }}>Current Password</label>
              <input 
                type="password" style={s.input(true)} 
                value={passwordForm.current}
                onChange={e => setPasswordForm(p => ({ ...p, current: e.target.value }))}
              />
              {passwordErrors.current && <small style={{ color: "#ef4444" }}>{passwordErrors.current}</small>}
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontSize: "0.8rem", color: "#64748b" }}>New Password</label>
              <input 
                type="password" style={s.input(true)} 
                value={passwordForm.newPass}
                onChange={e => setPasswordForm(p => ({ ...p, newPass: e.target.value }))}
              />
              {strength && (
                <>
                  <div style={s.strengthBar}><div style={{ height: "100%", width: strength.width, backgroundColor: strength.color }} /></div>
                  <small style={{ color: strength.color }}>Strength: {strength.label}</small>
                </>
              )}
              {passwordErrors.newPass && <div style={{ color: "#ef4444", fontSize: '0.8rem' }}>{passwordErrors.newPass}</div>}
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ fontSize: "0.8rem", color: "#64748b" }}>Confirm Password</label>
              <input 
                type="password" style={s.input(true)} 
                value={passwordForm.confirm}
                onChange={e => setPasswordForm(p => ({ ...p, confirm: e.target.value }))}
              />
              {passwordErrors.confirm && <small style={{ color: "#ef4444" }}>{passwordErrors.confirm}</small>}
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button style={{ ...s.btnSecondary, flex: 1 }} onClick={() => setShowPasswordModal(false)}>Cancel</button>
              <button style={{ ...s.btnPrimary, flex: 1 }} onClick={handlePasswordSubmit} disabled={isPasswordSubmitting}>
                {isPasswordSubmitting ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;