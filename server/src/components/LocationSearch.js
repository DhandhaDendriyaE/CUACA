import { useState } from 'react';

const LocationSearch = ({ onSearch }) => {
  const [input, setInput] = useState('');

  const examples = [
    'Jakarta', 'Bandung', 'Surabaya',
    'Tokyo', 'Seoul', 'Singapore',
    'London', 'Paris', 'Berlin',
    'New York', 'Los Angeles', 'Toronto',
    '-6.2,106.8', '35.7,139.7', '40.7,-74.0' // koordinat
  ];

  return (
    <div style={{ marginBottom: '20px' }}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Kota atau koordinat (misal: Tokyo, -6.2,106.8)"
        style={{ padding: '10px', width: '300px', marginRight: '10px' }}
        onKeyPress={(e) => e.key === 'Enter' && onSearch(input)}
      />
      <button onClick={() => onSearch(input)} disabled={!input}>
        Cari
      </button>

      <div style={{ marginTop: '10px', fontSize: '0.9em' }}>
        Contoh: {examples.map((ex, i) => (
          <span key={i} style={{ marginRight: '8px' }}>
            <button 
              onClick={() => onSearch(ex)} 
              style={{ background: '#e3f2fd', border: '1px solid #90caf9', cursor: 'pointer' }}
            >
              {ex}
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default LocationSearch;