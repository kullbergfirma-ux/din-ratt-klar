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

  return (
    <div ref={ref} className="relative">
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
        className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
      />
      {open && matches.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {matches.map((item, i) => (
            <li
              key={item}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                i === highlighted ? 'bg-primary/10 text-foreground' : 'text-foreground hover:bg-muted/50'
              }`}
              onMouseDown={() => {
                onChange(item);
                setOpen(false);
              }}
              onMouseEnter={() => setHighlighted(i)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
