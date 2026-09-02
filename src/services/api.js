/**
 * FarmDirect — Centralized API Service Layer
 * 
 * All API calls from the frontend go through this module.
 * Automatically attaches JWT token from localStorage.
 * Provides consistent error handling.
 */

const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('farmdirect_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error?.message || data?.message || `Request failed (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    err.code = data?.error?.code || 'UNKNOWN';
    err.data = data;
    throw err;
  }
  return data;
}

// ─── Auth ───────────────────────────────────────────────────────────────────

export async function sendOtp(identifier, role, mode = 'login', adminId = '') {
  const res = await fetch(`${API_BASE}/auth/otp/send`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ identifier, role, mode, adminId }),
  });
  return handleResponse(res);
}

export async function verifyOtp(identifier, otp, role, name = '', adminId = '') {
  const res = await fetch(`${API_BASE}/auth/otp/verify`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ identifier, otp, role, name, adminId }),
  });
  const data = await handleResponse(res);
  // Store token
  if (data.token) {
    localStorage.setItem('farmdirect_token', data.token);
  }
  return data;
}

export async function registerUser(formData) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(formData),
  });
  const data = await handleResponse(res);
  if (data.token) {
    localStorage.setItem('farmdirect_token', data.token);
  }
  return data;
}

export async function loginUser(identifier, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ identifier, password }),
  });
  const data = await handleResponse(res);
  if (data.token) {
    localStorage.setItem('farmdirect_token', data.token);
  }
  return data;
}

export async function verifyFarmerKyc(identifier, kycData) {
  const res = await fetch(`${API_BASE}/auth/verify-farmer`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ identifier, ...kycData }),
  });
  return handleResponse(res);
}

export async function verifyGovtFarmer(data) {
  const res = await fetch(`${API_BASE}/auth/verify-govt-farmer`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// ─── Products ───────────────────────────────────────────────────────────────

export async function getProducts(params = {}) {
  const qs = new URLSearchParams();
  if (params.category && params.category !== 'All') qs.set('category', params.category);
  if (params.search) qs.set('search', params.search);
  if (params.state && params.state !== 'All') qs.set('state', params.state);
  if (params.grade && params.grade !== 'All') qs.set('grade', params.grade);
  if (params.organic) qs.set('organic', 'true');
  if (params.maxPrice) qs.set('maxPrice', params.maxPrice);
  if (params.sort) qs.set('sort', params.sort);
  if (params.page) qs.set('page', params.page);
  if (params.limit) qs.set('limit', params.limit);

  const url = `${API_BASE}/products${qs.toString() ? '?' + qs : ''}`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function getProduct(id) {
  const res = await fetch(`${API_BASE}/products/${id}`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function createProduct(data) {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateProduct(id, data) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// ─── Orders ─────────────────────────────────────────────────────────────────

export async function getOrders(params = {}) {
  const qs = new URLSearchParams();
  if (params.role) qs.set('role', params.role);
  if (params.status) qs.set('status', params.status);
  const url = `${API_BASE}/orders${qs.toString() ? '?' + qs : ''}`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function getOrder(id) {
  const res = await fetch(`${API_BASE}/orders/${id}`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function createOrder(data) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateOrderStatus(id, status, extra = {}) {
  const res = await fetch(`${API_BASE}/orders/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status, ...extra }),
  });
  return handleResponse(res);
}

// ─── Delivery Confirmation ──────────────────────────────────────────────────

export async function confirmDelivery(orderId, otp = '') {
  const res = await fetch(`${API_BASE}/orders/${orderId}/confirm-delivery`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ otp }),
  });
  return handleResponse(res);
}

// ─── Payouts ────────────────────────────────────────────────────────────────

export async function getPayouts() {
  const res = await fetch(`${API_BASE}/payouts`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

// ─── Admin Stats ────────────────────────────────────────────────────────────

export async function getAdminStats() {
  const res = await fetch(`${API_BASE}/admin/stats`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

// ─── AI Forecast ────────────────────────────────────────────────────────────

export async function getForecast(params = {}) {
  const qs = new URLSearchParams();
  if (params.crop) qs.set('crop', params.crop);
  if (params.region) qs.set('region', params.region);
  const url = `${API_BASE}/forecast${qs.toString() ? '?' + qs : ''}`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  return handleResponse(res);
}

// ─── Telemetry ──────────────────────────────────────────────────────────────

export async function getTelemetry(shipmentId) {
  const res = await fetch(`${API_BASE}/telemetry/${shipmentId}`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

// ─── Route Optimization ─────────────────────────────────────────────────────

export async function getRouteOptimization() {
  const res = await fetch(`${API_BASE}/route-optimization`, { headers: getAuthHeaders() });
  return handleResponse(res);
}
