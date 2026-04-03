import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Lock, ArrowLeft, Check, Copy, Download, FileText, BookOpen, Mail } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';
import { type Tier } from '@/lib/pricing';
import { useState } from 'react';

interface Props {
  assessment: string;
  sentiment: 'positive' | 'uncertain' | 'negative';
  tier: Tier;
  letter: string;
  onUnlock: (tier: Tier) => void;
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
  const isLocked = tier === 'free';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([letter], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kravbrev.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Verdict banner */}
      <div className={`card-elevated p-6 sm:p-8 ${sentimentStyles[sentiment]}`}>
        <h2 className="text-xl font-bold text-foreground mb-2">Din rättighetsbedömning</h2>

        {/* Always visible: simple verdict */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-lg font-bold ${
            sentiment === 'positive' ? 'text-success' : sentiment === 'uncertain' ? 'text-warning' : 'text-destructive'
          }`}>
            {sentimentLabels[sentiment]}
          </span>
        </div>

        {/* Blurred content when free tier */}
        <div className="relative">
          <div className={`prose prose-sm max-w-none text-foreground/90 ${isLocked ? 'select-none' : ''}`} style={isLocked ? { filter: 'blur(6px)' } : undefined}>
            <ReactMarkdown>{assessment}</ReactMarkdown>
          </div>

          {isLocked && (
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

      <div className="mt-4 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
        {SITE_CONFIG.disclaimer}
      </div>

      {/* Pricing cards when free */}
      {isLocked && (
        <div className="mt-8">
          <div className="grid sm:grid-cols-3 gap-4">
            {/* Gratis */}
            <div className="card-elevated p-6">
              <h3 className="font-bold text-foreground mb-1">Gratis</h3>
              <div className="text-2xl font-extrabold text-foreground mb-3">0 kr</div>
              <ul className="space-y-2 text-sm text-muted-foreground mb-5">
                <li className="flex gap-2"><Check className="w-4 h-4 text-success shrink-0 mt-0.5" /> Enkel bedömning</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-success shrink-0 mt-0.5" /> Rättighetsstatus</li>
              </ul>
              <Button variant="outline" className="w-full" disabled>Nuvarande</Button>
            </div>

            {/* Bas */}
            <div className="card-elevated p-6">
              <h3 className="font-bold text-foreground mb-1">Bas</h3>
              <div className="text-2xl font-extrabold text-foreground mb-3">39 kr</div>
              <ul className="space-y-2 text-sm text-muted-foreground mb-5">
                <li className="flex gap-2"><Check className="w-4 h-4 text-success shrink-0 mt-0.5" /> Exakt ersättningsbelopp</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-success shrink-0 mt-0.5" /> Fullständig juridisk analys</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-success shrink-0 mt-0.5" /> Färdigt kravbrev</li>
              </ul>
              <Button onClick={() => onUnlock('bas')} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Lås upp för 39 kr
              </Button>
            </div>

            {/* Komplett */}
            <div className="card-elevated p-6 ring-2 ring-primary relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                Bäst värde
              </span>
              <h3 className="font-bold text-foreground mb-1">Komplett</h3>
              <div className="text-2xl font-extrabold text-foreground mb-3">99 kr</div>
              <ul className="space-y-2 text-sm text-muted-foreground mb-5">
                <li className="flex gap-2"><Check className="w-4 h-4 text-success shrink-0 mt-0.5" /> Allt i Bas</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-success shrink-0 mt-0.5" /> Strategisk vägledning</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-success shrink-0 mt-0.5" /> Uppföljningsbrev</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-success shrink-0 mt-0.5" /> Steg-för-steg ARN-guide</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-success shrink-0 mt-0.5" /> Ladda ner som PDF</li>
              </ul>
              <Button onClick={() => onUnlock('komplett')} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold">
                Lås upp för 99 kr
              </Button>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4">
            Ingen prenumeration. Engångsbetalning per ärende.
          </p>
        </div>
      )}

      {/* Unlocked content */}
      {!isLocked && (
        <>
          {/* Letter */}
          {letter && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" /> Ditt kravbrev
              </h2>
              <div className="paper-card p-6 sm:p-8 text-sm leading-relaxed whitespace-pre-wrap text-foreground/90 max-h-[500px] overflow-y-auto">
                {letter}
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                <Button onClick={handleCopy} variant="outline" className="gap-2">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Kopierat!' : 'Kopiera'}
                </Button>
                <Button onClick={handleDownload} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Download className="w-4 h-4" />
                  Ladda ner .txt
                </Button>
              </div>
            </div>
          )}

          {/* Komplett extras */}
          {tier === 'komplett' && (
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
                <h3 className="font-bold text-foreground mb-3">⏰ E-postpåminnelse</h3>
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
          )}
        </>
      )}

      {/* Back button */}
      <div className="mt-6">
        <Button variant="ghost" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="w-4 h-4" />
          Ny sökning
        </Button>
      </div>
    </motion.div>
  );
};

export default RightsAssessment;
