import { motion } from 'framer-motion';
import { ShieldCheck, Clock, BookOpen, BadgeEuro, Gavel, Globe } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';

const features = [
  {
    icon: ShieldCheck,
    title: 'Juridiskt grundad analys',
    description: 'Varje bedömning baseras på aktuell svensk lagstiftning och EU-förordningar.',
  },
  {
    icon: Clock,
    title: 'Svar på minuter',
    description: 'Ingen väntetid — få din bedömning och kravbrev direkt, dygnet runt.',
  },
  {
    icon: BadgeEuro,
    title: 'Uppskattad ersättning',
    description: 'Vi beräknar vad du sannolikt har rätt till i kronor eller euro.',
  },
  {
    icon: BookOpen,
    title: 'Tydliga lagstiftningshänvisningar',
    description: 'Varje bedömning hänvisar till specifika lagar och förordningar.',
  },
  {
    icon: Gavel,
    title: 'Nästa steg & instanser',
    description: 'Vi berättar vart du ska vända dig: ARN, Hyresnämnden, Konsumentverket m.fl.',
  },
  {
    icon: Globe,
    title: 'EU-rättigheter inkluderade',
    description: 'Flyg, tåg, buss, färja och paketresor — vi täcker alla EU-förordningar.',
  },
];

const FeaturesSection = () => (
  <section aria-label="Funktioner" className="py-20 sm:py-28 bg-muted/50">
    <div className="max-w-5xl mx-auto px-4">
      <div className="text-center mb-14">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
          Varför {SITE_CONFIG.name}?
        </h2>
        <p className="text-muted-foreground text-lg max-w-lg mx-auto">
          Vi gör juridiken tillgänglig för alla
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="card-elevated p-6 flex gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <f.icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
