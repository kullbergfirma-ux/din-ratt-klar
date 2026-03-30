export interface CategoryQuestion {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date';
  options?: string[];
  placeholder?: string;
}

export interface Category {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  questions: CategoryQuestion[];
}

export const categories: Category[] = [
  {
    id: 'flyg',
    emoji: '✈️',
    title: 'Flyg',
    subtitle: 'Försening, inställt, överbookning',
    questions: [
      { id: 'airline', label: 'Flygbolag?', type: 'text', placeholder: 'T.ex. SAS, Norwegian, Ryanair' },
      { id: 'date', label: 'Avresedatum?', type: 'date' },
      { id: 'route', label: 'Rutt (från → till)?', type: 'text', placeholder: 'T.ex. Stockholm → London' },
      { id: 'issue', label: 'Vad hände?', type: 'select', options: ['Försenat', 'Inställt', 'Överbookat'] },
      { id: 'delay_hours', label: 'Om försenat: hur många timmar?', type: 'text', placeholder: 'T.ex. 4' },
      { id: 'compensation_offered', label: 'Fick du någon ersättning eller ombokning?', type: 'select', options: ['Ja', 'Nej', 'Delvis'] },
    ],
  },
  {
    id: 'reklamation',
    emoji: '🛍️',
    title: 'Reklamation',
    subtitle: 'Trasig produkt',
    questions: [
      { id: 'product_type', label: 'Vilken typ av produkt?', type: 'text', placeholder: 'T.ex. mobiltelefon, tvättmaskin' },
      { id: 'purchase_date', label: 'När köpte du den?', type: 'date' },
      { id: 'purchase_place', label: 'Var köpte du den?', type: 'select', options: ['Butik', 'Online'] },
      { id: 'defect', label: 'Vad är felet?', type: 'text', placeholder: 'Beskriv felet' },
      { id: 'contacted_seller', label: 'Har du kontaktat säljaren? Vad sa de?', type: 'text', placeholder: 'Beskriv kontakten' },
    ],
  },
  {
    id: 'garanti',
    emoji: '🔧',
    title: 'Garanti',
    subtitle: 'Vad täcks?',
    questions: [
      { id: 'product', label: 'Produkt?', type: 'text', placeholder: 'T.ex. laptop, kylskåp' },
      { id: 'purchase_date', label: 'Inköpsdatum?', type: 'date' },
      { id: 'problem', label: 'Vad är problemet?', type: 'text', placeholder: 'Beskriv problemet' },
      { id: 'receipt', label: 'Har du kvitto/garantibevis?', type: 'select', options: ['Ja', 'Nej'] },
    ],
  },
  {
    id: 'hyra',
    emoji: '🏠',
    title: 'Hyra',
    subtitle: 'Ockerhyra, olagliga villkor',
    questions: [
      { id: 'rental_type', label: 'Förstahand eller andrahand?', type: 'select', options: ['Förstahand', 'Andrahand'] },
      { id: 'rent_amount', label: 'Månadshyra?', type: 'text', placeholder: 'T.ex. 8500 kr' },
      { id: 'issue', label: 'Vad anser du är fel/orimligt?', type: 'text', placeholder: 'Beskriv situationen' },
      { id: 'contract', label: 'Har du skriftligt kontrakt?', type: 'select', options: ['Ja', 'Nej'] },
    ],
  },
  {
    id: 'leverans',
    emoji: '📦',
    title: 'Leverans',
    subtitle: 'Försenat paket, skadat gods',
    questions: [
      { id: 'company', label: 'Vilket företag?', type: 'text', placeholder: 'T.ex. PostNord, DHL' },
      { id: 'order_date', label: 'Beställningsdatum och utlovat leveransdatum?', type: 'text', placeholder: 'T.ex. beställt 1 jan, utlovat 5 jan' },
      { id: 'issue', label: 'Vad hände?', type: 'select', options: ['Försenat', 'Skadat', 'Borttappat'] },
      { id: 'contacted', label: 'Har du kontaktat säljaren/transportören?', type: 'select', options: ['Ja', 'Nej'] },
    ],
  },
  {
    id: 'paketresa',
    emoji: '🧳',
    title: 'Paketresa',
    subtitle: 'Hotell ej som utlovat, inställd resa',
    questions: [
      { id: 'organizer', label: 'Researrangör?', type: 'text', placeholder: 'T.ex. TUI, Ving' },
      { id: 'destination_dates', label: 'Resmål och datum?', type: 'text', placeholder: 'T.ex. Kreta, 15–22 juli' },
      { id: 'issue', label: 'Vad stämde inte?', type: 'text', placeholder: 'Hotell, transport, aktiviteter...' },
      { id: 'documentation', label: 'Har du dokumentation (foton, kvitton)?', type: 'select', options: ['Ja', 'Nej', 'Delvis'] },
    ],
  },
  {
    id: 'kortkop',
    emoji: '💳',
    title: 'Kortköp / Bluff',
    subtitle: 'Chargeback, ej levererad vara',
    questions: [
      { id: 'bank', label: 'Bank/kortutgivare?', type: 'text', placeholder: 'T.ex. Nordea, SEB, Klarna' },
      { id: 'amount', label: 'Belopp?', type: 'text', placeholder: 'T.ex. 2500 kr' },
      { id: 'issue', label: 'Vad hände?', type: 'text', placeholder: 'Beskriv situationen' },
      { id: 'contacted_seller', label: 'Har du försökt kontakta säljaren?', type: 'select', options: ['Ja', 'Nej'] },
    ],
  },
  {
    id: 'bilkop',
    emoji: '🚗',
    title: 'Bilköp',
    subtitle: 'Dolda fel, garanti',
    questions: [
      { id: 'car_type', label: 'Ny eller begagnad bil?', type: 'select', options: ['Ny', 'Begagnad'] },
      { id: 'seller_type', label: 'Köpt av handlare eller privatperson?', type: 'select', options: ['Handlare', 'Privatperson'] },
      { id: 'purchase_date', label: 'Inköpsdatum?', type: 'date' },
      { id: 'defect', label: 'Vad är felet?', type: 'text', placeholder: 'Beskriv felet' },
      { id: 'defect_timing', label: 'När uppstod felet?', type: 'select', options: ['Inom 6 månader från köp', 'Efter 6 månader'] },
    ],
  },
];
