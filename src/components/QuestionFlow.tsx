import { useState } from 'react';
import { type Category, type CategoryQuestion } from '@/lib/categories';
import { ChevronLeft, ChevronRight, Plane, Train, Bus, Ship, Building2, Briefcase, Car, Clock, X, Users, AlertTriangle, MessageSquare } from 'lucide-react';
import AutocompleteInput from '@/components/AutocompleteInput';
import { questionCompanyMap } from '@/data/companies';

interface Props {
  category: Category;
  onSubmit: (answers: Record<string, string>, files: Record<string, File[]>) => void;
  onBack: () => void;
}

const optionIconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  'Flyg': Plane,
  'Tåg': Train,
  'Buss': Bus,
  'Färja': Ship,
  'Hotell': Building2,
  'Paketresa': Briefcase,
  'Hyrbil': Car,
  'Försening': Clock,
  'Inställt': X,
  'Överbookning': Users,
  'Ej som utlovat': AlertTriangle,
  'Annat': MessageSquare,
};

const months = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'];

const QuestionFlow = ({ category, onSubmit, onBack }: Props) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>({});
  const [currentQ, setCurrentQ] = useState(0);

  const getVisibleQuestions = (): CategoryQuestion[] => {
    return category.questions.filter(q => {
      if (q.showWhen) {
        const depAnswer = answers[q.showWhen.questionId];
        return q.showWhen.values.includes(depAnswer);
      }
      return true;
    });
  };

  const questions = getVisibleQuestions();
  const question = questions[currentQ];
  if (!question) return null;

  const isLast = currentQ === questions.length - 1;
  const canProceed = question.type === 'file' || question.optional || (question.type === 'date'
    ? /^\d{4}-\d{2}-\d{2}$/.test(answers[question.id] || '')
    : !!answers[question.id]?.trim());
  const progressPercent = ((currentQ + 1) / questions.length) * 100;

  const handleNext = () => {
    if (isLast) {
      onSubmit(answers, uploadedFiles);
    } else {
      setCurrentQ(currentQ + 1);
    }
  };

  const handlePrev = () => {
    if (currentQ === 0) {
      onBack();
    } else {
      setCurrentQ(currentQ - 1);
    }
  };

  const hasSuggestions = (qId: string): string[] | undefined => {
    return questionCompanyMap[qId];
  };

  const isShortOptions = (opts: string[]) => opts.length <= 3 && opts.every(o => o.length <= 10);

  const renderDateInput = (value: string, onChange: (val: string) => void) => {
    const parts = value ? value.split('-') : ['', '', ''];
    const year = parts[0] || '';
    const month = parts[1] || '';
    const day = parts[2] || '';
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => String(currentYear - i));
    const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

    const update = (y: string, m: string, d: string) => {
      onChange(`${y || ''}-${m || ''}-${d || ''}`);
    };

    const selectStyle: React.CSSProperties = {
      width: '100%',
      padding: '14px 16px',
      border: '1.5px solid #E2E8F0',
      borderRadius: 10,
      fontSize: 15,
      color: '#1A2744',
      background: '#FAFBFC',
      outline: 'none',
      appearance: 'none' as const,
      cursor: 'pointer',
    };

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: 10 }}>
        <select value={day} onChange={e => update(year, month, e.target.value)} style={selectStyle}>
          <option value="">Dag</option>
          {days.map(d => <option key={d} value={d}>{parseInt(d)}</option>)}
        </select>
        <select value={month} onChange={e => update(year, e.target.value, day)} style={selectStyle}>
          <option value="">Månad</option>
          {months.map((m, i) => <option key={m} value={String(i + 1).padStart(2, '0')}>{m}</option>)}
        </select>
        <select value={year} onChange={e => update(e.target.value, month, day)} style={selectStyle}>
          <option value="">År</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
    );
  };

  const isNarrativeQuestion = (q: CategoryQuestion): boolean => {
    const label = q.label.toLowerCase();
    return /(beskriv|vad hände|vad är felet|vad är problemet|situationen|kontaktat|kontakten)/.test(label);
  };

  const renderInput = (q: CategoryQuestion) => {
    const value = answers[q.id] || '';
    const onChange = (val: string) => setAnswers({ ...answers, [q.id]: val });
    const suggestions = hasSuggestions(q.id);

    if (q.type === 'file') {
      const files = uploadedFiles[q.id] || [];
      return (
        <div>
          <div
            onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = '#1B4F8A'; }}
            onDragLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; }}
            onDrop={e => {
              e.preventDefault();
              e.currentTarget.style.borderColor = '#E2E8F0';
              const dropped = Array.from(e.dataTransfer.files);
              setUploadedFiles(prev => ({ ...prev, [q.id]: [...(prev[q.id] || []), ...dropped] }));
              onChange('uploaded');
            }}
            style={{
              border: '2px dashed #E2E8F0',
              borderRadius: 12,
              padding: '32px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease',
              background: '#FAFBFC',
            }}
            onClick={() => document.getElementById(`file-input-${q.id}`)?.click()}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>📎</div>
            <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 4px' }}>
              Dra och släpp filer här eller klicka för att välja
            </p>
            <p style={{ fontSize: 12, color: '#9BA3AF', margin: 0 }}>
              {q.placeholder}
            </p>
            <input
              id={`file-input-${q.id}`}
              type="file"
              multiple
              accept={q.fileTypes?.join(',')}
              style={{ display: 'none' }}
              onChange={e => {
                const selected = Array.from(e.target.files || []);
                setUploadedFiles(prev => ({ ...prev, [q.id]: [...(prev[q.id] || []), ...selected] }));
                onChange('uploaded');
              }}
            />
          </div>

          {files.length > 0 && (
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {files.map((file, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: '#EEF4FF',
                  borderRadius: 8,
                  fontSize: 13,
                  color: '#1B4F8A',
                }}>
                  <span>{file.name}</span>
                  <button
                    onClick={() => setUploadedFiles(prev => ({
                      ...prev,
                      [q.id]: prev[q.id].filter((_, fi) => fi !== i),
                    }))}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', fontSize: 16, lineHeight: 1 }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <p style={{ fontSize: 12, color: '#9BA3AF', marginTop: 10, textAlign: 'center' }}>
            Valfritt — du kan gå vidare utan att ladda upp filer
          </p>
        </div>
      );
    }

    if (q.type === 'select' && q.options) {
      const short = isShortOptions(q.options);
      return (
        <div style={short ? { display: 'grid', gridTemplateColumns: `repeat(${q.options.length}, 1fr)`, gap: 8 } : undefined}>
          {q.options.map((opt) => {
            const selected = value === opt;
            const IconComp = optionIconMap[opt];
            return (
              <button
                key={opt}
                onClick={() => onChange(opt)}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  border: selected ? '1.5px solid #1B4F8A' : '1.5px solid #E2E8F0',
                  borderRadius: 10,
                  background: selected ? '#EEF4FF' : '#FFFFFF',
                  fontSize: 15,
                  fontWeight: 500,
                  color: selected ? '#1B4F8A' : '#1A2744',
                  cursor: 'pointer',
                  marginBottom: short ? 0 : 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}
                onMouseEnter={e => {
                  if (!selected) {
                    e.currentTarget.style.borderColor = '#93AACF';
                    e.currentTarget.style.background = '#F8FAFF';
                  }
                }}
                onMouseLeave={e => {
                  if (!selected) {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.background = '#FFFFFF';
                  }
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {IconComp && <IconComp style={{ width: 16, height: 16, strokeWidth: 1.5 }} />}
                  {opt}
                </span>
                {selected && (
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#1B4F8A', flexShrink: 0 }} />
                )}
              </button>
            );
          })}
        </div>
      );
    }

    if (q.type === 'date') {
      return renderDateInput(value, onChange);
    }

    if (suggestions) {
      return (
        <AutocompleteInput
          value={value}
          onChange={onChange}
          suggestions={suggestions}
          placeholder={q.placeholder}
          onKeyDown={(e) => e.key === 'Enter' && canProceed && handleNext()}
        />
      );
    }

    if (isNarrativeQuestion(q) || (isLast && q.type === 'text')) {
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={q.placeholder}
          rows={5}
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
            resize: 'vertical',
            minHeight: 120,
            lineHeight: 1.6,
            fontFamily: 'inherit',
          }}
          onFocus={e => {
            e.currentTarget.style.borderColor = '#1B4F8A';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(27, 79, 138, 0.08)';
            e.currentTarget.style.background = '#FFFFFF';
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor = '#E2E8F0';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.background = '#FAFBFC';
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.metaKey && canProceed) handleNext();
          }}
        />
      );
    }

    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={q.placeholder}
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
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(27, 79, 138, 0.08)';
          e.currentTarget.style.background = '#FFFFFF';
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = '#E2E8F0';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.background = '#FAFBFC';
        }}
        onKeyDown={(e) => e.key === 'Enter' && canProceed && handleNext()}
      />
    );
  };

  return (
    <div
      className="question-card"
      style={{
        background: '#FFFFFF',
        borderRadius: 16,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)',
        border: '1px solid rgba(0,0,0,0.06)',
        padding: '40px 48px',
        maxWidth: 640,
        margin: '0 auto',
      }}
    >
      {/* Progress bar */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ height: 3, background: '#E8ECF0', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: '#1B4F8A', borderRadius: 4, width: `${progressPercent}%`, transition: 'width 0.4s ease' }} />
        </div>
        <div style={{ textAlign: 'right', marginTop: 8, fontSize: 13, color: '#9BA3AF' }}>
          Fråga {currentQ + 1} av {questions.length}
        </div>
      </div>

      {/* Question header */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 22, fontWeight: 600, color: '#0F1F3D', lineHeight: 1.3, margin: 0 }}>
          {question.label}
        </h3>
      </div>

      {/* Input */}
      <div style={{ marginBottom: 32 }}>{renderInput(question)}</div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24, borderTop: '1px solid #F0F4F8' }}>
        <button
          onClick={handlePrev}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#6B7280',
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 0',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#1A2744'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#6B7280'; }}
        >
          <ChevronLeft style={{ width: 16, height: 16 }} />
          Tillbaka
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed}
          style={{
            background: canProceed ? '#1B4F8A' : '#E2E8F0',
            color: canProceed ? '#FFFFFF' : '#9BA3AF',
            border: 'none',
            borderRadius: 10,
            padding: '14px 28px',
            fontSize: 15,
            fontWeight: 600,
            cursor: canProceed ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'background 0.2s ease, transform 0.1s ease',
          }}
          onMouseEnter={e => { if (canProceed) e.currentTarget.style.background = '#163F6E'; }}
          onMouseLeave={e => { if (canProceed) e.currentTarget.style.background = '#1B4F8A'; }}
          onMouseDown={e => { if (canProceed) e.currentTarget.style.transform = 'scale(0.98)'; }}
          onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          {isLast ? 'Analysera' : 'Nästa'}
          <ChevronRight style={{ width: 16, height: 16 }} />
        </button>
      </div>

      <style>{`
        @keyframes stepIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .question-card { animation: stepIn 0.25s ease forwards; }
      `}</style>
    </div>
  );
};

export default QuestionFlow;
