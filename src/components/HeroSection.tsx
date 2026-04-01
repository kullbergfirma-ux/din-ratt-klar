import { motion } from 'framer-motion';
import { ArrowRight, Shield } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';

const HeroSection = () => {
  const handleScrollToCategories = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('kategorier');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-20 sm:py-28 lg:py-36">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Baserat på svensk & EU-lagstiftning
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
            {SITE_CONFIG.tagline.split(' och ')[0]}.
            <br />
            <span className="text-white/80">Få ersättning du har rätt till.</span>
          </h1>

          <p className="text-base sm:text-lg text-white/70 font-medium mb-6">
            Redan 2 400 ärenden hjälpta — genomsnittlig ersättning 3 200 kr
          </p>

          <p className="text-lg sm:text-xl text-white/75 leading-relaxed mb-8 max-w-xl">
            {SITE_CONFIG.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a href="/#kategorier" onClick={handleScrollToCategories}>
              <button className="bg-accent text-accent-foreground hover:bg-accent/90 text-base font-bold px-8 py-4 rounded-xl shadow-lg flex items-center gap-2 transition-colors">
                Kolla din rätt →
                <ArrowRight className="w-5 h-5" />
              </button>
            </a>
            <a href="/faq">
              <button className="bg-white/10 border border-white/25 text-white hover:bg-white/20 text-base px-8 py-4 rounded-xl transition-colors">
                Vanliga frågor
              </button>
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-white/60">
            <span className="flex items-center gap-1.5">📋 9 kategorier</span>
            <span className="flex items-center gap-1.5">⚡ Svar på 2 min</span>
            <span className="flex items-center gap-1.5">💶 Upp till 600€</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
