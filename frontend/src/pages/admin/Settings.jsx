import React, { useState, useEffect } from 'react';

function Settings() {
  console.log('Settings component rendering');
  
  const [logs, setLogs] = useState([
    {
      name: 'Suricata Rules',
      type: 'File based',
      logType: 'JSON',
      status: 'Active',
      lastUpdated: '29-Feb-2026 12:34'
    },
    {
      name: 'Snort Office 360',
      type: 'Syslog',
      logType: 'TCP',
      status: 'Active',
      lastUpdated: '28-Feb-2026 10:22'
    }
  ]);
  
  const [formData, setFormData] = useState({
    logName: '',
    logType: '',
    parsingOption: '',
    logFile: null
  });
  const [filter, setFilter] = useState('');

  const filteredLogs = logs.filter(log =>
    log.name.toLowerCase().includes(filter.toLowerCase()) ||
    log.type.toLowerCase().includes(filter.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, logFile: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const uploadData = new FormData();
    uploadData.append('logName', formData.logName);
    uploadData.append('logType', formData.logType);
    uploadData.append('parsingOption', formData.parsingOption);
    if (formData.logFile) {
      uploadData.append('logFile', formData.logFile);
    }
    console.log('Form submitted:', Object.fromEntries(uploadData));
    setFormData({ logName: '', logType: '', parsingOption: '', logFile: null });
  };

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Log Management</h1>
      </div>

      {/* Search + Table */}
      <div style={styles.tableSection}>
        <div style={styles.tableHeader}>
          <input
            type="text"
            placeholder="Search logs..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        
        <table style={styles.logsTable}>
          <thead>
            <tr>
              <th style={styles.th}>Log Name</th>
              <th style={styles.th}>Log Type</th>
              <th style={styles.th}>Format</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Last Updated</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, index) => (
              <tr key={index} style={styles.tr}>
                <td style={styles.td}>{log.name}</td>
                <td style={styles.td}>{log.type}</td>
                <td style={styles.td}>{log.logType}</td>
                <td style={styles.td}>
                  <span style={styles.statusBadge(log.status.toLowerCase())}>
                    {log.status}
                  </span>
                </td>
                <td style={styles.td}>{log.lastUpdated}</td>
                <td style={styles.td}>
                  <button style={styles.actionBtn}>+</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ FIXED FILE INPUT FORM */}
      <div style={styles.formSection}>
        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            name="logName"
            placeholder="Log Name"
            value={formData.logName}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
          <select
            name="logType"
            value={formData.logType}
            onChange={handleInputChange}
            style={styles.input}
            required
          >
            <option value="">Log Type</option>
            <option value="File based">File based</option>
            <option value="Syslog">Syslog</option>
          </select>
          <select
            name="parsingOption"
            value={formData.parsingOption}
            onChange={handleInputChange}
            style={styles.input}
            required
          >
            <option value="">Parsing Option</option>
            <option value="JSON">JSON</option>
            <option value="TCP">TCP</option>
            <option value="UDP">UDP</option>
          </select>
          
          {/* ✅ BEAUTIFUL FILE INPUT */}
          <div style={styles.fileInputContainer}>
            <input
              type="file"
              id="logFile"
              name="logFile"
              onChange={handleFileChange}
              accept=".log,.json"
              style={styles.fileInputHidden}
            />
            <label htmlFor="logFile" style={styles.fileInputLabel(formData.logFile)}>
              {formData.logFile ? (
                <>
                  <span style={styles.fileSuccessIcon}>✅</span>
                  <span>{formData.logFile.name}</span>
                </>
              ) : (
                <>
                  <span style={styles.fileIcon}>📁</span>
                  <span>Choose log file (.log, .json)</span>
                </>
              )}
            </label>
          </div>
          
          <button type="submit" style={styles.submitBtn}>Add Connection</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    flex: 1,
    padding: "2rem",
    backgroundColor: "#0f172a",
    color: "#f1f5f9",
    overflowY: "auto",
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
  tableSection: {
    backgroundColor: "#1e293b",
    padding: "1.5rem",
    borderRadius: "12px",
    marginBottom: "2rem",
  },
  tableHeader: {
    marginBottom: "1.5rem",
  },
  searchInput: {
    width: "100%",
    padding: "0.875rem 1rem",
    backgroundColor: "#334155",
    border: "1px solid #475569",
    borderRadius: "8px",
    color: "#f1f5f9",
    fontSize: "0.95rem",
  },
  logsTable: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#1e293b",
  },
  th: {
    padding: "1rem",
    textAlign: "left",
    color: "#94a3b8",
    fontSize: "0.85rem",
    fontWeight: 600,
    textTransform: "uppercase",
    borderBottom: "1px solid #334155",
  },
  tr: {
    borderBottom: "1px solid #334155",
  },
  td: {
    padding: "1rem",
    fontSize: "0.9rem",
    color: "#f1f5f9",
  },
  statusBadge: (status) => ({
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    fontSize: "0.8rem",
    fontWeight: 600,
    backgroundColor: status === 'active' ? "#10b981" : "#ef4444",
    color: "#fff",
  }),
  actionBtn: {
    padding: "0.5rem 1rem",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  formSection: {
    backgroundColor: "#1e293b",
    padding: "1.5rem",
    borderRadius: "12px",
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
  },
  input: {
    padding: "0.875rem 1rem",
    backgroundColor: "#334155",
    border: "1px solid #475569",
    borderRadius: "8px",
    color: "#f1f5f9",
    fontSize: "0.95rem",
  },
  // ✅ FIXED FILE INPUT STYLES
  fileInputContainer: {
    position: "relative",
    gridColumn: "1 / -1",
  },
  fileInputHidden: {
    display: "none",
  },
  fileInputLabel: (file) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.875rem 1rem",
    backgroundColor: file ? "#10b981" : "#1e293b",
    border: file ? "2px solid #059669" : "2px dashed #475569",
    borderRadius: "8px",
    color: file ? "#ffffff" : "#94a3b8",
    fontSize: "0.95rem",
    fontWeight: file ? 500 : 400,
    cursor: "pointer",
    transition: "all 0.2s ease",
    minHeight: "56px",
    textAlign: "center",
  }),
  fileIcon: {
    fontSize: "1.2rem",
  },
  fileSuccessIcon: {
    fontSize: "1.2rem",
  },
  submitBtn: {
    padding: "0.875rem 1.5rem",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    gridColumn: "1 / -1",
    transition: "background-color 0.2s",
  },
};

export default Settings;
