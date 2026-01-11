const API_BASE = 'http://localhost:5000/api';

// ─── CUACA ──────────────────────────────────────────────
export const getWeather = async (location) => {
  const res = await fetch(`${API_BASE}/weather/${encodeURIComponent(location)}`);
  if (!res.ok) {
    throw new Error('Gagal mengambil data cuaca');
  }
  return res.json();
};

// ─── AUTH PENGGUNJUNG ───────────────────────────────────
export const registerPengunjung = async (userData) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Gagal mendaftar');
  }
  return res.json();
};

export const loginPengunjung = async (credentials) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Email/password salah');
  }
  return res.json();
};

// ─── AUTH ADMIN ─────────────────────────────────────────
export const loginAdmin = async (credentials) => {
  const res = await fetch(`${API_BASE}/auth/login-admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Email/password admin salah');
  }
  return res.json();
};

// ─── ADMIN: KELOLA PENGGUNJUNG ──────────────────────────
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getPengunjung = async () => {
  const res = await fetch(`${API_BASE}/admin/pengunjung`, {
    headers: getAuthHeader()
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Gagal mengambil data pengunjung');
  }
  return res.json();
};

export const updatePengunjung = async (id, userData) => {
  const res = await fetch(`${API_BASE}/admin/pengunjung/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(userData)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Gagal memperbarui data');
  }
  return res.json();
};

export const deletePengunjung = async (id) => {
  const res = await fetch(`${API_BASE}/admin/pengunjung/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Gagal menghapus pengunjung');
  }
  return res.json();
};