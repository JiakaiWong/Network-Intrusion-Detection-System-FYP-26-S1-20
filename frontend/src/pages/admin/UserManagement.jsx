import React, { useState } from "react";

function UserManagementContent() {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const users = [
    { id: 1, name: "John Wong", email: "john.wong@company.com", role: "Analyst", status: "Active", lastLogin: "2026-02-25" },
    { id: 2, name: "Sarah Lim", email: "sarah.lim@company.com", role: "Admin", status: "Active", lastLogin: "2026-02-24" },
    { id: 3, name: "Mike Tan", email: "mike.tan@company.com", role: "Analyst", status: "Pending", lastLogin: "-" },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.content}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>User Management</h1>
        <p style={styles.subtitle}>Approve, manage, and assign roles to registered users</p>
      </div>

      <div style={styles.controls}>
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <button style={styles.addUserBtn}>+ Add User</button>
      </div>

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
            {filteredUsers.map((user) => (
              <tr 
                key={user.id}
                style={hoveredRow === user.id ? styles.trHover : styles.tr}
                onMouseEnter={() => setHoveredRow(user.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td style={styles.td}>
                  <div style={styles.userInfo}>
                    <div style={styles.avatar(user.id)}>
                      {user.name.split(' ').map(n => n[0]).join('')}
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
                  <button style={styles.actionBtn(styles.editBtn)}>Edit</button>
                  <button style={styles.actionBtn(styles.deleteBtn)}>Delete</button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="6" style={styles.emptyTd}>
                  No users found matching your search
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  content: {
    flex: 1,
    padding: "2rem",
    overflowY: "auto",
    backgroundColor: "#0f172a",
    color: "#f1f5f9",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  header: {
    marginBottom: "2rem",
  },
  pageTitle: {
    fontSize: "2rem",
    fontWeight: 700,
    margin: "0 0 0.5rem 0",
    color: "#f1f5f9",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: "1rem",
    margin: 0,
  },
  controls: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    marginBottom: "2rem",
  },
  searchInput: {
    flex: 1,
    padding: "0.875rem 1rem",
    backgroundColor: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "8px",
    color: "#f1f5f9",
    fontSize: "0.95rem",
  },
  addUserBtn: {
    padding: "0.875rem 1.5rem",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  tableSection: {
    backgroundColor: "#1e293b",
    padding: "1.5rem",
    borderRadius: "12px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: "1rem",
    textAlign: "left",
    color: "#94a3b8",
    fontSize: "0.85rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  tr: {
    borderBottom: "1px solid #334155",
  },
  trHover: {
    backgroundColor: "#253549",
  },
  td: {
    padding: "1rem",
    fontSize: "0.9rem",
    color: "#f1f5f9",
  },
  emptyTd: {
    padding: "3rem",
    textAlign: "center",
    color: "#94a3b8",
    fontStyle: "italic",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  avatar: (id) => ({
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: `hsl(${id * 137 % 360}, 50%, 45%)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "white",
  }),
  roleBadge: (role) => ({
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    fontSize: "0.8rem",
    fontWeight: 600,
    backgroundColor: role === "Admin" ? "#3b82f6" : role === "Analyst" ? "#10b981" : "#6b7280",
    color: "#fff",
  }),
  statusBadge: (status) => ({
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    fontSize: "0.8rem",
    fontWeight: 600,
    backgroundColor: status === "Active" ? "#10b981" : "#f59e0b",
    color: "#fff",
  }),
  actionBtn: (btnStyle) => ({
    ...btnStyle,
    marginRight: "0.5rem",
    padding: "0.375rem 0.75rem",
    border: "none",
    borderRadius: "6px",
    fontSize: "0.8rem",
    cursor: "pointer",
    transition: "all 0.2s",
  }),
  editBtn: {
    backgroundColor: "#3b82f6",
    color: "white",
  },
  deleteBtn: {
    backgroundColor: "#ef4444",
    color: "white",
  },
};

export default UserManagementContent;
