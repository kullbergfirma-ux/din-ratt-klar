import SEOHead from '@/components/SEOHead';
import { WebSiteSchema, FAQSchema } from '@/components/StructuredData';
import HeroSection from '@/components/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import CategoriesSection from '@/components/CategoriesSection';
import FeaturesSection from '@/components/FeaturesSection';
import PricingSection from '@/components/PricingSection';
import { SITE_CONFIG } from '@/config/site';

interface Props {
  onOpenCredits: () => void;
}

const homeFaqs = [
  { q: 'Vad kostar det?', a: 'Att se din rättighetsbedömning är helt gratis. Du får 2 credits att börja med. Att generera ett formellt kravbrev kostar 1 credit. Fler credits kan köpas från 19 kr.' },
  { q: 'Hur säker är bedömningen?', a: 'Bedömningen baseras på gällande svensk och EU-lagstiftning och ger dig en god uppfattning om dina rättigheter. Vid komplexa ärenden rekommenderar vi att du kontaktar Konsumentverket eller en jurist.' },
  { q: 'Vad gör jag om motparten vägrar?', a: 'Om motparten inte svarar eller vägrar kan du anmäla ärendet till ARN (Allmänna reklamationsnämnden) som gör en kostnadsfri prövning.' },
];

const HomePage = ({ onOpenCredits }: Props) => (
  <main>
    <SEOHead
      title={SITE_CONFIG.tagline}
      description={SITE_CONFIG.description}
      canonical="/"
    />
    <WebSiteSchema />
    <FAQSchema items={homeFaqs} />

    <HeroSection />
    <HowItWorks />
    <CategoriesSection />
    <FeaturesSection />
    <PricingSection onOpenCredits={onOpenCredits} />

    <section id="faq" aria-label="Vanliga frågor" className="py-20 sm:py-28 bg-background">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">Vanliga frågor</h2>
        </div>
        <div className="card-elevated divide-y divide-border">
          {homeFaqs.map((faq, i) => (
            <details key={i} className="group">
              <summary className="px-5 py-4 text-sm font-medium text-foreground cursor-pointer list-none flex items-center justify-between hover:bg-muted/30 transition-colors">
                {faq.q}
                <span className="text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="px-5 pb-4 text-sm text-muted-foreground">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>

    {/* Trust signals */}
    <section aria-label="Förtroendesignaler" className="py-16 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 flex flex-wrap justify-center gap-8 text-center">
        {[
          { label: 'Baserat på svensk och EU-lagstiftning', emoji: '⚖️' },
          { label: 'Inga dolda avgifter', emoji: '💰' },
          { label: 'Engångsbetalning per ärende', emoji: '✅' },
        ].map(signal => (
          <div key={signal.label} className="flex items-center gap-2 text-sm font-medium text-foreground">
            <span className="text-xl">{signal.emoji}</span>
            {signal.label}
          </div>
        ))}
      </div>
    </section>
  </main>
);

export default HomePage;
