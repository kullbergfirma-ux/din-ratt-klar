import { categories, type Category } from '@/lib/categories';
import { motion } from 'framer-motion';

interface Props {
  onSelect: (category: Category) => void;
}

const CategorySelector = ({ onSelect }: Props) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {categories.map((cat, i) => (
        <motion.button
          key={cat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          onClick={() => onSelect(cat)}
          className="card-interactive p-5 text-left flex flex-col gap-2"
        >
          <span className="text-3xl">{cat.emoji}</span>
          <span className="font-semibold text-foreground text-sm">{cat.title}</span>
          <span className="text-xs text-muted-foreground leading-snug">{cat.subtitle}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default CategorySelector;
