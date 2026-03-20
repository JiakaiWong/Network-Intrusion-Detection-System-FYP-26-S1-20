import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import axios from "axios";
import { styles } from "./UserManagement.styles";

// ── Config ────────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000";

// ── Helpers ───────────────────────────────────────────────────────────────────
const getId = (user) => user._id || user.id;

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

// ── Close button style ────────────────────────────────────────────────────────
const closeBtnStyle = {
  background: "none", border: "none", color: "#64748b",
  fontSize: "1.1rem", cursor: "pointer", padding: "4px 8px",
  borderRadius: "6px", lineHeight: 1, marginLeft: "auto",
};

// ── Password strength checker ─────────────────────────────────────────────────
function getPasswordStrength(password) {
  if (!password) return null;
  const checks = {
    "8+ characters":     password.length >= 8,
    "Uppercase":         /[A-Z]/.test(password),
    "Lowercase":         /[a-z]/.test(password),
    "Number":            /[0-9]/.test(password),
    "Special character": /[^A-Za-z0-9]/.test(password),
  };
  const score = Object.values(checks).filter(Boolean).length;
  if (score <= 2) return { label: "Weak",   color: "#ef4444", width: "20%",  checks };
  if (score === 3) return { label: "Fair",   color: "#f97316", width: "50%",  checks };
  if (score === 4) return { label: "Good",   color: "#eab308", width: "75%",  checks };
  return             { label: "Strong", color: "#10b981", width: "100%", checks };
}

function PasswordStrength({ password }) {
  const strength = getPasswordStrength(password);
  if (!strength) return null;
  return (
    <div style={{ marginTop: "8px" }}>
      {/* Bar */}
      <div style={{ height: "4px", backgroundColor: "#334155", borderRadius: "2px", overflow: "hidden", marginBottom: "6px" }}>
        <div style={{ height: "100%", width: strength.width, backgroundColor: strength.color, borderRadius: "2px", transition: "width 0.3s ease, background-color 0.3s ease" }} />
      </div>
      {/* Label */}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", marginBottom: "6px" }}>
        <span style={{ color: "#64748b" }}>Password strength</span>
        <span style={{ color: strength.color, fontWeight: 600 }}>{strength.label}</span>
      </div>
      {/* Requirement chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
        {Object.entries(strength.checks).map(([label, ok]) => (
          <span key={label} style={{
            fontSize: "0.7rem", padding: "2px 7px", borderRadius: "9999px",
            backgroundColor: ok ? "rgba(16,185,129,0.1)" : "rgba(100,116,139,0.1)",
            color: ok ? "#10b981" : "#475569",
            border: `1px solid ${ok ? "rgba(16,185,129,0.2)" : "rgba(100,116,139,0.15)"}`,
          }}>
            {ok ? "✓" : "○"} {label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Hamburger Menu Component ──────────────────────────────────────────────────
function ActionMenu({ user, isSelf, onApprove, onReject, onSuspend, onActivate, onEdit, onResetPassword }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const items = [];
  if (user.status === "pending") {
    items.push({ label: "✓ Approve", action: onApprove });
    items.push({ label: "✕ Reject",  action: onReject  });
  }
  if (user.status === "active") {
    items.push({ label: "Edit",           action: onEdit          });
    items.push({ label: "Reset Password", action: onResetPassword });
    if (!isSelf) {
      items.push({ label: "Suspend", action: onSuspend });
    }
  }
  if (!isSelf && (user.status === "suspended" || user.status === "rejected")) {
    items.push({ label: "Reactivate", action: onActivate });
  }

  if (items.length === 0)
    return <span style={{ color: "#475569", fontSize: "0.8rem" }}>—</span>;

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        style={styles.menuTrigger}
        onClick={() => setOpen((o) => !o)}
        title="Actions"
      >
        ···
      </button>
      {open && (
        <div style={styles.dropdown}>
          {items.map(({ label, action }) => (
            <button
              key={label}
              style={styles.dropdownItem}
              onClick={() => { action(); setOpen(false); }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
function UserManagement() {
  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab]   = useState("analysts");

  // Modal state
  const [editingUser, setEditingUser]           = useState(null);
  const [editForm, setEditForm]                 = useState({ full_name: "", role: "", isSelf: false });
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

  const [showAddModal, setShowAddModal]         = useState(false);
  const [addForm, setAddForm]                   = useState({ full_name: "", email: "", role: "Security Analyst", password: "" });
  const [isAddSubmitting, setIsAddSubmitting]   = useState(false);

  const [confirmModal, setConfirmModal] = useState(null);

  const [resetPwdTarget, setResetPwdTarget]       = useState(null);
  const [newPassword, setNewPassword]             = useState("");
  const [confirmPassword, setConfirmPassword]     = useState("");
  const [isResetSubmitting, setIsResetSubmitting] = useState(false);

  const [toast, setToast] = useState(null);

  // Decode logged-in admin's ID from JWT
  const currentAdminId = useMemo(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.user_id ?? null;
    } catch {
      return null;
    }
  }, []);

  // ── Toast ──────────────────────────────────────────────────────────────────
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/api/users`, getAuthHeader());
      setUsers(response.data);
    } catch (err) {
      showToast(err.response?.data?.detail || "Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // ── Derived data ───────────────────────────────────────────────────────────
  const processedUsers = useMemo(() => {
    let result = [...users];

    if (activeTab === "pending") {
      result = result.filter((u) => u.status === "pending");
    } else if (activeTab === "admins") {
      result = result.filter((u) => u.role === "Administrator" && u.status !== "pending");
    } else {
      result = result.filter((u) => u.role === "Security Analyst" && u.status !== "pending");
    }

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        (u) =>
          u.full_name?.toLowerCase().includes(lower) ||
          u.email?.toLowerCase().includes(lower)
      );
    }

    return result;
  }, [users, activeTab, searchTerm]);

  const pendingCount = useMemo(
    () => users.filter((u) => u.status === "pending").length,
    [users]
  );

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleUpdateStatus = async (userId, newStatus) => {
    try {
      await axios.put(
        `${API_BASE}/api/users/${userId}/status`,
        { status: newStatus },
        getAuthHeader()
      );
      showToast(`User marked as ${newStatus}`);
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.detail || "Update failed", "error");
    }
  };

  const handleEditSave = async () => {
    setIsEditSubmitting(true);
    try {
      await axios.put(
        `${API_BASE}/api/users/${getId(editingUser)}`,
        editForm,
        getAuthHeader()
      );

      if (getId(editingUser) === currentAdminId) {
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...stored, full_name: editForm.full_name }));
        window.dispatchEvent(new Event("user-updated"));
      }

      showToast("User updated successfully");
      closeEditModal();
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.detail || "Failed to update", "error");
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const handleAddUser = async () => {
    if (!addForm.password) {
      showToast("Password is required", "error");
      return;
    }
    setIsAddSubmitting(true);
    try {
      await axios.post(`${API_BASE}/api/users/admin-create`, addForm, getAuthHeader());
      showToast("User registered successfully");
      closeAddModal();
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.detail || "Failed to add user", "error");
    } finally {
      setIsAddSubmitting(false);
    }
  };

  const handleAdminResetPassword = async () => {
    if (!newPassword) {
      showToast("New password is required", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    setIsResetSubmitting(true);
    try {
      await axios.post(
        `${API_BASE}/api/users/${getId(resetPwdTarget)}/reset-password`,
        { new_password: newPassword },
        getAuthHeader()
      );
      showToast("Password reset successfully");
      closeResetPwdModal();
    } catch (err) {
      showToast(err.response?.data?.detail || "Error resetting password", "error");
    } finally {
      setIsResetSubmitting(false);
    }
  };

  // ── Modal close helpers ────────────────────────────────────────────────────
  const closeEditModal = () => {
    setEditingUser(null);
    setEditForm({ full_name: "", role: "", isSelf: false });
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setAddForm({ full_name: "", email: "", role: "Security Analyst", password: "" });
  };

  const closeResetPwdModal = () => {
    setResetPwdTarget(null);
    setNewPassword("");
    setConfirmPassword("");
  };

  const openConfirm = (message, onConfirm) => setConfirmModal({ message, onConfirm });

  // ── Style helpers ──────────────────────────────────────────────────────────
  const tabStyle = (id) => ({
    padding: "10px 20px", cursor: "pointer",
    color: activeTab === id ? "#3b82f6" : "#94a3b8",
    borderBottom: activeTab === id ? "2px solid #3b82f6" : "2px solid transparent",
    fontWeight: activeTab === id ? "600" : "400",
    transition: "all 0.2s ease",
  });

  const submittingStyle = { opacity: 0.6, cursor: "not-allowed" };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {toast && (
        <div style={styles.toast(toast.type)}>
          <span>{toast.type === "success" ? "✓" : "✕"}</span> {toast.message}
        </div>
      )}

      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>User Management</h1>
          <p style={styles.subtitle}>System Access Control Panel</p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", borderBottom: "1px solid #1e293b" }}>
          <div style={tabStyle("analysts")} onClick={() => setActiveTab("analysts")}>Analysts</div>
          <div style={tabStyle("admins")}   onClick={() => setActiveTab("admins")}>Administrators</div>
          <div style={tabStyle("pending")}  onClick={() => setActiveTab("pending")}>
            Pending Requests{" "}
            {pendingCount > 0 && (
              <span style={{ background: "#ef4444", color: "white", borderRadius: "10px", padding: "1px 6px", fontSize: "0.7rem", marginLeft: "5px" }}>
                {pendingCount}
              </span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div style={styles.controls}>
          <div style={{ position: "relative", flex: 1 }}>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ ...styles.searchInput, width: "100%" }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "1.2rem" }}
              >
                ×
              </button>
            )}
          </div>
          <button style={styles.addUserBtn} onClick={() => setShowAddModal(true)}>
            + Add User
          </button>
        </div>

        {/* Results count */}
        <div style={{ marginBottom: "10px", fontSize: "0.85rem", color: "#64748b" }}>
          Showing {processedUsers.length} {processedUsers.length === 1 ? "user" : "users"}
        </div>

        {loading ? (
          <div style={{ color: "white", textAlign: "center", padding: "50px" }}>Loading...</div>
        ) : (
          <div style={styles.tableSection}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {processedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ ...styles.td, textAlign: "center", color: "#64748b", padding: "40px" }}>
                      No results found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  processedUsers.map((user) => (
                    <tr
                      key={getId(user)}
                      style={hoveredRow === getId(user) ? styles.trHover : styles.tr}
                      onMouseEnter={() => setHoveredRow(getId(user))}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td style={styles.td}>{user.full_name}</td>
                      <td style={styles.td}>{user.email}</td>
                      <td style={styles.td}><span style={styles.roleBadge(user.role)}>{user.role}</span></td>
                      <td style={styles.td}><span style={styles.statusBadge(user.status)}>{user.status}</span></td>
                      <td style={styles.td}>
                        <ActionMenu
                          user={user}
                          isSelf={getId(user) === currentAdminId}
                          onApprove={() => openConfirm(`Approve ${user.full_name}?`, () => handleUpdateStatus(getId(user), "active"))}
                          onReject={() => openConfirm(`Reject ${user.full_name}?`, () => handleUpdateStatus(getId(user), "rejected"))}
                          onSuspend={() => openConfirm(`Suspend ${user.full_name}?`, () => handleUpdateStatus(getId(user), "suspended"))}
                          onActivate={() => openConfirm(`Reactivate ${user.full_name}?`, () => handleUpdateStatus(getId(user), "active"))}
                          onEdit={() => {
                            setEditingUser(user);
                            setEditForm({ full_name: user.full_name, role: user.role, isSelf: getId(user) === currentAdminId });
                          }}
                          onResetPassword={() => setResetPwdTarget(user)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Edit User Modal ─────────────────────────────────────────────────── */}
      {editingUser && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={{ ...styles.modalHeader, display: "flex", alignItems: "center" }}>
              <h2 style={styles.modalTitle}>Edit User</h2>
              <button style={closeBtnStyle} onClick={closeEditModal} disabled={isEditSubmitting}>✕</button>
            </div>
            <div style={styles.modalBody}>
              <label style={styles.fieldLabel}>Full Name</label>
              <input
                style={styles.inputField}
                type="text"
                value={editForm.full_name}
                onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
              />
              <label style={styles.fieldLabel}>Role</label>
              <select
                style={{ ...styles.inputField, ...(editForm.isSelf ? { opacity: 0.5, cursor: "not-allowed" } : {}) }}
                value={editForm.role}
                disabled={editForm.isSelf}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              >
                <option value="Administrator">Administrator</option>
                <option value="Security Analyst">Security Analyst</option>
              </select>
              {editForm.isSelf && (
                <p style={{ color: "#64748b", fontSize: "0.78rem", marginTop: "4px" }}>
                  You cannot change your own role.
                </p>
              )}
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.cancelBtn} onClick={closeEditModal} disabled={isEditSubmitting}>Cancel</button>
              <button
                style={{ ...styles.saveBtn, ...(isEditSubmitting ? submittingStyle : {}) }}
                onClick={handleEditSave}
                disabled={isEditSubmitting}
              >
                {isEditSubmitting ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add User Modal ──────────────────────────────────────────────────── */}
      {showAddModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={{ ...styles.modalHeader, display: "flex", alignItems: "center" }}>
              <h2 style={styles.modalTitle}>Add User</h2>
              <button style={closeBtnStyle} onClick={closeAddModal} disabled={isAddSubmitting}>✕</button>
            </div>
            <div style={styles.modalBody}>
              <label style={styles.fieldLabel}>Full Name</label>
              <input
                style={styles.inputField}
                type="text"
                value={addForm.full_name}
                onChange={(e) => setAddForm({ ...addForm, full_name: e.target.value })}
              />
              <label style={styles.fieldLabel}>Email</label>
              <input
                style={styles.inputField}
                type="email"
                value={addForm.email}
                onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
              />
              <label style={styles.fieldLabel}>Role</label>
              <select
                style={styles.inputField}
                value={addForm.role}
                onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
              >
                <option value="Administrator">Administrator</option>
                <option value="Security Analyst">Security Analyst</option>
              </select>
              <label style={styles.fieldLabel}>Password</label>
              <input
                style={styles.inputField}
                type="password"
                placeholder="Enter a password"
                value={addForm.password}
                onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
              />
              <PasswordStrength password={addForm.password} />
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.cancelBtn} onClick={closeAddModal} disabled={isAddSubmitting}>Cancel</button>
              <button
                style={{ ...styles.saveBtn, ...(isAddSubmitting ? submittingStyle : {}) }}
                onClick={handleAddUser}
                disabled={isAddSubmitting}
              >
                {isAddSubmitting ? "Registering…" : "Register"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Admin Reset Password Modal ──────────────────────────────────────── */}
      {resetPwdTarget && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={{ ...styles.modalHeader, display: "flex", alignItems: "center" }}>
              <h2 style={styles.modalTitle}>Reset Password</h2>
              <button style={closeBtnStyle} onClick={closeResetPwdModal} disabled={isResetSubmitting}>✕</button>
            </div>
            <div style={styles.modalBody}>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "12px" }}>
                Resetting password for:{" "}
                <strong style={{ color: "#e2e8f0" }}>{resetPwdTarget.full_name}</strong>
              </p>
              <label style={styles.fieldLabel}>New Password</label>
              <input
                style={styles.inputField}
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <PasswordStrength password={newPassword} />
              <label style={styles.fieldLabel}>Confirm New Password</label>
              <input
                style={styles.inputField}
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.cancelBtn} onClick={closeResetPwdModal} disabled={isResetSubmitting}>Cancel</button>
              <button
                style={{ ...styles.saveBtn, ...(isResetSubmitting ? submittingStyle : {}) }}
                onClick={handleAdminResetPassword}
                disabled={isResetSubmitting}
              >
                {isResetSubmitting ? "Updating…" : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm Modal ───────────────────────────────────────────────────── */}
      {confirmModal && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modal, maxWidth: "360px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ ...styles.modalHeader, display: "flex", alignItems: "center" }}>
              <h2 style={styles.modalTitle}>Confirm</h2>
              <button style={closeBtnStyle} onClick={() => setConfirmModal(null)}>✕</button>
            </div>
            <div style={{ padding: "20px", color: "#94a3b8" }}>{confirmModal.message}</div>
            <div style={styles.modalFooter}>
              <button style={styles.cancelBtn} onClick={() => setConfirmModal(null)}>Cancel</button>
              <button
                style={styles.saveBtn}
                onClick={() => { confirmModal.onConfirm(); setConfirmModal(null); }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserManagement;