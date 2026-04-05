import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Lock, ArrowLeft, Check, Copy, FileText, BookOpen, Mail, Loader2 } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';
import { type Tier } from '@/lib/pricing';
import { useState, useEffect } from 'react';

interface Props {
  assessment: string;
  sentiment: 'positive' | 'uncertain' | 'negative';
  tier: Tier;
  letter: string;
  onUnlock: (tier: Tier) => Promise<void> | void;
  onBack: () => void;
}

const sentimentStyles = {
  positive: 'border-l-4 border-l-success',
  uncertain: 'border-l-4 border-l-warning',
  negative: 'border-l-4 border-l-destructive',
};

const sentimentLabels = {
  positive: 'Du har troligtvis rätt',
  uncertain: 'Det är osäkert',
  negative: 'Du har troligtvis inte rätt',
};

const RightsAssessment = ({ assessment, sentiment, tier, letter, onUnlock, onBack }: Props) => {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLetter, setEditedLetter] = useState('');

  const isAssessmentLocked = tier === 'free' && sentiment !== 'negative';
  const isLetterLocked = tier === 'free' || tier === 'bas';
  const showAssessmentPricing = isAssessmentLocked;
  const showLetterPricing = !isAssessmentLocked && isLetterLocked && sentiment !== 'negative';

  useEffect(() => {
    if (letter && !editedLetter) setEditedLetter(letter);
  }, [letter]);

  const displayLetter = editedLetter || letter;

  const displayAssessment = tier === 'komplett'
    ? assessment
    : assessment.replace(/###\s*Nästa steg[\s\S]*?(?=###|##|$)/gi, '').trim();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(displayLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    const content = displayLetter;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Kravbrev</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: 14px; line-height: 1.7; padding: 40px; max-width: 700px; margin: 0 auto; color: #1a1a1a; }
            pre { white-space: pre-wrap; word-wrap: break-word; }
          </style>
        </head>
        <body>
          <pre>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
          <script>window.onload = () => { window.print(); window.close(); }<\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleUnlockClick = async (t: Tier) => {
    setIsGenerating(true);
    try {
      await onUnlock(t);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Verdict banner */}
      <div className={`card-elevated p-6 sm:p-8 ${sentimentStyles[sentiment]}`}>
        <h2 className="text-xl font-bold text-foreground mb-2">Din rättighetsbedömning</h2>

        <div className="flex items-center gap-2 mb-4">
          <span className={`text-lg font-bold ${
            sentiment === 'positive' ? 'text-success' : sentiment === 'uncertain' ? 'text-warning' : 'text-destructive'
          }`}>
            {sentimentLabels[sentiment]}
          </span>
        </div>

        <div className="relative">
          <div
            className={`prose prose-sm max-w-none text-foreground/90 ${isAssessmentLocked ? 'select-none' : ''}`}
            style={isAssessmentLocked ? { filter: 'blur(6px)' } : undefined}
          >
            <ReactMarkdown
              components={{
                h2: ({ children }) => (
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0F1F3D', marginTop: 28, marginBottom: 8 }}>
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1A2744', marginTop: 20, marginBottom: 6 }}>
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: '#374151', marginBottom: 12 }}>
                    {children}
                  </p>
                ),
                li: ({ children }) => (
                  <li style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 4 }}>
                    {children}
                  </li>
                ),
                ul: ({ children }) => (
                  <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol style={{ paddingLeft: 20, marginBottom: 12 }}>
                    {children}
                  </ol>
                ),
              }}
            >
              {displayAssessment}
            </ReactMarkdown>
          </div>

          {isAssessmentLocked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-card/90 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-border">
                <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">Lås upp fullständig analys</p>
                <p className="text-xs text-muted-foreground">Se belopp, lagparagrafer och kravbrev</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Negative verdict info box */}
      {sentiment === 'negative' && tier === 'free' && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: 10,
          padding: '12px 16px',
          marginTop: 16,
          fontSize: 13,
          color: '#991B1B',
        }}>
          Baserat på din beskrivning finns det troligtvis inte grund för ett krav i detta fall. Läs förklaringen ovan noggrant. Om du anser att situationen är mer komplex kan du kontakta <a href="https://www.konsumentverket.se" target="_blank" rel="noopener noreferrer" style={{ color: '#991B1B', textDecoration: 'underline' }}>Konsumentverket</a> för kostnadsfri rådgivning.
        </div>
      )}

      <div style={{ marginTop: 12, fontSize: 12, color: '#6B7280', background: '#F9FAFB', borderRadius: 8, padding: '10px 14px' }}>
        {SITE_CONFIG.disclaimer} — Bedömningen kostar 39 kr. Kravbrev och handlingsplan är ytterligare 40 kr.
      </div>

      {/* Assessment unlock card */}
      {showAssessmentPricing && (
        <div style={{ marginTop: 24 }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#0F1F3D', textAlign: 'center', marginBottom: 4 }}>
            Lås upp för att se hela bedömningen
          </p>
          <p style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', marginBottom: 20 }}>
            Se exakt belopp, lagparagrafer och juridisk analys
          </p>
          <div style={{ maxWidth: 320, margin: '0 auto' }}>
            <div style={{
              background: '#FFFFFF',
              border: '2px solid #1B4F8A',
              borderRadius: 14,
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}>
              <div>
                <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Bedömning</p>
                <p style={{ fontSize: 28, fontWeight: 700, color: '#0F1F3D', margin: '4px 0 0' }}>39 kr</p>
                <p style={{ fontSize: 12, color: '#9BA3AF', margin: '2px 0 0' }}>Engångsbetalning</p>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
                {[
                  'Exakt ersättningsbelopp i SEK eller EUR',
                  'Fullständig juridisk analys',
                  'Verifierade lagparagrafer med källhänvisningar',
                  'Bedömning av ärendets svagheter',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#374151' }}>
                    <span style={{ color: '#1D9E75', flexShrink: 0, marginTop: 1 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleUnlockClick('bas')}
                disabled={isGenerating}
                style={{
                  width: '100%',
                  padding: '13px 16px',
                  borderRadius: 10,
                  border: 'none',
                  background: '#1B4F8A',
                  color: 'white',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: isGenerating ? 'wait' : 'pointer',
                  marginTop: 4,
                  opacity: isGenerating ? 0.7 : 1,
                }}
              >
                {isGenerating ? 'Genererar...' : 'Lås upp för 39 kr'}
              </button>
            </div>
          </div>
          <p style={{ textAlign: 'center', fontSize: 12, color: '#9BA3AF', marginTop: 12 }}>
            Ingen prenumeration. Betala bara när du vill ha mer.
          </p>
        </div>
      )}

      {/* Letter unlock card */}
      {showLetterPricing && (
        <div style={{
          marginTop: 28,
          padding: '24px',
          background: '#F8FAFF',
          border: '1.5px solid #D4E2F4',
          borderRadius: 14,
        }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#0F1F3D', marginBottom: 4 }}>
            Vill du agera på bedömningen?
          </p>
          <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 16 }}>
            Lås upp kravbrevet och få vägledning om hur du går vidare — för ytterligare 40 kr.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {[
              'Färdigt kravbrev anpassat till ditt ärende',
              'Nästa steg — konkret handlingsplan',
              'Steg-för-steg ARN-anmälningsguide',
              'Uppföljningsbrev om motparten inte svarar',
              'Strategisk vägledning — vad du bör säga och undvika',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#374151' }}>
                <span style={{ color: '#1D9E75', flexShrink: 0, marginTop: 1 }}>✓</span>
                {item}
              </div>
            ))}
          </div>
          <button
            onClick={() => handleUnlockClick('komplett')}
            disabled={isGenerating}
            style={{
              width: '100%',
              padding: '13px 16px',
              borderRadius: 10,
              border: 'none',
              background: '#F59E0B',
              color: 'white',
              fontSize: 15,
              fontWeight: 600,
              cursor: isGenerating ? 'wait' : 'pointer',
              opacity: isGenerating ? 0.7 : 1,
            }}
          >
            {isGenerating ? 'Genererar...' : 'Lås upp kravbrev för 40 kr till'}
          </button>
          <p style={{ fontSize: 12, color: '#9BA3AF', textAlign: 'center', marginTop: 10 }}>
            Du har redan betalat 39 kr. Totalt 79 kr för fullständigt paket.
          </p>
        </div>
      )}

      {/* Unlocked letter content — only when komplett */}
      {tier === 'komplett' && (
        <>
          {displayLetter && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" /> Ditt kravbrev
              </h2>
              <div className="paper-card p-6 sm:p-8 text-sm leading-relaxed whitespace-pre-wrap text-foreground/90 max-h-[500px] overflow-y-auto">
                {displayLetter}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 16 }}>
                <button
                  onClick={() => { setEditedLetter(displayLetter); setIsEditing(true); }}
                  style={{ padding: '10px 16px', borderRadius: 8, border: '1.5px solid #E2E8F0', background: 'white', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  Redigera kravbrev
                </button>
                <button
                  onClick={handleCopy}
                  style={{ padding: '10px 16px', borderRadius: 8, border: '1.5px solid #E2E8F0', background: 'white', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  {copied ? 'Kopierat!' : 'Kopiera'}
                </button>
                <button
                  onClick={handleDownloadPDF}
                  style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: '#1B4F8A', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  Ladda ner PDF
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 space-y-6">
            <div className="card-elevated p-6">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" /> Strategisk vägledning
              </h3>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
                <p><strong className="text-foreground">Gör:</strong> Var saklig och hänvisa alltid till specifik lagparagraf. Dokumentera all kommunikation skriftligt.</p>
                <p><strong className="text-foreground">Undvik:</strong> Hotfulla formuleringar eller överdrivna krav. Håll dig till fakta och lagstiftning.</p>
                <p><strong className="text-foreground">Tips:</strong> Skicka brevet via rekommenderat brev eller e-post med läskvittens för att kunna bevisa att motparten fått kravet.</p>
              </div>
            </div>

            <div className="card-elevated p-6">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" /> Uppföljningsbrev (mall)
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Om motparten inte svarar inom 14 dagar, skicka detta uppföljningsbrev:
              </p>
              <div className="paper-card p-4 text-xs leading-relaxed whitespace-pre-wrap text-foreground/90">
{`[DITT NAMN]
[DIN ADRESS]

Till: [MOTPARTENS NAMN]

PÅMINNELSE — KRAVBREV

Jag hänvisar till mitt kravbrev daterat [DATUM FÖR FÖRSTA BREVET].

Jag har ännu inte mottagit något svar eller åtgärd. Jag ger er ytterligare 7 dagar att bemöta kravet.

Om jag inte erhåller ett tillfredsställande svar senast [DATUM] kommer jag att anmäla ärendet till [ARN/Hyresnämnden/relevant instans] för prövning.

Med vänliga hälsningar,
[DITT NAMN]`}
              </div>
            </div>

            <div className="card-elevated p-6">
              <h3 className="font-bold text-foreground mb-3">Steg-för-steg: Anmäl till ARN</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Gå till <a href="https://www.arn.se" target="_blank" rel="noopener noreferrer" className="text-primary underline">arn.se</a></li>
                <li>Klicka på "Anmäl ett ärende"</li>
                <li>Fyll i dina uppgifter och motpartens information</li>
                <li>Bifoga kravbrevet och eventuell dokumentation</li>
                <li>Skicka in — ARN:s prövning är kostnadsfri</li>
                <li>ARN ger normalt besked inom 3–6 månader</li>
              </ol>
            </div>

            <div className="card-elevated p-6">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" /> E-postpåminnelse
              </h3>
              <p className="text-sm text-muted-foreground mb-3">Vill du bli påmind om att följa upp?</p>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="din@epost.se"
                  className="flex-1 px-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <Button variant="outline" className="text-sm">Påminn mig om 14 dagar</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Funktionen är simulerad i denna version.</p>
            </div>
          </div>
        </>
      )}

      <div className="mt-6">
        <Button variant="ghost" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="w-4 h-4" />
          Ny sökning
        </Button>
      </div>

      {/* Edit letter modal */}
      {isEditing && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}>
          <div style={{
            background: 'white',
            borderRadius: 16,
            padding: 28,
            width: '100%',
            maxWidth: 640,
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F1F3D', margin: 0 }}>Redigera kravbrev</h3>
              <button
                onClick={() => setIsEditing(false)}
                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#6B7280', lineHeight: 1 }}
              >
                ×
              </button>
            </div>
            <textarea
              value={editedLetter}
              onChange={e => setEditedLetter(e.target.value)}
              style={{
                width: '100%',
                flex: 1,
                minHeight: 320,
                padding: '14px 16px',
                border: '1.5px solid #E2E8F0',
                borderRadius: 10,
                fontSize: 13,
                lineHeight: 1.7,
                fontFamily: 'inherit',
                resize: 'vertical',
                outline: 'none',
                color: '#1A2744',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => { setEditedLetter(letter); setIsEditing(false); }}
                style={{ padding: '10px 16px', borderRadius: 8, border: '1.5px solid #E2E8F0', background: 'white', fontSize: 14, cursor: 'pointer' }}
              >
                Återställ original
              </button>
              <button
                onClick={() => setIsEditing(false)}
                style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: '#1B4F8A', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
              >
                Spara ändringar
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RightsAssessment;
