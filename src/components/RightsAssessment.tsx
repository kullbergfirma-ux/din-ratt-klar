import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Lock, ArrowLeft, Check, Copy, FileText, BookOpen, Mail, Loader2 } from 'lucide-react';
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

  // Only lock assessment for positive sentiment on free tier
  const isAssessmentLocked = tier === 'free' && sentiment === 'positive';
  const showPricing = isAssessmentLocked;

  useEffect(() => {
    if (letter && !editedLetter) setEditedLetter(letter);
  }, [letter]);

  const displayLetter = editedLetter || letter;

  // Strip Nästa steg from assessment for free/bas tiers
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

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Verdict banner */}
      <div
        ref={assessmentRef}
        style={{
          background: '#FFFFFF',
          borderRadius: 14,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)',
          border: '1px solid rgba(0,0,0,0.06)',
          borderLeft: `4px solid ${sentimentColors[sentiment]}`,
          padding: '24px 28px',
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
        }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: sentimentColors[sentiment] }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: sentimentColors[sentiment] }}>
            {sentimentLabels[sentiment]}
          </span>
        </div>

        <div className="relative">
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
      </div>

      {/* Uncertain verdict: show edit option */}
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

      {/* Negative verdict info */}
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
          Baserat på din beskrivning finns det troligtvis inte grund för ett krav i detta fall. Om du anser att situationen är mer komplex kan du kontakta <a href="https://www.konsumentverket.se" target="_blank" rel="noopener noreferrer" style={{ color: '#991B1B', textDecoration: 'underline' }}>Konsumentverket</a> för kostnadsfri rådgivning.
        </div>
      )}

      <div style={{ marginTop: 12, fontSize: 12, color: '#6B7280', background: '#F9FAFB', borderRadius: 8, padding: '10px 14px' }}>
        {SITE_CONFIG.disclaimer} — Bedömningen kostar 39 kr. Kravbrev och handlingsplan är ytterligare 40 kr.
      </div>

      {/* Two-card pricing for free + positive */}
      {showPricing && (
        <div style={{ marginTop: 24 }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#0F1F3D', textAlign: 'center', marginBottom: 4 }}>
            Lås upp för att se hela bedömningen
          </p>
          <p style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', marginBottom: 20 }}>
            Välj det alternativ som passar dig
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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

      {/* Two-column layout for bas/komplett */}
      {(tier === 'bas' || tier === 'komplett') && (
        <div className="assessment-letter-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
          {/* Left — assessment is already shown above, so we skip duplicating. Instead show upsell for bas or nothing */}
        </div>
      )}

      {/* Upsell block when tier is bas */}
      {tier === 'bas' && (
        <div ref={letterRef} style={{
          marginTop: 28,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
        }} className="assessment-letter-grid">
          {/* Left: empty spacer on desktop, hidden on mobile */}
          <div />
          {/* Right: upsell + blurred letter preview */}
          <div>
            {/* Blurred letter preview */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 14,
              border: '1px solid #E2E8F0',
              padding: 24,
              position: 'relative',
              overflow: 'hidden',
              marginBottom: 16,
            }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#0F1F3D', marginBottom: 12 }}>Ditt kravbrev</p>
              <div style={{ filter: 'blur(5px)', userSelect: 'none' }}>
                {['Hej,', 'Med anledning av din situation vänder jag mig till er med följande krav.', 'Enligt gällande lagstiftning har jag som konsument rätt till ersättning. Jag begär att ni återkommer med en lösning inom 14 dagar.', 'Med vänliga hälsningar,', '[Ditt namn]'].map((line, i) => (
                  <p key={i} style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, marginBottom: 6 }}>{line}</p>
                ))}
              </div>
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.7)',
              }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#0F1F3D', marginBottom: 4 }}>Lås upp kravbrevet</p>
                <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 12 }}>40 kr till — totalt 79 kr</p>
                <button
                  onClick={() => handleUnlockClick('komplett')}
                  disabled={isGenerating}
                  style={{ padding: '12px 24px', borderRadius: 10, border: 'none', background: '#F59E0B', color: 'white', fontSize: 14, fontWeight: 600, cursor: isGenerating ? 'wait' : 'pointer', opacity: isGenerating ? 0.7 : 1 }}
                >
                  {isGenerating ? 'Genererar...' : 'Lås upp för 40 kr till'}
                </button>
              </div>
            </div>

            {/* Upsell features */}
            <div style={{
              padding: '20px 24px',
              background: '#F8FAFF',
              border: '1.5px solid #D4E2F4',
              borderRadius: 14,
            }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#0F1F3D', marginBottom: 4 }}>
                Vill du agera på bedömningen?
              </p>
              <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 12 }}>
                Betala 40 kr till och få ett färdigt kravbrev, nästa steg och fullständig handlingsplan.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                {['Färdigt kravbrev anpassat till ditt ärende', 'Nästa steg — konkret handlingsplan', 'Steg-för-steg ARN-anmälningsguide', 'Uppföljningsbrev om motparten inte svarar', 'Strategisk vägledning'].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#374151' }}>
                    <span style={{ color: '#1D9E75', flexShrink: 0, marginTop: 1 }}>✓</span>
                    {item}
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleUnlockClick('komplett')}
                disabled={isGenerating}
                style={{ width: '100%', padding: '13px 16px', borderRadius: 10, border: 'none', background: '#F59E0B', color: 'white', fontSize: 15, fontWeight: 600, cursor: isGenerating ? 'wait' : 'pointer', opacity: isGenerating ? 0.7 : 1 }}
              >
                {isGenerating ? 'Genererar...' : 'Lås upp kravbrev för 40 kr till'}
              </button>
              <p style={{ fontSize: 12, color: '#9BA3AF', textAlign: 'center', marginTop: 8 }}>
                Du har redan betalat 39 kr. Totalt 79 kr för fullständigt paket.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Unlocked letter content — only when komplett */}
      {tier === 'komplett' && (
        <>
          {displayLetter && (
            <div ref={letterRef} className="mt-8">
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
                <p><strong className="text-foreground">Tips:</strong> Skicka brevet via rekommenderat brev eller e-post med läskvittens.</p>
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

PÅMINNELSE — KRAVBREV

Jag hänvisar till mitt kravbrev daterat [DATUM FÖR FÖRSTA BREVET].

Jag har ännu inte mottagit något svar eller åtgärd. Jag ger er ytterligare 7 dagar att bemöta kravet.

Om jag inte erhåller ett tillfredsställande svar senast [DATUM] kommer jag att anmäla ärendet till ARN för prövning.

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

      <style>{`
        @media (max-width: 768px) {
          .assessment-letter-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default RightsAssessment;
