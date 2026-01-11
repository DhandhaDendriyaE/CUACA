
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationSearch from '../components/LocationSearch';
import WeatherCard from '../components/WeatherCard';
import { getWeather } from '../services/api';
import { logout } from '../services/auth'; // ✅ tambahkan ini

export default function WeatherDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeDayIndex, setActiveDayIndex] = useState(1);
  const navigate = useNavigate(); // ✅ tambahkan ini

  // ✅ Fungsi logout
  const handleLogout = () => {
    logout();
    navigate('/login/pengunjung');
  };

  const handleSearch = async (location) => {
    if (!location.trim()) return;
    setLoading(true);
    setError('');
    try {
      const result = await getWeather(location);
      setData(result);
      setActiveDayIndex(1);
    } catch (err) {
      setError('Gagal: ' + (err.message || 'lokasi tidak ditemukan'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch('Jakarta, Indonesia');
  }, []);

  const currentDay = data?.days?.[activeDayIndex] || null;

  return (
    <div style={{ 
      padding: '24px', 
      fontFamily: 'Segoe UI, Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      background: '#f9f9f9'
    }}>
      {/* ✅ Header dengan tombol logout */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#0d47a1', margin: 0 }}>🌍 Weather Dashboard</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            background: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.95rem'
          }}
        >
          🔐 Logout
        </button>
      </div>
      
      <LocationSearch onSearch={handleSearch} />
      
      {loading && <p style={{ textAlign: 'center', color: '#1976d2' }}>Memuat...</p>}
      {error && <p style={{ textAlign: 'center', color: 'red' }}>❌ {error}</p>}
      
      {currentDay && data && (
        <WeatherCard 
          data={currentDay}
          city={data.city}
          country={data.country}
          selectedDayIndex={activeDayIndex}
          onSelectDay={setActiveDayIndex}
          totalDays={data.days?.length || 3}
          isHighlighted={currentDay.period === 'today'}
        />
      )}
    </div>
  );
}