import React, { useState } from 'react';
import { styles } from './Settings.styles';

function Settings({ logs, setLogs }) {
  const [formData, setFormData] = useState({
    logName: '',
    logType: '',
    parsingOption: '',
    logFile: null
  });
  const [filter, setFilter] = useState('');
  const [hoveredRow, setHoveredRow] = useState(null);

  // Modal state
  const [modalLog, setModalLog] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [confirmModal, setConfirmModal] = useState(null);
  const [toast, setToast] = useState(null);

  const filteredLogs = logs.filter(log =>
    log.name.toLowerCase().includes(filter.toLowerCase()) ||
    log.type.toLowerCase().includes(filter.toLowerCase())
  );

  const getTimestamp = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = now.toLocaleString('en-GB', { month: 'short' });
    const year = now.getFullYear();
    const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    return `${day}-${month}-${year} ${time}`;
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openModal = (log) => {
    setModalLog(log);
    setEditData({ ...log });
    setEditMode(false);
  };

  const closeModal = () => {
    setModalLog(null);
    setEditMode(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = () => {
    const updated = { ...editData, lastUpdated: getTimestamp() };
    setLogs(prev => prev.map(l => l.id === modalLog.id ? updated : l));
    setModalLog(updated);
    setEditMode(false);
    showToast(`"${editData.name}" updated successfully`);
  };

  const handleToggleStatus = () => {
    const newStatus = modalLog.status === 'Active' ? 'Inactive' : 'Active';
    const updated = { ...modalLog, status: newStatus, lastUpdated: getTimestamp() };
    setLogs(prev => prev.map(l => l.id === modalLog.id ? updated : l));
    setModalLog(updated);
    setEditData(prev => ({ ...prev, status: newStatus }));
    showToast(`"${modalLog.name}" set to ${newStatus}`);
  };

  const handleDeleteLog = () => {
    setConfirmModal({
      title: 'Remove Log Source',
      message: `Remove "${modalLog.name}"? This will stop ingesting data from this source and may affect dashboard alerts.`,
      confirmLabel: 'Remove',
      confirmColor: '#ef4444',
      onConfirm: () => {
        const name = modalLog.name;
        setLogs(prev => prev.filter(l => l.id !== modalLog.id));
        closeModal();
        showToast(`"${name}" removed`, 'error');
      },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, logFile: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLog = {
      id: Date.now(),
      name: formData.logName,
      type: formData.logType,
      logType: formData.parsingOption,
      status: 'Active',
      lastUpdated: getTimestamp(),
    };
    setLogs(prev => [...prev, newLog]);
    setFormData({ logName: '', logType: '', parsingOption: '', logFile: null });
    showToast(`"${newLog.name}" connection added`);
  };

  return (
    <div style={styles.pageContainer}>
      {/* Toast */}
      {toast && (
        <div style={styles.toast(toast.type)}>
          <span>{toast.type === 'success' ? '✓' : '✕'}</span>
          {toast.message}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal && (
        <div style={styles.modalOverlay} onClick={() => setConfirmModal(null)}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <p style={styles.modalSubtitle}>Confirm Action</p>
                <h2 style={styles.modalTitle}>{confirmModal.title}</h2>
              </div>
              <button style={styles.modalClose} onClick={() => setConfirmModal(null)}>✕</button>
            </div>
            <div style={{ padding: '0 0 1.5rem 0' }}>
              <p style={{ color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>{confirmModal.message}</p>
            </div>
            <div style={styles.modalActions}>
              <button style={styles.btnSecondary} onClick={() => setConfirmModal(null)}>Cancel</button>
              <button
                style={{ ...styles.btnSave, backgroundColor: confirmModal.confirmColor }}
                onClick={() => { confirmModal.onConfirm(); setConfirmModal(null); }}
              >
                {confirmModal.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Log Detail Modal */}
      {modalLog && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <p style={styles.modalSubtitle}>Log Connection</p>
                <h2 style={styles.modalTitle}>{modalLog.name}</h2>
              </div>
              <button style={styles.modalClose} onClick={closeModal}>✕</button>
            </div>

            <div style={styles.modalStatusRow}>
              <span style={styles.statusBadge(modalLog.status.toLowerCase())}>
                <span style={styles.statusDot(modalLog.status.toLowerCase())} />
                {modalLog.status}
              </span>
              <span style={styles.modalTimestamp}>Last updated: {modalLog.lastUpdated}</span>
            </div>

            <div style={styles.detailGrid}>
              {editMode ? (
                <>
                  <div style={styles.detailItem}>
                    <label style={styles.detailLabel}>Log Name</label>
                    <input name="name" value={editData.name} onChange={handleEditChange} style={styles.editInput} />
                  </div>
                  <div style={styles.detailItem}>
                    <label style={styles.detailLabel}>Log Type</label>
                    <select name="type" value={editData.type} onChange={handleEditChange} style={styles.editInput}>
                      <option value="File based">File based</option>
                      <option value="Syslog">Syslog</option>
                    </select>
                  </div>
                  <div style={styles.detailItem}>
                    <label style={styles.detailLabel}>Format</label>
                    <select name="logType" value={editData.logType} onChange={handleEditChange} style={styles.editInput}>
                      <option value="JSON">JSON</option>
                      <option value="TCP">TCP</option>
                      <option value="UDP">UDP</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Log Type</span>
                    <span style={styles.detailValue}>{modalLog.type}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Format</span>
                    <span style={styles.detailValue}>{modalLog.logType}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Connection ID</span>
                    <span style={styles.detailValue}>#{String(modalLog.id).slice(-4)}</span>
                  </div>
                </>
              )}
            </div>

            <div style={styles.modalActions}>
              {editMode ? (
                <>
                  <button style={styles.btnSave} onClick={handleSaveEdit}>Save Changes</button>
                  <button style={styles.btnSecondary} onClick={() => setEditMode(false)}>Cancel</button>
                </>
              ) : (
                <>
                  <button style={styles.btnEdit} onClick={() => setEditMode(true)}>Edit</button>
                  <button style={styles.btnToggle(modalLog.status)} onClick={handleToggleStatus}>
                    {modalLog.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button style={styles.btnDelete} onClick={handleDeleteLog}>Remove</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

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
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ ...styles.td, textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                  No log connections found.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  style={hoveredRow === log.id ? styles.trHover : styles.tr}
                  onMouseEnter={() => setHoveredRow(log.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td style={styles.td}>{log.name}</td>
                  <td style={styles.td}>{log.type}</td>
                  <td style={styles.td}>{log.logType}</td>
                  <td style={styles.td}>
                    <span style={styles.statusBadge(log.status.toLowerCase())}>
                      <span style={styles.statusDot(log.status.toLowerCase())} />
                      {log.status}
                    </span>
                  </td>
                  <td style={styles.td}>{log.lastUpdated}</td>
                  <td style={styles.td}>
                    <button style={styles.actionBtn} onClick={() => openModal(log)} title="Manage connection">
                      ···
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Connection Form */}
      <div style={styles.formSection}>
        <h3 style={styles.formTitle}>Add New Connection</h3>
        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            name="logName"
            placeholder="Log Name"
            value={formData.logName}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
          <select name="logType" value={formData.logType} onChange={handleInputChange} style={styles.input} required>
            <option value="">Log Type</option>
            <option value="File based">File based</option>
            <option value="Syslog">Syslog</option>
          </select>
          <select name="parsingOption" value={formData.parsingOption} onChange={handleInputChange} style={styles.input} required>
            <option value="">Parsing Option</option>
            <option value="JSON">JSON</option>
            <option value="TCP">TCP</option>
            <option value="UDP">UDP</option>
          </select>

          <div style={styles.fileInputContainer}>
            <input type="file" id="logFile" name="logFile" onChange={handleFileChange} accept=".log,.json" style={styles.fileInputHidden} />
            <label htmlFor="logFile" style={styles.fileInputLabel(formData.logFile)}>
              {formData.logFile
                ? <><span>✅</span><span>{formData.logFile.name}</span></>
                : <><span style={{ fontSize: '1.2rem' }}>📁</span><span>Choose log file (.log, .json)</span></>
              }
            </label>
          </div>

          <button type="submit" style={styles.submitBtn}>Add Connection</button>
        </form>
      </div>
    </div>
  );
}

export default Settings;