import { useState } from 'react';

export default function LocationSearch({ onSearch }) {
  const [input, setInput] = useState('');

  const examples = [
    'Paris', 'Tokyo', 'London', 'New York',
    'Jakarta', 'Sydney', 'Cairo', 'Rome',
    '-6.2,106.8', '35.7,139.7', '51.5,-0.1', '40.7,-74.0'
  ];

  return (
    <div style={{ 
      marginBottom: '20px', 
      textAlign: 'center',
      padding: '16px',
      background: '#fff',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Kota atau koordinat, contoh: Paris atau -6.2,106.8"
        style={{ 
          padding: '10px', 
          width: '300px', 
          marginRight: '10px',
          border: '1px solid #ddd',
          borderRadius: '6px'
        }}
        onKeyPress={(e) => e.key === 'Enter' && onSearch(input)}
      />
      <button 
        onClick={() => onSearch(input)} 
        disabled={!input}
        style={{
          padding: '10px 20px',
          backgroundColor: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        Cari
      </button>

      <div style={{ 
        marginTop: '12px', 
        fontSize: '0.85em', 
        color: '#555',
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        Contoh: {examples.map((ex, i) => (
          <button
            key={i}
            onClick={() => onSearch(ex)}
            style={{
              margin: '2px',
              padding: '4px 8px',
              fontSize: '0.8em',
              background: '#e8f4fc',
              border: '1px solid #b3d9f4',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}