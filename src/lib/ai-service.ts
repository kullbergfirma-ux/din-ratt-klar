import { type Category } from '@/lib/categories';
import { type UserProfile } from '@/components/UserInfoForm';

// Pre-analysis validation — returns error message or null if valid
export function validateBeforeAnalysis(category: Category, answers: Record<string, string>): string | null {
  // Check amount for betalning-aterkrav
  if (category.id === 'betalning-aterkrav') {
    const amount = answers.amount || '';
    const parsed = parseFloat(amount.replace(/[^\d.,]/g, '').replace(',', '.'));
    if (!amount.trim() || parsed === 0 || isNaN(parsed)) {
      return 'Ange det belopp du anser dig ha rätt att få tillbaka för att vi ska kunna analysera ditt ärende.';
    }
  }

  // Check for description length — find any freetext field with a description-like purpose
  const descriptionFields = ['description', 'problem', 'what_happened', 'issue', 'defect'];
  for (const fieldId of descriptionFields) {
    const val = answers[fieldId];
    if (val !== undefined && typeof val === 'string' && val.trim().length > 0 && val.trim().length < 30) {
      return 'Beskriv ditt ärende mer detaljerat så att vi kan göra en korrekt bedömning.';
    }
  }

  // Check for "no problem" keywords across all answers
  const noProblemKeywords = ['fungerar bra', 'nöjd', 'inga problem', 'vill bara testa', 'testar', 'allt är som det ska'];
  const allText = Object.values(answers).join(' ').toLowerCase();
  for (const keyword of noProblemKeywords) {
    if (allText.includes(keyword)) {
      return 'Det verkar inte finnas ett aktivt problem i ditt ärende. Fyll i vad som faktiskt gick fel för att få en bedömning.';
    }
  }

  return null;
}

// --- Date helpers ---
function daysBetween(dateStr: string): number {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return -1;
  return Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
}

function yearsBetween(dateStr: string): number {
  return daysBetween(dateStr) / 365.25;
}

function formatElapsed(dateStr: string): string {
  const days = daysBetween(dateStr);
  if (days < 0) return 'okänt datum';
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  if (years > 0 && months > 0) return `${years} år och ${months} månader`;
  if (years > 0) return `${years} år`;
  if (months > 0) return `${months} månader`;
  return `${days} dagar`;
}

const DISCLAIMER = '\n\n*OBS: Detta är juridisk vägledning baserad på angiven information och gällande lagstiftning. Det ersätter inte rådgivning från en jurist. Vid komplexa ärenden rekommenderas kontakt med Konsumentverket eller en kvalificerad jurist.*';

// --- Verified legal references with riksdagen.se links ---
const LEGAL_LINKS = {
  konsumentkoplagen: '[Konsumentköplagen (2022:260)](https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/konsumentkoplag-2022260_sfs-2022-260/)',
  konsumenttjanstlagen: '[Konsumenttjänstlagen (1985:716)](https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/konsumenttjanstlag-1985716_sfs-1985-716/)',
  distansavtalslagen: '[Distansavtalslagen (2005:59)](https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-200559-om-distansavtal-och-avtal-utanfor_sfs-2005-59/)',
  koplagen: '[Köplagen (1990:931)](https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/koplag-1990931_sfs-1990-931/)',
  avtalslagen: '[Avtalslagen (1915:218)](https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-1915218-om-avtal-och-andra-rattshandlingar_sfs-1915-218/)',
  betaltjanstlagen: '[Betaltjänstlagen (2010:751)](https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-2010751-om-betaltjanster_sfs-2010-751/)',
  jordabalken: '[Jordabalken (1970:994)](https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/jordabalk-1970994_sfs-1970-994/)',
  eu261: '[EU-förordning 261/2004](https://eur-lex.europa.eu/legal-content/SV/TXT/?uri=CELEX%3A32004R0261)',
  eu1371: '[EU-förordning 1371/2007](https://eur-lex.europa.eu/legal-content/SV/TXT/?uri=CELEX%3A32007R1371)',
  eu181: '[EU-förordning 181/2011](https://eur-lex.europa.eu/legal-content/SV/TXT/?uri=CELEX%3A32011R0181)',
  eu1177: '[EU-förordning 1177/2010](https://eur-lex.europa.eu/legal-content/SV/TXT/?uri=CELEX%3A32010R1177)',
};

// --- Category analyzers with strict deadline enforcement ---

function analyzeResor(answers: Record<string, string>): { assessment: string; sentiment: 'positive' | 'uncertain' | 'negative' } {
  const travelType = answers.travel_type || '';
  const issue = answers.issue || '';
  const delay = answers.delay_duration || answers.delay_hours || '';
  const flightDate = answers.date || '';

  // Check 3-year prescription for flights
  if (travelType === 'Flyg' && flightDate && yearsBetween(flightDate) > 3) {
    return {
      sentiment: 'negative',
      assessment: `## Bedömning\n\nDu har troligtvis inte rätt till ersättning i detta fall.\n\nFlygresan ägde rum ${flightDate}, vilket är ${formatElapsed(flightDate)} sedan. I Sverige är preskriptionstiden för krav enligt ${LEGAL_LINKS.eu261} **3 år**. Ditt krav har därmed preskriberats.\n\n### Beräkning\nResan genomfördes ${flightDate}. Preskriptionstiden löpte ut 3 år därefter. Denna situation **faller utanför** den tillåtna tidsfristen.${DISCLAIMER}`,
    };
  }

  if (!issue || issue === 'Annat') {
    return {
      sentiment: 'uncertain',
      assessment: `## Bedömning\n\nSituationen är oklar — mer information behövs.\n\nDu har angett "${issue || 'inget specifikt problem'}" men inte beskrivit tillräckligt vad som gått fel. För att kunna bedöma dina rättigheter behöver vi veta exakt vad som hänt och vilken konkret skada du lidit.\n\n**Nästa steg**\nFörsök ange specifikt vad som gick fel — var resan försenad, inställd, eller avvek den från det som utlovats?${DISCLAIMER}`,
    };
  }

  if (travelType === 'Flyg' && issue === 'Försening') {
    const hours = parseFloat(delay) || 0;
    if (hours < 3) {
      return {
        sentiment: 'negative',
        assessment: `## Bedömning\n\nDu har troligtvis inte rätt till ersättning i detta fall.\n\nEnligt ${LEGAL_LINKS.eu261} uppstår rätt till ekonomisk kompensation först när ankomsten till slutdestinationen är försenad med **mer än 3 timmar**. Du har angett en försening på ${hours} timmar, vilket understiger tröskeln.\n\n### Juridiska referenser\n- Artikel 7: Ersättningsbelopp\n- Artikel 5–6: Villkor för kompensation\n\n### Svagheter i ditt ärende\nFörseningar under 3 timmar ger inte rätt till standardiserad kompensation enligt förordningen, även om de är irriterande.\n\n### Nästa steg\nOm flygbolaget erbjöd mat, dryck eller annan assistans som uteblev, kan du ha rätt till ersättning för utlägg du haft under väntetiden.${DISCLAIMER}`,
      };
    }
    return {
      sentiment: 'positive',
      assessment: `## Bedömning\n\nDu har troligtvis rätt till ersättning eller åtgärd.\n\nEnligt ${LEGAL_LINKS.eu261} har du rätt till ekonomisk kompensation vid flygförsening över 3 timmar. Beroende på flygdistansen kan ersättningen vara:\n- **250 €** för flygningar upp till 1 500 km\n- **400 €** för flygningar inom EU över 1 500 km eller andra flygningar 1 500–3 500 km\n- **600 €** för flygningar över 3 500 km\n\n### Juridiska referenser\n- Artikel 7: Ersättningsbelopp — 250€ (<1500km), 400€ (1500–3500km), 600€ (>3500km)\n- Artikel 5: Inställda flygningar\n- Artikel 6: Förseningar — rätt till assistans vid försening över 2 timmar\n- Artikel 9: Rätt till måltider, förfriskningar och inkvartering\n\nRätten gäller det **operativa flygbolaget**, inte researrangören eller bokningsplattformen.\n\n### Svagheter i ditt ärende\nFlygbolaget kan invända att förseningen orsakades av **extraordinära omständigheter** (extremväder, flygledningsbeslut, säkerhetshot) vilket undantar dem från kompensationsskyldighet. Du bör kontrollera om sådana omständigheter förelåg.\n\n### Nästa steg\n1. Kontakta flygbolaget skriftligt med krav på kompensation\n2. Om avslag eller inget svar inom 6 veckor: anmäl till [ARN](https://www.arn.se)${DISCLAIMER}`,
    };
  }

  if (travelType === 'Flyg' && issue === 'Inställt') {
    return {
      sentiment: 'positive',
      assessment: `## Bedömning\n\nDu har troligtvis rätt till ersättning eller åtgärd.\n\nEnligt ${LEGAL_LINKS.eu261} har du vid inställt flyg rätt till:\n1. **Ombokning eller full återbetalning** av biljetten\n2. **Ekonomisk kompensation** (250–600 € beroende på sträcka) om du informerades mindre än 14 dagar före avgång\n3. **Assistans** — mat, dryck och vid behov hotell\n\n### Juridiska referenser\n- Artikel 5: Inställda flygningar — rätt till återbetalning eller ombokning samt ersättning\n- Artikel 7: Ersättningsbelopp\n- Artikel 9: Rätt till måltider, förfriskningar och inkvartering\n\n### Svagheter i ditt ärende\nKompensation utgår inte om du informerades mer än 14 dagar i förväg, eller om flygbolaget kan visa extraordinära omständigheter.\n\n### Nästa steg\n1. Kontakta flygbolaget skriftligt\n2. Vid avslag: anmäl till [ARN](https://www.arn.se)${DISCLAIMER}`,
    };
  }

  if (travelType === 'Tåg' && issue === 'Försening') {
    const hours = parseFloat(delay) || 0;
    const minutes = hours * 60;
    if (minutes < 60) {
      return {
        sentiment: 'negative',
        assessment: `## Bedömning\n\nDu har troligtvis inte rätt till ersättning i detta fall.\n\nEnligt ${LEGAL_LINKS.eu1371} uppstår rätt till ekonomisk ersättning först vid försening över **60 minuter**. Din angivna försening understiger denna gräns.\n\n### Nästa steg\nKontrollera om tågoperatören har egna resegarantier som kan ge viss kompensation även vid kortare förseningar.${DISCLAIMER}`,
      };
    }
    const pct = minutes >= 120 ? '50%' : '25%';
    return {
      sentiment: 'positive',
      assessment: `## Bedömning\n\nDu har troligtvis rätt till ersättning eller åtgärd.\n\nEnligt ${LEGAL_LINKS.eu1371} artikel 17 har du rätt till ersättning med **${pct} av biljettpriset** vid en försening på ${Math.round(minutes)} minuter.\n\n### Juridiska referenser\nArtikel 17: 25% vid försening 60–119 minuter, 50% vid försening över 120 minuter. Gäller internationella tågresor och operatörer som frivilligt tillämpar förordningen (SJ gör det).\n\n### Svagheter i ditt ärende\nOm du reste med en operatör som inte tillämpar EU-förordningen för inrikesresor, kan ersättningen vara lägre eller utebli.\n\n### Nästa steg\n1. Ansök om ersättning direkt via tågoperatörens webbplats\n2. Vid avslag: anmäl till [ARN](https://www.arn.se)${DISCLAIMER}`,
    };
  }

  // Generic travel fallback
  return {
    sentiment: 'uncertain',
    assessment: `## Bedömning\n\nSituationen är oklar — mer information behövs.\n\nBaserat på den information du angett kan vi inte med säkerhet bedöma dina rättigheter. Ditt ärende gäller ${travelType || 'en resa'} med problemet "${issue}". För en mer precis bedömning behöver vi veta mer om omständigheterna.\n\n### Nästa steg\nKontakta transportbolaget skriftligt och beskriv problemet i detalj. Om du inte får ett tillfredsställande svar inom 6 veckor kan du anmäla till [ARN](https://www.arn.se).${DISCLAIMER}`,
  };
}

function analyzeBetalning(answers: Record<string, string>): { assessment: string; sentiment: 'positive' | 'uncertain' | 'negative' } {
  const issue = answers.issue || '';
  const amount = answers.amount || '';
  const parsed = parseFloat(amount.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;

  if (parsed === 0) {
    return {
      sentiment: 'negative',
      assessment: `## Bedömning\n\nDu har troligtvis inte rätt till ersättning i detta fall.\n\nDu har angett ett belopp på 0 kr. Utan ett faktiskt ekonomiskt krav finns det ingen grund att driva ärendet vidare.\n\n**Uppskattad ersättning**\nInget ekonomiskt krav kan beräknas baserat på angiven information.${DISCLAIMER}`,
    };
  }

  if (issue === 'Obehörig transaktion') {
    return {
      sentiment: 'positive',
      assessment: `## Bedömning\n\nDu har troligtvis rätt till ersättning eller åtgärd.\n\nEnligt ${LEGAL_LINKS.betaltjanstlagen} 5 a kap. ska din bank återbetala obehöriga transaktioner. Din självrisk är normalt max **400 kr** om du inte agerat grovt oaktsamt.\n\n### Juridiska referenser\n${LEGAL_LINKS.betaltjanstlagen} 5 a kap. 1–4 §§. Banken ska återbetala beloppet senast nästa bankdag efter att du anmält den obehöriga transaktionen.\n- Du måste rapportera till banken inom **13 månader** från transaktionsdatum\n\n### Uppskattad ersättning\n${parsed} kr minus eventuell självrisk (max 400 kr).\n\n### Svagheter i ditt ärende\nOm banken kan visa att du lämnat ut kortuppgifter eller pinkod genom grov oaktsamhet kan du bli ansvarig för hela beloppet.\n\n### Nästa steg\n1. Anmäl till banken omedelbart om du inte redan gjort det\n2. Polisanmäl bedrägeriet\n3. Om banken avslår: anmäl till [ARN](https://www.arn.se)${DISCLAIMER}`,
    };
  }

  if (issue === 'Vara ej levererad' || issue === 'Vara avviker från beskrivning') {
    return {
      sentiment: 'positive',
      assessment: `## Bedömning\n\nDu har troligtvis rätt till ersättning eller åtgärd.\n\nOm du betalat med kort och varan inte levererats eller väsentligt avviker från beskrivningen, kan du begära **chargeback** via din kortutgivare.\n\n### Juridisk grund\nKortnätverkens konsumentskyddsregler samt Konsumentköplagen (2022:260).\n\n### Uppskattad ersättning\n${parsed} kr.\n\n### Svagheter i ditt ärende\nChargeback har tidsgränser — vanligtvis 120 dagar från köp eller förväntat leveransdatum. Du behöver dokumentation på att du kontaktat säljaren först.\n\n### Nästa steg\n1. Kontakta säljaren skriftligt med krav\n2. Om inget svar inom 14 dagar: kontakta din bank och begär chargeback\n3. Spara all dokumentation${DISCLAIMER}`,
    };
  }

  return {
    sentiment: 'uncertain',
    assessment: `## Bedömning\n\nSituationen är oklar — mer information behövs.\n\nDu har angett "${issue}" med ett belopp på ${parsed} kr, men det framgår inte tillräckligt tydligt om det rör sig om en obehörig transaktion eller ett köp du själv genomfört. Betaltjänstlagen skyddar mot **obehöriga** transaktioner — inte mot köp du är missnöjd med i efterhand.\n\n### Nästa steg\nFörtydliga om transaktionen genomfördes av dig eller utan ditt godkännande. Det avgör vilken lag som är tillämplig.${DISCLAIMER}`,
  };
}

function analyzeKopEhandel(answers: Record<string, string>): { assessment: string; sentiment: 'positive' | 'uncertain' | 'negative' } {
  const issue = answers.issue || '';
  const purchaseDate = answers.purchase_date || '';

  // STRICT: Check 3-year reklamation deadline
  if (purchaseDate && yearsBetween(purchaseDate) > 3) {
    return {
      sentiment: 'negative',
      assessment: `## Bedömning\n\nDu har troligtvis inte rätt till reklamation — reklamationsrätten på tre år har löpt ut enligt Konsumentköplagen 32 §.\n\n### Beräkning\nKöpet gjordes ${purchaseDate}, vilket är ${formatElapsed(purchaseDate)} sedan. Reklamationsrätten löpte ut 3 år efter köpdatumet. Denna situation **faller utanför** reklamationsrätten.\n\n### Nästa steg\nOm du har en separat garanti från tillverkaren som fortfarande är giltig, kontrollera garantivillkoren. Den lagstadgade reklamationsrätten kan dock inte längre tillämpas.${DISCLAIMER}`,
    };
  }

  if (issue === 'Ångerrätt') {
    if (purchaseDate) {
      const daysSincePurchase = daysBetween(purchaseDate);
      if (daysSincePurchase > 14) {
        return {
          sentiment: 'negative',
          assessment: `## Bedömning\n\nDu har troligtvis inte rätt till ångerrätt i detta fall.\n\nEnligt Distansavtalslagen (2005:59) 14 § gäller ångerrätten i **14 dagar** från det att du mottog varan. Det har gått ${daysSincePurchase} dagar sedan köpet, vilket innebär att ångerfristen har löpt ut.\n\n### Svagheter i ditt ärende\nÅngerrätten är absolut — efter 14 dagar kan säljaren neka utan juridisk grund för krav.\n\n### Nästa steg\nOm varan är felaktig kan du istället reklamera enligt Konsumentköplagen. Reklamationsrätten gäller i 3 år.${DISCLAIMER}`,
        };
      }
    }
    return {
      sentiment: 'positive',
      assessment: `## Bedömning\n\nDu har troligtvis rätt till ersättning eller åtgärd.\n\nEnligt Distansavtalslagen (2005:59) 14 § har du **14 dagars ångerrätt** vid köp på distans (online, telefon). Du kan returnera varan utan att ange skäl.\n\n### Juridisk grund\nDistansavtalslagen 14 §. Säljaren ska återbetala inom 14 dagar efter att de mottagit den returnerade varan.\n\n### Svagheter i ditt ärende\nUndantag finns för bland annat: specialtillverkade varor, förseglad mjukvara/hygienartiklar som öppnats, och digitalt innehåll om nedladdning påbörjats.\n\n### Nästa steg\n1. Meddela säljaren skriftligt att du vill använda din ångerrätt\n2. Returnera varan inom 14 dagar${DISCLAIMER}`,
    };
  }

  // Default reklamation with burden-of-proof note
  let burdenNote = '';
  if (purchaseDate && yearsBetween(purchaseDate) > 2) {
    burdenNote = '\n\n### Viktigt om bevisbörda\nEftersom köpet gjordes för mer än 2 år sedan har **bevisbördan skiftat till dig**. Du behöver kunna visa att felet var ursprungligt och inte beror på normalt slitage eller felaktig användning.';
  }

  return {
    sentiment: 'positive',
    assessment: `## Bedömning\n\nDu har troligtvis rätt att reklamera produkten.\n\nEnligt Konsumentköplagen (2022:260) har du **3 års reklamationsrätt**. Fel som visar sig inom 2 år anses vara ursprungliga — säljaren har bevisbördan.\n\n### Juridisk grund\nKonsumentköplagen 4 kap. 1–3 §§. Du har rätt till avhjälpande, omleverans, prisavdrag eller hävning.${burdenNote}\n\n### Svagheter i ditt ärende\nOm felet beror på normalt slitage eller felaktig användning kan reklamationen avslås. Säljaren kan försöka hävda att felet uppstått efter köpet.\n\n### Nästa steg\n1. Kontakta säljaren skriftligt med reklamation\n2. Säljaren bekostar returtransport\n3. Om säljaren vägrar: anmäl till [ARN](https://www.arn.se)${DISCLAIMER}`,
  };
}

function analyzeAbonnemang(answers: Record<string, string>): { assessment: string; sentiment: 'positive' | 'uncertain' | 'negative' } {
  const issue = answers.issue || '';
  const hasProof = answers.written_confirmation || answers.cancellation_proof || '';

  if (issue === 'Fortsätter debitera efter uppsägning') {
    if (hasProof === 'Nej') {
      return {
        sentiment: 'uncertain',
        assessment: `## Bedömning\n\nSituationen är oklar — mer information behövs.\n\nDu anger att företaget fortsätter debitera efter uppsägning, men du har ingen skriftlig bekräftelse på uppsägningen. Utan bevis på att uppsägning skett blir det svårt att driva kravet.\n\n### Juridisk grund\nDistansavtalslagen (2005:59) 25 § kräver att tjänsteleverantören bekräftar uppsägning skriftligt. Avtalslagen 36 § kan tillämpas om villkoren anses oskäliga.\n\n### Svagheter i ditt ärende\nUtan dokumentation på uppsägning kan företaget hävda att abonnemanget fortfarande löper. Bevisbördan ligger på dig.\n\n### Nästa steg\n1. Säg upp skriftligt igen och spara bekräftelsen\n2. Kontakta din bank för att stoppa autogiro/kortdragning\n3. Kräv återbetalning från datumet du kan bevisa uppsägning${DISCLAIMER}`,
      };
    }
    return {
      sentiment: 'positive',
      assessment: `## Bedömning\n\nDu har troligtvis rätt till ersättning eller åtgärd.\n\nOm du har skriftlig bekräftelse på uppsägning har företaget ingen rätt att fortsätta debitera. Alla belopp debiterade efter uppsägningsdatumet ska återbetalas.\n\n### Juridisk grund\nDistansavtalslagen (2005:59) 25 § — uppsägning ska bekräftas skriftligt. Avtalslagen 36 § — oskäliga villkor kan jämkas.\n\n### Svagheter i ditt ärende\nFöretaget kan hävda att uppsägningstiden inte löpt ut. Kontrollera avtalsvillkoren.\n\n### Nästa steg\n1. Skicka skriftligt krav med kopia av uppsägningsbekräftelsen\n2. Sätt 14 dagars tidsfrist\n3. Kontakta banken för att stoppa framtida debiteringar\n4. Vid utebliven respons: anmäl till [ARN](https://www.arn.se)${DISCLAIMER}`,
    };
  }

  if (issue === 'Kan inte säga upp') {
    return {
      sentiment: 'positive',
      assessment: `## Bedömning\n\nDu har troligtvis rätt till åtgärd.\n\nEnligt Lagen om avtalsvillkor i konsumentförhållanden (1994:1512) 3 § är villkor som gör det orimligt svårt att säga upp ett abonnemang potentiellt **ogiltiga**.\n\n### Juridisk grund\nAvtalsvillkorslagen 3 § samt Avtalslagen 36 § om oskäliga avtalsvillkor.\n\n### Nästa steg\n1. Säg upp skriftligt via e-post och behåll bekräftelse\n2. Om företaget hindrar uppsägning: anmäl till [Konsumentverket](https://www.konsumentverket.se)\n3. Kontakta banken för att stoppa framtida betalningar${DISCLAIMER}`,
    };
  }

  return {
    sentiment: 'uncertain',
    assessment: `## Bedömning\n\nSituationen är oklar — mer information behövs.\n\nDitt ärende gäller "${issue}". Vi behöver mer information om de specifika omständigheterna för att kunna bedöma dina rättigheter.\n\n### Nästa steg\nKontakta företaget skriftligt och beskriv problemet. Sätt en tidsfrist på 14 dagar.${DISCLAIMER}`,
  };
}

function analyzeHantverkare(answers: Record<string, string>): { assessment: string; sentiment: 'positive' | 'uncertain' | 'negative' } {
  const contacted = answers.contacted || '';
  const defect = answers.defect || '';
  const workDate = answers.work_date || '';

  // Check 3-year deadline for konsumenttjänstlagen
  if (workDate && yearsBetween(workDate) > 3) {
    return {
      sentiment: 'negative',
      assessment: `## Bedömning\n\nDu har troligtvis inte rätt till reklamation — reklamationsfristen har löpt ut.\n\n### Beräkning\nArbetet utfördes ${workDate}, vilket är ${formatElapsed(workDate)} sedan. Enligt Konsumenttjänstlagen (1985:716) måste reklamation ske inom **3 år** från det att uppdraget avslutades. Denna situation **faller utanför** reklamationsfristen.${DISCLAIMER}`,
    };
  }

  if (!defect || defect.trim().length < 10) {
    return {
      sentiment: 'uncertain',
      assessment: `## Bedömning\n\nSituationen är oklar — mer information behövs.\n\nDu har inte beskrivit tillräckligt detaljerat vad felet är. Konsumenttjänstlagen (1985:716) kräver att felet avviker från **fackmässig standard** — inte bara från dina personliga preferenser.\n\n### Nästa steg\nBeskriv exakt vad som är felaktigt med det utförda arbetet och hur det avviker från vad som avtalades.${DISCLAIMER}`,
    };
  }

  if (contacted && contacted.toLowerCase().includes('nej')) {
    return {
      sentiment: 'uncertain',
      assessment: `## Bedömning\n\nDu har sannolikt rättigheter, men du behöver ge hantverkaren möjlighet att avhjälpa felet först.\n\nEnligt Konsumenttjänstlagen (1985:716) 20 § har hantverkaren rätt att **avhjälpa felet** innan du kan kräva prisavdrag eller hävning. Du måste därför kontakta hantverkaren och ge dem en rimlig tidsfrist.\n\n### Juridisk grund\nKonsumenttjänstlagen 4 § (fackmässighet), 20 § (avhjälpande), 16 § (rätt att hålla inne betalning).\n\n### Nästa steg\n1. Kontakta hantverkaren skriftligt och beskriv felet\n2. Ge en rimlig tidsfrist (2–4 veckor) för avhjälpande\n3. Du har rätt att hålla inne del av betalningen som säkerhet${DISCLAIMER}`,
    };
  }

  return {
    sentiment: 'positive',
    assessment: `## Bedömning\n\nDu har troligtvis rätt till ersättning eller åtgärd.\n\nEnligt Konsumenttjänstlagen (1985:716) ska arbetet utföras fackmässigt (4 §). Om resultatet avviker från fackmässig standard föreligger ett fel (9 §).\n\n### Juridisk grund\n- 4 §: Fackmässighet\n- 16 §: Rätt att hålla inne betalning\n- 20 §: Rätt till avhjälpande utan kostnad\n- 21 §: Prisavdrag om avhjälpande inte sker inom skälig tid\n- 22 §: Hävning vid väsentligt fel\n\n### Svagheter i ditt ärende\nMotparten kan hävda att arbetet utförts fackmässigt och att resultatet uppfyller avtalet. Det kan krävas en oberoende besiktning.\n\n### Nästa steg\n1. Dokumentera felet med foton\n2. Skicka skriftligt krav på avhjälpande\n3. Sätt rimlig tidsfrist (2–4 veckor)\n4. Om de vägrar: anmäl till [ARN](https://www.arn.se)${DISCLAIMER}`,
  };
}

function analyzeHyra(answers: Record<string, string>): { assessment: string; sentiment: 'positive' | 'uncertain' | 'negative' } {
  const issue = answers.issue || '';

  if (issue === 'Överhyra i andrahand') {
    return {
      sentiment: 'positive',
      assessment: `## Bedömning\n\nDu har troligtvis rätt till ersättning eller åtgärd.\n\nEnligt Hyreslagen (12 kap. Jordabalken) är max tillåtet påslag vid andrahandsuthyrning **15% på förstahandshyran**. Överskjutande belopp kan krävas tillbaka **upp till 3 år bakåt**.\n\n### Juridisk grund\n12 kap. 55 c–d §§ Jordabalken.\n\n### Svagheter i ditt ärende\nDu behöver veta förstahandshyran för att beräkna överhyran. Utan den uppgiften kan inte Hyresnämnden fastställa exakt belopp.\n\n### Nästa steg\n1. Kontakta Hyresnämnden i din region\n2. Ansök om prövning av hyrans skälighet\n3. Begär återbetalning av överskjutande hyra${DISCLAIMER}`,
    };
  }

  return {
    sentiment: 'uncertain',
    assessment: `## Bedömning\n\nSituationen är oklar — mer information behövs.\n\nHyresmål kan vara komplicerade och beror på omständigheterna. Ange mer detaljer om din situation för en mer precis bedömning.\n\n### Nästa steg\nKontakta [Hyresnämnden](https://www.domstol.se/hyres-och-arrendenamnden/) för en kostnadsfri prövning av ditt ärende.${DISCLAIMER}`,
  };
}

function analyzeBilkop(answers: Record<string, string>): { assessment: string; sentiment: 'positive' | 'uncertain' | 'negative' } {
  const sellerType = answers.seller_type || '';
  const purchaseDate = answers.purchase_date || '';

  // Check 3-year deadline for dealer purchases
  if (sellerType === 'Handlare' && purchaseDate && yearsBetween(purchaseDate) > 3) {
    return {
      sentiment: 'negative',
      assessment: `## Bedömning\n\nDu har troligtvis inte rätt till reklamation — reklamationsrätten på tre år har löpt ut enligt Konsumentköplagen 32 §.\n\n### Beräkning\nKöpet gjordes ${purchaseDate}, vilket är ${formatElapsed(purchaseDate)} sedan. Reklamationsrätten löpte ut 3 år efter köpdatumet. Denna situation **faller utanför** reklamationsrätten.${DISCLAIMER}`,
    };
  }

  if (sellerType === 'Privatperson') {
    return {
      sentiment: 'uncertain',
      assessment: `## Bedömning\n\nSituationen är oklar — privatköp ger väsentligt sämre skydd.\n\nVid köp av bil från privatperson gäller **Köplagen (1990:931)**, inte Konsumentköplagen. Vid köp i "befintligt skick" (vanligt vid privatköp) krävs att felet **väsentligt avviker** från vad du som köpare kunde förutsätta.\n\n### Juridisk grund\nKöplagen 17–19 §§. Bevisbördan ligger på dig som köpare.\n\n### Svagheter i ditt ärende\nPrivatköp i befintligt skick innebär höga krav på vad du som köpare borde ha undersökt innan köpet. Undersökningsplikten är omfattande.\n\n### Nästa steg\n1. Dokumentera felet — gärna med oberoende besiktningsprotokoll\n2. Kontakta säljaren skriftligt med krav\n3. Vid tvist: tingsrätten (ARN prövar inte privatköp)${DISCLAIMER}`,
    };
  }

  return {
    sentiment: 'positive',
    assessment: `## Bedömning\n\nDu har troligtvis rätt till ersättning eller åtgärd.\n\nVid köp av bil från bilhandlare gäller **Konsumentköplagen (2022:260)**. Du har 3 års reklamationsrätt och fel som visar sig inom 2 år presumeras ha funnits vid köpet.\n\n### Juridisk grund\nKonsumentköplagen 4 kap. Säljaren har bevisbördan de första 2 åren.\n\n### Svagheter i ditt ärende\nSäljaren kan hävda normalt slitage, att felet uppstått efter leverans, eller att du kände till felet vid köpet.\n\n### Nästa steg\n1. Reklamera skriftligt till bilhandlaren\n2. Begär avhjälpande i första hand\n3. Vid avslag: anmäl till [ARN](https://www.arn.se)${DISCLAIMER}`,
  };
}

function analyzeGaranti(answers: Record<string, string>): { assessment: string; sentiment: 'positive' | 'uncertain' | 'negative' } {
  const purchaseDate = answers.purchase_date || '';

  // Check 3-year reklamation deadline
  if (purchaseDate && yearsBetween(purchaseDate) > 3) {
    return {
      sentiment: 'negative',
      assessment: `## Bedömning\n\nDu har troligtvis inte rätt till reklamation — reklamationsrätten på tre år har löpt ut enligt Konsumentköplagen 32 §.\n\n### Beräkning\nKöpet gjordes ${purchaseDate}, vilket är ${formatElapsed(purchaseDate)} sedan. Reklamationsrätten löpte ut 3 år efter köpdatumet. Denna situation **faller utanför** reklamationsrätten.\n\nOm du har en separat garanti från tillverkaren som fortfarande är giltig, kontrollera garantivillkoren separat.${DISCLAIMER}`,
    };
  }

  return {
    sentiment: 'uncertain',
    assessment: `## Bedömning\n\nSituationen är oklar — det beror på garantivillkoren och felets natur.\n\nGaranti är ett **frivilligt åtagande** från säljaren — vad som täcks beror helt på garantivillkoren. Separat från garantin har du **3 års reklamationsrätt** enligt Konsumentköplagen (2022:260).\n\n### Viktigt att skilja på\n- **Garanti**: Frivilligt åtagande — kontrollera villkoren noga\n- **Reklamationsrätt**: Lagstadgad i 3 år oavsett garanti\n- **Dolda fel (fastighet)**: Jordabalken 4 kap 19 § — helt annan lagstiftning\n\n### Svagheter i ditt ärende\nOm felet beror på normal förslitning, felaktig användning, eller inte täcks av garantivillkoren, kan kravet sakna grund.\n\n### Nästa steg\n1. Kontrollera garantivillkoren noggrant\n2. Om felet uppstått inom 2 år: reklamera oavsett garanti\n3. Kontakta säljaren skriftligt${DISCLAIMER}`,
  };
}

function analyzeLeverans(answers: Record<string, string>): { assessment: string; sentiment: 'positive' | 'uncertain' | 'negative' } {
  const issue = answers.issue || '';

  if (issue === 'Försenat' || issue === 'Borttappat') {
    return {
      sentiment: 'positive',
      assessment: `## Bedömning\n\nDu har troligtvis rätt till ersättning eller åtgärd.\n\nEnligt Konsumentköplagen (2022:260) ansvarar **säljaren** för varan tills den levererats till dig. Om paketet är försenat eller försvunnet har du rätt att kräva ny leverans eller häva köpet.\n\n### Juridisk grund\nKonsumentköplagen 2 kap 5 § (riskens övergång) samt Distansavtalslagen.\n\n### Svagheter i ditt ärende\nSäljaren kan hävda att leverans skett om de har spårningsbevis. Kontrollera spårningsinformationen.\n\n### Nästa steg\n1. Kontakta säljaren — inte transportföretaget (säljaren ansvarar)\n2. Kräv ny leverans eller återbetalning\n3. Sätt 14 dagars tidsfrist${DISCLAIMER}`,
    };
  }

  return {
    sentiment: 'uncertain',
    assessment: `## Bedömning\n\nSituationen är oklar — mer information behövs.\n\nDitt ärende gäller "${issue}". Vi behöver mer detaljer för en säker bedömning. Har du kontaktat säljaren? Vad svarade de?\n\n### Nästa steg\nKontakta säljaren (inte transportföretaget) skriftligt.${DISCLAIMER}`,
  };
}

export function getMockAssessment(category: Category, answers: Record<string, string>): {
  assessment: string;
  sentiment: 'positive' | 'uncertain' | 'negative';
} {
  switch (category.id) {
    case 'resor': return analyzeResor(answers);
    case 'betalning-aterkrav': return analyzeBetalning(answers);
    case 'kop-ehandel': return analyzeKopEhandel(answers);
    case 'abonnemang': return analyzeAbonnemang(answers);
    case 'hantverkare': return analyzeHantverkare(answers);
    case 'hyra': return analyzeHyra(answers);
    case 'bilkop': return analyzeBilkop(answers);
    case 'garanti-dolda-fel': return analyzeGaranti(answers);
    case 'leverans': return analyzeLeverans(answers);
    default:
      return {
        sentiment: 'uncertain',
        assessment: `## Bedömning\n\nSituationen är oklar — mer information behövs.\n\nVi kunde inte matcha ditt ärende mot en specifik juridisk bedömning. Beskriv din situation mer detaljerat.${DISCLAIMER}`,
      };
  }
}

// --- Letter generation (email format, conversational, no Q&A lists) ---

function synthesizeSituation(category: Category, answers: Record<string, string>): string {
  const id = category.id;

  if (id === 'resor') {
    const type = answers.travel_type || 'resa';
    const company = answers.company || 'transportbolaget';
    const date = answers.date || '';
    const issue = answers.issue || '';
    const delay = answers.delay_duration || '';
    let desc = `Den ${date || '[datum]'} reste jag med ${company}`;
    if (issue === 'Försening') desc += ` och drabbades av en försening${delay ? ` på ${delay}` : ''}`;
    else if (issue === 'Inställt') desc += ` men ${type === 'Flyg' ? 'flyget' : 'resan'} ställdes in`;
    else if (issue === 'Överbookning') desc += ` men nekades ombordstigning på grund av överbookning`;
    else desc += ` och upplevde problem (${issue})`;
    desc += '.';
    return desc;
  }

  if (id === 'kop-ehandel') {
    const product = answers.product_type || 'produkten';
    const date = answers.purchase_date || '';
    const place = answers.purchase_place === 'Online' ? 'online' : 'i butik';
    const defect = answers.defect || 'ett fel';
    return `Den ${date || '[datum]'} köpte jag en ${product} ${place}. Efter leverans upptäckte jag ${defect}.`;
  }

  if (id === 'garanti-dolda-fel') {
    const product = answers.product || 'produkten';
    const date = answers.purchase_date || '';
    const problem = answers.problem || 'ett problem';
    return `Den ${date || '[datum]'} köpte jag en ${product}. Jag har nu upptäckt ${problem}.`;
  }

  if (id === 'leverans') {
    const orderDate = answers.order_date || '';
    const issue = answers.issue || 'problem med leveransen';
    return `Jag beställde en vara${orderDate ? ` (${orderDate})` : ''} och har drabbats av ${issue === 'Försenat' ? 'försenad leverans' : issue === 'Skadat' ? 'en skadad leverans' : 'att paketet försvunnit'}.`;
  }

  if (id === 'betalning-aterkrav') {
    const amount = answers.amount || '[belopp]';
    const issue = answers.issue || 'en felaktig transaktion';
    return `Jag har drabbats av ${issue} till ett belopp om ${amount} kr.`;
  }

  if (id === 'abonnemang') {
    const service = answers.service_type || 'en tjänst';
    const issue = answers.issue || '';
    const date = answers.problem_date || '';
    const totalAmount = answers.total_amount || '';
    if (issue === 'Fortsätter debitera efter uppsägning') {
      return `Jag sade upp mitt abonnemang för ${service.toLowerCase()}${date ? ` den ${date}` : ''}, men ni har fortsatt debitera mig${totalAmount ? ` med totalt ${totalAmount} kr` : ''} efter uppsägningen.`;
    }
    return `Jag har problem med mitt abonnemang för ${service.toLowerCase()}${date ? ` sedan ${date}` : ''}: ${issue.toLowerCase()}.`;
  }

  if (id === 'bilkop') {
    const carType = answers.car_type || '';
    const date = answers.purchase_date || '';
    const defect = answers.defect || 'ett fel';
    return `Den ${date || '[datum]'} köpte jag en ${carType === 'Begagnad' ? 'begagnad' : 'ny'} bil. Jag har nu upptäckt ${defect}.`;
  }

  if (id === 'hyra') {
    const rentalType = answers.rental_type || '';
    const rent = answers.rent_amount || '';
    const issue = answers.issue || 'problem med hyresvillkoren';
    return `Jag hyr en bostad i ${rentalType === 'Andrahand' ? 'andrahand' : 'förstahand'}${rent ? ` med en månadshyra på ${rent} kr` : ''}. ${issue}.`;
  }

  if (id === 'hantverkare') {
    const serviceType = answers.service_type || 'hantverksarbete';
    const date = answers.work_date || '';
    const defect = answers.defect || 'fel i utförandet';
    return `Jag anlitade er för ${serviceType.toLowerCase()}${date ? ` som utfördes den ${date}` : ''}. Jag har konstaterat ${defect}.`;
  }

  // Fallback
  const parts = category.questions.filter(q => answers[q.id]).map(q => answers[q.id]);
  return parts.join('. ') || 'Nedanstående händelse.';
}

function getRemedyPhrase(categoryId: string, answers: Record<string, string>): string {
  if (categoryId === 'kop-ehandel' || categoryId === 'garanti-dolda-fel') {
    return 'Jag skulle uppskatta om vi kan hitta en lösning, förslagsvis genom reparation eller byte av varan. Om detta inte är möjligt ser jag gärna att vi diskuterar en annan lösning, exempelvis prisavdrag eller återbetalning.';
  }
  if (categoryId === 'resor') {
    const amount = answers.amount || '';
    return `Jag begär den ersättning jag har rätt till enligt tillämplig förordning${amount ? ` — ${amount}` : ''}. Jag är öppen för ersättning via banköverföring eller voucher av motsvarande värde.`;
  }
  if (categoryId === 'abonnemang') {
    const totalAmount = answers.total_amount || '';
    return `Jag begär återbetalning av de felaktigt debiterade beloppen${totalAmount ? ` om totalt ${totalAmount} kr` : ''} samt att inga ytterligare debiteringar sker.`;
  }
  if (categoryId === 'hantverkare') {
    return 'Jag vill i första hand att ni avhjälper felet utan kostnad, i enlighet med er skyldighet enligt konsumenttjänstlagen. Om avhjälpande inte kan ske inom skälig tid ser jag gärna att vi diskuterar prisavdrag.';
  }
  if (categoryId === 'hyra') {
    return 'Jag begär att hyran justeras till en skälig nivå och att eventuellt överskjutande belopp återbetalas.';
  }
  if (categoryId === 'bilkop') {
    return 'Jag begär i första hand avhjälpande av felet. Om detta inte är möjligt inom skälig tid önskar jag diskutera prisavdrag eller hävning av köpet.';
  }
  if (categoryId === 'betalning-aterkrav') {
    const amount = answers.amount || '';
    return `Jag begär att beloppet${amount ? ` om ${amount} kr` : ''} återbetalas till mitt konto.`;
  }
  if (categoryId === 'leverans') {
    return 'Jag begär att ni antingen skickar varan på nytt utan extra kostnad eller återbetalar hela köpesumman.';
  }
  return 'Jag hoppas att vi kan lösa detta på ett smidigt sätt.';
}

function getLegalRef(categoryId: string, answers: Record<string, string>): string {
  if (categoryId === 'resor') {
    const t = answers.travel_type || '';
    if (t === 'Flyg') return 'EU-förordning 261/2004 om flygpassagerares rättigheter';
    if (t === 'Tåg') return 'EU-förordning 1371/2007 om tågresenärers rättigheter';
    if (t === 'Buss') return 'EU-förordning 181/2011 om busspassagerares rättigheter';
    if (t === 'Färja') return 'EU-förordning 1177/2010 om sjöpassagerares rättigheter';
    return 'tillämpliga EU-förordningar och svensk konsumentlagstiftning';
  }
  if (categoryId === 'kop-ehandel' || categoryId === 'garanti-dolda-fel') return 'Konsumentköplagen (2022:260)';
  if (categoryId === 'leverans') return 'Konsumentköplagen (2022:260) samt Distansavtalslagen (2005:59)';
  if (categoryId === 'betalning-aterkrav') return 'Betaltjänstlagen (2010:751)';
  if (categoryId === 'abonnemang') return 'Distansavtalslagen (2005:59) samt Avtalslagen (1915:218) 36 §';
  if (categoryId === 'bilkop') return answers.seller_type === 'Privatperson' ? 'Köplagen (1990:931)' : 'Konsumentköplagen (2022:260)';
  if (categoryId === 'hyra') return 'Hyreslagen (12 kap. Jordabalken)';
  if (categoryId === 'hantverkare') return 'Konsumenttjänstlagen (1985:716)';
  return 'gällande konsumentlagstiftning';
}

function getAuthority(categoryId: string): string {
  if (categoryId === 'hyra') return 'Hyresnämnden';
  if (categoryId === 'betalning-aterkrav') return 'Finansinspektionen och ARN';
  return 'Allmänna reklamationsnämnden (ARN)';
}

export function getMockLetter(category: Category, answers: Record<string, string>, assessment: string, profile?: UserProfile): string {
  const today = new Date();
  const todayStr = today.toLocaleDateString('sv-SE');
  const deadline = new Date(today);
  deadline.setDate(deadline.getDate() + 14);
  const deadlineStr = deadline.toLocaleDateString('sv-SE');

  const name = profile?.fullName || '[DITT NAMN]';
  const email = profile?.email || '[DIN E-POST]';
  const phone = profile?.phone || '';
  const counterparty = profile?.counterparty || answers.company || answers.bank || '[MOTPARTENS FÖRETAGSNAMN]';

  const situation = synthesizeSituation(category, answers);
  const legalRef = getLegalRef(category.id, answers);
  const remedy = getRemedyPhrase(category.id, answers);
  const authority = getAuthority(category.id);

  // Build subject line
  let subject = 'Reklamation';
  if (category.id === 'resor') subject = `Krav på ersättning — ${answers.travel_type || 'resa'} den ${answers.date || '[datum]'}`;
  else if (category.id === 'kop-ehandel') subject = `Reklamation — ${answers.product_type || 'produkt'} köpt ${answers.purchase_date || '[datum]'}`;
  else if (category.id === 'abonnemang') subject = `Felaktig debitering — ${answers.service_type || 'abonnemang'}`;
  else if (category.id === 'hantverkare') subject = `Reklamation — ${answers.service_type || 'hantverksarbete'}`;
  else if (category.id === 'bilkop') subject = `Reklamation — bilköp ${answers.purchase_date || ''}`;
  else if (category.id === 'hyra') subject = 'Hyresvillkor — begäran om justering';
  else if (category.id === 'betalning-aterkrav') subject = `Bestridande av transaktion — ${answers.amount || ''} kr`;
  else if (category.id === 'leverans') subject = `Reklamation — ${answers.issue === 'Försenat' ? 'försenad leverans' : answers.issue === 'Skadat' ? 'skadad leverans' : 'utebliven leverans'}`;
  else if (category.id === 'garanti-dolda-fel') subject = `Reklamation — ${answers.product || 'produkt'}`;

  const contactLine = [email, phone].filter(Boolean).join(' | ');

  return `Till: ${counterparty}
Ämne: ${subject}

Hej,

Med anledning av nedan beskriven situation vänder jag mig till er. ${situation}

${answers.contacted_seller === 'Ja' || answers.contacted === 'Ja' ? 'Jag har redan varit i kontakt med er angående detta, men vi har tyvärr inte kunnat nå en lösning.' : 'Jag har inte tidigare kontaktat er skriftligt i detta ärende och hoppas att vi kan lösa det smidigt.'}

Enligt ${legalRef} har jag som konsument rätt till åtgärd i denna situation. Lagstiftningen är tydlig med att ${category.id === 'hantverkare' ? 'en tjänst ska utföras fackmässigt och att avvikelser utgör fel som ger rätt till avhjälpande' : category.id === 'kop-ehandel' || category.id === 'garanti-dolda-fel' ? 'en vara ska vara felfri vid leverans, och att fel som visar sig inom två år presumeras ha funnits vid köptillfället' : category.id === 'resor' ? 'passagerare har rätt till ersättning vid förseningar och inställda avgångar som överstiger de lagstadgade gränserna' : category.id === 'abonnemang' ? 'en konsument har rätt att säga upp ett avtal och att debiteringar efter uppsägning saknar rättslig grund' : 'konsumenten har rätt till ersättning eller åtgärd när avtalet inte uppfyllts'}.

${remedy}

Jag hoppas på ett svar från er senast den ${deadlineStr}. Om vi inte kan nå en lösning inom den tidsramen kommer jag att överväga att anmäla ärendet till ${authority} för prövning.

Med vänliga hälsningar,
${name}
${contactLine}`;
}
