import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import { guides } from '@/lib/guides';
import { categories } from '@/lib/categories';

const readingTimes: Record<string, string> = {
  'forsenat-flyg-ersattning': '4 min',
  'forsenat-tag-ersattning': '3 min',
  'reklamera-trasig-produkt': '4 min',
  
  'avsluta-abonnemang': '4 min',
  'fel-pa-hantverksarbete': '4 min',
};

const GuidesOverviewPage = () => {
  const grouped = categories
    .map(cat => ({
      category: cat,
      guides: guides.filter(g => g.categorySlug === cat.slug),
    }))
    .filter(g => g.guides.length > 0);

  return (
    <main className="py-16 sm:py-24">
      <SEOHead
        title="Guider om konsumenträtt"
        description="Läs våra guider om dina rättigheter vid flyg, tåg, reklamation, abonnemang och hantverkare."
        canonical="/guider"
      />

      <div className="max-w-[860px] mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-10">
          Guider om konsumenträtt
        </h1>

        {grouped.map(({ category, guides: catGuides }) => (
          <section key={category.slug} className="mb-12" aria-label={category.title}>
            <h2 className="text-xl font-bold text-foreground mb-4">
              {category.title}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {catGuides.map(guide => (
                <Link
                  key={guide.slug}
                  to={`/guide/${guide.slug}`}
                  className="card-interactive p-6 flex flex-col gap-3 group"
                >
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
        ))}
      </div>
    </main>
  );
};

export default GuidesOverviewPage;
