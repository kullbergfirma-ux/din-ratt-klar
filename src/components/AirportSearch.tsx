import { useState, useRef, useEffect } from 'react';
import { airports, type Airport } from '@/data/airports';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const AirportSearch = ({ value, onChange, placeholder }: Props) => {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<Airport[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleSearch = (q: string) => {
    setQuery(q);
    onChange(q);
    if (q.length < 2) { setResults([]); setOpen(false); return; }
    const lower = q.toLowerCase();
    const filtered = airports.filter(a =>
      a.city.toLowerCase().includes(lower) ||
      a.country.toLowerCase().includes(lower) ||
      a.name.toLowerCase().includes(lower) ||
      a.iata.toLowerCase().includes(lower)
    ).slice(0, 8);
    setResults(filtered);
    setOpen(filtered.length > 0);
  };

  const handleSelect = (airport: Airport) => {
    const display = `${airport.city} (${airport.iata})`;
    setQuery(display);
    onChange(display);
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <input
        type="text"
        value={query}
        onChange={e => handleSearch(e.target.value)}
        placeholder={placeholder || 'Sök stad, land eller flygplats'}
        style={{
          width: '100%',
          padding: '14px 16px',
          border: '1.5px solid #E2E8F0',
          borderRadius: 10,
          fontSize: 15,
          color: '#1A2744',
          background: '#FAFBFC',
          outline: 'none',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        }}
        onFocus={e => {
          e.currentTarget.style.borderColor = '#1B4F8A';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(27,79,138,0.08)';
          e.currentTarget.style.background = '#FFFFFF';
          if (query.length >= 2 && results.length > 0) setOpen(true);
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = '#E2E8F0';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.background = '#FAFBFC';
        }}
      />
      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: '#FFFFFF',
          border: '1.5px solid #E2E8F0',
          borderRadius: 10,
          marginTop: 4,
          maxHeight: 280,
          overflowY: 'auto',
          zIndex: 50,
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        }}>
          {results.map(airport => (
            <div
              key={airport.iata}
              onMouseDown={() => handleSelect(airport)}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                borderBottom: '1px solid #F0F4F8',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F0F5FF'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <div>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#1A2744' }}>
                  {airport.city}
                </span>
                <span style={{ fontSize: 12, color: '#6B7280', marginLeft: 8 }}>
                  {airport.name}
                </span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#1B4F8A', background: '#EEF4FF', padding: '2px 8px', borderRadius: 4 }}>
                {airport.iata}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AirportSearch;
