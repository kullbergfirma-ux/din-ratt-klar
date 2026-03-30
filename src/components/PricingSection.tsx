import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  onOpenCredits: () => void;
}

const tiers = [
  { credits: 1, price: 19, label: 'Prova på', popular: false },
  { credits: 5, price: 79, label: 'Populär', popular: true },
  { credits: 10, price: 149, label: 'Bäst värde', popular: false },
];

const included = [
  'Gratis rättighetsbedömning',
  'AI-analys mot svensk & EU-lag',
  'Uppskattad ersättning',
  'Hänvisning till rätt instans',
];

const PricingSection = ({ onOpenCredits }: Props) => (
  <section id="priser" className="py-20 sm:py-28 bg-muted/50">
    <div className="max-w-5xl mx-auto px-4">
      <div className="text-center mb-14">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
          Enkel och transparent prissättning
        </h2>
        <p className="text-muted-foreground text-lg max-w-lg mx-auto">
          Bedömningen är alltid gratis. Betala bara när du vill ha ett färdigt kravbrev.
        </p>
      </div>

      {/* Free tier callout */}
      <div className="card-elevated p-6 mb-8 max-w-2xl mx-auto text-center">
        <h3 className="font-bold text-foreground text-lg mb-2">🎉 Gratis att börja</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Du får <strong className="text-foreground">2 credits</strong> direkt — ingen registrering krävs. Räcker för att testa hela tjänsten.
        </p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {included.map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-success" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Credit packs */}
      <div className="grid sm:grid-cols-3 gap-5 max-w-2xl mx-auto">
        {tiers.map((tier, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`card-elevated p-6 text-center relative ${tier.popular ? 'ring-2 ring-primary shadow-md' : ''}`}
          >
            {tier.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                {tier.label}
              </span>
            )}
            <div className="text-3xl font-extrabold text-foreground mb-1">{tier.credits}</div>
            <div className="text-sm text-muted-foreground mb-3">
              {tier.credits === 1 ? 'credit' : 'credits'}
            </div>
            <div className="text-2xl font-bold text-foreground mb-4">{tier.price} kr</div>
            <Button
              onClick={onOpenCredits}
              variant={tier.popular ? 'default' : 'outline'}
              className="w-full rounded-lg"
            >
              Köp
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default PricingSection;
