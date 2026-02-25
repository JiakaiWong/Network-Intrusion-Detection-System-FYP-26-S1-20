import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AlertDetails.css";
import {
  FaArrowLeft,
  FaExclamationCircle,
  FaLink,
  FaCloudDownloadAlt
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { BsTelegram } from "react-icons/bs";

const AlertDetails = () => {
  // Hooks must be called at the top level – unconditionally
  const location = useLocation();
  const navigate = useNavigate();
  const alertData = location.state?.alert;

  // State for notes (always declared)
  const [notes, setNotes] = useState([
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
  ]);

  const [newNoteText, setNewNoteText] = useState("");

  const handlePostNote = () => {
    if (newNoteText.trim() === "") return;

    const newNote = {
      id: notes.length + 1,
      author: "Analyst 1",
      time: "Just now",
      content: newNoteText,
      avatar: "A1"
    };

    setNotes([...notes, newNote]);
    setNewNoteText("");
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  // Early return is NOT allowed before hooks. So we conditionally render below.
  if (!alertData) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>No alert selected</h2>
        <button onClick={handleBack} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
          Go back to Dashboard
        </button>
      </div>
    );
  }

  // Main render when alertData exists
  return (
    <div className="dashboard-container">
      {/* Sidebar (unchanged) */}
      <aside className="sidebar">
        <div className="sidebar-header">Intrusion Detection</div>
        <nav className="sidebar-nav">
          <div className="nav-section">
            <ul>
              <li className="active">Alerts</li>
              <li>Dashboard</li>
              <li>Network Traffic</li>
              <li>Reports</li>
            </ul>
          </div>
        </nav>
        <div className="sidebar-user">
          <hr className="divider" />
          <div className="user-info">
            <span className="user-role">Analyst</span>
            <span className="user-name">Security Analyst 1</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="main-content">
        <div className="header">
          <FaArrowLeft
            className="back-icon"
            onClick={handleBack}
            style={{ cursor: 'pointer' }}
          />
          <h1>Alert Details</h1>
        </div>

        <div className="content-grid">
          {/* LEFT PANEL – populated with dynamic alertData */}
          <div className="left-panel">
            <div className="alert-overview-card">
              <h2 className="section-title">Alert Overview</h2>

              <div className="overview-grid">
                  <div className="label">Alert Type</div>
                  <div className="value">{alertData.type}</div>

              <div className="label">Status</div>
              <div className="value status">{alertData.progress}</div>

              <div className="label">IDS Source</div>
              <div className="value">
                  {alertData.ids || alertData.ids_source || alertData.sourceIds || '—'}
              </div>

              <div className="label">Detection Time</div>
              <div className="value">{alertData.time}</div>

              <div className="label">Source IP</div>
              <div className="value">
                   {alertData.src || alertData.source_ip || alertData.source || '—'}
              </div>

              <div className="label">Destination IP</div>
              <div className="value">
                   {alertData.dst || alertData.destination_ip || alertData.dest || '—'}
             </div>
          </div>
              <div className="description-box">
                <div className="description-title">Description</div>
                <p>
                  Detected {alertData.type} targeting the web application's login
                  endpoint. The attacker attempted to bypass authentication using
                  multiple malicious payloads. (Source: {alertData.src})
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL – unchanged */}
          <div className="right-panel">
            <div className="card">
              <h2>Quick Actions</h2>

              <div className="action-item">
                <FaExclamationCircle className="action-icon warning" />
                <span>Create Incident</span>
              </div>

              <div className="action-item">
                <FaLink className="action-icon" />
                <span>Link Alerts</span>
              </div>

              <div className="action-item">
                <FaCloudDownloadAlt className="action-icon" />
                <span>Generate Reports</span>
              </div>
            </div>

            <div className="card">
              <h2>Notifications</h2>

              <div className="notification-item">
                <input type="checkbox" defaultChecked />
                <BsTelegram className="notif-icon" />
                <span>Telegram</span>
              </div>

              <div className="notification-item">
                <input type="checkbox" defaultChecked />
                <MdEmail className="notif-icon" />
                <span>Email</span>
              </div>
            </div>
          </div>
        </div>

        {/* INVESTIGATION NOTES – unchanged */}
        <div className="investigation-notes">
          <h2 className="section-title">Investigation Notes</h2>

          <div className="notes-list">
            {notes.map((note) => (
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

          {/* Add new note */}
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
      </div>
    </div>
  );
};

export default AlertDetails;