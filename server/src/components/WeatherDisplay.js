export default function WeatherDisplay({ data }) {
  if (!data) return null;

  return (
    <div>
      <h2>🌤️ Cuaca di {data.city}, {data.country}</h2>
      <p>🕒 Lokal: {new Date(data.localtime).toLocaleString()}</p>
      
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {data.days.map((day, i) => (
          <div key={i} style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '16px', 
            minWidth: '200px',
            backgroundColor: '#fff'
          }}>
            <h3>{day.period === 'yesterday' ? 'Kemarin' : 
                day.period === 'today' ? 'Hari Ini' : 'Besok'}</h3>
            <p>📅 {day.date}</p>
            
            {day.icon && (
              <img 
                src={`https:${day.icon}`} 
                alt={day.condition} 
                style={{ width: '60px', height: '60px' }} 
              />
            )}
            <p>{day.condition}</p>
            
            <p>🌡️ Suhu: <b>{day.temperature}°C</b></p>
            <p>💧 Kelembapan: {day.humidity}%</p>
            <p>🌧️ Hujan: {day.precipitation} mm</p>
            <p>💨 Angin: {day.wind} km/jam</p>
            <p>🔽 Tekanan: {day.pressure ? `${day.pressure} hPa` : '–'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}