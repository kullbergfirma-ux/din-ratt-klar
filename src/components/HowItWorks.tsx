import { motion } from 'framer-motion';
import { ClipboardList, Brain, FileText } from 'lucide-react';

const steps = [
  {
    icon: ClipboardList,
    title: 'Beskriv din situation',
    description: 'Välj kategori och svara på några enkla frågor om ditt ärende. Det tar bara ett par minuter.',
  },
  {
    icon: Brain,
    title: 'Få en juridisk bedömning',
    description: 'Vår AI analyserar din situation mot gällande svensk och EU-lagstiftning och ger dig ett tydligt svar.',
  },
  {
    icon: FileText,
    title: 'Generera kravbrev',
    description: 'Få ett formellt kravbrev redo att skicka — med rätt lagparagrafer, belopp och tidsfrister.',
  },
];

const HowItWorks = () => (
  <section id="hur-fungerar" className="py-20 sm:py-28 bg-background">
    <div className="max-w-5xl mx-auto px-4">
      <div className="text-center mb-14">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
          Så fungerar det
        </h2>
        <p className="text-muted-foreground text-lg max-w-lg mx-auto">
          Tre enkla steg från problem till lösning
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className="relative"
          >
            <div className="card-elevated p-8 h-full text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-5">
                <step.icon className="w-7 h-7" />
              </div>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                {i + 1}
              </div>
              <h3 className="font-bold text-foreground text-lg mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
