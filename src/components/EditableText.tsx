import { useState } from 'react';
import { useTextEditor } from '@/context/TextEditorContext';
import { Pencil } from 'lucide-react';

interface Props {
  textKey: string;
  fallback: string;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'span' | 'li';
  style?: React.CSSProperties;
  className?: string;
}

const EditableText = ({ textKey, fallback, as: Tag = 'span', style, className }: Props) => {
  const { getText, isAdmin, saveText } = useTextEditor();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const value = getText(textKey, fallback);

  const handleEdit = () => {
    setDraft(value);
    setEditing(true);
  };

  const handleSave = async () => {
    await saveText(textKey, draft);
    setEditing(false);
  };

  if (editing) {
    return (
      <div style={{ display: 'inline-block', width: '100%' }}>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          autoFocus
          style={{
            width: '100%',
            minHeight: 80,
            padding: '8px 12px',
            border: '2px solid #1B4F8A',
            borderRadius: 8,
            fontSize: 'inherit',
            fontFamily: 'inherit',
            lineHeight: 'inherit',
            resize: 'vertical',
            outline: 'none',
          }}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
          <button
            onClick={handleSave}
            style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: '#1B4F8A', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            Spara
          </button>
          <button
            onClick={() => setEditing(false)}
            style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #E2E8F0', background: 'white', fontSize: 13, cursor: 'pointer' }}
          >
            Avbryt
          </button>
        </div>
      </div>
    );
  }

  return (
    <Tag style={{ ...style, position: 'relative', display: 'inline' }} className={className}>
      {value}
      {isAdmin && (
        <button
          onClick={handleEdit}
          title="Redigera text"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 22,
            height: 22,
            borderRadius: 4,
            border: '1px solid #E2E8F0',
            background: 'white',
            cursor: 'pointer',
            marginLeft: 6,
            verticalAlign: 'middle',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            flexShrink: 0,
          }}
        >
          <Pencil style={{ width: 11, height: 11, color: '#1B4F8A' }} />
        </button>
      )}
    </Tag>
  );
};

export default EditableText;
