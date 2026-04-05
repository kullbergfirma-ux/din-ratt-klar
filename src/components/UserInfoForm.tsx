import { useState } from 'react';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  postalCode: string;
  city: string;
  streetAddress: string;
  counterparty: string;
}

interface Props {
  onSubmit: (profile: UserProfile) => void;
  onBack: () => void;
  categoryTitle: string;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  border: '1.5px solid #E2E8F0',
  borderRadius: 10,
  fontSize: 15,
  color: '#1A2744',
  background: '#FAFBFC',
  outline: 'none',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
};

const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.borderColor = '#1B4F8A';
  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(27, 79, 138, 0.08)';
  e.currentTarget.style.background = '#FFFFFF';
};

const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.borderColor = '#E2E8F0';
  e.currentTarget.style.boxShadow = 'none';
  e.currentTarget.style.background = '#FAFBFC';
};

const UserInfoForm = ({ onSubmit, onBack }: Props) => {
  const [profile, setProfile] = useState<UserProfile>({
    fullName: '',
    email: '',
    phone: '',
    postalCode: '',
    city: '',
    streetAddress: '',
    counterparty: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!profile.fullName.trim()) errs.fullName = 'Ange ditt namn';
    if (!profile.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) errs.email = 'Ange en giltig e-postadress';
    if (!profile.postalCode.trim()) errs.postalCode = 'Ange postnummer';
    if (!profile.city.trim()) errs.city = 'Ange ort';
    if (!profile.counterparty.trim()) errs.counterparty = 'Ange företagets namn';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(profile);
  };

  const requiredDot = <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#1B4F8A', marginLeft: 6, verticalAlign: 'middle' }} />;

  const field = (key: keyof UserProfile, label: string, required: boolean, placeholder: string, type = 'text') => (
    <div>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#1A2744', marginBottom: 6 }}>
        {label}{required && requiredDot}
      </label>
      <input
        type={type}
        value={profile[key]}
        onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
        placeholder={placeholder}
        style={{
          ...inputStyle,
          borderColor: errors[key] ? '#EF4444' : '#E2E8F0',
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {errors[key] && <p style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>{errors[key]}</p>}
    </div>
  );

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
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: '#9BA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
          DINA UPPGIFTER
        </div>
        <h3 style={{ fontSize: 22, fontWeight: 600, color: '#0F1F3D', lineHeight: 1.3, margin: 0 }}>
          Sista steget innan din bedömning
        </h3>
        <p style={{ fontSize: 14, color: '#6B7280', marginTop: 8 }}>
          Dina uppgifter används för att fylla i kravbrevet automatiskt. Du betalar ingenting nu.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          {field('fullName', 'Förnamn och efternamn', true, 'Anna Andersson')}
          {field('email', 'E-postadress', true, 'anna@exempel.se', 'email')}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          {field('phone', 'Telefonnummer', false, '070-123 45 67', 'tel')}
          {field('streetAddress', 'Gatuadress', false, 'Storgatan 1')}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          {field('postalCode', 'Postnummer', true, '114 33')}
          {field('city', 'Ort', true, 'Stockholm')}
        </div>

        <div style={{ marginBottom: 24 }}>
          {field('counterparty', 'Företaget du har ett ärende mot', true, 'T.ex. SAS, IKEA, Telia')}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 24 }}>
          <Lock style={{ width: 14, height: 14, color: '#6B7280' }} />
          <span style={{ fontSize: 12, color: '#6B7280' }}>
            Dina uppgifter används bara för att generera kravbrevet och delas aldrig med tredje part.
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24, borderTop: '1px solid #F0F4F8' }}>
          <button
            type="button"
            onClick={onBack}
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
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#1A2744'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#6B7280'; }}
          >
            <ChevronLeft style={{ width: 16, height: 16 }} />
            Tillbaka
          </button>
          <button
            type="submit"
            style={{
              background: '#1B4F8A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 10,
              padding: '14px 28px',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#163F6E'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#1B4F8A'; }}
          >
            Nästa
            <ChevronRight style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </form>

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

export default UserInfoForm;
