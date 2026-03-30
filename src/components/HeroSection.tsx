import { motion } from 'framer-motion';
import { ArrowRight, Shield, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  onStart: () => void;
}

const HeroSection = ({ onStart }: Props) => (
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

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
          Förstå dina rättigheter.
          <br />
          <span className="text-white/80">Kräv din ersättning.</span>
        </h1>

        <p className="text-lg sm:text-xl text-white/75 leading-relaxed mb-8 max-w-xl">
          Beskriv din situation och få en juridisk bedömning på några minuter — plus ett färdigt kravbrev att skicka direkt.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            size="lg"
            onClick={onStart}
            className="bg-accent text-accent-foreground hover:bg-accent/90 text-base font-bold px-8 py-6 rounded-xl shadow-lg"
          >
            Starta ditt ärende
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => document.getElementById('hur-fungerar')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white/10 border-white/25 text-white hover:bg-white/20 text-base px-8 py-6 rounded-xl"
          >
            Så fungerar det
          </Button>
        </div>

        <div className="mt-10 flex items-center gap-6 text-sm text-white/60">
          <span className="flex items-center gap-1.5">
            <Scale className="w-4 h-4" /> Gratis bedömning
          </span>
          <span>•</span>
          <span>2 credits ingår</span>
          <span>•</span>
          <span>Ingen registrering</span>
        </div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
