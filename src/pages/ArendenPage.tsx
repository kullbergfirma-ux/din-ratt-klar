import { useNavigate } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { SITE_CONFIG } from '@/config/site';
import { categories } from '@/lib/categories';
import { Globe, ShoppingBag, Shield, Smartphone, Car, Wrench, ChevronRight, Check } from 'lucide-react';

const categoryIconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  'resor': Globe,
  'kop-reklamation': ShoppingBag,
  'garanti-dolda-fel': Shield,
  'abonnemang': Smartphone,
  'bilkop': Car,
  'hantverkare': Wrench,
};

const categoryColors: Record<string, { bg: string; icon: string; border: string }> = {
  'resor': { bg: '#EEF4FF', icon: '#1B4F8A', border: '#C7D9F5' },
  'kop-reklamation': { bg: '#FFF7ED', icon: '#C2410C', border: '#FED7AA' },
  'garanti-dolda-fel': { bg: '#F0FDF4', icon: '#15803D', border: '#BBF7D0' },
  'abonnemang': { bg: '#FDF4FF', icon: '#7E22CE', border: '#E9D5FF' },
  'bilkop': { bg: '#FFF1F2', icon: '#BE123C', border: '#FECDD3' },
  'hantverkare': { bg: '#FFFBEB', icon: '#B45309', border: '#FDE68A' },
};

const categoryExamples: Record<string, string[]> = {
  'resor': ['Försenat flyg — upp till 6 600 kr', 'Inställt flyg', 'Hotell ej som utlovat'],
  'kop-reklamation': ['Trasig vara', 'Paket som aldrig kom', '14 dagars ångerrätt'],
  'garanti-dolda-fel': ['Garantitvister', 'Dolda fel vid köp', 'Produkt slutar fungera'],
  'abonnemang': ['Gym som fortsätter debitera', 'Streaming efter uppsägning', 'Telefon bindningstid'],
  'bilkop': ['Dolda fel på bilen', 'Köp från handlare', 'Privatköp som gick fel'],
  'hantverkare': ['Badrum renoverat fel', 'VVS-arbete med fel', 'Oavslutad renovering'],
};

const ArendenPage = () => {
  const navigate = useNavigate();

  return (
    <main>
      <SEOHead
        title="Starta ditt ärende — Välj kategori"
        description={`Välj ärendekategori och få en juridisk bedömning baserad på svensk och EU-lagstiftning med ${SITE_CONFIG.name}.`}
        canonical="/arenden"
      />

      {/* Hero */}
      <section style={{ background: '#F4F6F9', padding: '64px 16px 48px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <span style={{ display: 'inline-block', background: '#EEF4FF', color: '#1B4F8A', fontSize: 12, fontWeight: 600, borderRadius: 20, padding: '5px 14px', marginBottom: 16 }}>
            Gratis att börja — betala bara om du vill ha mer
          </span>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#0F1F3D', marginBottom: 12 }}>
            Vad handlar ditt ärende om?
          </h1>
          <p style={{ fontSize: 17, color: '#6B7280', maxWidth: 540, margin: '0 auto' }}>
            Välj kategori nedan och få en juridisk bedömning baserad på svensk och EU-lagstiftning — på under 2 minuter.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '48px 16px 80px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 20 }}>
            {categories.map(category => {
              const IconComp = categoryIconMap[category.id];
              const colors = categoryColors[category.id] || { bg: '#EEF4FF', icon: '#1B4F8A', border: '#C7D9F5' };
              const examples = categoryExamples[category.id] || [];

              return (
                <div
                  key={category.id}
                  onClick={() => navigate(`/${category.slug}`)}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 16,
                    border: '1px solid #E8ECF4',
                    padding: '28px 24px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(27,79,138,0.12)';
                    e.currentTarget.style.borderColor = colors.border;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                    e.currentTarget.style.borderColor = '#E8ECF4';
                  }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {IconComp && <IconComp style={{ width: 24, height: 24, color: colors.icon, strokeWidth: 1.5 }} />}
                  </div>

                  <div>
                    <p style={{ fontSize: 18, fontWeight: 700, color: '#0F1F3D', margin: '0 0 4px' }}>{category.title}</p>
                    <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>{category.subtitle}</p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {examples.map(example => (
                      <div key={example} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#374151' }}>
                        <Check style={{ width: 14, height: 14, color: '#1D9E75', flexShrink: 0 }} />
                        {example}
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#1B4F8A' }}>Starta ärende</span>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#EEF4FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ChevronRight style={{ width: 16, height: 16, color: '#1B4F8A' }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trust */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 48, flexWrap: 'wrap' }}>
            {[
              { label: 'Gratis att börja', desc: 'Betala bara om du vill ha mer' },
              { label: 'Svar på 2 minuter', desc: 'Ingen väntetid' },
              { label: 'Baserat på lagstiftning', desc: 'Svensk och EU-lag' },
            ].map(trust => (
              <div key={trust.label} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#0F1F3D', margin: '0 0 2px' }}>{trust.label}</p>
                <p style={{ fontSize: 12, color: '#9BA3AF', margin: 0 }}>{trust.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ArendenPage;
