/**
 * api.js - Central API service layer
 * Handles two different backends: 
 * Auth (8000) and Alerts/Dashboard (8001)
 */

// Define the two different base URLs
const AUTH_BASE = import.meta.env.VITE_AUTH_URL || "http://127.0.0.1:8000";
const ALERTS_BASE = import.meta.env.VITE_ALERTS_URL || "http://127.0.0.1:8001";

/**
 * Core request helper
 * @param {string} baseUrl - Either AUTH_BASE or ALERTS_BASE
 * @param {string} path - The endpoint path
 */
async function request(baseUrl, path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = { 
    "Content-Type": "application/json", 
    ...options.headers 
  };
  
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${baseUrl}${path}`, { ...options, headers });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

// --- AUTH SERVICES (Port 8000) ---

export async function loginUser(email, password) {
  return request(AUTH_BASE, "/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser(email, password, full_name, role = "Security Analyst") {
  return request(AUTH_BASE, "/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, full_name, role }),
  });
}

export async function healthCheck() {
  return request(AUTH_BASE, "/health");
}

// --- ALERTS & DASHBOARD SERVICES (Port 8001) ---

export async function getDashboardSummary() {
  return request(ALERTS_BASE, "/dashboard/summary");
}

export async function getAlerts(params = {}) {
  const qs = new URLSearchParams();
  if (params.severity) qs.append("severity", params.severity);
  if (params.src_ip)   qs.append("src_ip",   params.src_ip);
  if (params.dest_ip)  qs.append("dest_ip",  params.dest_ip);
  if (params.proto)    qs.append("proto",    params.proto);
  if (params.status)   qs.append("status",   params.status);
  
  const q = qs.toString();
  return request(ALERTS_BASE, `/alerts${q ? `?${q}` : ""}`);
}

export async function getAlertById(id) {
  return request(ALERTS_BASE, `/alerts/${id}`);
}

export async function updateAlertStatus(id, status) {
  return request(ALERTS_BASE, `/alerts/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function getNotes(alertId) {
  return request(ALERTS_BASE, `/alerts/${alertId}/notes`);
}

export async function addNote(alertId, text) {
  return request(ALERTS_BASE, `/alerts/${alertId}/notes`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

// --- STUBS ---

export async function getTrafficLogs(params = {}) {
  console.warn("[api] GET /traffic not yet on backend – using mock data.");
  return { ok: true, items: [] };
}

export async function getNotifications() {
  console.warn("[api] GET /notifications not yet on backend – using mock data.");
  return { ok: true, items: [] };
}