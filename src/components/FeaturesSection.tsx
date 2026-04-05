import { motion } from 'framer-motion';
import { ShieldCheck, Clock, BookOpen, BadgeEuro, Gavel, Globe } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';
import EditableText from '@/components/EditableText';

const features = [
  { icon: ShieldCheck, titleKey: 'feat.1.title', titleFallback: 'Juridiskt grundad analys', descKey: 'feat.1.desc', descFallback: 'Varje bedömning baseras på aktuell svensk lagstiftning och EU-förordningar.' },
  { icon: Clock, titleKey: 'feat.2.title', titleFallback: 'Svar på minuter', descKey: 'feat.2.desc', descFallback: 'Ingen väntetid — få din bedömning och kravbrev direkt, dygnet runt.' },
  { icon: BadgeEuro, titleKey: 'feat.3.title', titleFallback: 'Uppskattad ersättning', descKey: 'feat.3.desc', descFallback: 'Vi beräknar vad du sannolikt har rätt till i kronor eller euro.' },
  { icon: BookOpen, titleKey: 'feat.4.title', titleFallback: 'Tydliga lagstiftningshänvisningar', descKey: 'feat.4.desc', descFallback: 'Varje bedömning hänvisar till specifika lagar och förordningar.' },
  { icon: Gavel, titleKey: 'feat.5.title', titleFallback: 'Nästa steg & instanser', descKey: 'feat.5.desc', descFallback: 'Vi berättar vart du ska vända dig: ARN, Hyresnämnden, Konsumentverket m.fl.' },
  { icon: Globe, titleKey: 'feat.6.title', titleFallback: 'EU-rättigheter inkluderade', descKey: 'feat.6.desc', descFallback: 'Flyg, tåg, buss, färja och paketresor — vi täcker alla EU-förordningar.' },
];

const FeaturesSection = () => (
  <section aria-label="Funktioner" style={{ padding: '80px 0', background: '#EEF4FF' }}>
    <div className="max-w-5xl mx-auto px-4">
      <div className="text-center mb-14">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
          <EditableText textKey="feat.title" fallback={`Varför ${SITE_CONFIG.name}?`} />
        </h2>
        <p className="text-muted-foreground text-lg max-w-lg mx-auto">
          <EditableText textKey="feat.subtitle" fallback="Vi gör juridiken tillgänglig för alla" />
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
            className="flex gap-4 p-6 rounded-2xl"
            style={{ background: '#FFFFFF', border: '1px solid #E8ECF4' }}
          >
            <div
              className="flex items-center justify-center shrink-0"
              style={{ width: 64, height: 64, borderRadius: '50%', background: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            >
              <f.icon style={{ width: 40, height: 40, color: '#1B4F8A', strokeWidth: 1.5 }} />
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-1">
                <EditableText textKey={f.titleKey} fallback={f.titleFallback} />
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <EditableText textKey={f.descKey} fallback={f.descFallback} />
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
