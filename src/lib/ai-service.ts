import { type Category } from '@/lib/categories';

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
  const descriptionFields = ['description', 'problem', 'what_happened', 'issue'];
  for (const fieldId of descriptionFields) {
    const val = answers[fieldId];
    if (val !== undefined && val.trim().length < 30) {
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

export function buildAssessmentPrompt(category: Category, answers: Record<string, string>): string {
  const situationParts = category.questions.map(q => `${q.label} ${answers[q.id] || 'Ej angivet'}`);
  return situationParts.join('\n');
}

function analyzeResor(answers: Record<string, string>): { assessment: string; sentiment: 'positive' | 'uncertain' | 'negative' } {
  const travelType = answers.travel_type || '';
  const issue = answers.issue || '';
  const delay = answers.delay_hours || '';

  if (!issue || issue === 'Annat') {
    return {
      sentiment: 'uncertain',
      assessment: `## Bedömning\n\nSituationen är oklar — mer information behövs.\n\nDu har angett "${issue || 'inget specifikt problem'}" men inte beskrivit tillräckligt vad som gått fel. För att kunna bedöma dina rättigheter behöver vi veta exakt vad som hänt och vilken konkret skada du lidit.\n\n**Nästa steg**\nFörsök ange specifikt vad som gick fel — var resan försenad, inställd, eller avvek den från det som utlovats?\n\n*OBS: Detta är juridisk vägledning baserad på angiven information och gällande lagstiftning. Det ersätter inte rådgivning från en jurist. Vid komplexa ärenden rekommenderas kontakt med Konsumentverket eller en kvalificerad jurist.*`,
    };
  }

  if (travelType === 'Flyg' && issue === 'Försening') {
    const hours = parseFloat(delay) || 0;
    if (hours < 3) {
      return {
        sentiment: 'negative',
        assessment: `## Bedömning\n\nDu har troligtvis inte rätt till ersättning i detta fall.\n\nEnligt EU-förordning 261/2004 uppstår rätt till ekonomisk kompensation först när ankomsten till slutdestinationen är försenad med **mer än 3 timmar**. Du har angett en försening på ${hours} timmar, vilket understiger tröskeln.\n\n### Svagheter i ditt ärende\nFörseningar under 3 timmar ger inte rätt till standardiserad kompensation enligt förordningen, även om de är irriterande.\n\n### Nästa steg\nOm flygbolaget erbjöd mat, dryck eller annan assistans som uteblev, kan du ha rätt till ersättning för utlägg du haft under väntetiden.\n\n*OBS: Detta är juridisk vägledning baserad på angiven information och gällande lagstiftning. Det ersätter inte rådgivning från en jurist. Vid komplexa ärenden rekommenderas kontakt med Konsumentverket eller en kvalificerad jurist.*`,
      };
    }
    return {
      sentiment: 'positive',
      assessment: `## Bedömning\n\nDu har troligtvis rätt till ersättning eller åtgärd.\n\nEnligt EU-förordning 261/2004 har du rätt till ekonomisk kompensation vid flygförsening över 3 timmar. Beroende på flygdistansen kan ersättningen vara:\n- **250 €** för flygningar upp till 1 500 km\n- **400 €** för flygningar inom EU över 1 500 km eller andra flygningar 1 500–3 500 km\n- **600 €** för flygningar över 3 500 km\n\n### Juridisk grund\nArtikel 7 i EU-förordning 261/2004 om kompensation. Rätten gäller det **operativa flygbolaget**, inte researrangören eller bokningsplattformen.\n\n### Svagheter i ditt ärende\nFlygbolaget kan invända att förseningen orsakades av **extraordinära omständigheter** (extremväder, flygledningsbeslut, säkerhetshot) vilket undantar dem från kompensationsskyldighet. Du bör kontrollera om sådana omständigheter förelåg.\n\n### Nästa steg\n1. Kontakta flygbolaget skriftligt med krav på kompensation\n2. Om avslag eller inget svar inom 6 veckor: anmäl till [ARN](https://www.arn.se)\n\n*OBS: Detta är juridisk vägledning baserad på angiven information och gällande lagstiftning. Det ersätter inte rådgivning från en jurist. Vid komplexa ärenden rekommenderas kontakt med Konsumentverket eller en kvalificerad jurist.*`,
    };
  }

  if (travelType === 'Flyg' && issue === 'Inställt') {
    return {
      sentiment: 'positive',
      assessment: `## Bedömning\n\nDu har troligtvis rätt till ersättning eller åtgärd.\n\nEnligt EU-förordning 261/2004 har du vid inställt flyg rätt till:\n1. **Ombokning eller full återbetalning** av biljetten\n2. **Ekonomisk kompensation** (250–600 € beroende på sträcka) om du informerades mindre än 14 dagar före avgång\n3. **Assistans** — mat, dryck och vid behov hotell\n\n### Svagheter i ditt ärende\nKompensation utgår inte om du informerades mer än 14 dagar i förväg, eller om flygbolaget kan visa extraordinära omständigheter.\n\n### Nästa steg\n1. Kontakta flygbolaget skriftligt\n2. Vid avslag: anmäl till [ARN](https://www.arn.se)\n\n*OBS: Detta är juridisk vägledning baserad på angiven information och gällande lagstiftning. Det ersätter inte rådgivning från en jurist. Vid komplexa ärenden rekommenderas kontakt med Konsumentverket eller en kvalificerad jurist.*`,
    };
  }

  if (travelType === 'Tåg' && issue === 'Försening') {
    const hours = parseFloat(delay) || 0;
    const minutes = hours * 60;
    if (minutes < 60) {
      return {
        sentiment: 'negative',
        assessment: `## Bedömning\n\nDu har troligtvis inte rätt till ersättning i detta fall.\n\nEnligt EU-förordning 1371/2007 uppstår rätt till ekonomisk ersättning först vid försening över **60 minuter**. Din angivna försening understiger denna gräns.\n\n### Nästa steg\nKontrollera om tågoperatören har egna resegarantier som kan ge viss kompensation även vid kortare förseningar.\n\n*OBS: Detta är juridisk vägledning baserad på angiven information och gällande lagstiftning. Det ersätter inte rådgivning från en jurist. Vid komplexa ärenden rekommenderas kontakt med Konsumentverket eller en kvalificerad jurist.*`,
      };
    }
    const pct = minutes >= 120 ? '50%' : '25%';
    return {
      sentiment: 'positive',
      assessment: `## Bedömning\n\nDu har troligtvis rätt till ersättning eller åtgärd.\n\nEnligt EU-förordning 1371/2007 artikel 17 har du rätt till ersättning med **${pct} av biljettpriset** vid en försening på ${Math.round(minutes)} minuter.\n\n### Juridisk grund\nArtikel 17: 25% vid försening 60–119 minuter, 50% vid försening över 120 minuter. Gäller internationella tågresor och operatörer som frivilligt tillämpar förordningen (SJ gör det).\n\n### Svagheter i ditt ärende\nOm du reste med en operatör som inte tillämpar EU-förordningen för inrikesresor, kan ersättningen vara lägre eller utebli.\n\n### Nästa steg\n1. Ansök om ersättning direkt via tågoperatörens webbplats\n2. Vid avslag: anmäl till [ARN](https://www.arn.se)\n\n*OBS: Detta är juridisk vägledning baserad på angiven information och gällande lagstiftning. Det ersätter inte rådgivning från en jurist. Vid komplexa ärenden rekommenderas kontakt med Konsumentverket eller en kvalificerad jurist.*`,
    };
  }

  // Generic travel fallback
  return {
    sentiment: 'uncertain',
    assessment: `## Bedömning\n\nSituationen är oklar — mer information behövs.\n\nBaserat på den information du angett kan vi inte med säkerhet bedöma dina rättigheter. Ditt ärende gäller ${travelType || 'en resa'} med problemet "${issue}". För en mer precis bedömning behöver vi veta mer om omständigheterna.\n\n### Nästa steg\nKontakta transportbolaget skriftligt och beskriv problemet i detalj. Om du inte får ett tillfredsställande svar inom 6 veckor kan du anmäla till [ARN](https://www.arn.se).\n\n*OBS: Detta är juridisk vägledning baserad på angiven information och gällande lagstiftning. Det ersätter inte rådgivning från en jurist. Vid komplexa ärenden rekommenderas kontakt med Konsumentverket eller en kvalificerad jurist.*`,
  };
}

function analyzeBetalning(answers: Record<string, string>): { assessment: string; sentiment: 'positive' | 'uncertain' | 'negative' } {
  const issue = answers.issue || '';
  const amount = answers.amount || '';
  const parsed = parseFloat(amount.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;

  if (parsed === 0) {
    return {
      sentiment: 'negative',
      assessment: `## Bedömning\n\nDu har troligtvis inte rätt till ersättning i detta fall.\n\nDu har angett ett belopp på 0 kr. Utan ett faktiskt ekonomiskt krav finns det ingen grund att driva ärendet vidare.\n\n**Uppskattad ersättning**\nInget ekonomiskt krav kan beräknas baserat på angiven information.\n\n*OBS: Detta är juridisk vägledning baserad på angiven information och gällande lagstiftning. Det ersätter inte rådgivning från en jurist. Vid komplexa ärenden rekommenderas kontakt med Konsumentverket eller en kvalificerad jurist.*`,
    };
  }

  if (issue === 'Obehörig transaktion') {
    return {
      sentiment: 'positive',
      assessment: `## Bedömning\n\nDu har troligtvis rätt till ersättning eller åtgärd.\n\nEnligt Betaltjänstlagen (2010:751) 5 a kap. ska din bank återbetala obehöriga transaktioner. Din självrisk är normalt max **400 kr** om du inte agerat grovt oaktsamt.\n\n### Juridisk grund\nBetaltjänstlagen 5 a kap. 1–4 §§. Banken ska återbetala beloppet senast nästa bankdag efter att du anmält den obehöriga transaktionen.\n\n### Uppskattad ersättning\n${parsed} kr minus eventuell självrisk (max 400 kr).\n\n### Svagheter i ditt ärende\nOm banken kan visa att du lämnat ut kortuppgifter eller pinkod genom grov oaktsamhet kan du bli ansvarig för hela beloppet.\n\n### Nästa steg\n1. Anmäl till banken omedelbart om du inte redan gjort det\n2. Polisanmäl bedrägeriet\n3. Om banken avslår: anmäl till [ARN](https://www.arn.se)\n\n*OBS: Detta är juridisk vägledning baserad på angiven information och gällande lagstiftning. Det ersätter inte rådgivning från en jurist. Vid komplexa ärenden rekommenderas kontakt med Konsumentverket eller en kvalificerad jurist.*`,
    };
  }

  if (issue === 'Vara ej levererad' || issue === 'Vara avviker från beskrivning') {
    return {
      sentiment: 'positive',
      assessment: `## Bedömning\n\nDu har troligtvis rätt till ersättning eller åtgärd.\n\nOm du betalat med kort och varan inte levererats eller väsentligt avviker från beskrivningen, kan du begära **chargeback** via din kortutgivare.\n\n### Juridisk grund\nKortnätverkens konsumentskyddsregler samt Konsumentköplagen (2022:260).\n\n### Uppskattad ersättning\n${parsed} kr.\n\n### Svagheter i ditt ärende\nChargeback har tidsgränser — vanligtvis 120 dagar från köp eller förväntat leveransdatum. Du behöver dokumentation på att du kontaktat säljaren först.\n\n### Nästa steg\n1. Kontakta säljaren skriftligt med krav\n2. Om inget svar inom 14 dagar: kontakta din bank och begär chargeback\n3. Spara all dokumentation\n\n*OBS: Detta är juridisk vägledning baserad på angiven information och gällande lagstiftning. Det ersätter inte rådgivning från en jurist. Vid komplexa ärenden rekommenderas kontakt med Konsumentverket eller en kvalificerad jurist.*`,
    };
  }

  return {
    sentiment: 'uncertain',
    assessment: `## Bedömning\n\nSituationen är oklar — mer information behövs.\n\nDu har angett "${issue}" med ett belopp på ${parsed} kr, men det framgår inte tillräckligt tydligt om det rör sig om en obehörig transaktion eller ett köp du själv genomfört. Betaltjänstlagen skyddar mot **obehöriga** transaktioner — inte mot köp du är missnöjd med i efterhand.\n\n### Nästa steg\nFörtydliga om transaktionen genomfördes av dig eller utan ditt godkännande. Det avgör vilken lag som är tillämplig.\n\n*OBS: Detta är juridisk vägledning baserad på angiven information och gällande lagstiftning. Det ersätter inte rådgivning från en jurist. Vid komplexa ärenden rekommenderas kontakt med Konsumentverket eller en kvalificerad jurist.*`,
  };
}

function analyzeKopEhandel(answers: Record<string, string>): { assessment: string; sentiment: 'positive' | 'uncertain' | 'negative' } {
  const issue = answers.issue || '';
  const purchaseDate = answers.purchase_date || '';

  if (issue === 'Ångerrätt') {
    // Check if within 14 days
    if (purchaseDate) {
      const daysSincePurchase = Math.floor((Date.now() - new Date(purchaseDate).getTime()) / (1000 * 60 * 60 * 24));
      if (daysSincePurchase > 14) {
        return {
          sentiment: 'negative',
          assessment: `## Bedömning\n\nDu har troligtvis inte rätt till ångerrätt i detta fall.\n\nEnligt Distansavtalslagen (2005:59) 14 § gäller ångerrätten i **14 dagar** från det att du mottog varan. Det har gått ${daysSincePurchase} dagar sedan köpet, vilket innebär att ångerfristen har löpt ut.\n\n### Svagheter i ditt ärende\nÅngerrätten är absolut — efter 14 dagar kan säljaren neka utan juridisk grund för krav.\n\n### Nästa steg\nOm varan är felaktig kan du istället reklamera enligt Konsumentköplagen. Reklamationsrätten gäller i 3 år.\n\n*OBS: Detta är juridisk vägledning baserad på angiven information och gällande lagstiftning. Det ersätter inte rådgivning från en jurist. Vid komplexa ärenden rekommenderas kontakt med Konsumentverket eller en kvalificerad jurist.*`,
        };
      }
    }
    return {
      sentiment: 'positive',
      assessment: `## Bedömning\n\nDu har troligtvis rätt till ersättning eller åtgärd.\n\nEnligt Distansavtalslagen (2005:59) 14 § har du **14 dagars ångerrätt** vid köp på distans (online, telefon). Du kan returnera varan utan att ange skäl.\n\n### Juridisk grund\nDistansavtalslagen 14 §. Säljaren ska återbetala inom 14 dagar efter att de mottagit den returnerade varan.\n\n### Svagheter i ditt ärende\nUndantag finns för bland annat: specialtillverkade varor, förseglad mjukvara/hygienartiklar som öppnats, och digitalt innehåll om nedladdning påbörjats.\n\n### Nästa steg\n1. Meddela säljaren skriftligt att du vill använda din ångerrätt\n2. Returnera varan inom 14 dagar\n\n*OBS: Detta är juridisk vägledning baserad på angiven information och gällande lagstiftning. Det ersätter inte rådgivning från en jurist. Vid komplexa ärenden rekommenderas kontakt med Konsumentverket eller en kvalificerad jurist.*`,
    };
  }

  return {
    sentiment: 'positive',
    assessment: `## Bedömning\n\nDu har troligtvis rätt att reklamera produkten.\n\nEnligt Konsumentköplagen (2022:260) har du **3 års reklamationsrätt**. Fel som visar sig inom 2 år anses vara ursprungliga — säljaren har bevisbördan.\n\n### Juridisk grund\nKonsumentköplagen 4 kap. 1–3 §§. Du har rätt till avhjälpande, omleverans, prisavdrag eller hävning.\n\n### Svagheter i ditt ärende\nOm felet beror på normalt slitage eller felaktig användning kan reklamationen avslås. Säljaren kan försöka hävda att felet uppstått efter köpet.\n\n### Nästa steg\n1. Kontakta säljaren skriftligt med reklamation\n2. Säljaren bekostar returtransport\n3. Om säljaren vägrar: anmäl till [ARN](https://www.arn.se)\n\n*OBS: Detta är juridisk vägledning baserad på angiven information och gällande lagstiftning. Det ersätter inte rådgivning från en jurist. Vid komplexa ärenden rekommenderas kontakt med Konsumentverket eller en kvalificerad jurist.*`,
  };
}

function analyzeAbonnemang(answers: Record<string, string>): { assessment: string; sentiment: 'positive' | 'uncertain' | 'negative' } {
  const issue = answers.issue || '';
  const hasProof = answers.cancellation_proof || '';

  if (issue === 'Fortsätter debitera efter uppsägning') {
    if (hasProof === 'Nej') {
      return {
        sentiment: 'uncertain',
        assessment: `## Bedömning\n\nSituationen är oklar — mer information behövs.\n\nDu anger att företaget fortsätter debitera efter uppsägning, men du har ingen skriftlig bekräftelse på uppsägningen. Utan bevis på att uppsägning skett blir det svårt att driva kravet.\n\n### Juridisk grund\nDistansavtalslagen (2005:59) 25 § kräver att tjänsteleverantören bekräftar uppsägning skriftligt. Avtalslagen 36 § kan tillämpas om villkoren anses oskäliga.\n\n### Svagheter i ditt ärende\nUtan dokumentation på uppsägning kan företaget hävda att abonnemanget fortfarande löper. Bevisbördan ligger på dig.\n\n### Nästa steg\n1. Säg upp skriftligt igen och spara bekräftelsen\n2. Kontakta din bank för att stoppa autogiro/kortdragning\n3. Kräv återbetalning från datumet du kan bevisa uppsägning\n\n*OBS: Detta är juridisk vägledning baserad på angiven information och gällande lagstiftning. Det ersätter inte rådgivning från en jurist. Vid komplexa ärenden rekommenderas kontakt med Konsumentverket eller en kvalificerad jurist.*`,
      };
    }
    return {
      sentiment: 'positive',
      assessment: `## Bedömning\n\nDu har troligtvis rätt till ersättning eller åtgärd.\n\nOm du har skriftlig bekräftelse på uppsägning har företaget ingen rätt att fortsätta debitera. Alla belopp debiterade efter uppsägningsdatumet ska återbetalas.\n\n### Juridisk grund\nDistansavtalslagen (2005:59) 25 § — uppsägning ska bekräftas skriftligt. Avtalslagen 36 § — oskäliga villkor kan jämkas.\n\n### Svagheter i ditt ärende\nFöretaget kan hävda att uppsägningstiden inte löpt ut. Kontrollera avtalsvillkoren.\n\n### Nästa steg\n1. Skicka skriftligt krav med kopia av uppsägningsbekräftelsen\n2. Sätt 14 dagars tidsfrist\n3. Kontakta banken för att stoppa framtida debiteringar\n4. Vid utebliven respons: anmäl till [ARN](https://www.arn.se)\n\n*OBS: Detta är juridisk vägledning baserad på angiven information och gällande lagstiftning. Det ersätter inte rådgivning från en jurist. Vid komplexa ärenden rekommenderas kontakt med Konsumentverket eller en kvalificerad jurist.*`,
    };
  }

  if (issue === 'Kan inte säga upp') {
    return {
      sentiment: 'positive',
      assessment: `## Bedömning\n\nDu har troligtvis rätt till åtgärd.\n\nEnligt Lagen om avtalsvillkor i konsumentförhållanden (1994:1512) 3 § är villkor som gör det orimligt svårt att säga upp ett abonnemang potentiellt **ogiltiga**.\n\n### Juridisk grund\nAvtalsvillkorslagen 3 § samt Avtalslagen 36 § om oskäliga avtalsvillkor.\n\n### Nästa steg\n1. Säg upp skriftligt via e-post och behåll bekräftelse\n2. Om företaget hindrar uppsägning: anmäl till [Konsumentverket](https://www.konsumentverket.se)\n3. Kontakta banken för att stoppa framtida betalningar\n\n*OBS: Detta är juridisk vägledning baserad på angiven information och gällande lagstiftning. Det ersätter inte rådgivning från en jurist. Vid komplexa ärenden rekommenderas kontakt med Konsumentverket eller en kvalificerad jurist.*`,
    };
  }

  return {
    sentiment: 'uncertain',
    assessment: `## Bedömning\n\nSituationen är oklar — mer information behövs.\n\nDitt ärende gäller "${issue}". Vi behöver mer information om de specifika omständigheterna för att kunna bedöma dina rättigheter.\n\n### Nästa steg\nKontakta företaget skriftligt och beskriv problemet. Sätt en tidsfrist på 14 dagar.\n\n*OBS: Detta är juridisk vägledning baserad på angiven information och gällande lagstiftning. Det ersätter inte rådgivning från en jurist. Vid komplexa ärenden rekommenderas kontakt med Konsumentverket eller en kvalificerad jurist.*`,
  };
}

function analyzeHantverkare(answers: Record<string, string>): { assessment: string; sentiment: 'positive' | 'uncertain' | 'negative' } {
  const contacted = answers.contacted || '';
  const problem = answers.problem || '';

  if (!problem || problem.trim().length < 10) {
    return {
      sentiment: 'uncertain',
      assessment: `## Bedömning\n\nSituationen är oklar — mer information behövs.\n\nDu har inte beskrivit tillräckligt detaljerat vad felet är. Konsumenttjänstlagen (1985:716) kräver att felet avviker från **fackmässig standard** — inte bara från dina personliga preferenser.\n\n### Nästa steg\nBeskriv exakt vad som är felaktigt med det utförda arbetet och hur det avviker från vad som avtalades.\n\n*OBS: Detta är juridisk vägledning baserad på angiven information och gällande lagstiftning. Det ersätter inte rådgivning från en jurist. Vid komplexa ärenden rekommenderas kontakt med Konsumentverket eller en kvalificerad jurist.*`,
    };
  }

  if (contacted && contacted.toLowerCase().includes('nej')) {
    return {
      sentiment: 'uncertain',
      assessment: `## Bedömning\n\nDu har sannolikt rättigheter, men du behöver ge hantverkaren möjlighet att avhjälpa felet först.\n\nEnligt Konsumenttjänstlagen (1985:716) 20 § har hantverkaren rätt att **avhjälpa felet** innan du kan kräva prisavdrag eller hävning. Du måste därför kontakta hantverkaren och ge dem en rimlig tidsfrist.\n\n### Juridisk grund\nKonsumenttjänstlagen 4 § (fackmässighet), 20 § (avhjälpande), 16 § (rätt att hålla inne betalning).\n\n### Nästa steg\n1. Kontakta hantverkaren skriftligt och beskriv felet\n2. Ge en rimlig tidsfrist (2–4 veckor) för avhjälpande\n3. Du har rätt att hålla inne del av betalningen som säkerhet\n\n*OBS: Detta är juridisk vägledning baserad på angiven information och gällande lagstiftning. Det ersätter inte rådgivning från en jurist. Vid komplexa ärenden rekommenderas kontakt med Konsumentverket eller en kvalificerad jurist.*`,
    };
  }

  return {
    sentiment: 'positive',
    assessment: `## Bedömning\n\nDu har troligtvis rätt till ersättning eller åtgärd.\n\nEnligt Konsumenttjänstlagen (1985:716) ska arbetet utföras fackmässigt (4 §). Om resultatet avviker från fackmässig standard föreligger ett fel (9 §).\n\n### Juridisk grund\n- 4 §: Fackmässighet\n- 16 §: Rätt att hålla inne betalning\n- 20 §: Rätt till avhjälpande utan kostnad\n- 21 §: Prisavdrag om avhjälpande inte sker inom skälig tid\n- 22 §: Hävning vid väsentligt fel\n\n### Svagheter i ditt ärende\nMotparten kan hävda att arbetet utförts fackmässigt och att resultatet uppfyller avtalet. Det kan krävas en oberoende besiktning.\n\n### Nästa steg\n1. Dokumentera felet med foton\n2. Skicka skriftligt krav på avhjälpande\n3. Sätt rimlig tidsfrist (2–4 veckor)\n4. Om de vägrar: anmäl till [ARN](https://www.arn.se)\n\n*OBS: Detta är juridisk vägledning baserad på angiven information och gällande lagstiftning. Det ersätter inte rådgivning från en jurist. Vid komplexa ärenden rekommenderas kontakt med Konsumentverket eller en kvalificerad jurist.*`,
  };
}

function analyzeHyra(answers: Record<string, string>): { assessment: string; sentiment: 'positive' | 'uncertain' | 'negative' } {
  const issue = answers.issue || '';

  if (issue === 'Överhyra i andrahand') {
    return {
      sentiment: 'positive',
      assessment: `## Bedömning\n\nDu har troligtvis rätt till ersättning eller åtgärd.\n\nEnligt Hyreslagen (12 kap. Jordabalken) är max tillåtet påslag vid andrahandsuthyrning **15% på förstahandshyran**. Överskjutande belopp kan krävas tillbaka **upp till 3 år bakåt**.\n\n### Juridisk grund\n12 kap. 55 c–d §§ Jordabalken.\n\n### Svagheter i ditt ärende\nDu behöver veta förstahandshyran för att beräkna överhyran. Utan den uppgiften kan inte Hyresnämnden fastställa exakt belopp.\n\n### Nästa steg\n1. Kontakta Hyresnämnden i din region\n2. Ansök om prövning av hyrans skälighet\n3. Begär återbetalning av överskjutande hyra\n\n*OBS: Detta är juridisk vägledning baserad på angiven information och gällande lagstiftning. Det ersätter inte rådgivning från en jurist. Vid komplexa ärenden rekommenderas kontakt med Konsumentverket eller en kvalificerad jurist.*`,
    };
  }

  return {
    sentiment: 'uncertain',
    assessment: `## Bedömning\n\nSituationen är oklar — mer information behövs.\n\nHyresmål kan vara komplicerade och beror på omständigheterna. Ange mer detaljer om din situation för en mer precis bedömning.\n\n### Nästa steg\nKontakta [Hyresnämnden](https://www.domstol.se/hyres-och-arrendenamnden/) för en kostnadsfri prövning av ditt ärende.\n\n*OBS: Detta är juridisk vägledning baserad på angiven information och gällande lagstiftning. Det ersätter inte rådgivning från en jurist. Vid komplexa ärenden rekommenderas kontakt med Konsumentverket eller en kvalificerad jurist.*`,
  };
}

function analyzeBilkop(answers: Record<string, string>): { assessment: string; sentiment: 'positive' | 'uncertain' | 'negative' } {
  const sellerType = answers.seller_type || '';

  if (sellerType === 'Privatperson') {
    return {
      sentiment: 'uncertain',
      assessment: `## Bedömning\n\nSituationen är oklar — privatköp ger väsentligt sämre skydd.\n\nVid köp av bil från privatperson gäller **Köplagen (1990:931)**, inte Konsumentköplagen. Vid köp i "befintligt skick" (vanligt vid privatköp) krävs att felet **väsentligt avviker** från vad du som köpare kunde förutsätta.\n\n### Juridisk grund\nKöplagen 17–19 §§. Bevisbördan ligger på dig som köpare.\n\n### Svagheter i ditt ärende\nPrivatköp i befintligt skick innebär höga krav på vad du som köpare borde ha undersökt innan köpet. Undersökningsplikten är omfattande.\n\n### Nästa steg\n1. Dokumentera felet — gärna med oberoende besiktningsprotokoll\n2. Kontakta säljaren skriftligt med krav\n3. Vid tvist: tingsrätten (ARN prövar inte privatköp)\n\n*OBS: Detta är juridisk vägledning baserad på angiven information och gällande lagstiftning. Det ersätter inte rådgivning från en jurist. Vid komplexa ärenden rekommenderas kontakt med Konsumentverket eller en kvalificerad jurist.*`,
    };
  }

  return {
    sentiment: 'positive',
    assessment: `## Bedömning\n\nDu har troligtvis rätt till ersättning eller åtgärd.\n\nVid köp av bil från bilhandlare gäller **Konsumentköplagen (2022:260)**. Du har 3 års reklamationsrätt och fel som visar sig inom 2 år presumeras ha funnits vid köpet.\n\n### Juridisk grund\nKonsumentköplagen 4 kap. Säljaren har bevisbördan de första 2 åren.\n\n### Svagheter i ditt ärende\nSäljaren kan hävda normalt slitage, att felet uppstått efter leverans, eller att du kände till felet vid köpet.\n\n### Nästa steg\n1. Reklamera skriftligt till bilhandlaren\n2. Begär avhjälpande i första hand\n3. Vid avslag: anmäl till [ARN](https://www.arn.se)\n\n*OBS: Detta är juridisk vägledning baserad på angiven information och gällande lagstiftning. Det ersätter inte rådgivning från en jurist. Vid komplexa ärenden rekommenderas kontakt med Konsumentverket eller en kvalificerad jurist.*`,
  };
}

function analyzeGaranti(answers: Record<string, string>): { assessment: string; sentiment: 'positive' | 'uncertain' | 'negative' } {
  return {
    sentiment: 'uncertain',
    assessment: `## Bedömning\n\nSituationen är oklar — det beror på garantivillkoren och felets natur.\n\nGaranti är ett **frivilligt åtagande** från säljaren — vad som täcks beror helt på garantivillkoren. Separat från garantin har du **3 års reklamationsrätt** enligt Konsumentköplagen (2022:260).\n\n### Viktigt att skilja på\n- **Garanti**: Frivilligt åtagande — kontrollera villkoren noga\n- **Reklamationsrätt**: Lagstadgad i 3 år oavsett garanti\n- **Dolda fel (fastighet)**: Jordabalken 4 kap 19 § — helt annan lagstiftning\n\n### Svagheter i ditt ärende\nOm felet beror på normal förslitning, felaktig användning, eller inte täcks av garantivillkoren, kan kravet sakna grund.\n\n### Nästa steg\n1. Kontrollera garantivillkoren noggrant\n2. Om felet uppstått inom 2 år: reklamera oavsett garanti\n3. Kontakta säljaren skriftligt\n\n*OBS: Detta är juridisk vägledning baserad på angiven information och gällande lagstiftning. Det ersätter inte rådgivning från en jurist. Vid komplexa ärenden rekommenderas kontakt med Konsumentverket eller en kvalificerad jurist.*`,
  };
}

function analyzeLeverans(answers: Record<string, string>): { assessment: string; sentiment: 'positive' | 'uncertain' | 'negative' } {
  const issue = answers.issue || '';

  if (issue === 'Försenat' || issue === 'Försvunnet') {
    return {
      sentiment: 'positive',
      assessment: `## Bedömning\n\nDu har troligtvis rätt till ersättning eller åtgärd.\n\nEnligt Konsumentköplagen (2022:260) ansvarar **säljaren** för varan tills den levererats till dig. Om paketet är försenat eller försvunnet har du rätt att kräva ny leverans eller häva köpet.\n\n### Juridisk grund\nKonsumentköplagen 2 kap 5 § (riskens övergång) samt Distansavtalslagen.\n\n### Svagheter i ditt ärende\nSäljaren kan hävda att leverans skett om de har spårningsbevis. Kontrollera spårningsinformationen.\n\n### Nästa steg\n1. Kontakta säljaren — inte transportföretaget (säljaren ansvarar)\n2. Kräv ny leverans eller återbetalning\n3. Sätt 14 dagars tidsfrist\n\n*OBS: Detta är juridisk vägledning baserad på angiven information och gällande lagstiftning. Det ersätter inte rådgivning från en jurist. Vid komplexa ärenden rekommenderas kontakt med Konsumentverket eller en kvalificerad jurist.*`,
    };
  }

  return {
    sentiment: 'uncertain',
    assessment: `## Bedömning\n\nSituationen är oklar — mer information behövs.\n\nDitt ärende gäller "${issue}". Vi behöver mer detaljer för en säker bedömning. Har du kontaktat säljaren? Vad svarade de?\n\n### Nästa steg\nKontakta säljaren (inte transportföretaget) skriftligt.\n\n*OBS: Detta är juridisk vägledning baserad på angiven information och gällande lagstiftning. Det ersätter inte rådgivning från en jurist. Vid komplexa ärenden rekommenderas kontakt med Konsumentverket eller en kvalificerad jurist.*`,
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
        assessment: `## Bedömning\n\nSituationen är oklar — mer information behövs.\n\nVi kunde inte matcha ditt ärende mot en specifik juridisk bedömning. Beskriv din situation mer detaljerat.\n\n*OBS: Detta är juridisk vägledning baserad på angiven information och gällande lagstiftning. Det ersätter inte rådgivning från en jurist. Vid komplexa ärenden rekommenderas kontakt med Konsumentverket eller en kvalificerad jurist.*`,
      };
  }
}

export function getMockLetter(category: Category, answers: Record<string, string>, assessment: string): string {
  const counterparty = answers.company || answers.bank || answers.subscription_company || answers.purchase_company || answers.delivery_company || '[MOTPARTENS FÖRETAGSNAMN]';
  const amount = answers.amount || '[BELOPP]';

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const deadline = new Date(today);
  deadline.setDate(deadline.getDate() + 14);
  const deadlineStr = deadline.toISOString().split('T')[0];

  const situationLines = category.questions
    .filter(q => answers[q.id])
    .map(q => `${q.label} ${answers[q.id]}`)
    .join('. ');

  // Determine legal reference and authority per category
  let legalRef = 'gällande konsumentlagstiftning';
  let authority = 'Allmänna reklamationsnämnden (ARN)';

  if (category.id === 'resor') {
    const t = answers.travel_type || '';
    if (t === 'Flyg') legalRef = 'EU-förordning 261/2004 om flygpassagerares rättigheter';
    else if (t === 'Tåg') legalRef = 'EU-förordning 1371/2007 om tågresenärers rättigheter';
    else if (t === 'Buss') legalRef = 'EU-förordning 181/2011 om busspassagerares rättigheter';
    else if (t === 'Färja') legalRef = 'EU-förordning 1177/2010 om sjöpassagerares rättigheter';
    else legalRef = 'tillämpliga EU-förordningar och svensk konsumentlagstiftning';
  } else if (category.id === 'kop-ehandel' || category.id === 'garanti-dolda-fel') {
    legalRef = 'Konsumentköplagen (2022:260)';
  } else if (category.id === 'leverans') {
    legalRef = 'Konsumentköplagen (2022:260) samt Distansavtalslagen (2005:59)';
  } else if (category.id === 'betalning-aterkrav') {
    legalRef = 'Betaltjänstlagen (2010:751)';
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

  return `[ORT], ${todayStr}

[DITT NAMN]
[DIN ADRESS]
[POSTNUMMER OCH ORT]
[DIN E-POST]
[DITT TELEFONNUMMER]

${counterparty}
[MOTPARTENS ADRESS]


Med anledning av ${situationLines.toLowerCase() || 'nedanstående händelse'} vänder jag mig till er med följande krav.

Jag har i egenskap av konsument ingått avtal med er, och den tjänst eller vara som levererats uppfyller inte de krav som ställs enligt ${legalRef}. Den aktuella situationen innebär att mina rättigheter som konsument har åsidosatts, och jag har lidit ekonomisk skada till följd av detta.

Med stöd av ${legalRef} framställer jag härmed krav på ersättning om ${amount} kr. Beloppet avser den faktiska ekonomiska skada jag åsamkats genom ert avtalsbrott. Om dröjsmålsränta är tillämplig tillkommer ränta enligt räntelagen (1975:635) från och med förfallodagen.

Jag begär att betalning eller åtgärd genomförs senast den ${deadlineStr}. Betalning kan göras via Swish eller bankgiro till nedan angivna uppgifter. [SWISH-NUMMER ELLER BANKGIRO]

Om mitt krav inte tillgodoses inom angiven tidsfrist kommer jag att anmäla ärendet till ${authority} för prövning. Jag förbehåller mig rätten att kräva ersättning för eventuella tillkommande kostnader som uppstår till följd av er underlåtenhet att fullgöra era skyldigheter.

Med vänliga hälsningar,

[DITT NAMN]
[DIN ADRESS]
[DIN E-POST]
[DITT TELEFONNUMMER]`;
}
