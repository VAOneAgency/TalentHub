/**
 * api.js — thin fetch wrapper
 * Reads token from localStorage key 'talenthub_token'
 * (key set by partner's auth system — do NOT change)
 */

const BASE = import.meta.env.VITE_API_URL || '/api';

const getToken = () => localStorage.getItem('talenthub_token');

const request = async (method, path, body) => {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  const token = getToken();
  if (token) opts.headers['Authorization'] = `Bearer ${token}`;
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  const text = await res.text();
  let data = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export { request };

// ─── Projects ─────────────────────────────────────────────────────────────────
export const getProjects = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request('GET', `/projects${qs ? `?${qs}` : ''}`);
};
export const getProjectById = (id) => request('GET', `/projects/${id}`);
export const getMyProjects = () => request('GET', '/projects/my/listings');
export const createProject = (data) => request('POST', '/projects', data);
export const updateProject = (id, data) => request('PUT', `/projects/${id}`, data);
export const deleteProject = (id) => request('DELETE', `/projects/${id}`);

// ─── Applications ─────────────────────────────────────────────────────────────
export const applyToProject = (data) => request('POST', '/applications', data);
export const getMyApplications = () => request('GET', '/applications/my');
export const getProjectApplications = (projectId) => request('GET', `/applications/project/${projectId}`);
export const withdrawApplication = (id) => request('DELETE', `/applications/${id}`);
export const updateApplicationStatus = (id, status) => request('PATCH', `/applications/${id}/status`, { status });

// GET /api/applications/check/:projectId
// Returns { hasApplied: boolean } for the current authenticated user
export const checkHasApplied = (projectId) =>
  request('GET', `/applications/check/${projectId}`);