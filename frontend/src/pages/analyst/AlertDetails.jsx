import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AlertDetails.css";
import {
  FaArrowLeft,
  FaExclamationCircle,
  FaLink,
  FaCloudDownloadAlt
} from "react-icons/fa";

const AlertDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const alertData = location.state?.alert;

  // ---------- STATE ----------
  const [currentAlert, setCurrentAlert] = useState(alertData);
  const [selectedProgress, setSelectedProgress] = useState(alertData?.progress || "New");
  const [notes, setNotes] = useState([]);
  const [newNoteText, setNewNoteText] = useState("");

  // Incident modal
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [incidentTitle, setIncidentTitle] = useState("");
  const [incidentDescription, setIncidentDescription] = useState("");
  const [incidentSeverity, setIncidentSeverity] = useState("Medium");

  // Link alerts modal
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [allAlerts, setAllAlerts] = useState([]);
  const [selectedLinks, setSelectedLinks] = useState([]);
  const [linkedAlerts, setLinkedAlerts] = useState([]);

  // Linked alert details modal
  const [showLinkedAlertModal, setShowLinkedAlertModal] = useState(false);
  const [selectedLinkedAlert, setSelectedLinkedAlert] = useState(null);

  // ---------- LOAD DATA ----------
  useEffect(() => {
    if (alertData) {
      const saved = localStorage.getItem(`alert_${alertData.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setCurrentAlert(parsed);
        setSelectedProgress(parsed.progress);
      } else {
        setCurrentAlert(alertData);
        setSelectedProgress(alertData.progress);
      }
    }
  }, [alertData]);

  useEffect(() => {
    if (alertData) {
      const storageKey = `notes_${alertData.id}`;
      const storedNotes = localStorage.getItem(storageKey);
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      } else {
        const defaultNotes = [
          {
            id: 1,
            author: "Analyst 1",
            time: "2 hours ago",
            content: "My analysis on this alert is that SQL injection has been used to bypass authentication.",
            avatar: "A1"
          },
          {
            id: 2,
            author: "Analyst 2",
            time: "1 hour ago",
            content: "Authentication bypass enabled the attacker to steal credentials from the login page.",
            avatar: "A2"
          }
        ];
        setNotes(defaultNotes);
        localStorage.setItem(storageKey, JSON.stringify(defaultNotes));
      }
    }
  }, [alertData]);

  // Load all alerts for linking
  useEffect(() => {
    const baseAlerts = [
      { id: 1, severity: 'High', type: 'SQLI', src: '192.168.1.100', dst: '10.0.0.12', ids: 'Snort', time: '30s ago', progress: 'New' },
      { id: 2, severity: 'High', type: 'Malware', src: '192.168.1.120', dst: '10.0.0.5', ids: 'Suricata', time: '1m ago', progress: 'New' },
      { id: 3, severity: 'Medium', type: 'Suspicious login', src: '203.45.67.89', dst: '45.67.89.12', ids: 'Zeek', time: '2m ago', progress: 'In Progress' },
      { id: 4, severity: 'Low', type: 'Phishing', src: '192.168.1.92', dst: '10.0.0.10', ids: 'Snort', time: '5m ago', progress: 'Resolved' },
      { id: 5, severity: 'Low', type: 'Port scan', src: '178.23.156.42', dst: '8.8.8.8', ids: 'Kismet', time: '10m ago', progress: 'Resolved' },
      { id: 6, severity: 'High', type: 'Ransomware', src: '192.168.1.45', dst: '10.0.0.22', ids: 'Suricata', time: '15m ago', progress: 'In Progress' },
      { id: 7, severity: 'Medium', type: 'Brute Force', src: '104.28.12.34', dst: '192.168.1.1', ids: 'Snort', time: '22m ago', progress: 'New' },
      { id: 8, severity: 'Low', type: 'Port scan', src: '8.8.8.8', dst: '192.168.1.100', ids: 'Kismet', time: '32m ago', progress: 'Resolved' },
      { id: 9, severity: 'High', type: 'C2 Beacon', src: '45.33.22.11', dst: '10.0.0.50', ids: 'Zeek', time: '45m ago', progress: 'In Progress' },
      { id: 10, severity: 'Medium', type: 'SQL Injection', src: '203.0.113.5', dst: '10.0.0.15', ids: 'Snort', time: '1h ago', progress: 'Resolved' },
      { id: 11, severity: 'Low', type: 'Failed Login', src: '192.168.1.200', dst: '10.0.0.8', ids: 'Zeek', time: '2h ago', progress: 'Resolved' },
      { id: 12, severity: 'High', type: 'Data Exfiltration', src: '198.51.100.77', dst: '10.0.0.99', ids: 'Suricata', time: '3h ago', progress: 'In Progress' },
      { id: 13, severity: 'Medium', type: 'DDoS', src: '192.168.1.150', dst: '10.0.0.20', ids: 'Snort', time: '4h ago', progress: 'In Progress' },
      { id: 14, severity: 'Low', type: 'Reconnaissance', src: '104.16.45.33', dst: '192.168.1.10', ids: 'Zeek', time: '5h ago', progress: 'Resolved' },
    ];

    const merged = baseAlerts.map(alert => {
      const saved = localStorage.getItem(`alert_${alert.id}`);
      return saved ? JSON.parse(saved) : alert;
    }).filter(a => a.id !== currentAlert?.id);
    setAllAlerts(merged);
  }, [currentAlert]);

  // Load linked alerts
  useEffect(() => {
    if (currentAlert) {
      const linkedKey = `linkedAlerts_${currentAlert.id}`;
      const savedLinks = localStorage.getItem(linkedKey);
      if (savedLinks) {
        const linkedIds = JSON.parse(savedLinks);
        setSelectedLinks(linkedIds);
        const linked = allAlerts.filter(a => linkedIds.includes(a.id));
        setLinkedAlerts(linked);
      } else {
        setSelectedLinks([]);
        setLinkedAlerts([]);
      }
    }
  }, [currentAlert, allAlerts]);

  // ---------- HANDLERS ----------
  const handleProgressChange = (e) => setSelectedProgress(e.target.value);
  const handleUpdateStatus = () => {
    const updatedAlert = { ...currentAlert, progress: selectedProgress };
    setCurrentAlert(updatedAlert);
    localStorage.setItem(`alert_${updatedAlert.id}`, JSON.stringify(updatedAlert));
    alert("Status updated successfully!");
  };

  const handlePostNote = () => {
    if (newNoteText.trim() === "" || !alertData) return;
    const newNote = {
      id: notes.length + 1,
      author: "Analyst 1",
      time: "Just now",
      content: newNoteText,
      avatar: "A1"
    };
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    localStorage.setItem(`notes_${alertData.id}`, JSON.stringify(updatedNotes));
    setNewNoteText("");
  };

  // Incident modal
  const handleCreateIncident = () => setShowIncidentModal(true);
  const handleCloseIncidentModal = () => {
    setShowIncidentModal(false);
    setIncidentTitle("");
    setIncidentDescription("");
    setIncidentSeverity("Medium");
  };
  const handleSaveIncident = () => {
    if (!incidentTitle.trim()) {
      alert("Please enter an incident title");
      return;
    }
    const newIncident = {
      id: Date.now(),
      alertId: currentAlert.id,
      alertType: currentAlert.type,
      title: incidentTitle,
      description: incidentDescription,
      severity: incidentSeverity,
      created: new Date().toLocaleString(),
      status: "Open",
    };
    const existing = JSON.parse(localStorage.getItem("incidents") || "[]");
    localStorage.setItem("incidents", JSON.stringify([...existing, newIncident]));
    alert("Incident created successfully!");
    handleCloseIncidentModal();
  };

  // Link alerts modal
  const handleLinkAlerts = () => setShowLinkModal(true);
  const handleCloseLinkModal = () => {
    setShowLinkModal(false);
    const linkedKey = `linkedAlerts_${currentAlert.id}`;
    const saved = localStorage.getItem(linkedKey);
    setSelectedLinks(saved ? JSON.parse(saved) : []);
  };
  const handleCheckboxChange = (id) => {
    setSelectedLinks(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };
  const handleSaveLinks = () => {
    const linkedKey = `linkedAlerts_${currentAlert.id}`;
    localStorage.setItem(linkedKey, JSON.stringify(selectedLinks));
    const linked = allAlerts.filter(a => selectedLinks.includes(a.id));
    setLinkedAlerts(linked);
    setShowLinkModal(false);
    alert("Links updated successfully!");
  };

  // Linked alert modal
  const handleViewLinkedAlert = (alert) => {
    setSelectedLinkedAlert(alert);
    setShowLinkedAlertModal(true);
  };
  const handleCloseLinkedAlertModal = () => {
    setShowLinkedAlertModal(false);
    setSelectedLinkedAlert(null);
  };
  const handleViewFullDetails = () => {
    if (selectedLinkedAlert) {
      navigate(`/alert/${selectedLinkedAlert.id}`, { state: { alert: selectedLinkedAlert } });
    }
  };

  const handleBack = () => navigate('/dashboard');

  if (!alertData) {
    return (
      <div className="alert-page no-alert">
        <h2>No alert selected</h2>
        <button onClick={handleBack} className="post-note-btn">Go back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="alert-page">
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
              <h2 className="section-title">Alert Overview</h2>
              <div className="overview-grid">
                <div className="label">Alert Type</div>
                <div className="value">{currentAlert.type}</div>
                <div className="label">IDS Source</div>
                <div className="value">{currentAlert.ids || currentAlert.ids_source || currentAlert.sourceIds || '—'}</div>
                <div className="label">Detection Time</div>
                <div className="value">{currentAlert.time}</div>
                <div className="label">Source IP</div>
                <div className="value">{currentAlert.src || currentAlert.source_ip || currentAlert.source || '—'}</div>
                <div className="label">Destination IP</div>
                <div className="value">{currentAlert.dst || currentAlert.destination_ip || currentAlert.dest || '—'}</div>
              </div>
              <div className="description-box">
                <div className="description-title">Description</div>
                <p>Detected {currentAlert.type} targeting the web application's login endpoint. The attacker attempted to bypass authentication using multiple malicious payloads. (Source: {currentAlert.src})</p>
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
                <div className="note-avatar">{note.avatar}</div>
                <div className="note-content-area">
                  <div className="note-header">
                    <span className="note-author">{note.author}</span>
                    <span className="note-time">{note.time}</span>
                  </div>
                  <p className="note-content">{note.content}</p>
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
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
            />
            <div className="add-note-footer">
              <button className="post-note-btn" onClick={handlePostNote}>
                Post Note
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