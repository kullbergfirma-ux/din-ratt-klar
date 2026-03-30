import { categories, type Category } from '@/lib/categories';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface Props {
  onSelect: (category: Category) => void;
}

const CategoriesSection = ({ onSelect }: Props) => (
  <section id="kategorier" className="py-20 sm:py-28 bg-background">
    <div className="max-w-5xl mx-auto px-4">
      <div className="text-center mb-14">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
          Vad gäller ditt ärende?
        </h2>
        <p className="text-muted-foreground text-lg max-w-lg mx-auto">
          Välj en kategori för att komma igång
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.map((cat, i) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            onClick={() => onSelect(cat)}
            className="card-interactive p-6 text-left flex flex-col gap-2 group"
          >
            <span className="text-3xl">{cat.emoji}</span>
            <span className="font-bold text-foreground">{cat.title}</span>
            <span className="text-xs text-muted-foreground leading-snug">{cat.subtitle}</span>
            <span className="mt-auto pt-2 text-xs font-semibold text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Starta <ArrowRight className="w-3 h-3" />
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  </section>
);

export default CategoriesSection;
