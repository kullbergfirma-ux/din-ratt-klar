import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const scrollToCategories = () => {
  document.getElementById('kategorier')?.scrollIntoView({ behavior: 'smooth' });
};

const PricingSection = () => (
  <section id="priser" className="py-20 sm:py-28 bg-muted/50">
    <div className="max-w-5xl mx-auto px-4">
      <div className="text-center mb-14">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
          Enkel och transparent prissättning
        </h2>
        <p className="text-muted-foreground text-lg max-w-lg mx-auto">
          Bedömningen är alltid gratis. Betala bara för fullständig analys och kravbrev.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
        {/* Gratis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0 }}
          className="card-elevated p-6 text-center flex flex-col"
        >
          <div className="text-lg font-bold text-foreground mb-1">Gratis</div>
          <div className="text-3xl font-extrabold text-foreground mb-4">0 kr</div>
          <ul className="text-left space-y-2 text-sm text-muted-foreground mb-5">
            <li className="flex gap-2"><Check className="w-4 h-4 text-success shrink-0 mt-0.5" /> Enkel ja/nej-bedömning</li>
            <li className="flex gap-2"><Check className="w-4 h-4 text-success shrink-0 mt-0.5" /> Se om du troligtvis har rätt</li>
          </ul>
          <button
            onClick={scrollToCategories}
            style={{ width: '100%', padding: '10px 16px', borderRadius: 8, border: '1.5px solid #E2E8F0', background: 'transparent', cursor: 'pointer', fontSize: 14, marginTop: 'auto' }}
          >
            Börja gratis
          </button>
        </motion.div>

        {/* Bas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="card-elevated p-6 text-center flex flex-col"
        >
          <div className="text-lg font-bold text-foreground mb-1">Bas</div>
          <div className="text-3xl font-extrabold text-foreground mb-4">39 kr</div>
          <ul className="text-left space-y-2 text-sm text-muted-foreground mb-5">
            <li className="flex gap-2"><Check className="w-4 h-4 text-success shrink-0 mt-0.5" /> Exakt ersättningsbelopp</li>
            <li className="flex gap-2"><Check className="w-4 h-4 text-success shrink-0 mt-0.5" /> Fullständig juridisk analys</li>
            <li className="flex gap-2"><Check className="w-4 h-4 text-success shrink-0 mt-0.5" /> Färdigt kravbrev</li>
          </ul>
          <button
            onClick={scrollToCategories}
            style={{ width: '100%', padding: '10px 16px', borderRadius: 8, border: 'none', background: '#1B4F8A', color: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 600, marginTop: 'auto' }}
          >
            Kom igång — 39 kr
          </button>
        </motion.div>

        {/* Komplett */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="card-elevated p-6 text-center ring-2 ring-primary relative flex flex-col"
        >
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
            Bäst värde
          </span>
          <div className="text-lg font-bold text-foreground mb-1">Komplett</div>
          <div className="text-3xl font-extrabold text-foreground mb-4">99 kr</div>
          <ul className="text-left space-y-2 text-sm text-muted-foreground mb-5">
            <li className="flex gap-2"><Check className="w-4 h-4 text-success shrink-0 mt-0.5" /> Allt i Bas</li>
            <li className="flex gap-2"><Check className="w-4 h-4 text-success shrink-0 mt-0.5" /> Strategisk vägledning</li>
            <li className="flex gap-2"><Check className="w-4 h-4 text-success shrink-0 mt-0.5" /> Uppföljningsbrev</li>
            <li className="flex gap-2"><Check className="w-4 h-4 text-success shrink-0 mt-0.5" /> ARN-guide</li>
            <li className="flex gap-2"><Check className="w-4 h-4 text-success shrink-0 mt-0.5" /> PDF-export</li>
          </ul>
          <button
            onClick={scrollToCategories}
            style={{ width: '100%', padding: '10px 16px', borderRadius: 8, border: 'none', background: '#F59E0B', color: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 600, marginTop: 'auto' }}
          >
            Kom igång — 79 kr
          </button>
        </motion.div>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Ingen prenumeration. Engångsbetalning per ärende.
      </p>
    </div>
  </section>
);

export default PricingSection;
