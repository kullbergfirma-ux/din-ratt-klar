import { useParams, Link } from 'react-router-dom';
import { getGuideBySlug } from '@/lib/guides';
import { getCategoryBySlug } from '@/lib/categories';
import SEOHead from '@/components/SEOHead';
import RelatedLinks from '@/components/RelatedLinks';
import NotFound from '@/pages/NotFound';
import { ArrowRight } from 'lucide-react';

const GuidePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const guide = getGuideBySlug(slug || '');

  if (!guide) return <NotFound />;

  const category = getCategoryBySlug(guide.categorySlug);

  return (
    <main className="py-16 sm:py-24">
      <SEOHead
        title={guide.seoTitle}
        description={guide.seoDescription}
        canonical={`/guide/${guide.slug}`}
      />

      <article className="max-w-[860px] mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-6">{guide.title}</h1>

        {guide.sections.map((section, i) => (
          <section key={i} className="mb-10">
            <h2 className="text-xl font-bold text-foreground mb-3">{section.heading}</h2>
            <div className="text-muted-foreground leading-relaxed whitespace-pre-line">{section.content}</div>
          </section>
        ))}

        {/* Mid-page CTA */}
        {category && (
          <div className="card-elevated p-6 my-12 text-center">
            <h2 className="text-lg font-bold text-foreground mb-2">Har du ett aktivt ärende?</h2>
            <p className="text-sm text-muted-foreground mb-4">Kolla din rätt gratis — det tar bara ett par minuter.</p>
            <Link
              to={`/${category.slug}`}
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground hover:bg-accent/90 font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Starta ärende: {category.title} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        <RelatedLinks categorySlugs={guide.relatedSlugs} />
      </article>
    </main>
  );
};

export default GuidePage;
