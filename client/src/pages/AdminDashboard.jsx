import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Ganti dengan URL backend-mu
const API_BASE = 'http://localhost:5000/api';

export default function AdminDashboard() {
  const [pengunjung, setPengunjung] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const navigate = useNavigate();

  // Ambil token dari localStorage
  const getAuthToken = () => localStorage.getItem('token');

  // Fetch data pengunjung
  const fetchPengunjung = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE}/admin/pengunjung`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 403) {
        alert('Akses ditolak! Silakan login ulang.');
        navigate('/login/admin');
        return;
      }

      if (!res.ok) throw new Error(await res.text());
      
      const data = await res.json();
      setPengunjung(data);
    } catch (err) {
      setError(err.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPengunjung();
  }, []);

  // Handle edit
  const handleEdit = (user) => {
    setEditingId(user.id);
    setEditForm({ name: user.name, email: user.email });
  };

  // Simpan perubahan
  const handleSave = async (id) => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE}/admin/pengunjung/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (!res.ok) throw new Error(await res.text());
      
      fetchPengunjung(); // Refresh data
      setEditingId(null);
    } catch (err) {
      alert('Gagal menyimpan: ' + err.message);
    }
  };

  // Hapus pengunjung
  const handleDelete = async (id) => {
    if (!window.confirm('Hapus pengunjung ini?')) return;

    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE}/admin/pengunjung/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error(await res.text());
      
      fetchPengunjung(); // Refresh data
    } catch (err) {
      alert('Gagal menghapus: ' + err.message);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login/admin');
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <div>Memuat data pengunjung...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>👨‍💼 Dashboard Admin</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          🔐 Logout
        </button>
      </header>

      {/* Konten Utama */}
      <main style={styles.main}>
        {error && (
          <div style={styles.errorBox}>
            ❌ {error}
          </div>
        )}

        <div style={styles.stats}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{pengunjung.length}</div>
            <div>Total Pengunjung</div>
          </div>
        </div>

        {/* Tabel Pengunjung */}
        <div style={styles.tableContainer}>
          <h2 style={styles.sectionTitle}>Daftar Pengunjung</h2>
          
          {pengunjung.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#757575' }}>
              Belum ada pengunjung terdaftar
            </p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Tanggal Daftar</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pengunjung.map(user => (
                  <tr key={user.id}>
                    <td>
                      {editingId === user.id ? (
                        <input
                          value={editForm.name}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          style={styles.input}
                        />
                      ) : (
                        user.name
                      )}
                    </td>
                    <td>
                      {editingId === user.id ? (
                        <input
                          value={editForm.email}
                          onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                          style={styles.input}
                        />
                      ) : (
                        user.email
                      )}
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString('id-ID')}</td>
                    <td>
                      {editingId === user.id ? (
                        <>
                          <button onClick={() => handleSave(user.id)} style={styles.saveBtn}>
                            💾 Simpan
                          </button>
                          <button onClick={() => setEditingId(null)} style={styles.cancelBtn}>
                            ✕ Batal
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(user)} style={styles.editBtn}>
                            ✏️ Edit
                          </button>
                          <button onClick={() => handleDelete(user.id)} style={styles.deleteBtn}>
                            🗑️ Hapus
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

// Styling
const styles = {
  container: {
    fontFamily: 'Segoe UI, Arial, sans-serif',
    background: '#f5f5f5',
    minHeight: '100vh'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    background: '#1976d2',
    color: 'white'
  },
  title: {
    margin: 0,
    fontSize: '1.8rem'
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.2)',
    border: '1px solid white',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  main: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontSize: '1.2rem'
  },
  errorBox: {
    background: '#ffebee',
    color: '#c62828',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '24px'
  },
  stats: {
    display: 'flex',
    gap: '24px',
    marginBottom: '32px'
  },
  statCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
    flex: 1
  },
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#1976d2'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#0d47a1',
    marginBottom: '20px'
  },
  tableContainer: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  input: {
    width: '100%',
    padding: '6px',
    border: '1px solid #ccc',
    borderRadius: '4px'
  },
  editBtn: {
    background: '#2196f3',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    marginRight: '8px'
  },
  deleteBtn: {
    background: '#f44336',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  saveBtn: {
    background: '#4caf50',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    marginRight: '8px'
  },
  cancelBtn: {
    background: '#9e9e9e',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};