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
    resor: {
      sentiment: 'positive',
      assessment: `## Bedömning

Baserat på din situation har du sannolikt **rätt till ekonomisk ersättning** enligt tillämplig EU-förordning.

### Uppskattad ersättning
- **Flyg** (EU 261/2004): 250–600 € beroende på sträcka
- **Tåg** (EU 1371/2007): 25–50% av biljettpriset
- **Buss** (EU 181/2011): 50% av biljettpriset vid försening >120 min
- **Färja** (EU 1177/2010): 25–50% av biljettpriset

### Nästa steg
1. Kontakta transportbolaget/arrangören skriftligt med ditt krav
2. Om de avslår eller inte svarar inom 6 veckor: anmäl till **ARN** (kostnadsfritt)
3. Vid flyg kan du även använda **EU:s klagomålsformulär**

### Undantag
Transportbolaget kan undgå ansvar vid *extraordinära omständigheter* som extremväder eller strejk utanför bolagets kontroll.

*OBS: Detta är vägledning baserad på gällande lagstiftning, inte juridisk rådgivning.*`,
    },
    'kop-ehandel': {
      sentiment: 'positive',
      assessment: `## Bedömning

Du har sannolikt **rätt att reklamera** produkten enligt Konsumentköplagen (2022:260).

### Dina rättigheter
- **3 års reklamationsrätt** från köpdatum
- Fel som visar sig inom **2 år** anses vara ursprungliga — säljaren har bevisbördan
- Du har rätt till: avhjälpande, omleverans, prisavdrag eller hävning
- Vid onlineköp: **14 dagars ångerrätt** enligt distansavtalslagen

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
    abonnemang: {
      sentiment: 'positive',
      assessment: `## Bedömning

Du har sannolikt **rätt till återbetalning** av felaktiga debiteringar enligt distansavtalslagen och avtalslagen.

### Dina rättigheter
- **14 dagars ångerrätt** för tjänster tecknade online
- Företaget **ska bekräfta uppsägning skriftligt**
- Oskäliga bindningstider kan **jämkas** av domstol
- Felaktiga debiteringar efter uppsägning ska återbetalas

### Uppskattad ersättning
Alla belopp debiterade efter giltig uppsägning ska återbetalas i sin helhet.

### Nästa steg
1. Skicka skriftligt krav om återbetalning med 14 dagars frist
2. Kontakta din bank för att stoppa framtida debiteringar
3. Om företaget vägrar: anmäl till **ARN**

*OBS: Detta är vägledning baserad på gällande lagstiftning, inte juridisk rådgivning.*`,
    },
    hantverkare: {
      sentiment: 'positive',
      assessment: `## Bedömning

Du har sannolikt **rätt till avhjälpande** enligt konsumenttjänstlagen (1985:716).

### Dina rättigheter
- Arbetet ska utföras **fackmässigt** (4 §)
- Du har rätt att **hålla inne betalning** vid fel (16 §)
- Hantverkaren ska **åtgärda felet utan kostnad** (20 §)
- Rätt till **prisavdrag** om avhjälpande inte sker inom skälig tid (21 §)
- Rätt till **hävning** vid väsentligt fel (22 §)

### Uppskattad ersättning
Kostnad för att åtgärda felet, alternativt prisavdrag motsvarande värdeminskingen.

### Nästa steg
1. Dokumentera felet med foton
2. Kontakta hantverkaren skriftligt med krav på avhjälpande
3. Sätt en rimlig tidsfrist (normalt 2–4 veckor)
4. Om de vägrar: anmäl till **ARN**

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
  const counterparty = answers.company || answers.bank || answers.organizer || '[MOTPARTENS NAMN]';
  
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
