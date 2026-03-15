import React, { useState, useEffect, useRef } from "react";
import { styles } from "./UserManagement.styles";

const INITIAL_USERS = [
  { id: 1, name: "John Wong", email: "john.wong@company.com", role: "Analyst", status: "Active", lastLogin: "2026-02-25" },
  { id: 2, name: "Sarah Lim", email: "sarah.lim@company.com", role: "Admin", status: "Active", lastLogin: "2026-02-24" },
  { id: 3, name: "Mike Tan", email: "mike.tan@company.com", role: "Analyst", status: "Pending", lastLogin: "-" },
  { id: 4, name: "Lisa Chen", email: "lisa.chen@company.com", role: "Admin", status: "Pending", lastLogin: "-" },
];

// ── Hamburger Menu ─────────────────────────────────────────
function ActionMenu({ user, onApprove, onReject, onSuspend, onActivate, onEdit, onResetPassword }) {
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
  if (user.status === "Pending") {
    items.push({ label: "Approve", action: onApprove });
    items.push({ label: "Reject", action: onReject });
  }
  if (user.status === "Active") {
    items.push({ label: "Edit", action: onEdit });
    items.push({ label: "Reset Password", action: onResetPassword });
    items.push({ label: "Suspend", action: onSuspend });
  }
  if (user.status === "Suspended") {
    items.push({ label: "Activate", action: onActivate });
    items.push({ label: "Edit", action: onEdit });
  }
  if (user.status === "Rejected") {
    items.push({ label: "Re-approve", action: onActivate });
  }

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button style={styles.menuTrigger} onClick={() => setOpen((o) => !o)} title="Actions">
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

// ── Filter/Sort Dropdown ───────────────────────────────────
function SelectDropdown({ value, onChange, options, placeholder }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={styles.selectDropdown}>
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

// ── Main Component ─────────────────────────────────────────
function UserManagement() {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState(INITIAL_USERS);

  // ── Filter & Sort state ───────────────────────────────────
  const [filterStatus, setFilterStatus] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterLogin, setFilterLogin] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Modal states
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", email: "", role: "Analyst", status: "Active" });
  const [addErrors, setAddErrors] = useState({});
  const [confirmModal, setConfirmModal] = useState(null);
  const [resetModal, setResetModal] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const activeFiltersCount = [filterStatus, filterRole, filterLogin, sortBy].filter(Boolean).length;

  const clearFilters = () => {
    setFilterStatus("");
    setFilterRole("");
    setFilterLogin("");
    setSortBy("");
  };

  // ── Filter + Sort logic ───────────────────────────────────
  const processedUsers = (() => {
    let result = [...users];

    // Search
    if (searchTerm) {
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus) result = result.filter((u) => u.status === filterStatus);

    // Filter by role
    if (filterRole) result = result.filter((u) => u.role === filterRole);

    // Filter by last login
    if (filterLogin) {
      result = result.filter((u) => {
        if (filterLogin === "never") return u.lastLogin === "-";
        if (filterLogin === "today") return u.lastLogin === new Date().toISOString().split("T")[0];
        if (filterLogin === "week") {
          if (u.lastLogin === "-") return false;
          const diff = (new Date() - new Date(u.lastLogin)) / (1000 * 60 * 60 * 24);
          return diff <= 7;
        }
        return true;
      });
    }

    // Sort
    if (sortBy) {
      result.sort((a, b) => {
        switch (sortBy) {
          case "name_asc": return a.name.localeCompare(b.name);
          case "name_desc": return b.name.localeCompare(a.name);
          case "login_newest":
            if (a.lastLogin === "-") return 1;
            if (b.lastLogin === "-") return -1;
            return new Date(b.lastLogin) - new Date(a.lastLogin);
          case "login_oldest":
            if (a.lastLogin === "-") return 1;
            if (b.lastLogin === "-") return -1;
            return new Date(a.lastLogin) - new Date(b.lastLogin);
          case "role": return a.role.localeCompare(b.role);
          case "status": return a.status.localeCompare(b.status);
          default: return 0;
        }
      });
    }

    return result;
  })();

  // ── Actions ───────────────────────────────────────────────
  const handleApprove = (userId) => {
    const user = users.find((u) => u.id === userId);
    setConfirmModal({
      title: "Approve User",
      message: `Approve ${user.name}? This will grant them full access.`,
      confirmLabel: "Approve",
      confirmColor: "#10b981",
      onConfirm: () => {
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: "Active" } : u));
        showToast(`${user.name} approved successfully`);
      },
    });
  };

  const handleReject = (userId) => {
    const user = users.find((u) => u.id === userId);
    setConfirmModal({
      title: "Reject Registration",
      message: `Reject ${user.name}'s registration? Their account will be marked as rejected.`,
      confirmLabel: "Reject",
      confirmColor: "#ef4444",
      onConfirm: () => {
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: "Rejected" } : u));
        showToast(`${user.name}'s registration rejected`, "error");
      },
    });
  };

  const handleSuspend = (userId) => {
    const user = users.find((u) => u.id === userId);
    setConfirmModal({
      title: "Suspend Account",
      message: `Suspend ${user.name}? This will temporarily disable their account access.`,
      confirmLabel: "Suspend",
      confirmColor: "#ef4444",
      onConfirm: () => {
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: "Suspended" } : u));
        showToast(`${user.name}'s account suspended`, "error");
      },
    });
  };

  const handleActivate = (userId) => {
    const user = users.find((u) => u.id === userId);
    setConfirmModal({
      title: "Activate Account",
      message: `Activate ${user.name}? This will restore their full account access.`,
      confirmLabel: "Activate",
      confirmColor: "#10b981",
      onConfirm: () => {
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: "Active" } : u));
        showToast(`${user.name}'s account activated`);
      },
    });
  };

  const handleResetPassword = (user) => setResetModal(user);

  const confirmResetPassword = () => {
    showToast(`Password reset link sent to ${resetModal.email}`);
    setResetModal(null);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditForm({ name: user.name, email: user.email, role: user.role, status: user.status });
  };

  const handleSaveEdit = () => {
    setUsers((prev) => prev.map((u) => u.id === editingUser.id ? { ...u, ...editForm } : u));
    showToast(`${editForm.name}'s profile updated`);
    setEditingUser(null);
    setEditForm({});
  };

  const validateAddForm = () => {
    const errors = {};
    if (!addForm.name.trim()) errors.name = "Name is required";
    if (!addForm.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(addForm.email)) errors.email = "Invalid email address";
    else if (users.some((u) => u.email.toLowerCase() === addForm.email.toLowerCase()))
      errors.email = "Email already exists";
    return errors;
  };

  const handleAddUser = () => {
    const errors = validateAddForm();
    if (Object.keys(errors).length > 0) { setAddErrors(errors); return; }
    const newUser = {
      id: Date.now(),
      name: addForm.name.trim(),
      email: addForm.email.trim(),
      role: addForm.role,
      status: addForm.status,
      lastLogin: "-",
    };
    setUsers((prev) => [...prev, newUser]);
    showToast(`Account created for ${newUser.name}`);
    setShowAddModal(false);
    setAddForm({ name: "", email: "", role: "Analyst", status: "Active" });
    setAddErrors({});
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setAddForm({ name: "", email: "", role: "Analyst", status: "Active" });
    setAddErrors({});
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <>
      {toast && (
        <div style={styles.toast(toast.type)}>
          <span>{toast.type === "success" ? "✓" : "✕"}</span>
          {toast.message}
        </div>
      )}

      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>User Management</h1>
          <p style={styles.subtitle}>Approve, manage, and assign roles to registered users</p>
        </div>

        {/* ── Search + Add ── */}
        <div style={styles.controls}>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <button style={styles.addUserBtn} onClick={() => setShowAddModal(true)}>
            + Add User
          </button>
        </div>

        {/* ── Filter + Sort bar ── */}
        <div style={styles.filterBar}>
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Filter by</span>
            <SelectDropdown
              value={filterStatus}
              onChange={setFilterStatus}
              placeholder="Status"
              options={[
                { value: "Active", label: "Active" },
                { value: "Pending", label: "Pending" },
                { value: "Suspended", label: "Suspended" },
                { value: "Rejected", label: "Rejected" },
              ]}
            />
            <SelectDropdown
              value={filterRole}
              onChange={setFilterRole}
              placeholder="Role"
              options={[
                { value: "Admin", label: "Admin" },
                { value: "Analyst", label: "Analyst" },
              ]}
            />
            <SelectDropdown
              value={filterLogin}
              onChange={setFilterLogin}
              placeholder="Last Login"
              options={[
                { value: "today", label: "Today" },
                { value: "week", label: "Past 7 days" },
                { value: "never", label: "Never logged in" },
              ]}
            />
          </div>

          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Sort by</span>
            <SelectDropdown
              value={sortBy}
              onChange={setSortBy}
              placeholder="Sort by"
              options={[
                { value: "name_asc", label: "Name (A → Z)" },
                { value: "name_desc", label: "Name (Z → A)" },
                { value: "login_newest", label: "Last Login (Newest)" },
                { value: "login_oldest", label: "Last Login (Oldest)" },
                { value: "role", label: "Role" },
                { value: "status", label: "Status" },
              ]}
            />
          </div>

          {/* Clear filters button — only shown when something is active */}
          {activeFiltersCount > 0 && (
            <button style={styles.clearBtn} onClick={clearFilters}>
              ✕ Clear ({activeFiltersCount})
            </button>
          )}
        </div>

        {/* Results count */}
        <p style={styles.resultsCount}>
          Showing {processedUsers.length} of {users.length} users
        </p>

        <div style={styles.tableSection}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Last Login</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {processedUsers.map((user) => (
                <tr
                  key={user.id}
                  style={hoveredRow === user.id ? styles.trHover : styles.tr}
                  onMouseEnter={() => setHoveredRow(user.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td style={styles.td}>
                    <div style={styles.userInfo}>
                      <div style={styles.avatar(user.id)}>
                        {user.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>
                    <span style={styles.roleBadge(user.role)}>{user.role}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.statusBadge(user.status)}>{user.status}</span>
                  </td>
                  <td style={styles.td}>{user.lastLogin}</td>
                  <td style={styles.td}>
                    <ActionMenu
                      user={user}
                      onApprove={() => handleApprove(user.id)}
                      onReject={() => handleReject(user.id)}
                      onSuspend={() => handleSuspend(user.id)}
                      onActivate={() => handleActivate(user.id)}
                      onEdit={() => handleEdit(user)}
                      onResetPassword={() => handleResetPassword(user)}
                    />
                  </td>
                </tr>
              ))}
              {processedUsers.length === 0 && (
                <tr>
                  <td colSpan="6" style={styles.emptyTd}>
                    No users match your search or filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Modal */}
      {confirmModal && (
        <div style={styles.modalOverlay} onClick={() => setConfirmModal(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{confirmModal.title}</h2>
              <button style={styles.closeBtn} onClick={() => setConfirmModal(null)}>×</button>
            </div>
            <div style={styles.modalBody}>
              <p style={{ color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>{confirmModal.message}</p>
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.cancelBtn} onClick={() => setConfirmModal(null)}>Cancel</button>
              <button
                style={{ ...styles.saveBtn, backgroundColor: confirmModal.confirmColor }}
                onClick={() => { confirmModal.onConfirm(); setConfirmModal(null); }}
              >
                {confirmModal.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetModal && (
        <div style={styles.modalOverlay} onClick={() => setResetModal(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Reset Password</h2>
              <button style={styles.closeBtn} onClick={() => setResetModal(null)}>×</button>
            </div>
            <div style={styles.modalBody}>
              <p style={{ color: "#94a3b8", margin: "0 0 1rem 0", lineHeight: 1.6 }}>
                A one-time password reset link will be sent to:
              </p>
              <div style={styles.resetEmailBox}>
                <span>📧</span>
                <strong style={{ color: "#60a5fa" }}>{resetModal.email}</strong>
              </div>
              <p style={{ color: "#64748b", fontSize: "0.85rem", margin: "1rem 0 0 0" }}>
                The user will be forced to log out and must set a new password using the link.
              </p>
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.cancelBtn} onClick={() => setResetModal(null)}>Cancel</button>
              <button style={{ ...styles.saveBtn, backgroundColor: "#f59e0b" }} onClick={confirmResetPassword}>
                Send Reset Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div style={styles.modalOverlay} onClick={() => { setEditingUser(null); setEditForm({}); }}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Edit User</h2>
              <button style={styles.closeBtn} onClick={() => { setEditingUser(null); setEditForm({}); }}>×</button>
            </div>
            <div style={styles.modalBody}>
              {[
                { label: "Full Name", key: "name", type: "text" },
                { label: "Email", key: "email", type: "email" },
              ].map(({ label, key, type }) => (
                <div key={key} style={styles.formGroup}>
                  <label style={styles.fieldLabel}>{label}</label>
                  <input
                    type={type}
                    value={editForm[key] || ""}
                    onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                    style={styles.input}
                  />
                </div>
              ))}
              <div style={styles.formGroup}>
                <label style={styles.fieldLabel}>Role</label>
                <select value={editForm.role || ""} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} style={styles.input}>
                  <option value="Admin">Admin</option>
                  <option value="Analyst">Analyst</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.fieldLabel}>Status</label>
                <select value={editForm.status || ""} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} style={styles.input}>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.cancelBtn} onClick={() => { setEditingUser(null); setEditForm({}); }}>Cancel</button>
              <button style={styles.saveBtn} onClick={handleSaveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div style={styles.modalOverlay} onClick={handleCloseAddModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Create New User</h2>
              <button style={styles.closeBtn} onClick={handleCloseAddModal}>×</button>
            </div>
            <div style={styles.modalBody}>
              {[
                { label: "Full Name", key: "name", type: "text", placeholder: "e.g. John Smith" },
                { label: "Email Address", key: "email", type: "email", placeholder: "e.g. john@company.com" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key} style={styles.formGroup}>
                  <label style={styles.fieldLabel}>{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={addForm[key] || ""}
                    onChange={(e) => {
                      setAddForm({ ...addForm, [key]: e.target.value });
                      if (addErrors[key]) setAddErrors({ ...addErrors, [key]: null });
                    }}
                    style={{ ...styles.input, border: addErrors[key] ? "1px solid #ef4444" : "1px solid #334155" }}
                  />
                  {addErrors[key] && <span style={styles.errorText}>{addErrors[key]}</span>}
                </div>
              ))}
              <div style={styles.formGroup}>
                <label style={styles.fieldLabel}>Role</label>
                <select value={addForm.role} onChange={(e) => setAddForm({ ...addForm, role: e.target.value })} style={styles.input}>
                  <option value="Analyst">Analyst</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.fieldLabel}>Initial Status</label>
                <select value={addForm.status} onChange={(e) => setAddForm({ ...addForm, status: e.target.value })} style={styles.input}>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div style={styles.infoBox}>
                🔑 A temporary password will be auto-generated and the user will be required to change it on first login.
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.cancelBtn} onClick={handleCloseAddModal}>Cancel</button>
              <button style={styles.saveBtn} onClick={handleAddUser}>Create Account</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserManagement;