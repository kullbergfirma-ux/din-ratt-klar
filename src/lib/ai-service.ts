import { type Category } from '@/lib/categories';

// Mock AI responses for demo purposes
// Replace with actual API calls when ready

export function buildAssessmentPrompt(category: Category, answers: Record<string, string>): string {
  const situationParts = category.questions.map(q => `${q.label} ${answers[q.id] || 'Ej angivet'}`);
  return situationParts.join('\n');
}

export function getMockAssessment(category: Category, answers: Record<string, string>): {
  assessment: string;
  sentiment: 'positive' | 'uncertain' | 'negative';
} {
  const assessments: Record<string, { assessment: string; sentiment: 'positive' | 'uncertain' | 'negative' }> = {
    flyg: {
      sentiment: 'positive',
      assessment: `## Bedömning

Baserat på din situation har du sannolikt **rätt till ekonomisk ersättning** enligt EU-förordning 261/2004.

### Uppskattad ersättning
- **250–600 €** beroende på flygsträckans längd
- Kort rutt (<1500 km): **250 €**
- Medellång rutt (1500–3500 km): **400 €**
- Lång rutt (>3500 km): **600 €**

### Nästa steg
1. Kontakta flygbolaget skriftligt med ditt krav
2. Om de avslår eller inte svarar inom 6 veckor: anmäl till **ARN** (kostnadsfritt)
3. Du kan även använda **EU:s klagomålsformulär** för gränsöverskridande flyg

### Undantag att vara medveten om
Flygbolaget kan undgå ansvar vid *extraordinära omständigheter* som extremväder eller strejk utanför bolagets kontroll.

*OBS: Detta är vägledning baserad på gällande lagstiftning, inte juridisk rådgivning.*`,
    },
    reklamation: {
      sentiment: 'positive',
      assessment: `## Bedömning

Du har sannolikt **rätt att reklamera** produkten enligt Konsumentköplagen (2022:260).

### Dina rättigheter
- **3 års reklamationsrätt** från köpdatum
- Fel som visar sig inom **2 år** anses vara ursprungliga — säljaren har bevisbördan
- Du har rätt till: avhjälpande, omleverans, prisavdrag eller hävning

### Uppskattad ersättning
Reparation eller ersättningsprodukt i första hand. Vid väsentligt fel: **full återbetalning**.

### Nästa steg
1. Kontakta säljaren skriftligt och reklamera
2. Säljaren bekostar transport för reklamation
3. Om säljaren vägrar: anmäl till **ARN**

*OBS: Detta är vägledning baserad på gällande lagstiftning, inte juridisk rådgivning.*`,
    },
    hyra: {
      sentiment: 'uncertain',
      assessment: `## Bedömning

Din situation kan innebära rätt till **återbetalning av överskjutande hyra** eller prövning av hyrans skälighet.

### Dina rättigheter
- **Andrahand**: Max 15% påslag på förstahandshyran är tillåtet
- Överskjutande belopp kan krävas tillbaka **upp till 3 år bakåt**
- **Förstahand**: Hyran måste följa bruksvärdesprincipen

### Uppskattad ersättning
Beror på skillnaden mellan betald hyra och skälig hyra. Kan bli **tusentals kronor** vid långvarig överhyra.

### Nästa steg
1. Samla dokumentation (kontrakt, betalningsbevis)
2. Kontakta **Hyresnämnden** för prövning
3. Du kan begära återbetalning retroaktivt

*OBS: Detta är vägledning baserad på gällande lagstiftning, inte juridisk rådgivning.*`,
    },
  };

  return assessments[category.id] || {
    sentiment: 'positive' as const,
    assessment: `## Bedömning

Baserat på din beskrivning har du sannolikt **rättigheter som konsument** enligt svensk lagstiftning.

### Nästa steg
1. Dokumentera allt skriftligt
2. Kontakta motparten med ett formellt krav
3. Om de inte svarar: anmäl till **ARN** (Allmänna reklamationsnämnden)

### Instanser att kontakta
- **Konsumentverket** — rådgivning
- **ARN** — kostnadsfri prövning
- **Kronofogden** — om motparten vägrar betala

*OBS: Detta är vägledning baserad på gällande lagstiftning, inte juridisk rådgivning.*`,
  };
}

export function getMockLetter(category: Category, answers: Record<string, string>, assessment: string): string {
  const counterparty = answers.airline || answers.company || answers.organizer || answers.bank || '[MOTPARTENS NAMN]';
  
  return `[DITT NAMN]
[DIN ADRESS]
[POSTNUMMER ORT]

${counterparty}
[MOTPARTENS ADRESS]

[ORT], [DATUM]

KRAVBREV

Till ${counterparty},

Jag skriver till er angående ${category.title.toLowerCase()} som jag önskar reklamera/kräva ersättning för.

Bakgrund:
${category.questions.map(q => `- ${q.label} ${answers[q.id] || '[EJ ANGIVET]'}`).join('\n')}

Med hänvisning till gällande lagstiftning framställer jag härmed följande krav:

1. Ersättning/återbetalning enligt ovan beskrivna rättigheter
2. Att ni bekräftar mottagande av detta brev inom 14 dagar
3. Att ärendet hanteras skyndsamt

Om jag inte erhåller ett tillfredsställande svar inom 14 dagar från detta brevs datum kommer jag att anmäla ärendet till Allmänna reklamationsnämnden (ARN) för vidare prövning.

Jag bifogar relevant dokumentation som stöd för mitt krav.

Med vänliga hälsningar,

____________________________
[DITT NAMN]
[TELEFONNUMMER]
[E-POSTADRESS]`;
}
