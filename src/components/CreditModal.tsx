import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { addCredits } from '@/lib/credits';

interface Props {
  open: boolean;
  onClose: () => void;
  onPurchase: () => void;
}

const plans = [
  { credits: 1, price: '19 kr', popular: false },
  { credits: 5, price: '79 kr', popular: true },
  { credits: 10, price: '149 kr', popular: false },
];

const CreditModal = ({ open, onClose, onPurchase }: Props) => {
  const handleBuy = (amount: number) => {
    addCredits(amount);
    onPurchase();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:inset-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md z-50"
          >
            <div className="card-elevated p-6 sm:p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Köp credits</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Varje kravbrev kostar 1 credit
                  </p>
                </div>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {plans.map((plan) => (
                  <button
                    key={plan.credits}
                    onClick={() => handleBuy(plan.credits)}
                    className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all ${
                      plan.popular
                        ? 'border-primary bg-primary/5 hover:bg-primary/10'
                        : 'border-border hover:border-primary/30 hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-foreground">{plan.credits}</span>
                      <span className="text-sm text-muted-foreground">
                        {plan.credits === 1 ? 'credit' : 'credits'}
                      </span>
                      {plan.popular && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">
                          Populär
                        </span>
                      )}
                    </div>
                    <span className="font-semibold text-foreground">{plan.price}</span>
                  </button>
                ))}
              </div>

              <p className="text-xs text-muted-foreground mt-4 text-center">
                Betalning är simulerad i denna version.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreditModal;
