import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin, setAuthToken } from '../services/auth';

export default function LoginAdmin() {
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
      const data = await loginAdmin(email, password);
      
      // Simpan token & role
      setAuthToken(data.token);
      localStorage.setItem('userRole', 'admin');
      
      // Redirect ke dashboard admin
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Email/password salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛡️</div>
          <h2 style={styles.title}>Login Admin</h2>
          <p style={{ color: '#757575' }}>Masuk ke panel kontrol sistem</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email admin"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              style={styles.input}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              ...styles.button,
              background: loading ? '#A5D6A7' : '#4CAF50'
            }}
          >
            {loading ? 'Memuat...' : 'Login sebagai Admin'}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={{ margin: 0, color: '#757575' }}>
            ⚠️ Akses khusus admin terverifikasi
          </p>
          
          {/* ✅ TOMBOL KEMBALI KE LOGIN PENGUNJUNG */}
          <button
            onClick={() => navigate('/login/pengunjung')}
            style={styles.backButton}
          >
            ← Kembali ke Login Pengunjung
          </button>
        </div>
      </div>
    </div>
  );
}

// Styling (diperluas dengan backButton)
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
    padding: '20px'
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    width: '100%',
    maxWidth: '450px',
    boxShadow: '0 10px 30px rgba(76, 175, 80, 0.2)',
    textAlign: 'center'
  },
  title: {
    color: '#1B5E20',
    margin: '0 0 8px 0',
    fontSize: '28px'
  },
  form: {
    textAlign: 'left'
  },
  inputGroup: {
    marginBottom: '20px'
  },
  input: {
    width: '100%',
    padding: '14px',
    border: '1px solid #C8E6C9',
    borderRadius: '10px',
    fontSize: '16px'
  },
  button: {
    width: '100%',
    padding: '14px',
    border: 'none',
    borderRadius: '10px',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  error: {
    background: '#FFEBEE',
    color: '#D32F2F',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'left'
  },
  footer: {
    marginTop: '24px',
    paddingTop: '20px',
    borderTop: '1px solid #E0E0E0'
  },
  backButton: {
    marginTop: '20px',
    padding: '10px 16px',
    background: 'none',
    border: '1px solid #81C784',
    borderRadius: '8px',
    color: '#1B5E20',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s',
    ':hover': {
      background: '#E8F5E9'
    }
  }
};