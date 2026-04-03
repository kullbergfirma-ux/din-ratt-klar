export interface CategoryQuestion {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date';
  options?: string[];
  placeholder?: string;
  showWhen?: { questionId: string; values: string[] };
}

export interface CategoryFAQ {
  q: string;
  a: string;
}

export interface Category {
  id: string;
  slug: string;
  emoji: string;
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
  // Row 1
  {
    id: 'resor',
    slug: 'resor',
    emoji: '🌍',
    title: 'Resor',
    subtitle: 'Flyg, tåg, buss, färja, hotell och paketresor',
    seoTitle: 'Försenat flyg, tåg eller buss? Kräv ersättning',
    seoDescription: 'Få hjälp att kräva ersättning vid försenat flyg, tåg, buss eller färja. Vi guidar dig genom EU-förordningarna och svensk lag.',
    legalInfo: [
      'EU-förordning 261/2004 (flyg): Ersättning 250–600€ vid försening >3h, inställt eller överbookning',
      'EU-förordning 1371/2007 (tåg): 25% ersättning vid 60–119 min försening, 50% vid >120 min',
      'EU-förordning 181/2011 (buss): 50% av biljettpriset vid försening >120 min (resor >250 km)',
      'EU-förordning 1177/2010 (färja): 25% ersättning vid kortare försening, 50% vid längre',
      'Paketreselagen (2018:1217): Arrangören ansvarar för hela resan — rätt till prisavdrag',
      'Avtalslagen 36 §: Oskäliga hotellvillkor kan jämkas',
    ],
    faqs: [
      { q: 'Vilken ersättning kan jag få vid försenat flyg?', a: 'Vid försening >3h vid ankomst: 250€ (<1500km), 400€ (1500–3500km) eller 600€ (>3500km).' },
      { q: 'Gäller EU-reglerna för tåg i Sverige?', a: 'Ja, SJ tillämpar EU-förordning 1371/2007. Du har rätt till ersättning vid försening över 60 minuter.' },
      { q: 'Vad gör jag om hotellet inte är som utlovat?', a: 'Dokumentera bristerna och reklamera till arrangören/hotellet. Vid paketresa ansvarar arrangören.' },
    ],
    relatedSlugs: ['leverans', 'betalning-aterkrav', 'kop-ehandel'],
    questions: [
      { id: 'travel_type', label: 'Typ av resa?', type: 'select', options: ['Flyg', 'Tåg', 'Buss', 'Färja', 'Hotell', 'Paketresa', 'Hyrbil'] },
      { id: 'company', label: 'Transportbolag eller arrangör?', type: 'text', placeholder: 'T.ex. SAS, SJ, FlixBus, Stena Line' },
      { id: 'date', label: 'Datum för resan?', type: 'date' },
      { id: 'issue', label: 'Vad hände?', type: 'select', options: ['Försening', 'Inställt', 'Överbookning', 'Ej som utlovat', 'Annat'] },
      { id: 'delay_duration', label: 'Hur många minuter/timmar var förseningen?', type: 'text', placeholder: 'T.ex. 3 timmar', showWhen: { questionId: 'issue', values: ['Försening'] } },
      { id: 'compensation_offered', label: 'Fick du någon ersättning eller hjälp på plats?', type: 'select', options: ['Ja', 'Nej', 'Delvis'] },
      { id: 'description', label: 'Beskriv kort vad som hände', type: 'text', placeholder: 'T.ex. Flyget blev 4 timmar försenat och jag fick ingen hjälp på plats' },
    ],
  },
  {
    id: 'kop-ehandel',
    slug: 'kop-ehandel',
    emoji: '🛍️',
    title: 'Köp & e-handel',
    subtitle: 'Trasig vara, fel produkt, retur och ångerrätt',
    seoTitle: 'Trasig eller fel vara? Så reklamerar du',
    seoDescription: 'Lär dig dina rättigheter vid köp online eller i butik. Reklamation, ångerrätt och retur enligt konsumentköplagen.',
    questions: [
      { id: 'product_type', label: 'Vilken typ av produkt?', type: 'text', placeholder: 'T.ex. mobiltelefon, tvättmaskin' },
      { id: 'purchase_date', label: 'När köpte du den?', type: 'date' },
      { id: 'purchase_place', label: 'Var köpte du den?', type: 'select', options: ['Butik', 'Online'] },
      { id: 'defect', label: 'Vad är felet?', type: 'text', placeholder: 'Beskriv felet' },
      { id: 'contacted_seller', label: 'Har du kontaktat säljaren? Vad sa de?', type: 'text', placeholder: 'Beskriv kontakten' },
    ],
    legalInfo: [
      'Konsumentköplagen (2022:260): 3 års reklamationsrätt från köpdatum',
      'Fel inom 2 år presumeras vara ursprungliga — säljaren har bevisbördan',
      'Rätt till avhjälpande, omleverans, prisavdrag eller hävning',
      'Distansavtalslagen: 14 dagars ångerrätt vid köp online',
      'Säljaren bekostar alltid transport för reklamation',
    ],
    faqs: [
      { q: 'Hur lång tid har jag på mig att reklamera?', a: 'Du har 3 år på dig att reklamera en vara från köpdatumet, enligt konsumentköplagen.' },
      { q: 'Gäller ångerrätten i butik?', a: 'Nej, 14 dagars ångerrätt gäller bara vid distansköp (online, telefon). I butik gäller butikens egna villkor.' },
      { q: 'Vem betalar frakten vid reklamation?', a: 'Säljaren bekostar alltid transport vid reklamation. Du ska inte behöva betala för att skicka tillbaka en trasig vara.' },
    ],
    relatedSlugs: ['garanti-dolda-fel', 'leverans', 'betalning-aterkrav'],
  },
  {
    id: 'garanti-dolda-fel',
    slug: 'garanti-dolda-fel',
    emoji: '🔧',
    title: 'Garanti & dolda fel',
    subtitle: 'Vad täcker garantin och dolda fel vid köp?',
    seoTitle: 'Garanti och dolda fel — vad har du rätt till?',
    seoDescription: 'Förstå skillnaden mellan garanti och reklamationsrätt. Lär dig vad som täcks vid dolda fel på produkter.',
    questions: [
      { id: 'product', label: 'Produkt?', type: 'text', placeholder: 'T.ex. laptop, kylskåp' },
      { id: 'purchase_date', label: 'Inköpsdatum?', type: 'date' },
      { id: 'problem', label: 'Vad är problemet?', type: 'text', placeholder: 'Beskriv problemet' },
      { id: 'receipt', label: 'Har du kvitto/garantibevis?', type: 'select', options: ['Ja', 'Nej'] },
    ],
    legalInfo: [
      'Garanti är ett frivilligt åtagande utöver den lagstadgade reklamationsrätten',
      'Reklamationsrätten (3 år) gäller alltid oavsett garantivillkor',
      'Vid garantitvist: kontakta tillverkaren för garanti, säljaren för reklamation',
      'Dolda fel som inte borde ha märkts vid köp täcks av konsumentköplagen',
    ],
    faqs: [
      { q: 'Vad är skillnaden mellan garanti och reklamationsrätt?', a: 'Garanti är frivilligt från säljaren/tillverkaren. Reklamationsrätten är lagstadgad och gäller alltid i 3 år.' },
      { q: 'Vad räknas som ett dolt fel?', a: 'Ett dolt fel är ett fel som inte var synligt eller möjligt att upptäcka vid köptillfället men som fanns redan då.' },
      { q: 'Kan säljaren neka garanti?', a: 'Säljaren kan neka garanti om villkoren inte uppfylls, men reklamationsrätten gäller ändå vid ursprungliga fel.' },
    ],
    relatedSlugs: ['kop-ehandel', 'bilkop', 'leverans'],
  },
  // Row 2
  {
    id: 'leverans',
    slug: 'leverans',
    emoji: '📦',
    title: 'Leverans & onlineköp',
    subtitle: 'Försenat, skadat eller försvunnet paket',
    seoTitle: 'Försenat eller skadat paket? Kräv ersättning',
    seoDescription: 'Ditt paket är försenat, skadat eller försvunnet? Lär dig dina rättigheter och hur du kräver ersättning.',
    questions: [
      { id: 'company', label: 'Vilket företag?', type: 'text', placeholder: 'T.ex. PostNord, DHL' },
      { id: 'order_date', label: 'Beställningsdatum och utlovat leveransdatum?', type: 'text', placeholder: 'T.ex. beställt 1 jan, utlovat 5 jan' },
      { id: 'issue', label: 'Vad hände?', type: 'select', options: ['Försenat', 'Skadat', 'Borttappat'] },
      { id: 'contacted', label: 'Har du kontaktat säljaren/transportören?', type: 'select', options: ['Ja', 'Nej'] },
    ],
    legalInfo: [
      'Konsumentköplagen: Säljaren ansvarar för leveransen, inte transportören',
      'Försenad vara: rätt att häva köpet om leveransen dröjer oskäligt',
      'Skadad vara vid leverans: reklamera direkt till säljaren',
      'Rätt till återbetalning inom 14 dagar vid hävning',
    ],
    faqs: [
      { q: 'Vem ansvarar för mitt paket?', a: 'Säljaren ansvarar för att varan kommer fram till dig. Det är alltså säljaren du ska kontakta, inte transportföretaget.' },
      { q: 'Hur länge ska jag vänta innan jag kan häva köpet?', a: 'Du kan häva köpet om varan inte levereras inom utlovad tid och säljaren inte levererar inom en rimlig tilläggstid.' },
      { q: 'Vad gör jag om paketet är skadat?', a: 'Dokumentera skadan med foton och reklamera direkt till säljaren. Transportskador är säljarens ansvar.' },
    ],
    relatedSlugs: ['kop-ehandel', 'betalning-aterkrav', 'garanti-dolda-fel'],
  },
  {
    id: 'betalning-aterkrav',
    slug: 'betalning-aterkrav',
    emoji: '💳',
    title: 'Betalning & återkrav',
    subtitle: 'Kortbedrägeri, obehöriga transaktioner och chargeback',
    seoTitle: 'Betalning & återkrav — få tillbaka dina pengar',
    seoDescription: 'Har du blivit utsatt för kortbedrägeri eller obehöriga transaktioner? Lär dig om chargeback och dina rättigheter.',
    questions: [
      { id: 'bank', label: 'Bank/kortutgivare?', type: 'text', placeholder: 'T.ex. Nordea, SEB, Klarna' },
      { id: 'amount', label: 'Belopp?', type: 'text', placeholder: 'T.ex. 2500 kr' },
      { id: 'issue', label: 'Vad hände?', type: 'text', placeholder: 'Beskriv situationen' },
      { id: 'contacted_seller', label: 'Har du försökt kontakta säljaren?', type: 'select', options: ['Ja', 'Nej'] },
    ],
    legalInfo: [
      'Betaltjänstlagen: möjlighet att bestrida transaktioner via banken',
      'Vid bedrägeri: banken ska återbetala om du inte agerat grovt vårdslöst',
      'Kontakta banken inom 13 månader från debiteringen',
      'Dokumentera all kommunikation med säljaren',
    ],
    faqs: [
      { q: 'Vad är chargeback?', a: 'Chargeback innebär att du bestrider en kortbetalning via din bank. Banken utreder och kan kräva tillbaka beloppet från säljaren.' },
      { q: 'Hur snabbt måste jag agera?', a: 'Kontakta din bank så snart som möjligt, senast inom 13 månader från debiteringen.' },
      { q: 'Kan jag få tillbaka pengar vid bedrägeri?', a: 'Ja, vid obehöriga transaktioner ska banken återbetala dig om du inte agerat grovt vårdslöst.' },
    ],
    relatedSlugs: ['kop-ehandel', 'leverans', 'abonnemang'],
  },
  {
    id: 'abonnemang',
    slug: 'abonnemang',
    emoji: '📱',
    title: 'Abonnemang & feldebitering',
    subtitle: 'Gym, streaming, telefon och tjänster som fortsätter debitera',
    seoTitle: 'Abonnemang som inte går att avsluta? Så gör du',
    seoDescription: 'Problem med abonnemang som fortsätter debitera? Lär dig dina rättigheter vid feldebitering och uppsägning.',
    questions: [
      { id: 'service_type', label: 'Vilken typ av tjänst?', type: 'select', options: ['Streaming', 'Gym', 'Telefon', 'Internet', 'Annat'] },
      { id: 'company', label: 'Vilket företag?', type: 'text', placeholder: 'T.ex. Netflix, SATS, Telia' },
      { id: 'issue', label: 'Vad hände?', type: 'select', options: ['Fortsätter debitera efter uppsägning', 'Felaktigt belopp', 'Kan inte säga upp', 'Automatisk förlängning', 'Annat'] },
      { id: 'problem_date', label: 'När sade du upp eller när uppstod problemet?', type: 'date' },
      { id: 'total_amount', label: 'Hur mycket pengar handlar det om totalt?', type: 'text', placeholder: 'T.ex. 1200 kr' },
      { id: 'written_confirmation', label: 'Har du skriftlig bekräftelse på uppsägning?', type: 'select', options: ['Ja', 'Nej'] },
    ],
    legalInfo: [
      'Distansavtalslagen (2005:59): 14 dagars ångerrätt för tjänster tecknade på distans',
      'Tjänsteleverantören ska bekräfta uppsägning skriftligt',
      'Avtalslagen 36 §: Oskäliga bindningstider kan jämkas',
      'Lagen om avtalsvillkor i konsumentförhållanden (1994:1512): Oskäliga villkor är ogiltiga',
      'Felaktiga debiteringar efter uppsägning: kräv återbetalning med 14 dagars frist',
    ],
    faqs: [
      { q: 'Kan företaget neka min uppsägning?', a: 'Nej, du har alltid rätt att säga upp ett avtal. Oskäliga bindningstider kan jämkas av domstol.' },
      { q: 'Vad gör jag om de fortsätter debitera?', a: 'Kräv återbetalning skriftligt med 14 dagars frist. Om de inte svarar, anmäl till ARN.' },
      { q: 'Gäller ångerrätten för gymkort?', a: 'Ja, om du tecknade avtalet online eller via telefon har du 14 dagars ångerrätt.' },
      { q: 'Kan jag stoppa automatiska betalningar?', a: 'Ja, kontakta din bank för att spärra framtida dragningar. Du kan också bestrida felaktiga debiteringar.' },
    ],
    relatedSlugs: ['betalning-aterkrav', 'kop-ehandel', 'hantverkare'],
  },
  // Row 3
  {
    id: 'bilkop',
    slug: 'bilkop',
    emoji: '🚗',
    title: 'Bilköp',
    subtitle: 'Dolda fel, garanti och reklamation vid bilköp',
    seoTitle: 'Fel på bilen? Så reklamerar du ett bilköp',
    seoDescription: 'Upptäckt dolda fel efter bilköp? Lär dig om reklamationsrätt vid köp av ny eller begagnad bil.',
    questions: [
      { id: 'car_type', label: 'Ny eller begagnad bil?', type: 'select', options: ['Ny', 'Begagnad'] },
      { id: 'seller_type', label: 'Köpt av handlare eller privatperson?', type: 'select', options: ['Handlare', 'Privatperson'] },
      { id: 'purchase_date', label: 'Inköpsdatum?', type: 'date' },
      { id: 'defect', label: 'Vad är felet?', type: 'text', placeholder: 'Beskriv felet' },
      { id: 'defect_timing', label: 'När uppstod felet?', type: 'select', options: ['Inom 6 månader från köp', 'Efter 6 månader'] },
    ],
    legalInfo: [
      'Konsumentköplagen: 3 års reklamationsrätt vid köp av handlare',
      'Fel inom 6 månader presumeras vara ursprungliga (omvänd bevisbörda)',
      'Köplagen: vid privat köp säljs i "befintligt skick" om inget annat avtalats',
      'Dolda fel som säljaren aktivt dolt täcks alltid, oavsett köplag',
    ],
    faqs: [
      { q: 'Vad gäller vid köp av privatperson?', a: 'Vid privatköp gäller köplagen. Bilen säljs ofta i befintligt skick, men grovt avvikande eller dolda fel täcks ändå.' },
      { q: 'Hur länge kan jag reklamera?', a: 'Vid köp av handlare: 3 år. Vid privatköp finns ingen lagstadgad tidsgräns men reklamera så snart du upptäcker felet.' },
      { q: 'Vad är omvänd bevisbörda?', a: 'Under de första 6 månaderna presumeras felet vara ursprungligt. Säljaren måste bevisa att felet uppstått efter köpet.' },
    ],
    relatedSlugs: ['garanti-dolda-fel', 'kop-ehandel', 'betalning-aterkrav'],
  },
  {
    id: 'hyra',
    slug: 'hyra',
    emoji: '🏠',
    title: 'Hyra',
    subtitle: 'Ockerhyra, olaglig hyreshöjning och otillåtna villkor',
    seoTitle: 'Ockerhyra eller olagliga villkor? Kräv din rätt',
    seoDescription: 'Problem med hög hyra, olagliga villkor eller felaktiga hyreshöjningar? Lär dig dina rättigheter som hyresgäst.',
    questions: [
      { id: 'rental_type', label: 'Förstahand eller andrahand?', type: 'select', options: ['Förstahand', 'Andrahand'] },
      { id: 'rent_amount', label: 'Månadshyra?', type: 'text', placeholder: 'T.ex. 8500 kr' },
      { id: 'issue', label: 'Vad anser du är fel/orimligt?', type: 'text', placeholder: 'Beskriv situationen' },
      { id: 'contract', label: 'Har du skriftligt kontrakt?', type: 'select', options: ['Ja', 'Nej'] },
    ],
    legalInfo: [
      'Hyreslagen (12 kap. Jordabalken): Hyra ska följa bruksvärdesprincipen',
      'Hyreshöjning kräver minst 3 månaders varsel',
      'Andrahand: max 15% påslag på förstahandshyran',
      'Överskjutande hyra kan krävas tillbaka upp till 3 år bakåt via Hyresnämnden',
    ],
    faqs: [
      { q: 'Hur vet jag om hyran är för hög?', a: 'Jämför med liknande lägenheter i området. Hyresnämnden kan pröva om hyran är skälig.' },
      { q: 'Kan jag kräva tillbaka pengar?', a: 'Ja, vid andrahandsuthyrning kan du kräva tillbaka överskjutande belopp upp till 3 år bakåt.' },
      { q: 'Vad är nyckelpengar?', a: 'Nyckelpengar (betalning för att få ett kontrakt) är olagligt och kan alltid krävas tillbaka.' },
    ],
    relatedSlugs: ['hantverkare', 'betalning-aterkrav', 'abonnemang'],
  },
  {
    id: 'hantverkare',
    slug: 'hantverkare',
    emoji: '🔨',
    title: 'Hantverkare & tjänster',
    subtitle: 'Felmonterat, oavslutat eller felaktigt utfört arbete',
    seoTitle: 'Fel på hantverksarbete? Så kräver du rättelse',
    seoDescription: 'Har hantverkaren gjort ett dåligt jobb? Lär dig om konsumenttjänstlagen och hur du kräver avhjälpande.',
    questions: [
      { id: 'service_type', label: 'Vilken typ av tjänst?', type: 'select', options: ['VVS', 'El', 'Målning', 'Renovering', 'Flytt', 'Trädgård', 'Annat'] },
      { id: 'company', label: 'Vilket företag eller person utförde arbetet?', type: 'text', placeholder: 'T.ex. Rörmokare AB' },
      { id: 'work_date', label: 'När utfördes arbetet?', type: 'date' },
      { id: 'defect', label: 'Vad är felet eller problemet?', type: 'text', placeholder: 'Beskriv problemet' },
      { id: 'payment_status', label: 'Har du betalat hela beloppet eller håller du inne något?', type: 'select', options: ['Betalat allt', 'Håller inne del', 'Inte betalat'] },
      { id: 'contacted', label: 'Har du kontaktat hantverkaren om problemet? Vad sa de?', type: 'text', placeholder: 'Beskriv kontakten' },
    ],
    legalInfo: [
      'Konsumenttjänstlagen (1985:716) 4 §: Tjänsten ska utföras fackmässigt',
      '9 §: Fel föreligger om resultatet avviker från fackmässig standard',
      '16 §: Rätt att hålla inne betalning vid fel',
      '20 §: Hantverkaren ska åtgärda felet utan kostnad',
      '21 §: Rätt till prisavdrag om avhjälpande inte sker inom skälig tid',
      '22 §: Rätt till hävning om felet är väsentligt',
      '35 §: Rätt till skadestånd vid ytterligare skada',
    ],
    faqs: [
      { q: 'Kan jag hålla inne betalning?', a: 'Ja, du har rätt att hålla inne ett belopp som motsvarar kostnaden för att åtgärda felet.' },
      { q: 'Måste hantverkaren åtgärda felet gratis?', a: 'Ja, vid fel har hantverkaren skyldighet att avhjälpa utan extra kostnad enligt konsumenttjänstlagen.' },
      { q: 'Vad räknas som fackmässigt?', a: 'Arbetet ska utföras enligt branschstandard, med rätt material och metod. Resultatet ska vara hållbart.' },
      { q: 'Hur lång tid har jag att reklamera?', a: 'Reklamera inom skälig tid efter att du upptäckt felet, normalt inom 2 månader.' },
    ],
    relatedSlugs: ['hyra', 'garanti-dolda-fel', 'kop-ehandel'],
  },
];


export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug);
}
