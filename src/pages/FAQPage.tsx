import SEOHead from '@/components/SEOHead';
import { FAQSchema } from '@/components/StructuredData';
import { SITE_CONFIG } from '@/config/site';

const faqGroups = [
  {
    heading: 'Om tjänsten',
    items: [
      { q: 'Vad kostar det?', a: 'Att se din rättighetsbedömning är helt gratis. Vill du se fullständig analys med belopp, lagparagrafer och kravbrev kostar det 39 kr (Bas) eller 99 kr (Komplett). Engångsbetalning per ärende — ingen prenumeration.' },
      { q: 'Hur säker är bedömningen?', a: 'Bedömningen baseras på gällande svensk och EU-lagstiftning och ger dig en god uppfattning om dina rättigheter. Vid komplexa ärenden rekommenderar vi att du kontaktar Konsumentverket eller en jurist.' },
      { q: 'Sparas min information?', a: 'Nej. All information stannar i din webbläsare och skickas direkt till AI-tjänsten för analys. Vi sparar ingenting på våra servrar.' },
      { q: 'Behöver jag skapa ett konto?', a: 'Nej, ingen registrering krävs. Betalning sker per ärende.' },
    ],
  },
  {
    heading: 'Dina rättigheter',
    items: [
      { q: 'Vad gör jag om motparten vägrar?', a: 'Om motparten inte svarar eller vägrar kan du anmäla ärendet till ARN (Allmänna reklamationsnämnden) som gör en kostnadsfri prövning. I sista hand kan du vända dig till Kronofogden.' },
      { q: 'Hur lång tid har jag på mig att reklamera?', a: 'Du har 3 år på dig att reklamera en vara från köpdatumet enligt konsumentköplagen.' },
      { q: 'Gäller EU-reglerna i Sverige?', a: 'Ja, EU-förordningar gäller direkt i alla medlemsländer. Exempelvis gäller EU-förordning 261/2004 om flygpassagerares rättigheter fullt ut i Sverige.' },
      { q: 'Vad är skillnaden mellan reklamation och garanti?', a: 'Reklamationsrätten (3 år) är lagstadgad och gäller alltid. Garanti är ett frivilligt åtagande från säljaren eller tillverkaren utöver reklamationsrätten.' },
    ],
  },
  {
    heading: 'Kravbrevet',
    items: [
      { q: 'Vad händer efter att jag skickat kravbrevet?', a: 'Motparten har normalt 14 dagar att svara. Om de inte svarar eller avslår ditt krav kan du anmäla ärendet till ARN.' },
      { q: 'Är kravbrevet juridiskt bindande?', a: 'Kravbrevet är inte juridiskt bindande i sig, men det är ett viktigt steg för att formellt framställa ditt krav och dokumentera att du har försökt lösa tvisten.' },
      { q: 'Kan jag redigera kravbrevet?', a: 'Ja, du kan kopiera brevet och anpassa det efter behov. Fyll i dina personuppgifter och specifika detaljer innan du skickar det.' },
    ],
  },
];

const allFaqs = faqGroups.flatMap(g => g.items);

const FAQPage = () => (
  <main className="py-16 sm:py-24">
    <SEOHead
      title={`Vanliga frågor om konsumenträtt`}
      description={`Svar på vanliga frågor om konsumenträttigheter, reklamation, kravbrev och hur ${SITE_CONFIG.name} fungerar.`}
      canonical="/faq"
    />
    <FAQSchema items={allFaqs} />

    <div className="max-w-3xl mx-auto px-4">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-10">
        Vanliga frågor om konsumenträtt och dina rättigheter
      </h1>

      {faqGroups.map((group, gi) => (
        <section key={gi} className="mb-12" aria-label={group.heading}>
          <h2 className="text-xl font-bold text-foreground mb-4">{group.heading}</h2>
          <div className="card-elevated divide-y divide-border">
            {group.items.map((faq, i) => (
              <details key={i} className="group">
                <summary className="px-5 py-4 text-sm font-medium text-foreground cursor-pointer list-none flex items-center justify-between hover:bg-muted/30 transition-colors">
                  {faq.q}
                  <span className="text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="px-5 pb-4 text-sm text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      ))}
    </div>
  </main>
);

export default FAQPage;
