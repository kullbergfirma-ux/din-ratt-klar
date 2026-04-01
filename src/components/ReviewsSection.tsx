import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const reviews = [
  { text: 'Fick 400€ från flygbolaget efter att ha fått nej två gånger. Brevet övertygade dem direkt.', name: 'Anna K.', category: 'Resor' },
  { text: 'Visste inte att jag hade rätt att reklamera efter 2 år. Fick ny dator utan krångel.', name: 'Marcus L.', category: 'Köp & e-handel' },
  { text: 'Gymmet fortsatte ta betalt i 4 månader efter uppsägning. Fick tillbaka allt via kravbrevet.', name: 'Sofia B.', category: 'Abonnemang' },
  { text: 'Otroligt enkelt. Fyllde i mina uppgifter, fick ett professionellt brev på 2 minuter.', name: 'Erik J.', category: 'Hantverkare' },
  { text: 'Andrahandshyran var olaglig. Fick tillbaka 18 000 kr tack vare vägledningen här.', name: 'Linnea M.', category: 'Hyra' },
  { text: 'Bättre och snabbare än att ringa Konsumentverket. Rekommenderar starkt.', name: 'David A.', category: 'Bilköp' },
];

const ReviewsSection = () => (
  <section aria-label="Kundrecensioner" className="py-20 sm:py-28 bg-background">
    <div className="max-w-5xl mx-auto px-4">
      <div className="text-center mb-14">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
          Vad våra användare säger
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {reviews.map((review, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="card-elevated p-6"
          >
            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>
            <p className="text-sm text-foreground leading-relaxed mb-4">"{review.text}"</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{review.name}</span>
              <span>{review.category}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ReviewsSection;
