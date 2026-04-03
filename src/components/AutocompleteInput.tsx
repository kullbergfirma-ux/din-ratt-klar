import { useState, useRef, useEffect } from 'react';
import { fuzzyMatch } from '@/data/companies';

interface Props {
  value: string;
  onChange: (val: string) => void;
  suggestions: string[];
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

const AutocompleteInput = ({ value, onChange, suggestions, placeholder, onKeyDown }: Props) => {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const matches = fuzzyMatch(value, suggestions);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted(h => Math.min(h + 1, matches.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted(h => Math.max(h - 1, -1));
    } else if (e.key === 'Enter' && highlighted >= 0 && matches[highlighted]) {
      e.preventDefault();
      onChange(matches[highlighted]);
      setOpen(false);
      setHighlighted(-1);
    } else if (e.key === 'Escape') {
      setOpen(false);
    } else {
      onKeyDown?.(e);
    }
  };

  const highlightMatch = (text: string) => {
    if (!value.trim()) return text;
    const idx = text.toLowerCase().indexOf(value.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <strong style={{ color: '#1B4F8A' }}>{text.slice(idx, idx + value.length)}</strong>
        {text.slice(idx + value.length)}
      </>
    );
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setHighlighted(-1);
        }}
        onFocus={() => value && setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
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
        onFocusCapture={e => {
          e.currentTarget.style.borderColor = '#1B4F8A';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(27, 79, 138, 0.08)';
          e.currentTarget.style.background = '#FFFFFF';
        }}
        onBlurCapture={e => {
          e.currentTarget.style.borderColor = '#E2E8F0';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.background = '#FAFBFC';
        }}
      />
      {open && matches.length > 0 && (
        <ul style={{
          position: 'absolute',
          width: '100%',
          background: '#FFFFFF',
          border: '1.5px solid #E2E8F0',
          borderRadius: 10,
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          marginTop: 4,
          maxHeight: 220,
          overflowY: 'auto',
          zIndex: 100,
          listStyle: 'none',
          padding: 0,
          margin: 0,
          marginBlockStart: 4,
        }}>
          {matches.map((item, i) => (
            <li
              key={item}
              style={{
                padding: '12px 16px',
                fontSize: 14,
                color: i === highlighted ? '#1B4F8A' : '#1A2744',
                background: i === highlighted ? '#F0F5FF' : 'transparent',
                cursor: 'pointer',
                transition: 'background 0.1s ease',
              }}
              onMouseDown={() => {
                onChange(item);
                setOpen(false);
              }}
              onMouseEnter={() => setHighlighted(i)}
            >
              {highlightMatch(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
