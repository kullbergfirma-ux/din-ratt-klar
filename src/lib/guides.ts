export interface Guide {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  categorySlug: string;
  sections: { heading: string; content: string }[];
  relatedSlugs: string[];
}

export const guides: Guide[] = [
  {
    slug: 'forsenat-flyg-ersattning',
    title: 'Försenat flyg — så kräver du ersättning',
    seoTitle: 'Försenat flyg? Så kräver du ersättning (2024)',
    seoDescription: 'Steg-för-steg guide för att kräva ersättning vid försenat flyg enligt EU-förordning 261/2004.',
    categorySlug: 'resor',
    sections: [
      { heading: 'Dina rättigheter vid försenat flyg', content: 'Enligt EU-förordning 261/2004 har du rätt till ekonomisk ersättning om ditt flyg anländer mer än 3 timmar försenat. Ersättningen är 250€ för korta flygningar (<1500km), 400€ för medellånga (1500–3500km) och 600€ för långa (>3500km).' },
      { heading: 'Undantag — extraordinära omständigheter', content: 'Flygbolaget kan undgå ansvar vid extraordinära omständigheter som extremt väder, politisk instabilitet eller strejk utanför bolagets kontroll. Tekniska fel räknas normalt inte som undantag.' },
      { heading: 'Så här gör du steg för steg', content: '1. Spara boardingkort och bokningsbekräftelse\n2. Dokumentera förseningen (foton av avgångstavlan)\n3. Skicka ett skriftligt krav till flygbolaget\n4. Vänta 6 veckor på svar\n5. Om ingen respons: anmäl till ARN' },
    ],
    relatedSlugs: ['resor', 'leverans', 'betalning-aterkrav'],
  },
  {
    slug: 'forsenat-tag-ersattning',
    title: 'Försenat tåg — ersättning enligt EU-regler',
    seoTitle: 'Försenat tåg? Så får du ersättning',
    seoDescription: 'Guide om ersättning vid tågförsening enligt EU-förordning 1371/2007. Gäller SJ och internationella tågresor.',
    categorySlug: 'resor',
    sections: [
      { heading: 'EU-förordningen som skyddar tågresenärer', content: 'EU-förordning 1371/2007 ger dig rätt till ersättning vid tågförseningar. Vid försening 60–119 minuter: 25% av biljettpriset. Vid försening över 120 minuter: 50% av biljettpriset.' },
      { heading: 'Rätt till mat och logi', content: 'Vid försening över 60 minuter har du rätt till måltider och förfriskningar. Vid längre förseningar som kräver övernattning ska tågbolaget erbjuda inkvartering.' },
      { heading: 'Hur du ansöker om ersättning', content: '1. Spara din biljett och bokningsbekräftelse\n2. Notera den faktiska ankomsttiden\n3. Ansök om ersättning via SJ:s hemsida eller kundtjänst\n4. Vid avslag: kontakta ARN' },
    ],
    relatedSlugs: ['resor', 'leverans'],
  },
  {
    slug: 'reklamera-trasig-produkt',
    title: 'Så reklamerar du en trasig produkt',
    seoTitle: 'Reklamera trasig produkt — steg för steg',
    seoDescription: 'Komplett guide för att reklamera en trasig vara. Dina rättigheter enligt konsumentköplagen.',
    categorySlug: 'kop-ehandel',
    sections: [
      { heading: 'Konsumentköplagen skyddar dig', content: 'Du har 3 års reklamationsrätt från köpdatumet. Om felet visar sig inom 2 år presumeras det vara ursprungligt — det är säljarens sak att bevisa motsatsen.' },
      { heading: 'Vad du kan kräva', content: 'Du kan kräva avhjälpande (reparation), omleverans (ny produkt), prisavdrag eller hävning (full återbetalning). Säljaren väljer normalt mellan reparation och ny vara.' },
      { heading: 'Steg-för-steg reklamation', content: '1. Kontakta säljaren (inte tillverkaren)\n2. Beskriv felet skriftligt\n3. Skicka varan — säljaren betalar frakten\n4. Vänta på svar\n5. Om säljaren vägrar: anmäl till ARN' },
    ],
    relatedSlugs: ['kop-ehandel', 'garanti-dolda-fel', 'leverans'],
  },
  {
    slug: 'andrahandshyra-regler',
    title: 'Andrahandshyra — regler och dina rättigheter',
    seoTitle: 'Andrahandshyra regler — kräv tillbaka överhyra',
    seoDescription: 'Hyr du i andrahand? Lär dig reglerna om tillåten hyra och hur du kräver tillbaka för mycket betald hyra.',
    categorySlug: 'hyra',
    sections: [
      { heading: 'Vad är tillåten hyra i andrahand?', content: 'Vid andrahandsuthyrning får hyresvärden ta ut max 15% påslag utöver sin egen förstahandshyra. Om lägenheten är möblerad tillkommer ersättning för möblerna.' },
      { heading: 'Så kräver du tillbaka överhyra', content: 'Du kan kräva tillbaka all överhyra upp till 3 år bakåt genom Hyresnämnden. Samla bevis: kontrakt, betalningsbevis och jämför med skälig hyra.' },
      { heading: 'Anmäl till Hyresnämnden', content: '1. Samla ditt andrahandskontrakt\n2. Ta reda på förstahandshyran\n3. Beräkna överhyran\n4. Skicka en ansökan till Hyresnämnden — det är kostnadsfritt' },
    ],
    relatedSlugs: ['hyra', 'betalning-aterkrav'],
  },
  {
    slug: 'avsluta-abonnemang',
    title: 'Så avslutar du ett abonnemang som inte går att säga upp',
    seoTitle: 'Kan inte avsluta abonnemang? Så gör du',
    seoDescription: 'Svårt att säga upp gym, streaming eller telefonabonnemang? Lär dig dina rättigheter och hur du gör.',
    categorySlug: 'abonnemang',
    sections: [
      { heading: 'Dina rättigheter vid uppsägning', content: 'Du har alltid rätt att säga upp ett abonnemang. Ångerrätten ger dig 14 dagar vid distansavtal. Oskäliga bindningstider kan jämkas enligt avtalslagen 36 §.' },
      { heading: 'Om företaget fortsätter debitera', content: 'Kräv återbetalning skriftligt och ge företaget 14 dagar att svara. Kontakta din bank för att stoppa framtida debiteringar. Spara all kommunikation.' },
      { heading: 'Hur du går tillväga', content: '1. Säg upp skriftligt (e-post eller brev)\n2. Kräv skriftlig bekräftelse\n3. Om de vägrar: kontakta Konsumentverket\n4. Anmäl till ARN om du inte får gehör\n5. Kontakta banken för att stoppa dragningar' },
    ],
    relatedSlugs: ['abonnemang', 'betalning-aterkrav'],
  },
  {
    slug: 'fel-pa-hantverksarbete',
    title: 'Fel på hantverksarbete — så kräver du rättelse',
    seoTitle: 'Fel på hantverksarbete? Dina rättigheter',
    seoDescription: 'Har hantverkaren gjort fel? Lär dig konsumenttjänstlagen och hur du kräver avhjälpande, prisavdrag eller hävning.',
    categorySlug: 'hantverkare',
    sections: [
      { heading: 'Konsumenttjänstlagen skyddar dig', content: 'Enligt konsumenttjänstlagen ska allt arbete utföras fackmässigt. Fel föreligger om resultatet avviker från vad som kan anses vara fackmannamässig standard.' },
      { heading: 'Dina rättigheter vid fel', content: 'Du kan hålla inne betalning, kräva att felet åtgärdas utan kostnad, få prisavdrag eller häva avtalet vid väsentliga fel. Du har även rätt till skadestånd om felet orsakat ytterligare skada.' },
      { heading: 'Steg-för-steg vid tvist', content: '1. Dokumentera felet med foton och beskrivning\n2. Kontakta hantverkaren skriftligt\n3. Ge en rimlig frist att åtgärda (2–4 veckor)\n4. Håll inne motsvarande belopp vid betalning\n5. Om ingen lösning: anmäl till ARN' },
    ],
    relatedSlugs: ['hantverkare', 'garanti-dolda-fel'],
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find(g => g.slug === slug);
}
