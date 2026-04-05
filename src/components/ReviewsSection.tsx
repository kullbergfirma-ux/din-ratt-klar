import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import EditableText from '@/components/EditableText';

const reviews = [
  { text: 'Fick 400€ från flygbolaget efter att ha fått nej två gånger. Brevet övertygade dem direkt.', name: 'Anna K.', category: 'Resor' },
  { text: 'Visste inte att jag hade rätt att reklamera efter 2 år. Fick ny dator utan krångel.', name: 'Marcus L.', category: 'Köp & e-handel' },
  { text: 'Gymmet fortsatte ta betalt i 4 månader efter uppsägning. Fick tillbaka allt via kravbrevet.', name: 'Sofia B.', category: 'Abonnemang' },
  { text: 'Otroligt enkelt. Fyllde i mina uppgifter, fick ett professionellt brev på 2 minuter.', name: 'Erik J.', category: 'Hantverkare' },
  { text: 'Andrahandshyran var olaglig. Fick tillbaka 18 000 kr tack vare vägledningen här.', name: 'Linnea M.', category: 'Hyra' },
  { text: 'Bättre och snabbare än att ringa Konsumentverket. Rekommenderar starkt.', name: 'David A.', category: 'Bilköp' },
];

const ReviewsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -320 : 320,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section aria-label="Kundrecensioner" style={{ padding: '80px 0', background: '#F4F6F9' }}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
              <EditableText textKey="reviews.title" fallback="Vad våra användare säger" />
            </h2>
          </div>
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="flex items-center justify-center transition-colors hover:bg-muted"
              style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid #E2E8F0', background: '#FFFFFF' }}
              aria-label="Föregående"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="flex items-center justify-center transition-colors hover:bg-muted"
              style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid #E2E8F0', background: '#FFFFFF' }}
              aria-label="Nästa"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="no-scrollbar"
        style={{
          display: 'flex',
          gap: 20,
          overflowX: 'auto',
          padding: '16px 48px',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {reviews.map((review, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            style={{
              minWidth: 300,
              maxWidth: 300,
              background: '#FFFFFF',
              borderRadius: 14,
              border: '1px solid #E8ECF4',
              padding: 24,
              scrollSnapAlign: 'start',
              flexShrink: 0,
            }}
          >
            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-current" style={{ color: '#F59E0B' }} />
              ))}
            </div>
            <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, margin: '12px 0' }}>"{review.text}"</p>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1A2744' }}>{review.name}</span>
              <span style={{ fontSize: 12, color: '#1B4F8A', background: '#EEF4FF', padding: '2px 10px', borderRadius: 20 }}>
                {review.category}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default ReviewsSection;
