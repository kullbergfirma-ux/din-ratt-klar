import { motion } from 'framer-motion';
import EditableText from '@/components/EditableText';

const steps = [
  {
    number: 1,
    titleKey: 'how.step1.title',
    titleFallback: 'Beskriv din situation',
    descKey: 'how.step1.desc',
    descFallback: 'Välj kategori och svara på några enkla frågor.',
  },
  {
    number: 2,
    titleKey: 'how.step2.title',
    titleFallback: 'Få en juridisk bedömning',
    descKey: 'how.step2.desc',
    descFallback: 'Vår AI analyserar mot gällande lagstiftning.',
  },
  {
    number: 3,
    titleKey: 'how.step3.title',
    titleFallback: 'Generera kravbrev',
    descKey: 'how.step3.desc',
    descFallback: 'Få ett formellt kravbrev redo att skicka.',
  },
];

const HowItWorks = () => (
  <section id="hur-fungerar" aria-label="Så fungerar det" className="bg-background" style={{ padding: '80px 0' }}>
    <div className="max-w-5xl mx-auto px-4">
      <div className="text-center mb-14">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
          <EditableText textKey="how.title" fallback="Så fungerar det" />
        </h2>
        <p className="text-muted-foreground text-lg max-w-lg mx-auto">
          <EditableText textKey="how.subtitle" fallback="Tre enkla steg från problem till lösning" />
        </p>
      </div>

      <div className="relative">
        <div
          className="hidden md:block absolute top-[26px] left-[calc(8.33%+26px)] right-[calc(8.33%+26px)]"
          style={{ height: 1, background: '#D1D9E6' }}
        />

        <ol className="grid md:grid-cols-3 gap-12 md:gap-8 list-none p-0">
          {steps.map((step, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="text-center"
            >
              <div
                className="mx-auto mb-5 flex items-center justify-center relative z-[1]"
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: '#EEF4FF',
                  color: '#1B4F8A',
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                {step.number}
              </div>
              <h3 className="font-semibold text-foreground text-lg mb-2">
                <EditableText textKey={step.titleKey} fallback={step.titleFallback} />
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                <EditableText textKey={step.descKey} fallback={step.descFallback} />
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  </section>
);

export default HowItWorks;
