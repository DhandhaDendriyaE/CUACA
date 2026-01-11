import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerPengunjung } from '../services/api';

export default function RegisterPengunjung() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await registerPengunjung(formData);
      alert('✅ Pendaftaran berhasil! Silakan login.');
      navigate('/login/pengunjung');
    } catch (err) {
      setError(err.message || 'Gagal mendaftar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📝 Daftar Akun Pengunjung</h2>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nama Lengkap"
              required
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              minLength="6"
              style={styles.input}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={styles.button}
          >
            {loading ? 'Memuat...' : 'Daftar Sekarang'}
          </button>
        </form>
        
        <p style={styles.footer}>
          Sudah punya akun?{' '}
          <a href="/login/pengunjung" style={styles.link}>Login di sini</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
    padding: '20px'
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    width: '100%',
    maxWidth: '450px',
    boxShadow: '0 8px 24px rgba(33,150,243,0.2)'
  },
  title: {
    textAlign: 'center',
    color: '#0D47A1',
    marginBottom: '30px'
  },
  form: { marginTop: '20px' },
  inputGroup: { marginBottom: '20px' },
  input: {
    width: '100%',
    padding: '14px',
    border: '1px solid #B3E5FC',
    borderRadius: '10px',
    fontSize: '16px'
  },
  button: {
    width: '100%',
    padding: '14px',
    background: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  error: {
    background: '#FFEBEE',
    color: '#D32F2F',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  footer: {
    textAlign: 'center',
    marginTop: '24px',
    color: '#757575'
  },
  link: {
    color: '#2196F3',
    textDecoration: 'none',
    fontWeight: '600'
  }
};