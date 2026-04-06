import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import EditableText from '@/components/EditableText';

const rights = [
  'Upp till 6 600 kr vid försenat eller inställt flyg (600€ enligt EU-lag)',
  'Reparation, byte eller pengarna tillbaka vid trasig vara',
  'Hävning av abonnemang med omedelbar verkan',
  'Prisavdrag vid felaktigt utfört hantverksarbete',
  'Återbetalning vid felaktiga debiteringar',
];

const WhatCanYouClaim = () => (
  <section aria-label="Vad kan du kräva" className="bg-background" style={{ padding: '80px 0' }}>
    <div className="max-w-5xl mx-auto px-4">
      <div className="flex flex-col-reverse md:flex-row md:items-center" style={{ gap: 64 }}>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="md:w-[58%]"
        >
          <span style={{ fontSize: 11, color: '#1B4F8A', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
            DINA RÄTTIGHETER
          </span>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: '#0F1F3D', marginTop: 8, marginBottom: 12, lineHeight: 1.25 }}>
            <EditableText textKey="claim.title" fallback="Du har mer rätt än du tror" />
          </h2>
          <p style={{ fontSize: 16, color: '#6B7280', marginBottom: 32, lineHeight: 1.6 }}>
            <EditableText textKey="claim.description" fallback="Svensk och EU-lagstiftning ger dig starka rättigheter som konsument. De flesta vet inte om dem — och ännu färre agerar på dem." />
          </p>

          <div>
            {rights.map((right, i) => (
              <div
                key={i}
                className="flex items-center"
                style={{ gap: 12, padding: '12px 0', borderBottom: '1px solid #F0F4F8' }}
              >
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{ width: 28, height: 28, borderRadius: '50%', background: '#EEF4FF' }}
                >
                  <Check style={{ width: 14, height: 14, color: '#1B4F8A' }} />
                </div>
                <span style={{ fontSize: 15, color: '#374151', fontWeight: 500 }}>{right}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="md:w-[42%]"
        >
          <div style={{
            background: '#FFFFFF',
            borderRadius: 16,
            boxShadow: '0 16px 48px rgba(0,0,0,0.1)',
            padding: 28,
          }}>
            <span style={{ background: '#EEF4FF', color: '#1B4F8A', fontSize: 12, borderRadius: 20, padding: '4px 12px', fontWeight: 500 }}>
              Resor — Flyg
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22C55E', flexShrink: 0 }} />
              <span style={{ fontSize: 15, fontWeight: 600, color: '#0F1F3D' }}>Du har troligtvis rätt till ersättning</span>
            </div>

            <div style={{ height: 1, background: '#F0F4F8', margin: '16px 0' }} />

            <span style={{ fontSize: 12, color: '#9BA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Uppskattad ersättning</span>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#0F1F3D', marginTop: 4 }}>4 400 kr</div>

            <span style={{ fontSize: 12, color: '#9BA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginTop: 16 }}>Juridisk grund</span>
            <div style={{ height: 10, background: '#E8ECF4', borderRadius: 4, marginTop: 8, width: '100%' }} />
            <div style={{ height: 10, background: '#E8ECF4', borderRadius: 4, marginTop: 8, width: '75%' }} />
            <div style={{ height: 10, background: '#E8ECF4', borderRadius: 4, marginTop: 8, width: '85%' }} />

            <button style={{
              width: '100%',
              background: '#1B4F8A',
              color: '#FFFFFF',
              borderRadius: 10,
              padding: 12,
              fontSize: 14,
              fontWeight: 600,
              border: 'none',
              marginTop: 20,
              cursor: 'pointer',
            }}>
              Lås upp fullständig analys
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default WhatCanYouClaim;
