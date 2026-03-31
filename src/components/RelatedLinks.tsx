import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { categories } from '@/lib/categories';
import { guides } from '@/lib/guides';

interface Props {
  categorySlugs?: string[];
  guideSlugs?: string[];
}

const RelatedLinks = ({ categorySlugs = [], guideSlugs = [] }: Props) => {
  const relatedCategories = categorySlugs
    .map(slug => categories.find(c => c.slug === slug))
    .filter(Boolean);

  const relatedGuides = guideSlugs
    .map(slug => guides.find(g => g.slug === slug))
    .filter(Boolean);

  if (relatedCategories.length === 0 && relatedGuides.length === 0) return null;

  return (
    <nav aria-label="Relaterade sidor" className="mt-12 pt-8 border-t border-border">
      <h3 className="text-lg font-bold text-foreground mb-4">Relaterade sidor</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {relatedCategories.map(cat => (
          <Link
            key={cat!.slug}
            to={`/${cat!.slug}`}
            className="card-interactive p-4 flex items-center gap-3 group"
          >
            <span className="text-2xl">{cat!.emoji}</span>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-foreground text-sm">{cat!.title}</span>
              <p className="text-xs text-muted-foreground truncate">{cat!.subtitle}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        ))}
        {relatedGuides.map(guide => (
          <Link
            key={guide!.slug}
            to={`/guide/${guide!.slug}`}
            className="card-interactive p-4 flex items-center gap-3 group"
          >
            <span className="text-2xl">📖</span>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-foreground text-sm">{guide!.title}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default RelatedLinks;
