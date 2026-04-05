import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const AdminPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError('Felaktig e-post eller lösenord.');
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: '#F4F6F9' }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: 16,
        padding: '40px 36px',
        maxWidth: 400,
        width: '100%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)',
      }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F1F3D', marginBottom: 4 }}>Admin</h1>
        <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 24 }}>Logga in för att redigera texter</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input
            type="email"
            placeholder="E-postadress"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '12px 16px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 15, outline: 'none' }}
          />
          <input
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: '12px 16px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 15, outline: 'none' }}
          />
          {error && <p style={{ fontSize: 13, color: '#EF4444' }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#1B4F8A',
              color: 'white',
              border: 'none',
              borderRadius: 10,
              padding: '13px 16px',
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Loggar in...' : 'Logga in'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default AdminPage;
