/**
 * api.js - Central API service layer
 * All fetch calls to the FastAPI backend go through here.
 * Base URL is read from the Vite env var VITE_API_URL
 * (falls back to http://127.0.0.1:8000 for local dev).
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// helpers 

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

// Auth 

/**
 * POST /api/auth/login
 * Returns { token, user: { id, email, full_name, role } }
 */
export async function loginUser(email, password) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

/**
 * POST /api/auth/register
 */
export async function registerUser(email, password, full_name, role = "Security Analyst") {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, full_name, role }),
  });
}

// Dashboard
/**
 * GET /dashboard/summary
 * Returns { total, severity_summary: { high, medium, low } }
 */
export async function getDashboardSummary() {
  return request("/dashboard/summary");
}

//  Alerts
/**
 * GET /alerts  (optional query params: severity, src_ip, dest_ip, proto, status)
 * Returns { ok, items: Alert[] }
 */
export async function getAlerts(params = {}) {
  const qs = new URLSearchParams();
  if (params.severity) qs.append("severity", params.severity);
  if (params.src_ip)   qs.append("src_ip",   params.src_ip);
  if (params.dest_ip)  qs.append("dest_ip",  params.dest_ip);
  if (params.proto)    qs.append("proto",    params.proto);
  if (params.status)   qs.append("status",   params.status);
  const q = qs.toString();
  return request(`/alerts${q ? `?${q}` : ""}`);
}

/**
 * GET /alerts/:id
 */
export async function getAlertById(id) {
  return request(`/alerts/${id}`);
}

/**
 * PATCH /alerts/:id/status   body: { status }
 */
export async function updateAlertStatus(id, status) {
  return request(`/alerts/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

/**
 * GET /alerts/:id/notes
 */
export async function getNotes(alertId) {
  return request(`/alerts/${alertId}/notes`);
}

/**
 * POST /alerts/:id/notes   body: { text }
 */
export async function addNote(alertId, text) {
  return request(`/alerts/${alertId}/notes`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

// Traffic  (stub - backend endpoint TBD) 

export async function getTrafficLogs(params = {}) {
  // Backend GET /traffic not yet implemented; returns mock data so
  // NetworkTraffic.jsx can still render without errors.
  console.warn("[api] GET /traffic not yet on backend – using mock data.");
  return { ok: true, items: [] };
}

// Notifications (stub) 

export async function getNotifications() {
  console.warn("[api] GET /notifications not yet on backend – using mock data.");
  return { ok: true, items: [] };
}

// Health check 
export async function healthCheck() {
  return request("/health");
}
