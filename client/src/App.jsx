// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Halaman
import LoginPengunjung from './pages/LoginPengunjung';
import LoginAdmin from './pages/LoginAdmin';
import WeatherDashboard from './pages/WeatherDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Service
import { getAuthToken } from './services/auth';

// Middleware proteksi
const ProtectedRoute = ({ children, allowedRoles }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = getAuthToken();
    const role = localStorage.getItem('userRole');
    setIsAuthenticated(!!token);
    setUserRole(role);
  }, []);

  if (isAuthenticated === null) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Memuat...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login/pengunjung" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default function App() {
  return (
    <Routes>
      {/* Halaman publik */}
      <Route path="/login/pengunjung" element={<LoginPengunjung />} />
      <Route path="/login/admin" element={<LoginAdmin />} />
      
      {/* Dashboard pengunjung (terproteksi) */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['pengunjung']}>
            <WeatherDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Dashboard admin (terproteksi) */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Redirect root ke login pengunjung */}
      <Route path="/" element={<Navigate to="/login/pengunjung" replace />} />
    </Routes>
  );
}