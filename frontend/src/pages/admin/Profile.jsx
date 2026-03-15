import React, { useState } from "react";
import { styles } from "./Profile.styles";

function Profile() {
  const [editing, setEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "Sarah Lim",
    email: "sarah.lim@company.com",
    phone: "+65 9123 4567",
    department: "Security Operations",
    status: "Active",
  });
  const [formData, setFormData] = useState({ ...userData });
  const [toast, setToast] = useState(null);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", newPass: "", confirm: "" });
  const [passwordErrors, setPasswordErrors] = useState({});

  const role = localStorage.getItem("role") === "admin" ? "Admin" : "Analyst";

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleStartEdit = () => {
    setFormData({ ...userData });
    setEditing(true);
  };

  const handleCancel = () => {
    setFormData({ ...userData });
    setEditing(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setUserData({ ...formData });
    setEditing(false);
    showToast("Profile updated successfully");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) setPasswordErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validatePassword = () => {
    const errors = {};
    if (!passwordForm.current) errors.current = "Current password is required";
    if (!passwordForm.newPass) errors.newPass = "New password is required";
    else if (passwordForm.newPass.length < 8) errors.newPass = "Password must be at least 8 characters";
    if (!passwordForm.confirm) errors.confirm = "Please confirm your new password";
    else if (passwordForm.newPass !== passwordForm.confirm) errors.confirm = "Passwords do not match";
    return errors;
  };

  const handleSavePassword = () => {
    const errors = validatePassword();
    if (Object.keys(errors).length > 0) { setPasswordErrors(errors); return; }
    setShowPasswordModal(false);
    setPasswordForm({ current: "", newPass: "", confirm: "" });
    setPasswordErrors({});
    showToast("Password changed successfully");
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordForm({ current: "", newPass: "", confirm: "" });
    setPasswordErrors({});
  };

  const initials = userData.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div style={styles.content}>
      {/* Toast */}
      {toast && (
        <div style={styles.toast(toast.type)}>
          <span>{toast.type === "success" ? "+" : toast.type === "error" ? "x" : "i"}</span>
          {toast.message}
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div style={styles.modalOverlay} onClick={handleClosePasswordModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Change Password</h2>
              <button style={styles.closeBtn} onClick={handleClosePasswordModal}>x</button>
            </div>
            <div style={styles.modalBody}>
              {[
                { label: "Current Password", name: "current" },
                { label: "New Password", name: "newPass" },
                { label: "Confirm New Password", name: "confirm" },
              ].map(({ label, name }) => (
                <div key={name} style={styles.formGroup}>
                  <label style={styles.fieldLabel}>{label}</label>
                  <input
                    type="password"
                    name={name}
                    value={passwordForm[name]}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    style={{
                      ...styles.modalInput,
                      border: passwordErrors[name] ? "1px solid #ef4444" : "1px solid #334155",
                    }}
                  />
                  {passwordErrors[name] && (
                    <span style={styles.errorText}>{passwordErrors[name]}</span>
                  )}
                </div>
              ))}
              <div style={styles.infoBox}>
                Password must be at least 8 characters long.
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.modalCancelBtn} onClick={handleClosePasswordModal}>Cancel</button>
              <button style={styles.modalSaveBtn} onClick={handleSavePassword}>Change Password</button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Profile</h1>
        <p style={styles.subtitle}>Manage your account settings</p>
      </div>

      {/* Profile Card */}
      <div style={styles.profileCard}>
        <div style={styles.avatarRow}>
          <div style={styles.leftSection}>
            <div style={styles.avatarSection}>
              <div style={styles.avatar}>{initials}</div>
              <div style={styles.statusDot} />
            </div>
            <div>
              <h2 style={styles.profileName}>{userData.name}</h2>
              <p style={styles.profileEmail}>{userData.email}</p>
            </div>
          </div>
          <div style={styles.badgeRow}>
            <span style={styles.roleBadgeSmall}>{role}</span>
            <span style={styles.statusBadgeSmall}>{userData.status}</span>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div style={styles.inputGrid}>
            {[
              { label: "Full Name", name: "name", type: "text" },
              { label: "Email", name: "email", type: "email" },
              { label: "Phone", name: "phone", type: "text" },
              { label: "Department", name: "department", type: "text" },
            ].map(({ label, name, type }) => (
              <div key={name} style={styles.fieldGroup}>
                <label style={styles.label}>{label}</label>
                <input
                  name={name}
                  type={type}
                  value={formData[name]}
                  onChange={handleChange}
                  style={styles.input(editing)}
                  readOnly={!editing}
                />
              </div>
            ))}
          </div>

          <div style={styles.actionSection}>
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              style={{ ...styles.btn, ...styles.passwordBtn }}
            >
              Change Password
            </button>
            <div style={styles.editActions}>
              {editing ? (
                <>
                  <button type="button" onClick={handleCancel} style={{ ...styles.btn, ...styles.cancelBtn }}>
                    Cancel
                  </button>
                  <button type="submit" style={{ ...styles.btn, ...styles.saveBtn }}>
                    Save Changes
                  </button>
                </>
              ) : (
                <button type="button" onClick={handleStartEdit} style={{ ...styles.btn, ...styles.editBtn }}>
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;