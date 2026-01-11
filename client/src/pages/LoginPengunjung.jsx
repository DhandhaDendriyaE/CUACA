import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginPengunjung, registerPengunjung } from '../services/api';

export default function LoginPengunjung() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let data;
      if (isLogin) {
        data = await loginPengunjung({ email, password });
      } else {
        data = await registerPengunjung({ name, email, password });
        alert('✅ Pendaftaran berhasil! Silakan login.');
        setIsLogin(true);
        return;
      }

      // Simpan token & role
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', 'pengunjung');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '450px',
        boxShadow: '0 8px 24px rgba(33,150,243,0.2)',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#0D47A1', margin: '0 0 20px 0' }}>
          {isLogin ? '👤 Login Pengunjung' : '📝 Daftar Akun'}
        </h2>

        {error && (
          <div style={{
            background: '#FFEBEE',
            color: '#D32F2F',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="Nama Lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                style={inputStyle}
              />
            </div>
          )}
          
          <div style={{ marginBottom: '16px' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...buttonStyle,
              background: loading ? '#90CAF9' : '#2196F3'
            }}
          >
            {loading ? 'Memuat...' : isLogin ? 'Masuk' : 'Daftar'}
          </button>
        </form>

        <p style={{ marginTop: '20px', color: '#757575' }}>
          {isLogin ? (
            <>
              Belum punya akun?{' '}
              <button
                onClick={() => setIsLogin(false)}
                style={linkButton}
              >
                Daftar di sini
              </button>
            </>
          ) : (
            <>
              Sudah punya akun?{' '}
              <button
                onClick={() => setIsLogin(true)}
                style={linkButton}
              >
                Login di sini
              </button>
            </>
          )}
        </p>

        {/* 🔑 Tombol Login Admin */}
        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #EEE' }}>
          <p style={{ color: '#757575', margin: '0 0 12px 0' }}>Untuk admin sistem:</p>
          <button
            onClick={() => navigate('/login/admin')}
            style={{
              ...buttonStyle,
              background: '#4CAF50',
              fontSize: '0.95rem'
            }}
          >
            🔐 Login sebagai Admin
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px',
  border: '1px solid #B3E5FC',
  borderRadius: '8px',
  fontSize: '16px',
  boxSizing: 'border-box'
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  border: 'none',
  borderRadius: '8px',
  color: 'white',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer'
};

const linkButton = {
  background: 'none',
  border: 'none',
  color: '#2196F3',
  fontWeight: '600',
  cursor: 'pointer',
  padding: 0,
  fontSize: 'inherit'
};