import SEOHead from '@/components/SEOHead';
import { SITE_CONFIG } from '@/config/site';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const exampleLetter = `Hej,

Med anledning av att mitt flyg med SAS från Stockholm Arlanda till London Heathrow den 15 mars 2025 försenades med 4 timmar och 20 minuter vid ankomst, vänder jag mig till er med följande krav.

Enligt EU-förordning 261/2004 artikel 7 har jag som passagerare rätt till standardiserad kompensation vid ankomstförseningar överstigande 3 timmar. För flygningar inom EU på sträckor över 1 500 km uppgår ersättningen till 400€, vilket motsvarar ungefär 4 400 kr.

Jag hoppas att vi kan lösa detta på ett smidigt sätt. Jag begär återbetalning av 4 400 kr och ser gärna ett svar från er senast den 29 april 2025.

Om vi inte kan nå en lösning inom angiven tid kommer jag att överväga att anmäla ärendet till Allmänna reklamationsnämnden (ARN) för prövning.

Med vänliga hälsningar,
Anna Andersson
anna@exempel.se`;

const PricingPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const navigateToArenden = () => {
    window.location.href = '/arenden';
  };

  return (
    <main>
      <SEOHead
        title="Priser — Enkel och transparent prissättning"
        description={`Se vad det kostar att använda ${SITE_CONFIG.name}. Börja gratis, betala bara när du vill ha mer.`}
        canonical="/priser"
      />

      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '64px 16px 80px' }}>
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#0F1F3D', marginBottom: 12 }}>
            Enkel och transparent prissättning
          </h1>
          <p style={{ fontSize: 17, color: '#6B7280', maxWidth: 520, margin: '0 auto' }}>
            Betala steg för steg. Börja gratis, betala bara när du vill ha mer.
          </p>
        </div>

        {/* Pricing cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, maxWidth: 860, margin: '0 auto 64px' }}>
          {/* Gratis */}
          <div style={{
            background: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            borderRadius: 14,
            padding: '28px 24px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#0F1F3D', margin: '0 0 4px' }}>Gratis</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#0F1F3D', margin: '0 0 4px' }}>0 kr</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16, marginBottom: 20, flex: 1 }}>
              {['Välj kategori och beskriv din situation', 'Ladda upp dokument och bilder', 'Se om du troligtvis har rätt eller inte'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#374151' }}>
                  <span style={{ color: '#1D9E75', flexShrink: 0, marginTop: 1 }}>✓</span>
                  {f}
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: '#9BA3AF', margin: '0 0 12px' }}>Ingen registrering krävs</p>
            <button
              onClick={navigateToArenden}
              style={{ width: '100%', padding: '11px 16px', borderRadius: 10, border: '1.5px solid #E2E8F0', background: 'transparent', cursor: 'pointer', fontSize: 14 }}
            >
              Börja gratis
            </button>
          </div>

          {/* Bas */}
          <div style={{
            background: '#FFFFFF',
            border: '2px solid #1B4F8A',
            borderRadius: 14,
            padding: '28px 24px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#0F1F3D', margin: '0 0 4px' }}>Bas</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#0F1F3D', margin: '0 0 4px' }}>39 kr</p>
            <p style={{ fontSize: 12, color: '#9BA3AF', margin: '0 0 16px' }}>Engångsbetalning per ärende</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, flex: 1 }}>
              {[
                'Allt i Gratis',
                'Exakt ersättningsbelopp i SEK',
                'Fullständig juridisk analys',
                'Verifierade lagparagrafer med källhänvisningar',
                'Bedömning av ärendets svagheter',
              ].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#374151' }}>
                  <span style={{ color: '#1D9E75', flexShrink: 0, marginTop: 1 }}>✓</span>
                  {f}
                </div>
              ))}
            </div>
            <button
              onClick={navigateToArenden}
              style={{ width: '100%', padding: '11px 16px', borderRadius: 10, border: 'none', background: '#1B4F8A', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
            >
              Kom igång — 39 kr
            </button>
          </div>

          {/* Komplett */}
          <div style={{
            background: '#FFFFFF',
            border: '2px solid #F59E0B',
            borderRadius: 14,
            padding: '28px 24px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}>
            <span style={{
              position: 'absolute',
              top: -12,
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#F59E0B',
              color: 'white',
              fontSize: 11,
              fontWeight: 700,
              padding: '4px 14px',
              borderRadius: 20,
            }}>
              Mest populär
            </span>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#0F1F3D', margin: '0 0 4px' }}>Komplett</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#0F1F3D', margin: '0 0 4px' }}>79 kr</p>
            <p style={{ fontSize: 12, color: '#9BA3AF', margin: '0 0 16px' }}>eller 40 kr till om du redan köpt Bas</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, flex: 1 }}>
              {[
                'Allt i Bas',
                'Färdigt kravbrev anpassat till ditt ärende',
                'Nästa steg — konkret handlingsplan',
                'Steg-för-steg ARN-anmälningsguide',
                'Uppföljningsbrev om motparten inte svarar',
                'Strategisk vägledning',
              ].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#374151' }}>
                  <span style={{ color: '#1D9E75', flexShrink: 0, marginTop: 1 }}>✓</span>
                  {f}
                </div>
              ))}
            </div>
            <button
              onClick={navigateToArenden}
              style={{ width: '100%', padding: '11px 16px', borderRadius: 10, border: 'none', background: '#F59E0B', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
            >
              Kom igång — 79 kr
            </button>
          </div>
        </div>

        {/* Example letter section */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0F1F3D', marginBottom: 8 }}>
              Så här ser ett kravbrev ut
            </h2>
            <p style={{ fontSize: 15, color: '#6B7280', maxWidth: 480, margin: '0 auto' }}>
              Genererat automatiskt baserat på dina svar — anpassat till ditt specifika ärende.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 860, margin: '0 auto' }}>
            {/* Result card mockup */}
            <div style={{
              background: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
              borderRadius: 14,
              padding: 24,
            }}>
              <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 12 }}>Resor — Flyg</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#1D9E75' }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: '#1D9E75' }}>Du har troligtvis rätt till ersättning</span>
              </div>
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 12, color: '#6B7280', margin: '0 0 4px' }}>Uppskattad ersättning</p>
                <p style={{ fontSize: 24, fontWeight: 700, color: '#0F1F3D', margin: '0 0 2px' }}>4 400 kr</p>
                <p style={{ fontSize: 12, color: '#9BA3AF', margin: 0 }}>400€ enligt EU-förordning 261/2004</p>
              </div>
              <div>
                <p style={{ fontSize: 12, color: '#6B7280', margin: '0 0 8px' }}>Juridisk grund</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {['EU-förordning 261/2004 Artikel 7', 'Försening över 3 timmar', 'Sträcka 1 500–3 500 km'].map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#374151' }}>
                      <span style={{ color: '#1B4F8A' }}>§</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Letter preview */}
            <div style={{
              background: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
              borderRadius: 14,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
            }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#0F1F3D', marginBottom: 12 }}>Kravbrev</p>
              <pre style={{
                fontSize: 11,
                lineHeight: 1.6,
                color: '#374151',
                whiteSpace: 'pre-wrap',
                fontFamily: 'inherit',
                flex: 1,
                margin: 0,
                overflow: 'hidden',
                maxHeight: 260,
              }}>
                {exampleLetter}
              </pre>
              <div style={{ borderTop: '1px solid #F0F4F8', paddingTop: 16, marginTop: 16 }}>
                <Link to="/#kategorier">
                  <button style={{
                    width: '100%',
                    padding: '11px 16px',
                    borderRadius: 10,
                    border: 'none',
                    background: '#1B4F8A',
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}>
                    Skapa ditt kravbrev
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0F1F3D', textAlign: 'center', marginBottom: 24 }}>
            Vanliga frågor om prissättningen
          </h2>
          {[
            { q: 'Kan jag betala för Bas och sedan uppgradera?', a: 'Ja, du betalar 39 kr för Bas-paketet och kan sedan lägga till Komplett för ytterligare 40 kr — totalt 79 kr.' },
            { q: 'Vad händer om jag inte har rätt till ersättning?', a: 'Om bedömningen visar att du troligtvis inte har rätt visas detta direkt utan kostnad. Du betalar ingenting om du inte vill låsa upp mer.' },
            { q: 'Behöver jag skapa ett konto?', a: 'Nej, ingen registrering krävs. Du betalar per ärende utan att skapa ett konto.' },
            { q: 'Kan jag använda kravbrevet direkt?', a: 'Ja, kravbrevet är redo att skicka. Du kan kopiera det eller ladda ner det som PDF och skicka direkt till motparten.' },
          ].map((faq, i) => (
            <div key={i} style={{ borderBottom: '1px solid #E2E8F0' }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: '100%',
                  padding: '16px 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#0F1F3D',
                  textAlign: 'left',
                }}
              >
                {faq.q}
                <span style={{ color: '#6B7280', transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
              </button>
              {openFaq === i && (
                <p style={{ fontSize: 13, color: '#6B7280', padding: '0 0 16px', margin: 0, lineHeight: 1.6 }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
};

export default PricingPage;
