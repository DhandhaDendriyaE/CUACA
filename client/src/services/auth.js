// src/services/auth.js

const API_BASE = 'http://localhost:5000/api';

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
};
export const loginPengunjung = async (email, password) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Login gagal');
  }
  
  return res.json();
};

// ✅ Fungsi login admin
export const loginAdmin = async (email, password) => {
  const res = await fetch(`${API_BASE}/auth/login-admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Login admin gagal');
  }
  
  return res.json();
};

// ✅ Helper token
export const setAuthToken = (token) => {
  localStorage.setItem('token', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};