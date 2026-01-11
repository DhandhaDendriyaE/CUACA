
import { useState } from 'react';

export default function WeatherCard({ data, city, country, selectedDayIndex, onSelectDay, totalDays }) {
  const [tempUnit, setTempUnit] = useState('C'); // C/F toggl

  const temp = tempUnit === 'C' 
    ? Math.round(data.temperature)
    : Math.round((data.temperature * 9/5) + 32);

  const high = tempUnit === 'C' 
    ? Math.round(data.high) 
    : Math.round((data.high * 9/5) + 32);

  const low = tempUnit === 'C' 
    ? Math.round(data.low) 
    : Math.round((data.low * 9/5) + 32);

  const isRainy = data.condition?.includes('rain') || data.precipitation > 0;
  const isCloudy = data.condition?.includes('cloud');
  const isSunny = data.condition?.includes('sun');

  return (
    <div style={{
      background: 'linear-gradient(135deg, #87CEEB 0%, #E0F7FA 100%)',
      borderRadius: '20px',
      padding: '32px',
      textAlign: 'center',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      position: 'relative',
      overflow: 'hidden',
      maxWidth: '600px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Curve bottom */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '100px',
        background: '#FFFFFF',
        clipPath: 'ellipse(100% 100% at 50% 0%)',
        zIndex: -1
      }}></div>

      {/* City & Country */}
      <h2 style={{ 
        color: '#0D47A1', 
        margin: '0 0 4px 0', 
        fontSize: '1.5rem',
        fontWeight: 'bold'
      }}>
        {city}, {country}
      </h2>
      <p style={{ 
        color: '#555', 
        fontSize: '0.9em', 
        margin: '0 0 20px 0'
      }}>
        {data.date}
      </p>

      {/* Weather Icon */}
      <div style={{ 
        fontSize: '64px', 
        margin: '20px 0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {data.icon && (
          <img 
            src={`https:${data.icon}`} 
            alt={data.condition} 
            style={{ 
              width: '100px', 
              height: '100px',
              filter: isRainy ? 'drop-shadow(0 0 2px #4FC3F7)' : 
                        isCloudy ? 'drop-shadow(0 0 2px #9E9E9E)' : 
                        isSunny ? 'drop-shadow(0 0 2px #FFD700)' : 'none'
            }} 
          />
        )}
      </div>

      {/* Temperature */}
      <div style={{ 
        fontSize: '48px', 
        fontWeight: 'bold', 
        color: '#212121',
        margin: '10px 0'
      }}>
        {temp}°{tempUnit}
      </div>

      {/* Real Time */}
      <p style={{ 
        fontSize: '0.8em', 
        color: '#777', 
        margin: '8px 0'
      }}>
        ⏰ {data.time}
      </p>

      {/* Navigation: Yesterday / Today / Tomorrow */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        margin: '20px 0',
        alignItems: 'center'
      }}>
        <button 
          onClick={() => selectedDayIndex > 0 && onSelectDay(selectedDayIndex - 1)}
          disabled={selectedDayIndex === 0}
          style={{
            background: 'none',
            border: 'none',
            color: selectedDayIndex === 0 ? '#ccc' : '#0D47A1',
            cursor: selectedDayIndex === 0 ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            textDecoration: 'underline',
            opacity: selectedDayIndex === 0 ? 0.5 : 1
          }}
        >
          ← Yesterday
        </button>
        <span style={{ color: '#555', fontSize: '0.9em' }}>
          Day {selectedDayIndex + 1} of {totalDays}
        </span>
        <button 
          onClick={() => selectedDayIndex < totalDays - 1 && onSelectDay(selectedDayIndex + 1)}
          disabled={selectedDayIndex === totalDays - 1}
          style={{
            background: 'none',
            border: 'none',
            color: selectedDayIndex === totalDays - 1 ? '#ccc' : '#0D47A1',
            cursor: selectedDayIndex === totalDays - 1 ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            textDecoration: 'underline',
            opacity: selectedDayIndex === totalDays - 1 ? 0.5 : 1
          }}
        >
          Tomorrow →
        </button>
      </div>

      {/* Details */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '16px', 
        flexWrap: 'wrap', 
        marginTop: '20px',
        padding: '16px',
        background: 'rgba(255,255,255,0.8)',
        borderRadius: '12px'
      }}>
        <span style={detailStyle}>🌡️ {high}°/{low}°</span>
        <span style={detailStyle}>💧 {data.humidity}%</span>
        <span style={detailStyle}>🌧️ {data.precipitation} mm</span>
        <span style={detailStyle}>🌬️ {data.wind} km/h</span>
        <span style={detailStyle}>🔽 {data.pressure} hPa</span>
      </div>

      {/* Toggle °C/°F */}
      <div style={{ 
        marginTop: '20px', 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '8px'
      }}>
        <button 
          onClick={() => setTempUnit('C')} 
          style={toggleBtn(tempUnit === 'C')}
        >
          °C
        </button>
        <button 
          onClick={() => setTempUnit('F')} 
          style={toggleBtn(tempUnit === 'F')}
        >
          °F
        </button>
      </div>
    </div>
  );
}


const detailStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '0.9em',
  color: '#555'
};

const toggleBtn = (isActive) => ({
  background: isActive ? '#1976d2' : '#E3F2FD',
  color: isActive ? 'white' : '#0D47A1',
  border: '1px solid #90CAF9',
  padding: '4px 8px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.9em',
  fontWeight: isActive ? 'bold' : 'normal'
});