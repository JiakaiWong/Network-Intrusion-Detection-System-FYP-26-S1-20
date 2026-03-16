import React, { useState, useEffect } from "react";                               // useEffect added
import { useLocation, useNavigate, useParams } from "react-router-dom";            // useParams added
import "./AlertDetails.css";
import {
  FaArrowLeft,
  FaExclamationCircle,
  FaLink,
  FaCloudDownloadAlt
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { BsTelegram } from "react-icons/bs";
import { getAlertById, getNotes, addNote, updateAlertStatus } from "../../services/api"; // NEW

const AlertDetails = () => {
  const location = useLocation();
  const navigate  = useNavigate();
  // NEW: read the :id param so we can fetch directly if no location.state
  const { id }    = useParams();

  // CHANGED: alertData → alert (state variable), starts from location.state or null
  const [alert,       setAlert]       = useState(location.state?.alert || null);
  // CHANGED: was hardcoded 2-item array, now empty — loaded from backend
  const [notes,       setNotes]       = useState([]);
  // CHANGED: newNoteText → newNote
  const [newNote,     setNewNote]     = useState("");
  // NEW: tracks current status for the status-changer buttons
  const [status,      setStatus]      = useState(location.state?.alert?.status || "new");
  // NEW: loading states for save and note-post actions
  const [saving,      setSaving]      = useState(false);
  const [notePosting, setNotePosting] = useState(false);

  // NEW: fetch alert from backend if navigated directly (no location.state)
  useEffect(() => {
    if (!alert && id) {
      getAlertById(id)
        .then((data) => { setAlert(data.item); setStatus(data.item?.status || "new"); })
        .catch(console.error);
    } else if (alert) {
      setStatus(alert.status || "new");
    }
  }, [id]);

  // NEW: load notes from backend, fallback to sample notes if offline
  useEffect(() => {
    if (id) {
      getNotes(id)
        .then((data) => setNotes(data.items || []))
        .catch(() => {
          // fallback sample notes when backend offline
          setNotes([
            { id: 1, author: "Analyst 1", time: "2 hours ago", content: "SQL injection used to bypass authentication." },
            { id: 2, author: "Analyst 2", time: "1 hour ago",  content: "Attacker stole credentials from the login page." },
          ]);
        });
    }
  }, [id]);

  // CHANGED: was sync, now async — calls backend, falls back offline
  const handlePostNote = async () => {
    // CHANGED: newNoteText → newNote
    if (!newNote.trim()) return;
    setNotePosting(true);
    try {
      const res = await addNote(id || alert?.id, newNote.trim());
      setNotes((prev) => [...prev, { ...res.note, author: "Analyst 1" }]);
      setNewNote("");
    } catch {
      // offline fallback — same behaviour as original but persists locally
      setNotes((prev) => [...prev, {
        id: notes.length + 1,
        author: "Analyst 1",
        time: "Just now",
        content: newNote.trim(),
        avatar: "A1"
      }]);
      setNewNote("");
    } finally {
      setNotePosting(false);
    }
  };

  // NEW: calls PATCH /alerts/:id/status, optimistic update if offline
  const handleStatusChange = async (newStatus) => {
    setSaving(true);
    try {
      await updateAlertStatus(id || alert?.id, newStatus);
      setStatus(newStatus);
    } catch {
      setStatus(newStatus); // optimistic update if offline
    } finally {
      setSaving(false);
    }
  };

  // CHANGED: was handleBack() → navigate('/dashboard')
  // Now inline navigate(-1) so back goes to wherever the user came from
  const handleBack = () => {
    navigate(-1);
  };

  if (!alert) {
    return (
      <div className="alert-page no-alert">
        <h2>No alert selected</h2>
        <button onClick={handleBack} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
          Go back
        </button>
      </div>
    );
  }

  // NEW: normalise field names — backend uses src_ip/dest_ip/signature, old mock used src/dst/type
  const srcIp     = alert.src_ip    || alert.src  || "—";
  const dstIp     = alert.dest_ip   || alert.dst  || "—";
  const alertType = alert.signature || alert.type || "Unknown";
  const idsSource = alert.proto     || alert.ids  || "—";
  const time      = alert.timestamp
    ? new Date(alert.timestamp).toLocaleString()
    : (alert.time || "—");

  return (
    <div className="dashboard-container">
      {/* Sidebar — CHANGED: plain text items → working links, added missing pages + logout */}
      <aside className="sidebar">
        <div className="sidebar-header">🛡️ Intrusion Detection</div>
        <nav className="sidebar-nav">
          <div className="nav-section">
            <ul>
              <li><a href="/dashboard">Dashboard</a></li>
              {/* CHANGED: was plain <li className="active">Alerts</li> */}
              <li className="active"><a href="/alerts">Alerts</a></li>
              {/* CHANGED: was plain <li>Network Traffic</li> */}
              <li><a href="/network-traffic">Network Traffic</a></li>
              {/* CHANGED: was plain <li>Reports</li> */}
              <li><a href="/reports">Reports</a></li>
              {/* NEW: missing from original */}
              <li><a href="/notifications">Notifications</a></li>
              <li><a href="/analyst/profile">Profile</a></li>
            </ul>
          </div>
        </nav>
        <div className="sidebar-user">
          <hr className="divider" />
          <div className="user-info">
            <span className="user-role">Analyst</span>
            <span className="user-name">Security Analyst 1</span>
          </div>
          {/* NEW: logout button */}
          <button
            className="logout-btn"
            onClick={() => { localStorage.clear(); navigate("/logout"); }}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <FaArrowLeft className="back-icon" onClick={handleBack} />
          <h1>Alert Details</h1>
        </div>

        {/* Two-column layout */}
        <div className="content-grid">
          {/* LEFT PANEL */}
          <div className="left-panel">
            <div className="alert-overview-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h2 className="section-title" style={{ margin: 0 }}>Alert Overview</h2>
                {/* NEW: status changer buttons */}
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  {["new", "investigating", "resolved"].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      disabled={saving}
                      style={{
                        padding: "0.25rem 0.6rem", borderRadius: 20, border: "1px solid",
                        fontSize: "0.75rem", cursor: "pointer", fontWeight: 600, textTransform: "capitalize",
                        background: status === s
                          ? s === "resolved"     ? "rgba(34,197,94,0.15)"
                          : s === "investigating" ? "rgba(245,158,11,0.15)"
                          :                        "rgba(56,189,248,0.15)"
                          : "transparent",
                        color: status === s
                          ? s === "resolved"     ? "#22c55e"
                          : s === "investigating" ? "#f59e0b"
                          :                        "#38bdf8"
                          : "#64748b",
                        borderColor: status === s
                          ? s === "resolved"     ? "#22c55e"
                          : s === "investigating" ? "#f59e0b"
                          :                        "#38bdf8"
                          : "#334155",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overview-grid">
                <div className="label">Alert Type</div>
                {/* CHANGED: alertData.type → alertType (normalised) */}
                <div className="value">{alertType}</div>

                <div className="label">Status</div>
                {/* CHANGED: alertData.progress → status (live state) */}
                <div className="value status" style={{ textTransform: "capitalize" }}>{status}</div>

                <div className="label">IDS Source</div>
                {/* CHANGED: alertData.ids fallback chain → idsSource (normalised) */}
                <div className="value">{idsSource}</div>

                <div className="label">Detection Time</div>
                {/* CHANGED: alertData.time → time (normalised, formats timestamp) */}
                <div className="value">{time}</div>

                <div className="label">Source IP</div>
                {/* CHANGED: alertData.src fallback chain → srcIp (normalised) */}
                <div className="value">{srcIp}</div>

                <div className="label">Destination IP</div>
                {/* CHANGED: alertData.dst fallback chain → dstIp (normalised) */}
                <div className="value">{dstIp}</div>

                {/* NEW: extra backend fields shown if present */}
                {alert.category  && <><div className="label">Category</div><div className="value">{alert.category}</div></>}
                {alert.src_port  && <><div className="label">Src Port</div><div className="value">{alert.src_port}</div></>}
                {alert.dest_port && <><div className="label">Dst Port</div><div className="value">{alert.dest_port}</div></>}
              </div>

              <div className="description-box">
                <div className="description-title">Description</div>
                {/* CHANGED: uses normalised alertType/srcIp/dstIp instead of alertData.type/src */}
                <p>
                  Detected {alertType} targeting the web application's login
                  endpoint. The attacker attempted to bypass authentication using
                  multiple malicious payloads. (Source: {srcIp} → {dstIp})
                </p>
              </div>
            </div>

            {/* Linked Alerts – clickable */}
            {linkedAlerts.length > 0 && (
              <div className="linked-alerts-card">
                <h3>Linked Alerts</h3>
                {linkedAlerts.map(alert => (
                  <div
                    key={alert.id}
                    className="linked-item"
                    onClick={() => handleViewLinkedAlert(alert)}
                  >
                    <span>{alert.type} ({alert.severity})</span>
                    <span>{alert.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT PANEL */}
          <div className="right-panel">
            <div className="card">
              <h2>Quick Actions</h2>
              <div className="action-item" onClick={handleCreateIncident}>
                <FaExclamationCircle className="action-icon warning" />
                <span>Create Incident</span>
              </div>
              <div className="action-item" onClick={handleLinkAlerts}>
                <FaLink className="action-icon" />
                <span>Link Alerts</span>
              </div>
              {/* Generate Reports now redirects to /reports */}
              <div className="action-item" onClick={() => navigate('/reports')}>
                <FaCloudDownloadAlt className="action-icon" />
                <span>Generate Reports</span>
              </div>
            </div>

            {/* Alert Status */}
            <div className="card">
              <h2>Alert Status</h2>
              <div className="status-update">
                <label htmlFor="status-select">Progress</label>
                <select
                  id="status-select"
                  value={selectedProgress}
                  onChange={handleProgressChange}
                  className="status-select"
                >
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <button className="update-status-btn" onClick={handleUpdateStatus}>
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* INVESTIGATION NOTES */}
        <div className="investigation-notes">
          <h2 className="section-title">Investigation Notes</h2>
          <div className="notes-list">
            {notes.map(note => (
              <div key={note.id} className="note-item">
                {/* CHANGED: note.avatar → derived from note.author */}
                <div className="note-avatar">
                  {(note.author || "A").substring(0, 2).toUpperCase()}
                </div>
                <div className="note-content-area">
                  <div className="note-header">
                    <span className="note-author">{note.author}</span>
                    <span className="note-time">{note.time}</span>
                  </div>
                  {/* CHANGED: note.content → note.text || note.content (handles both backend + old field) */}
                  <p className="note-content">{note.text || note.content}</p>
                  <button className="note-reply">↩ Reply</button>
                </div>
              </div>
            ))}
          </div>
          <div className="add-note">
            <textarea
              className="note-input"
              placeholder="Write a note..."
              rows="3"
              // CHANGED: newNoteText → newNote
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
            <div className="add-note-footer">
              {/* CHANGED: added disabled + loading text */}
              <button
                className="post-note-btn"
                onClick={handlePostNote}
                disabled={notePosting}
              >
                {notePosting ? "Posting…" : "Post Note"}
              </button>
            </div>
          </div>
        </div>

        {/* Create Incident Modal */}
        {showIncidentModal && (
          <div className="modal-overlay">
            <div className="modal-container" style={{ width: '500px' }}>
              <h2>Create Incident</h2>
              <div className="modal-form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={incidentTitle}
                  onChange={(e) => setIncidentTitle(e.target.value)}
                  className="modal-input"
                />
              </div>
              <div className="modal-form-group">
                <label>Description</label>
                <textarea
                  value={incidentDescription}
                  onChange={(e) => setIncidentDescription(e.target.value)}
                  rows="3"
                  className="modal-textarea"
                />
              </div>
              <div className="modal-form-group">
                <label>Severity</label>
                <select
                  value={incidentSeverity}
                  onChange={(e) => setIncidentSeverity(e.target.value)}
                  className="modal-select"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div className="modal-actions">
                <button className="modal-cancel" onClick={handleCloseIncidentModal}>Cancel</button>
                <button className="modal-save" onClick={handleSaveIncident}>Create Incident</button>
              </div>
            </div>
          </div>
        )}

        {/* Link Alerts Modal */}
        {showLinkModal && (
          <div className="modal-overlay">
            <div className="modal-container" style={{ width: '600px' }}>
              <h2>Link Alerts</h2>
              <p className="modal-description">Select alerts to link with this one:</p>
              {allAlerts.length === 0 ? (
                <p className="modal-empty">No other alerts available.</p>
              ) : (
                <div className="modal-checkbox-list">
                  {allAlerts.map(alert => (
                    <label key={alert.id} className="modal-checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedLinks.includes(alert.id)}
                        onChange={() => handleCheckboxChange(alert.id)}
                      />
                      <span>{alert.type} ({alert.severity}) – {alert.time}</span>
                    </label>
                  ))}
                </div>
              )}
              <div className="modal-actions">
                <button className="modal-cancel" onClick={handleCloseLinkModal}>Cancel</button>
                <button className="modal-save" onClick={handleSaveLinks}>Save Links</button>
              </div>
            </div>
          </div>
        )}

        {/* Linked Alert Details Modal */}
        {showLinkedAlertModal && selectedLinkedAlert && (
          <div className="modal-overlay">
            <div className="modal-container" style={{ width: '450px' }}>
              <h2>Linked Alert Details</h2>
              <div className="linked-alert-details">
                <div className="detail-row">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">{selectedLinkedAlert.type}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Severity:</span>
                  <span className="detail-value">{selectedLinkedAlert.severity}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Time:</span>
                  <span className="detail-value">{selectedLinkedAlert.time}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Source IP:</span>
                  <span className="detail-value">{selectedLinkedAlert.src || selectedLinkedAlert.source_ip || selectedLinkedAlert.source || '—'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Destination IP:</span>
                  <span className="detail-value">{selectedLinkedAlert.dst || selectedLinkedAlert.destination_ip || selectedLinkedAlert.dest || '—'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">IDS Source:</span>
                  <span className="detail-value">{selectedLinkedAlert.ids || selectedLinkedAlert.ids_source || '—'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <span className="detail-value">{selectedLinkedAlert.progress}</span>
                </div>
              </div>
              <div className="modal-actions">
                <button className="modal-cancel" onClick={handleCloseLinkedAlertModal}>Close</button>
                <button className="modal-save" onClick={handleViewFullDetails}>View Full Details</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertDetails;
