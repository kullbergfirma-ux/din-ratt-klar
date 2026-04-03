import SEOHead from '@/components/SEOHead';
import { WebSiteSchema, FAQSchema } from '@/components/StructuredData';
import HeroSection from '@/components/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import CategoriesSection from '@/components/CategoriesSection';
import WhatCanYouClaim from '@/components/WhatCanYouClaim';
import ReviewsSection from '@/components/ReviewsSection';
import FeaturesSection from '@/components/FeaturesSection';
import PricingSection from '@/components/PricingSection';
import { SITE_CONFIG } from '@/config/site';
import { Scale, Zap, CheckCircle } from 'lucide-react';

const homeFaqs = [
  { q: 'Vad kostar det?', a: 'Att se din rättighetsbedömning är helt gratis. Vill du se fullständig analys och kravbrev kostar det 39 kr (Bas) eller 99 kr (Komplett). Engångsbetalning per ärende — ingen prenumeration.' },
  { q: 'Hur säker är bedömningen?', a: 'Bedömningen baseras på gällande svensk och EU-lagstiftning och ger dig en god uppfattning om dina rättigheter. Vid komplexa ärenden rekommenderar vi att du kontaktar Konsumentverket eller en jurist.' },
  { q: 'Vad gör jag om motparten vägrar?', a: 'Om motparten inte svarar eller vägrar kan du anmäla ärendet till ARN (Allmänna reklamationsnämnden) som gör en kostnadsfri prövning.' },
];

const HomePage = () => (
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
    <WhatCanYouClaim />
    <ReviewsSection />
    <FeaturesSection />
    <PricingSection />

    <section id="faq" aria-label="Vanliga frågor" className="bg-background" style={{ padding: '80px 0' }}>
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">Vanliga frågor</h2>
        </div>
        <div className="card-elevated divide-y divide-border">
          {homeFaqs.map((faq, i) => (
            <details key={i} className="group">
              <summary className="px-5 py-4 text-sm font-medium text-foreground cursor-pointer list-none flex items-center justify-between hover:bg-muted/30 transition-colors">
                {faq.q}
                <span className="text-muted-foreground group-open:rotate-180 transition-transform">&#9662;</span>
              </summary>
              <p className="px-5 pb-4 text-sm text-muted-foreground">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>

    <section aria-label="Förtroendesignaler" className="py-16 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 flex flex-wrap justify-center gap-8 text-center">
        {[
          { label: 'Baserat på svensk och EU-lagstiftning', icon: Scale },
          { label: 'Inga dolda avgifter', icon: Zap },
          { label: 'Engångsbetalning per ärende', icon: CheckCircle },
        ].map(signal => (
          <div key={signal.label} className="flex items-center gap-2 text-sm font-medium text-foreground">
            <signal.icon className="w-5 h-5 text-primary" />
            {signal.label}
          </div>
        ))}
      </div>
    </section>
  </main>
);

export default HomePage;
