import { categories } from '@/lib/categories';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Globe, ShoppingBag, Shield, Package, CreditCard, Smartphone, Car, Home, Wrench } from 'lucide-react';

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  resor: Globe,
  'kop-ehandel': ShoppingBag,
  'garanti-dolda-fel': Shield,
  leverans: Package,
  'betalning-aterkrav': CreditCard,
  abonnemang: Smartphone,
  bilkop: Car,
  hyra: Home,
  hantverkare: Wrench,
};

const CategoriesSection = () => (
  <section id="kategorier" aria-label="Ärendekategorier" className="bg-background" style={{ padding: '80px 0' }}>
    <div className="max-w-5xl mx-auto px-4">
      <div className="text-center mb-14">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
          Vad gäller ditt ärende?
        </h2>
        <p className="text-muted-foreground text-lg max-w-lg mx-auto">
          Välj en kategori för att komma igång
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {categories.map((cat, i) => {
          const IconComponent = categoryIcons[cat.slug] || Scale;
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <Link
                to={`/${cat.slug}`}
                className="group block h-full relative overflow-hidden"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E8ECF4',
                  borderRadius: 14,
                  padding: 24,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = '#1B4F8A';
                  el.style.boxShadow = '0 8px 24px rgba(27, 79, 138, 0.1)';
                  el.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = '#E8ECF4';
                  el.style.boxShadow = 'none';
                  el.style.transform = 'translateY(0)';
                }}
              >
                <IconComponent className="w-6 h-6 mb-3" style={{ color: '#1B4F8A', strokeWidth: 1.5 }} />
                <div className="font-bold text-foreground mb-1">{cat.title}</div>
                <div className="text-xs text-muted-foreground leading-snug">{cat.subtitle}</div>
                <ChevronRight
                  className="absolute bottom-5 right-5 w-4 h-4 transition-all duration-200 group-hover:translate-x-[3px]"
                  style={{ color: '#9BA3AF' }}
                  onMouseEnter={() => {}}
                />
                <style>{`
                  .group:hover .absolute.bottom-5.right-5 { color: #1B4F8A !important; }
                `}</style>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default CategoriesSection;
