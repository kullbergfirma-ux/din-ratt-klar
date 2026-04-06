import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { guides } from '@/lib/guides';

interface Props {
  categorySlug: string;
  categoryTitle: string;
}

const readingTimes: Record<string, string> = {
  'forsenat-flyg-ersattning': '4 min',
  'forsenat-tag-ersattning': '3 min',
  'reklamera-trasig-produkt': '4 min',
  
  'avsluta-abonnemang': '4 min',
  'fel-pa-hantverksarbete': '4 min',
};

const GuidesSection = ({ categorySlug, categoryTitle }: Props) => {
  const categoryGuides = guides.filter(g => g.categorySlug === categorySlug);
  if (categoryGuides.length === 0) return null;

  return (
    <section aria-label={`Guider för ${categoryTitle}`} className="mt-16">
      <h2 className="text-xl font-bold text-foreground mb-4">Guider för {categoryTitle}</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {categoryGuides.map(guide => (
          <Link
            key={guide.slug}
            to={`/guide/${guide.slug}`}
            className="card-interactive p-6 flex flex-col gap-3 group"
          >
            <span className="text-2xl">📖</span>
            <h3 className="font-bold text-foreground">{guide.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{guide.seoDescription}</p>
            <div className="mt-auto pt-3 flex items-center justify-between">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {readingTimes[guide.slug] || '3 min'} läsning
              </span>
              <span className="text-sm font-semibold text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Läs guiden <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default GuidesSection;
