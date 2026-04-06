export interface CategoryQuestion {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'file';
  options?: string[];
  placeholder?: string;
  showWhen?: { questionId: string; values: string[] };
  fileTypes?: string[];
  optional?: boolean;
}

export interface CategoryFAQ {
  q: string;
  a: string;
}

export interface Category {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  seoTitle: string;
  seoDescription: string;
  questions: CategoryQuestion[];
  legalInfo: string[];
  faqs: CategoryFAQ[];
  relatedSlugs: string[];
}

export const categories: Category[] = [
  {
    id: 'resor',
    slug: 'resor',
    title: 'Resor',
    subtitle: 'Flyg, tåg, buss, färja, hotell och paketresor',
    seoTitle: 'Försenat flyg, tåg eller buss? Kräv ersättning',
    seoDescription: 'Få hjälp att kräva ersättning vid försenat flyg, tåg, buss eller färja. Vi guidar dig genom EU-förordningarna och svensk lag.',
    legalInfo: [
      // Exchange rate: 1 EUR = 11 SEK (approximate, used for display purposes only)
      'EU-förordning 261/2004 (flyg): Ersättning 2 750–6 600 kr (250–600€) vid försening över 3h, inställt eller överbookning',
      'EU-förordning 1371/2007 (tåg): 25% ersättning vid 60–119 min försening, 50% vid över 120 min',
      'EU-förordning 181/2011 (buss): 50% av biljettpriset vid försening över 120 min på resor över 250 km',
      'EU-förordning 1177/2010 (färja): 25% ersättning vid kortare försening, 50% vid längre',
      'Paketreselagen (2018:1217): Arrangören ansvarar för hela resan — rätt till prisavdrag',
    ],
    faqs: [
      { q: 'Vilken ersättning kan jag få vid försenat flyg?', a: 'Vid försening över 3h vid ankomst: 250€ under 1500km, 400€ för 1500–3500km eller 600€ över 3500km.' },
      { q: 'Gäller EU-reglerna för tåg i Sverige?', a: 'Ja, SJ tillämpar EU-förordning 1371/2007. Du har rätt till ersättning vid försening över 60 minuter.' },
      { q: 'Vad gäller vid inställt flyg?', a: 'Vid inställt flyg med under 14 dagars varsel har du rätt till ombokning eller återbetalning samt ekonomisk kompensation.' },
      { q: 'Kan jag kräva ersättning för hotell som inte var som utlovat?', a: 'Ja, vid paketresa ansvarar arrangören. Dokumentera bristerna och reklamera inom skälig tid.' },
    ],
    relatedSlugs: ['kop-reklamation', 'abonnemang'],
    questions: [
      { id: 'travel_type', label: 'Vilken typ av resa gäller det?', type: 'select', options: ['Flyg', 'Tåg', 'Buss', 'Färja', 'Hotell', 'Paketresa', 'Hyrbil'] },
      { id: 'company', label: 'Vilket bolag eller arrangör gäller det?', type: 'text', placeholder: 'Skriv bolagets namn' },
      { id: 'date', label: 'När skedde resan?', type: 'date' },
      { id: 'issue', label: 'Vad hände?', type: 'select', options: ['Försening', 'Inställt', 'Överbookning', 'Ej som utlovat', 'Annat'] },
      { id: 'delay_duration', label: 'Hur många timmar var förseningen?', type: 'text', placeholder: 'Ange antal timmar', showWhen: { questionId: 'issue', values: ['Försening'] } },
      { id: 'compensation_offered', label: 'Fick du någon hjälp eller ersättning på plats?', type: 'select', options: ['Ja', 'Nej', 'Delvis'] },
      { id: 'description', label: 'Beskriv vad som hände', type: 'text', placeholder: 'Beskriv händelsen med egna ord' },
      { id: 'documents', label: 'Har du dokumentation att ladda upp?', type: 'file', placeholder: 'Boardingkort, bokningsbekräftelse, kvitto eller bilder', fileTypes: ['image/*', 'application/pdf'], optional: true },
    ],
  },
  {
    id: 'kop-reklamation',
    slug: 'kop-reklamation',
    title: 'Köp & reklamation',
    subtitle: 'Trasig vara, fel produkt, leveransproblem och ångerrätt',
    seoTitle: 'Trasig vara eller leveransproblem? Så reklamerar du',
    seoDescription: 'Lär dig dina rättigheter vid köp online eller i butik. Reklamation, leveransproblem, ångerrätt och retur enligt konsumentköplagen.',
    legalInfo: [
      'Konsumentköplagen (2022:260): 3 års reklamationsrätt från köpdatum',
      'Fel inom 2 år presumeras vara ursprungliga — säljaren har bevisbördan',
      'Rätt till avhjälpande, omleverans, prisavdrag eller hävning',
      'Distansavtalslagen: 14 dagars ångerrätt vid köp online',
      'Säljaren ansvarar för leveransen — inte transportören',
      'Säljaren bekostar alltid transport vid reklamation',
    ],
    faqs: [
      { q: 'Hur lång tid har jag på mig att reklamera?', a: 'Du har 3 år på dig att reklamera en vara från köpdatumet enligt konsumentköplagen.' },
      { q: 'Vem ansvarar om paketet försvinner?', a: 'Säljaren ansvarar för att varan kommer fram. Kontakta alltid säljaren, inte transportföretaget.' },
      { q: 'Gäller ångerrätten i butik?', a: 'Nej, 14 dagars ångerrätt gäller bara vid distansköp online eller telefon. I butik gäller butikens egna villkor.' },
      { q: 'Vem betalar frakten vid reklamation?', a: 'Säljaren bekostar alltid transport vid reklamation.' },
    ],
    relatedSlugs: ['garanti-dolda-fel', 'abonnemang'],
    questions: [
      { id: 'issue', label: 'Vad gäller ditt ärende?', type: 'select', options: ['Trasig eller felaktig vara', 'Varan kom aldrig fram', 'Fel vara levererad', 'Vill returnera / ångerrätt', 'Annat'] },
      { id: 'product_type', label: 'Vilken typ av produkt gäller det?', type: 'text', placeholder: 'Beskriv produkten' },
      { id: 'purchase_date', label: 'När köpte du produkten?', type: 'date' },
      { id: 'purchase_place', label: 'Var köpte du produkten?', type: 'select', options: ['Online', 'Butik'] },
      { id: 'company', label: 'Vilket företag köpte du från?', type: 'text', placeholder: 'Skriv företagets namn' },
      { id: 'defect', label: 'Beskriv felet eller problemet', type: 'text', placeholder: 'Beskriv vad som är fel med egna ord' },
      { id: 'contacted_seller', label: 'Har du kontaktat säljaren? Vad sa de?', type: 'text', placeholder: 'Beskriv kontakten eller skriv att du inte hört av dig ännu' },
      { id: 'documents', label: 'Har du dokumentation att ladda upp?', type: 'file', placeholder: 'Kvitto, orderbekräftelse eller bilder på felet', fileTypes: ['image/*', 'application/pdf'], optional: true },
    ],
  },
  {
    id: 'garanti-dolda-fel',
    slug: 'garanti-dolda-fel',
    title: 'Garanti & dolda fel',
    subtitle: 'Vad täcker garantin och dolda fel vid köp?',
    seoTitle: 'Garanti och dolda fel — vad har du rätt till?',
    seoDescription: 'Förstå skillnaden mellan garanti och reklamationsrätt. Lär dig vad som täcks vid dolda fel på produkter.',
    legalInfo: [
      'Garanti är ett frivilligt åtagande utöver den lagstadgade reklamationsrätten',
      'Reklamationsrätten på 3 år gäller alltid oavsett garantivillkor',
      'Vid garantitvist: kontakta tillverkaren för garanti, säljaren för reklamation',
      'Dolda fel som inte borde ha märkts vid köp täcks av konsumentköplagen',
    ],
    faqs: [
      { q: 'Vad är skillnaden mellan garanti och reklamationsrätt?', a: 'Garanti är frivilligt från säljaren eller tillverkaren. Reklamationsrätten är lagstadgad och gäller alltid i 3 år.' },
      { q: 'Vad räknas som ett dolt fel?', a: 'Ett dolt fel är ett fel som inte var synligt eller möjligt att upptäcka vid köptillfället men som fanns redan då.' },
      { q: 'Kan säljaren neka garanti?', a: 'Säljaren kan neka garanti om villkoren inte uppfylls, men reklamationsrätten gäller ändå vid ursprungliga fel.' },
    ],
    relatedSlugs: ['kop-reklamation', 'bilkop'],
    questions: [
      { id: 'product', label: 'Vilken produkt gäller det?', type: 'text', placeholder: 'Beskriv produkten' },
      { id: 'purchase_date', label: 'När köpte du produkten?', type: 'date' },
      { id: 'company', label: 'Vilket företag köpte du från?', type: 'text', placeholder: 'Skriv företagets namn' },
      { id: 'problem', label: 'Beskriv problemet', type: 'text', placeholder: 'Beskriv felet eller problemet med egna ord' },
      { id: 'receipt', label: 'Har du kvitto eller garantibevis?', type: 'select', options: ['Ja, båda', 'Bara kvitto', 'Bara garantibevis', 'Nej'] },
      { id: 'contacted_seller', label: 'Har du kontaktat säljaren eller tillverkaren?', type: 'text', placeholder: 'Beskriv kontakten eller skriv att du inte hört av dig ännu' },
      { id: 'documents', label: 'Har du dokumentation att ladda upp?', type: 'file', placeholder: 'Kvitto, garantibevis eller bilder på felet', fileTypes: ['image/*', 'application/pdf'], optional: true },
    ],
  },
  {
    id: 'abonnemang',
    slug: 'abonnemang',
    title: 'Abonnemang & feldebitering',
    subtitle: 'Gym, streaming, telefon och tjänster som fortsätter debitera',
    seoTitle: 'Abonnemang som inte går att avsluta? Så gör du',
    seoDescription: 'Problem med abonnemang som fortsätter debitera? Lär dig dina rättigheter vid feldebitering och uppsägning.',
    legalInfo: [
      'Distansavtalslagen (2005:59): 14 dagars ångerrätt för tjänster tecknade på distans',
      'Tjänsteleverantören ska bekräfta uppsägning skriftligt',
      'Avtalslagen 36 §: Oskäliga bindningstider kan jämkas',
      'Felaktiga debiteringar efter uppsägning: kräv återbetalning med 14 dagars frist',
    ],
    faqs: [
      { q: 'Kan företaget neka min uppsägning?', a: 'Nej, du har alltid rätt att säga upp ett avtal. Oskäliga bindningstider kan jämkas av domstol.' },
      { q: 'Vad gör jag om de fortsätter debitera?', a: 'Kräv återbetalning skriftligt med 14 dagars frist. Om de inte svarar, anmäl till ARN.' },
      { q: 'Kan jag stoppa automatiska betalningar?', a: 'Ja, kontakta din bank för att spärra framtida dragningar.' },
    ],
    relatedSlugs: ['kop-reklamation', 'hantverkare'],
    questions: [
      { id: 'service_type', label: 'Vilken typ av tjänst gäller det?', type: 'select', options: ['Streaming', 'Gym', 'Telefon', 'Internet', 'Tidning', 'Annat'] },
      { id: 'company', label: 'Vilket företag gäller det?', type: 'text', placeholder: 'Skriv företagets namn' },
      { id: 'issue', label: 'Vad har hänt?', type: 'select', options: ['Fortsätter debitera efter uppsägning', 'Felaktigt belopp debiterat', 'Kan inte säga upp', 'Automatisk förlängning utan varsel', 'Annat'] },
      { id: 'problem_date', label: 'När uppstod problemet eller när sade du upp?', type: 'date' },
      { id: 'total_amount', label: 'Hur mycket pengar handlar det om totalt?', type: 'text', placeholder: 'Ange totalt belopp i kronor' },
      { id: 'written_confirmation', label: 'Har du skriftlig bekräftelse på uppsägningen?', type: 'select', options: ['Ja', 'Nej'] },
      { id: 'description', label: 'Beskriv situationen', type: 'text', placeholder: 'Beskriv vad som hänt med egna ord' },
      { id: 'documents', label: 'Har du dokumentation att ladda upp?', type: 'file', placeholder: 'Uppsägningsbekräftelse, kontoutdrag eller skärmdumpar', fileTypes: ['image/*', 'application/pdf'], optional: true },
    ],
  },
  {
    id: 'bilkop',
    slug: 'bilkop',
    title: 'Bilköp',
    subtitle: 'Dolda fel, garanti och reklamation vid bilköp',
    seoTitle: 'Fel på bilen? Så reklamerar du ett bilköp',
    seoDescription: 'Upptäckt dolda fel efter bilköp? Lär dig om reklamationsrätt vid köp av ny eller begagnad bil från handlare eller privatperson.',
    legalInfo: [
      'Konsumentköplagen: 3 års reklamationsrätt vid köp från handlare',
      'Fel inom 6 månader presumeras vara ursprungliga vid handlarköp',
      'Köplagen: vid köp från privatperson gäller sämre skydd',
      'Dolda fel som säljaren aktivt dolt täcks alltid oavsett köplag',
    ],
    faqs: [
      { q: 'Vad gäller vid köp av privatperson?', a: 'Vid privatköp gäller köplagen. Bilen säljs ofta i befintligt skick, men grovt avvikande eller dolda fel täcks ändå.' },
      { q: 'Hur länge kan jag reklamera?', a: 'Vid köp från handlare: 3 år. Vid privatköp: reklamera så snart du upptäcker felet.' },
      { q: 'Vad är omvänd bevisbörda?', a: 'Under de första 6 månaderna vid handlarköp presumeras felet vara ursprungligt. Säljaren måste bevisa att felet uppstått efter köpet.' },
    ],
    relatedSlugs: ['garanti-dolda-fel', 'kop-reklamation'],
    questions: [
      { id: 'car_type', label: 'Ny eller begagnad bil?', type: 'select', options: ['Ny', 'Begagnad'] },
      { id: 'seller_type', label: 'Köpte du av handlare eller privatperson?', type: 'select', options: ['Handlare', 'Privatperson'] },
      { id: 'company', label: 'Vilket företag eller vem sålde bilen?', type: 'text', placeholder: 'Skriv handlarens namn eller privatpersonens förnamn' },
      { id: 'purchase_date', label: 'När köpte du bilen?', type: 'date' },
      { id: 'defect', label: 'Beskriv felet', type: 'text', placeholder: 'Beskriv vad som är fel med egna ord' },
      { id: 'defect_timing', label: 'När märkte du felet?', type: 'select', options: ['Direkt vid köp', 'Inom 6 månader från köp', 'Efter 6 månader'] },
      { id: 'contacted_seller', label: 'Har du kontaktat säljaren? Vad sa de?', type: 'text', placeholder: 'Beskriv kontakten eller skriv att du inte hört av dig ännu' },
      { id: 'documents', label: 'Har du dokumentation att ladda upp?', type: 'file', placeholder: 'Köpekontrakt, besiktningsprotokoll eller bilder på felet', fileTypes: ['image/*', 'application/pdf'], optional: true },
    ],
  },
  {
    id: 'hantverkare',
    slug: 'hantverkare',
    title: 'Hantverkare & tjänster',
    subtitle: 'Felmonterat, oavslutat eller felaktigt utfört arbete',
    seoTitle: 'Fel på hantverksarbete? Så kräver du rättelse',
    seoDescription: 'Har hantverkaren gjort ett dåligt jobb? Lär dig om konsumenttjänstlagen och hur du kräver avhjälpande eller ersättning.',
    legalInfo: [
      'Konsumenttjänstlagen (1985:716) 4 §: Tjänsten ska utföras fackmässigt',
      '9 §: Fel föreligger om resultatet avviker från fackmässig standard',
      '16 §: Rätt att hålla inne betalning vid fel',
      '20 §: Hantverkaren ska åtgärda felet utan kostnad',
      '21 §: Rätt till prisavdrag om avhjälpande inte sker inom skälig tid',
      '22 §: Rätt till hävning om felet är väsentligt',
    ],
    faqs: [
      { q: 'Kan jag hålla inne betalning?', a: 'Ja, du har rätt att hålla inne ett belopp som motsvarar kostnaden för att åtgärda felet.' },
      { q: 'Måste hantverkaren åtgärda felet gratis?', a: 'Ja, vid fel har hantverkaren skyldighet att avhjälpa utan extra kostnad.' },
      { q: 'Hur lång tid har jag att reklamera?', a: 'Reklamera inom skälig tid efter att du upptäckt felet, normalt inom 2 månader.' },
    ],
    relatedSlugs: ['garanti-dolda-fel', 'kop-reklamation'],
    questions: [
      { id: 'service_type', label: 'Vilken typ av arbete gäller det?', type: 'select', options: ['VVS', 'El', 'Målning', 'Renovering', 'Flytt', 'Trädgård', 'Takarbete', 'Golvläggning', 'Annat'] },
      { id: 'company', label: 'Vilket företag eller person utförde arbetet?', type: 'text', placeholder: 'Skriv företagets eller personens namn' },
      { id: 'work_date', label: 'När utfördes arbetet?', type: 'date' },
      { id: 'defect', label: 'Beskriv felet eller problemet', type: 'text', placeholder: 'Beskriv vad som är fel med egna ord' },
      { id: 'payment_status', label: 'Har du betalat för arbetet?', type: 'select', options: ['Betalat hela beloppet', 'Håller inne del av betalningen', 'Har inte betalat'] },
      { id: 'contacted', label: 'Har du kontaktat hantverkaren om problemet?', type: 'text', placeholder: 'Beskriv kontakten eller skriv att du inte hört av dig ännu' },
      { id: 'documents', label: 'Har du dokumentation att ladda upp?', type: 'file', placeholder: 'Offert, faktura eller bilder på felet', fileTypes: ['image/*', 'application/pdf'], optional: true },
    ],
  },
];


export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug);
}
