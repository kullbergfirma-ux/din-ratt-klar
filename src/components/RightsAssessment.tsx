import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Lock, ArrowLeft, Check, Copy, FileText, BookOpen, Mail, Shield, ChevronRight, Loader2 } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';
import { type Tier } from '@/lib/pricing';
import { useState, useEffect, type RefObject } from 'react';

interface Props {
  assessment: string;
  sentiment: 'positive' | 'uncertain' | 'negative';
  tier: Tier;
  letter: string;
  onUnlock: (tier: Tier) => Promise<void> | void;
  onBack: () => void;
  assessmentRef?: RefObject<HTMLDivElement>;
  letterRef?: RefObject<HTMLDivElement>;
}

const RightsAssessment = ({ assessment, sentiment, tier, letter, onUnlock, onBack, assessmentRef, letterRef }: Props) => {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLetter, setEditedLetter] = useState('');

  const isAssessmentLocked = tier === 'free' && sentiment === 'positive';
  const showPricing = isAssessmentLocked;

  useEffect(() => {
    if (letter && !editedLetter) setEditedLetter(letter);
  }, [letter]);

  const displayLetter = editedLetter || letter;

  const cleanAssessment = tier === 'komplett'
    ? assessment
    : assessment.replace(/###?\s*Nästa steg[\s\S]*?(?=###?|##|$)/gi, '').trim();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(displayLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    const content = displayLetter
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const html = `<!DOCTYPE html>
<html>
<head>
<title>Kravbrev</title>
<style>
  @page { margin: 40px; size: A4; }
  @media print { html, body { -webkit-print-color-adjust: exact; } }
  body { font-family: Arial, sans-serif; font-size: 14px; line-height: 1.8; color: #1a1a1a; padding: 0; margin: 0; }
  pre { white-space: pre-wrap; word-wrap: break-word; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.8; }
</style>
</head>
<body>
<pre>${content}</pre>
</body>
</html>`;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;
    doc.open();
    doc.write(html);
    doc.close();

    iframe.contentWindow?.focus();
    setTimeout(() => {
      iframe.contentWindow?.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    }, 500);
  };

  const handleUnlockClick = async (t: Tier) => {
    setIsGenerating(true);
    try {
      await onUnlock(t);
    } finally {
      setIsGenerating(false);
    }
  };

  const sentimentColors = {
    positive: '#1D9E75',
    uncertain: '#D97706',
    negative: '#DC2626',
  };

  const sentimentBgs = {
    positive: '#F0FDF4',
    uncertain: '#FFFBEB',
    negative: '#FEF2F2',
  };

  const sentimentLabels = {
    positive: 'Du har troligtvis rätt till ersättning',
    uncertain: 'Osäkert utfall — vi kunde inte ge ett tydligt svar',
    negative: 'Du har troligtvis inte rätt till ersättning i detta fall',
  };

  const markdownComponents = {
    h2: ({ children }: any) => (
      <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0F1F3D', marginTop: 28, marginBottom: 8 }}>
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1A2744', marginTop: 20, marginBottom: 6 }}>
        {children}
      </h3>
    ),
    p: ({ children }: any) => (
      <p style={{ fontSize: 14, lineHeight: 1.7, color: '#374151', marginBottom: 12 }}>
        {children}
      </p>
    ),
    li: ({ children }: any) => (
      <li style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 4 }}>{children}</li>
    ),
    ul: ({ children }: any) => (
      <ul style={{ paddingLeft: 20, marginBottom: 12 }}>{children}</ul>
    ),
    ol: ({ children }: any) => (
      <ol style={{ paddingLeft: 20, marginBottom: 12 }}>{children}</ol>
    ),
  };

  /* ──────────────── LEFT COLUMN: Assessment ──────────────── */
  const renderAssessmentColumn = () => (
    <div
      ref={assessmentRef}
      style={{
        background: '#FFFFFF',
        borderRadius: 14,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)',
        border: '1px solid rgba(0,0,0,0.06)',
        borderLeft: `4px solid ${sentimentColors[sentiment]}`,
        padding: '24px 28px',
        display: 'flex',
        flexDirection: 'column' as const,
      }}
    >
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F1F3D', marginBottom: 8 }}>Din rättighetsbedömning</h2>

      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 14px',
        borderRadius: 8,
        background: sentimentBgs[sentiment],
        marginBottom: 16,
        alignSelf: 'flex-start',
      }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: sentimentColors[sentiment] }} />
        <span style={{ fontSize: 14, fontWeight: 600, color: sentimentColors[sentiment] }}>
          {sentimentLabels[sentiment]}
        </span>
      </div>

      <div className="relative" style={{ flex: 1 }}>
        <div
          className={`prose prose-sm max-w-none ${isAssessmentLocked ? 'select-none' : ''}`}
          style={isAssessmentLocked ? { filter: 'blur(6px)' } : undefined}
        >
          <ReactMarkdown components={markdownComponents}>
            {cleanAssessment}
          </ReactMarkdown>
        </div>

        {isAssessmentLocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: 12, padding: 24, textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0' }}>
              <Lock style={{ width: 32, height: 32, color: '#6B7280', margin: '0 auto 12px' }} />
              <p style={{ fontSize: 14, fontWeight: 600, color: '#0F1F3D', margin: '0 0 4px' }}>Lås upp fullständig analys</p>
              <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>Se belopp, lagparagrafer och kravbrev</p>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: 16, fontSize: 12, color: '#6B7280', background: '#F9FAFB', borderRadius: 8, padding: '10px 14px' }}>
        {SITE_CONFIG.disclaimer}
      </div>
    </div>
  );

  /* ──────────────── RIGHT COLUMN: Letter ──────────────── */
  const renderLetterColumn = () => {
    // Free tier with positive: show nothing (pricing cards shown separately)
    if (tier === 'free') return null;

    // Bas tier: blurred letter with unlock
    if (tier === 'bas') {
      return (
        <div
          ref={letterRef}
          style={{
            background: '#FFFFFF',
            borderRadius: 14,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)',
            border: '1px solid rgba(0,0,0,0.06)',
            padding: '24px 28px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column' as const,
          }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F1F3D', marginBottom: 16 }}>Ditt kravbrev</h2>

          <div style={{ filter: 'blur(5px)', userSelect: 'none', pointerEvents: 'none', flex: 1, fontFamily: 'inherit', fontSize: 14, lineHeight: 1.7, color: '#374151', background: '#FAFBFC', borderRadius: 10, border: '1px solid #F0F4F8', padding: '20px 24px' }}>
            <p style={{ fontSize: 13, color: '#374151', marginBottom: 6 }}>Hej,</p>
            <p style={{ fontSize: 13, color: '#374151', marginBottom: 6 }}>Med anledning av nedanstående situation vänder jag mig till er med följande krav. Jag har som konsument rätt till ersättning enligt gällande lagstiftning och begär att ni återkommer med en lösning.</p>
            <p style={{ fontSize: 13, color: '#374151', marginBottom: 6 }}>Enligt tillämplig lag har jag rätt till ersättning för den skada jag lidit. Jag begär att ärendet åtgärdas inom 14 dagar från detta brev.</p>
            <p style={{ fontSize: 13, color: '#374151', marginBottom: 6 }}>Om ni inte återkommer inom angiven tid kommer jag att överväga att anmäla ärendet till Allmänna reklamationsnämnden för prövning.</p>
            <p style={{ fontSize: 13, color: '#374151', marginBottom: 6 }}>Med vänliga hälsningar,{'\n'}[Ditt namn]</p>
          </div>

          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.75)',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%', background: '#FEF3C7',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
            }}>
              <Lock style={{ width: 22, height: 22, color: '#D97706' }} />
            </div>
            <p style={{ fontSize: 17, fontWeight: 700, color: '#0F1F3D', marginBottom: 4 }}>Lås upp kravbrevet</p>
            <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 4, textAlign: 'center', maxWidth: 280 }}>
              Få ett färdigt kravbrev anpassat till ditt specifika ärende
            </p>
            <p style={{ fontSize: 22, fontWeight: 700, color: '#D97706', marginBottom: 2 }}>40 kr till</p>
            <p style={{ fontSize: 12, color: '#9BA3AF', marginBottom: 16 }}>Totalt 79 kr — du har redan betalat 39 kr</p>
            <button
              onClick={() => handleUnlockClick('komplett')}
              disabled={isGenerating}
              style={{
                padding: '13px 28px',
                borderRadius: 10,
                border: 'none',
                background: '#F59E0B',
                color: 'white',
                fontSize: 15,
                fontWeight: 700,
                cursor: isGenerating ? 'wait' : 'pointer',
                opacity: isGenerating ? 0.7 : 1,
                width: '100%',
                maxWidth: 260,
              }}
            >
              {isGenerating ? 'Genererar...' : 'Lås upp för 40 kr till'}
            </button>

            <div style={{ marginTop: 20, textAlign: 'left', width: '100%', maxWidth: 260 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#0F1F3D', marginBottom: 8 }}>Du får även:</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
                {[
                  'Nästa steg — konkret handlingsplan',
                  'Steg-för-steg ARN-anmälningsguide',
                  'Uppföljningsbrev om motparten inte svarar',
                  'Strategisk vägledning',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 11, color: '#374151' }}>
                    <span style={{ color: '#1D9E75', flexShrink: 0, marginTop: 1 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
    }

    // Komplett tier: full letter
    if (tier === 'komplett' && displayLetter) {
      return (
        <div
          ref={letterRef}
          style={{
            background: '#FFFFFF',
            borderRadius: 14,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)',
            border: '1px solid rgba(0,0,0,0.06)',
            padding: '24px 28px',
            display: 'flex',
            flexDirection: 'column' as const,
          }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F1F3D', marginBottom: 16 }}>Ditt kravbrev</h2>

          <div style={{
            background: '#FAFBFC',
            borderRadius: 10,
            border: '1px solid #F0F4F8',
            padding: '20px 24px',
            fontSize: 14,
            lineHeight: 1.7,
            whiteSpace: 'pre-wrap',
            color: '#374151',
            fontFamily: 'inherit',
            flex: 1,
            maxHeight: 380,
            overflowY: 'auto',
            marginBottom: 16,
          }}>
            {displayLetter}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 16 }}>
            <button
              onClick={() => { setEditedLetter(displayLetter); setIsEditing(true); }}
              style={{ padding: '9px 16px', borderRadius: 8, border: '1.5px solid #E2E8F0', background: 'white', fontSize: 13, cursor: 'pointer' }}
            >
              Redigera
            </button>
            <button
              onClick={handleCopy}
              style={{ padding: '9px 16px', borderRadius: 8, border: '1.5px solid #E2E8F0', background: 'white', fontSize: 13, cursor: 'pointer' }}
            >
              {copied ? 'Kopierat!' : 'Kopiera'}
            </button>
            <button
              onClick={handleDownloadPDF}
              style={{ padding: '9px 16px', borderRadius: 8, border: 'none', background: '#1B4F8A', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              Ladda ner PDF
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  /* ──────────────── RENDER ──────────────── */
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

      {/* ── FREE TIER: single column assessment + pricing cards ── */}
      {tier === 'free' && (
        <>
          {renderAssessmentColumn()}

          {/* Uncertain verdict edit option */}
          {sentiment === 'uncertain' && (
            <div style={{
              background: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: 10,
              padding: '14px 18px',
              marginTop: 16,
            }}>
              <p style={{ fontSize: 13, color: '#92400E', margin: '0 0 10px' }}>
                Om du anser att din situation är tydligare än beskrivningen antyder kan du gå tillbaka och justera dina svar.
              </p>
              <button
                onClick={onBack}
                style={{ padding: '8px 16px', borderRadius: 8, border: '1.5px solid #D97706', background: 'transparent', color: '#D97706', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                Ändra mina svar
              </button>
            </div>
          )}

          {/* Negative verdict */}
          {sentiment === 'negative' && (
            <div style={{
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: 10,
              padding: '12px 16px',
              marginTop: 16,
              fontSize: 13,
              color: '#991B1B',
            }}>
              Baserat på din beskrivning finns det troligtvis inte grund för ett krav i detta fall. Om du anser att situationen är mer komplex kan du kontakta <a href="https://www.konsumentverket.se" target="_blank" rel="noopener noreferrer" style={{ color: '#991B1B', textDecoration: 'underline' }}>Konsumentverket</a> för kostnadsfri rådgivning.
            </div>
          )}

          {/* Pricing cards for positive */}
          {showPricing && (
            <div style={{ marginTop: 24 }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#0F1F3D', textAlign: 'center', marginBottom: 4 }}>
                Lås upp för att se hela bedömningen
              </p>
              <p style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', marginBottom: 20 }}>
                Välj det alternativ som passar dig
              </p>

              <div className="result-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* Bas — 39 kr */}
                <div style={{
                  background: '#FFFFFF',
                  border: '2px solid #1B4F8A',
                  borderRadius: 14,
                  padding: '24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Bas</p>
                    <p style={{ fontSize: 28, fontWeight: 700, color: '#0F1F3D', margin: '4px 0 0' }}>39 kr</p>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
                    {['Exakt ersättningsbelopp', 'Fullständig juridisk analys', 'Verifierade lagparagrafer'].map(item => (
                      <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#374151' }}>
                        <span style={{ color: '#1D9E75', flexShrink: 0, marginTop: 1 }}>✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleUnlockClick('bas')}
                    disabled={isGenerating}
                    style={{ width: '100%', padding: '11px 16px', borderRadius: 10, border: 'none', background: '#1B4F8A', color: 'white', fontSize: 14, fontWeight: 600, cursor: isGenerating ? 'wait' : 'pointer', opacity: isGenerating ? 0.7 : 1 }}
                  >
                    {isGenerating ? 'Genererar...' : 'Lås upp för 39 kr'}
                  </button>
                </div>

                {/* Komplett — 79 kr */}
                <div style={{
                  background: '#FFFFFF',
                  border: '2px solid #F59E0B',
                  borderRadius: 14,
                  padding: '24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}>
                  <span style={{
                    position: 'absolute',
                    top: -10,
                    right: 16,
                    background: '#F59E0B',
                    color: 'white',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: 12,
                  }}>
                    Bäst värde
                  </span>
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Komplett</p>
                    <p style={{ fontSize: 28, fontWeight: 700, color: '#0F1F3D', margin: '4px 0 0' }}>79 kr</p>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
                    {['Allt i Bas', 'Färdigt kravbrev', 'Nästa steg och handlingsplan', 'ARN-anmälningsguide', 'Uppföljningsbrev'].map(item => (
                      <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#374151' }}>
                        <span style={{ color: '#1D9E75', flexShrink: 0, marginTop: 1 }}>✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleUnlockClick('komplett')}
                    disabled={isGenerating}
                    style={{ width: '100%', padding: '11px 16px', borderRadius: 10, border: 'none', background: '#F59E0B', color: 'white', fontSize: 14, fontWeight: 600, cursor: isGenerating ? 'wait' : 'pointer', opacity: isGenerating ? 0.7 : 1 }}
                  >
                    {isGenerating ? 'Genererar...' : 'Lås upp för 79 kr'}
                  </button>
                </div>
              </div>
              <p style={{ textAlign: 'center', fontSize: 12, color: '#9BA3AF', marginTop: 12 }}>
                Ingen prenumeration. Engångsbetalning per ärende.
              </p>
            </div>
          )}
        </>
      )}

      {/* ── BAS / KOMPLETT: Two-column grid ── */}
      {(tier === 'bas' || tier === 'komplett') && (
        <div className="result-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'stretch' }}>
          {renderAssessmentColumn()}
          {renderLetterColumn()}
        </div>
      )}

      {/* ── KOMPLETT EXTRAS: 2x2 card grid ── */}
      {tier === 'komplett' && (
        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F1F3D', marginBottom: 20 }}>Ingår i ditt paket</h2>

          <div className="extras-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Nästa steg */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 14,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              border: '1px solid rgba(0,0,0,0.06)',
              padding: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#EEF4FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChevronRight style={{ width: 20, height: 20, color: '#1B4F8A' }} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F1F3D', margin: 0 }}>Nästa steg</h3>
              </div>
              <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6 }}>
                Konkret handlingsplan för hur du driver ditt ärende vidare mot motparten.
              </p>
            </div>

            {/* ARN-guide */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 14,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              border: '1px solid rgba(0,0,0,0.06)',
              padding: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#EEF4FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield style={{ width: 20, height: 20, color: '#1B4F8A' }} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F1F3D', margin: 0 }}>ARN-anmälan</h3>
              </div>
              <ol style={{ paddingLeft: 18, margin: '0 0 12px', fontSize: 13, color: '#374151', lineHeight: 1.8 }}>
                {['Gå till arn.se', 'Klicka på "Anmäl ett ärende"', 'Bifoga kravbrevet', 'Skicka in — kostnadsfritt'].map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
              <a href="https://www.arn.se" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#1B4F8A', fontWeight: 600, textDecoration: 'none' }}>
                Gå till ARN →
              </a>
            </div>

            {/* Uppföljningsbrev */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 14,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              border: '1px solid rgba(0,0,0,0.06)',
              padding: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#EEF4FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail style={{ width: 20, height: 20, color: '#1B4F8A' }} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F1F3D', margin: 0 }}>Uppföljningsbrev</h3>
              </div>
              <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 10 }}>
                Om motparten inte svarar inom 14 dagar, skicka detta påminnelsebrev:
              </p>
              <div style={{
                background: '#FAFBFC',
                borderRadius: 8,
                padding: '14px 16px',
                fontSize: 12,
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                color: '#1A2744',
              }}>
                {`Hej,\n\nJag hänvisar till mitt kravbrev daterat [DATUM].\n\nJag har ännu inte fått något svar. Jag ger er ytterligare 7 dagar på er, annars anmäler jag ärendet till ARN.\n\nMed vänliga hälsningar,\n[DITT NAMN]`}
              </div>
            </div>

            {/* Strategisk vägledning */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 14,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              border: '1px solid rgba(0,0,0,0.06)',
              padding: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#EEF4FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen style={{ width: 20, height: 20, color: '#1B4F8A' }} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F1F3D', margin: 0 }}>Strategisk vägledning</h3>
              </div>
              <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.7 }}>
                <div style={{ marginBottom: 10 }}>
                  <p style={{ fontWeight: 600, color: '#0F1F3D', margin: '0 0 2px' }}>Gör</p>
                  <p style={{ margin: 0, color: '#6B7280' }}>Var saklig och hänvisa till specifik lagparagraf. Dokumentera all kommunikation skriftligt.</p>
                </div>
                <div>
                  <p style={{ fontWeight: 600, color: '#0F1F3D', margin: '0 0 2px' }}>Undvik</p>
                  <p style={{ margin: 0, color: '#6B7280' }}>Hotfulla formuleringar eller överdrivna krav. Håll dig till fakta och lagstiftning.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back button */}
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

      <style>{`
        @media (max-width: 768px) {
          .result-grid {
            grid-template-columns: 1fr !important;
          }
          .extras-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default RightsAssessment;
