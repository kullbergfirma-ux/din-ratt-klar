import SEOHead from '@/components/SEOHead';
import { SITE_CONFIG } from '@/config/site';
import EditableText from '@/components/EditableText';

const AboutPage = () => (
  <main className="py-16 sm:py-24">
    <SEOHead
      title={`Om ${SITE_CONFIG.name}`}
      description={`Lär dig mer om ${SITE_CONFIG.name} och hur vi hjälper svenska konsumenter att hävda sina rättigheter.`}
      canonical="/om-oss"
    />

    <div className="max-w-3xl mx-auto px-4">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-8">
        Om {SITE_CONFIG.name}
      </h1>

      <section className="mb-10" aria-label="Vårt uppdrag">
        <h2 className="text-xl font-bold text-foreground mb-3"><EditableText textKey="about.mission.title" fallback="Vårt uppdrag" /></h2>
        <p className="text-muted-foreground leading-relaxed">
          <EditableText textKey="about.mission.text" fallback={`${SITE_CONFIG.name} finns för att göra juridiken tillgänglig för alla. Vi hjälper svenska privatpersoner att förstå och kräva sina rättigheter — snabbt, enkelt och baserat på gällande svensk och EU-lagstiftning.`} />
        </p>
      </section>

      <section className="mb-10" aria-label="Så fungerar det">
        <h2 className="text-xl font-bold text-foreground mb-3"><EditableText textKey="about.how.title" fallback="Så fungerar det" /></h2>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground leading-relaxed">
          <li><strong className="text-foreground">Beskriv din situation</strong> — Välj kategori och svara på några enkla frågor om ditt ärende.</li>
          <li><strong className="text-foreground">Få en juridisk bedömning</strong> — Vår AI analyserar din situation mot gällande lagstiftning och ger dig ett tydligt svar.</li>
          <li><strong className="text-foreground">Generera kravbrev</strong> — Få ett formellt kravbrev redo att skicka — med lagparagrafer, belopp och tidsfrister.</li>
        </ol>
      </section>

      <section className="mb-10" aria-label="Vilka ärenden hanterar vi">
        <h2 className="text-xl font-bold text-foreground mb-3"><EditableText textKey="about.cases.title" fallback="Vilka ärenden hanterar vi?" /></h2>
        <p className="text-muted-foreground leading-relaxed">
          <EditableText textKey="about.cases.text" fallback="Vi hjälper dig med resor (flyg, tåg, buss, färja, hotell), köp och e-handel, garanti och dolda fel, leveransproblem, betalningstvister, abonnemang och feldebitering, bilköp, hyrestvister samt hantverkartvister." />
        </p>
      </section>

      <section aria-label="Viktig information">
        <h2 className="text-xl font-bold text-foreground mb-3"><EditableText textKey="about.disclaimer.title" fallback="Viktig information" /></h2>
        <p className="text-muted-foreground leading-relaxed">
          <EditableText textKey="about.disclaimer.text" fallback={`${SITE_CONFIG.disclaimer} Vid komplexa ärenden rekommenderar vi kontakt med Konsumentverket eller en jurist.`} />
        </p>
      </section>
    </div>
  </main>
);

export default AboutPage;
