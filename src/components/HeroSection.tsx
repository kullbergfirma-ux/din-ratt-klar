import { motion } from 'framer-motion';
import { ArrowRight, Shield } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';
import EditableText from '@/components/EditableText';

const HeroResultCard = () => (
  <div
    className="hidden md:block"
    style={{ maxWidth: 340, margin: '0 auto' }}
  >
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 16,
        boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
        padding: 28,
        transform: 'rotate(2deg)',
      }}
    >
      <span style={{ background: '#EEF4FF', color: '#1B4F8A', fontSize: 12, borderRadius: 20, padding: '4px 12px', fontWeight: 500 }}>
        Resor — Flyg
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22C55E', flexShrink: 0 }} />
        <span style={{ fontSize: 15, fontWeight: 600, color: '#0F1F3D' }}>Du har troligtvis rätt till ersättning</span>
      </div>
      <div style={{ height: 1, background: '#F0F4F8', margin: '16px 0' }} />
      <span style={{ fontSize: 11, color: '#9BA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Uppskattad ersättning</span>
      <div style={{ fontSize: 36, fontWeight: 800, color: '#0F1F3D', marginTop: 4 }}>400 €</div>
      <div style={{ height: 1, background: '#F0F4F8', margin: '16px 0' }} />
      <span style={{ fontSize: 11, color: '#9BA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Juridisk grund</span>
      <div style={{ height: 10, background: '#E8ECF4', borderRadius: 4, marginTop: 8, width: '100%' }} />
      <div style={{ height: 10, background: '#E8ECF4', borderRadius: 4, marginTop: 8, width: '75%' }} />
      <div style={{ height: 10, background: '#E8ECF4', borderRadius: 4, marginTop: 8, width: '85%' }} />
      <button style={{ width: '100%', background: '#1B4F8A', color: '#FFFFFF', borderRadius: 10, padding: 12, fontSize: 14, fontWeight: 600, border: 'none', marginTop: 20, cursor: 'pointer' }}>
        Lås upp fullständig analys
      </button>
    </div>
  </div>
);

const HeroSection = () => {
  const handleScrollToCategories = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('kategorier');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-20 sm:py-28 lg:py-36">
        <div className="flex flex-col md:flex-row md:items-center md:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="md:w-[55%]"
          >
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              <EditableText textKey="hero.badge" fallback="Baserat på svensk & EU-lagstiftning" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
              <EditableText textKey="hero.heading" fallback="Kräv din rätt." />
              <br />
              <span className="text-white/80"><EditableText textKey="hero.subheading" fallback="Få ersättning du har rätt till." /></span>
            </h1>

            <p className="text-base sm:text-lg text-white/70 font-medium mb-6">
              <EditableText textKey="hero.stats" fallback="Redan 2 400 ärenden hjälpta — genomsnittlig ersättning 3 200 kr" />
            </p>

            <p className="text-lg sm:text-xl text-white/75 leading-relaxed mb-8 max-w-xl">
              <EditableText textKey="hero.description" fallback={SITE_CONFIG.description} />
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a href="/#kategorier" onClick={handleScrollToCategories}>
                <button className="bg-accent text-accent-foreground hover:bg-accent/90 text-base font-bold px-8 py-4 rounded-xl shadow-lg flex items-center gap-2 transition-colors">
                  <EditableText textKey="hero.cta" fallback="Kolla din rätt" />
                  <ArrowRight className="w-5 h-5" />
                </button>
              </a>
              <a href="/faq">
                <button className="bg-white/10 border border-white/25 text-white hover:bg-white/20 text-base px-8 py-4 rounded-xl transition-colors">
                  Vanliga frågor
                </button>
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-white/60">
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4" /> <EditableText textKey="hero.trust1" fallback="6 kategorier" />
              </span>
              <span className="flex items-center gap-1.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <EditableText textKey="hero.trust2" fallback="Svar på 2 min" />
              </span>
              <span className="flex items-center gap-1.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                <EditableText textKey="hero.trust3" fallback="Upp till 600€" />
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="md:w-[45%] mt-12 md:mt-0"
          >
            <HeroResultCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
