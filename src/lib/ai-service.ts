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
  const counterparty = answers.company || answers.bank || answers.subscription_company || answers.purchase_company || answers.delivery_company || '[MOTPARTENS FÖRETAGSNAMN]';

  const today = new Date();
  const deadline = new Date(today);
  deadline.setDate(deadline.getDate() + 14);
  const deadlineStr = deadline.toISOString().split('T')[0];

  // Build situation description from answers
  const situationLines = category.questions
    .filter(q => answers[q.id])
    .map(q => `${q.label} ${answers[q.id]}`)
    .join('. ');

  // Determine relevant legal reference and authority
  let legalRef = 'gällande konsumentlagstiftning';
  let authority = 'Allmänna reklamationsnämnden (ARN)';

  if (category.id === 'resor') {
    const travelType = answers.travel_type || '';
    if (travelType === 'Flyg') legalRef = 'EU-förordning 261/2004 om flygpassagerares rättigheter';
    else if (travelType === 'Tåg') legalRef = 'EU-förordning 1371/2007 om tågresenärers rättigheter';
    else if (travelType === 'Buss') legalRef = 'EU-förordning 181/2011 om busspassagerares rättigheter';
    else if (travelType === 'Färja') legalRef = 'EU-förordning 1177/2010 om sjöpassagerares rättigheter';
    else legalRef = 'tillämpliga EU-förordningar och svensk konsumentlagstiftning';
  } else if (category.id === 'kop-ehandel' || category.id === 'garanti-dolda-fel') {
    legalRef = 'Konsumentköplagen (2022:260)';
  } else if (category.id === 'leverans') {
    legalRef = 'Konsumentköplagen (2022:260) samt Distansavtalslagen (2005:59)';
  } else if (category.id === 'betalning-aterkrav') {
    legalRef = 'Betaltjänstlagen';
    authority = 'Finansinspektionen och ARN';
  } else if (category.id === 'abonnemang') {
    legalRef = 'Distansavtalslagen (2005:59) samt Avtalslagen (1915:218) 36 §';
  } else if (category.id === 'bilkop') {
    legalRef = answers.seller_type === 'Privatperson' ? 'Köplagen (1990:931)' : 'Konsumentköplagen (2022:260)';
  } else if (category.id === 'hyra') {
    legalRef = 'Hyreslagen (12 kap. Jordabalken)';
    authority = 'Hyresnämnden';
  } else if (category.id === 'hantverkare') {
    legalRef = 'Konsumenttjänstlagen (1985:716)';
  }

  return `[ORT], [DATUM]

[DITT NAMN]
[DIN ADRESS]
[POSTNUMMER OCH ORT]
[DIN E-POST]
[DITT TELEFONNUMMER]

Till: ${counterparty}
[MOTPARTENS ADRESS OM KÄND]

KRAVBREV

Grund för kravet:
Jag vänder mig till er med anledning av följande: ${situationLines}. Med stöd av ${legalRef} framställer jag härmed krav på ersättning/åtgärd. Enligt aktuell lagstiftning har jag som konsument rätt till kompensation i denna situation.

Exakt belopp som krävs:
[SPECIFICERAT BELOPP I SEK ELLER EUR]
Om ränta är aktuellt tillkommer dröjsmålsränta enligt räntelagen.
Totalt: [BELOPP] kr/€

Tidsfrist:
Betalning eller åtgärd ska vara genomförd senast ${deadlineStr}.

Betalningsinstruktioner:
Vänligen genomför betalning till nedanstående konto:
Bankgiro/Swish: [DITT BANKGIRO ELLER SWISH-NUMMER]
Vid åtgärd istället för betalning: [BESKRIV VAD SOM KONKRET FÖRVÄNTAS]

Konsekvenser vid utebliven betalning:
Om betalning eller åtgärd inte sker inom angiven tidsfrist kommer ärendet att anmälas till ${authority}. Vi förbehåller oss rätten att kräva ersättning för eventuella tillkommande kostnader.

Med vänliga hälsningar,

[DITT NAMN]
________________________
Underskrift`;
}
