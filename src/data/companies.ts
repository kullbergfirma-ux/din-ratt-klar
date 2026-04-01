export const companyData: Record<string, string[]> = {
  flygbolag: [
    'SAS', 'Norwegian', 'Ryanair', 'Wizz Air', 'easyJet', 'Finnair', 'Lufthansa', 'British Airways', 'KLM', 'Air France',
    'Turkish Airlines', 'Emirates', 'Qatar Airways', 'Eurowings', 'Transavia', 'Vueling', 'Iberia', 'TAP Air Portugal',
    'Swiss', 'Austrian Airlines', 'Brussels Airlines', 'LOT Polish Airlines', 'Aer Lingus', 'Air Baltic', 'Aegean Airlines',
    'TUI fly', 'Sunclass Airlines', 'Primera Air', 'SmartLynx Airlines', 'Condor', 'Jet2', 'Blue Air', 'Flydubai',
    'Air Arabia', 'Pegasus Airlines', 'Corendon Airlines', 'Atlas Global', 'Widerøe', 'Braathens Regional Airlines',
    'Amapola Flyg', 'West Air Sweden', 'nextjet',
  ],
  tagoperatorer: [
    'SJ', 'MTR Express', 'Snälltåget', 'Vy', 'Inlandsbanan', 'Arlanda Express', 'Öresundståg', 'Pågatågen',
    'Västtrafik', 'Skånetrafiken', 'Blåtåget',
  ],
  bussbolag: [
    'FlixBus', 'Nettbuss', 'Ybuss', 'Swebus', 'Linjebuss', 'Länstrafiken', 'Västtrafik', 'Skånetrafiken', 'Dalatrafik',
  ],
  farjeoperatorer: [
    'Stena Line', 'Viking Line', 'Tallink Silja', 'Finnlines', 'DFDS', 'TT-Line', 'Destination Gotland', 'Gotlandsbåten',
  ],
  hotell: [
    'Booking.com', 'Airbnb', 'Hotels.com', 'Expedia', 'Agoda', 'Trivago', 'Nordic Choice Hotels', 'Scandic',
    'Elite Hotels', 'Radisson', 'Hilton', 'Marriott', 'Best Western', 'Comfort Hotel', 'Quality Hotel',
    'Thon Hotels', 'First Hotels', 'Clarion Hotel',
  ],
  hyrbil: [
    'Hertz', 'Avis', 'Europcar', 'Budget', 'Sixt', 'Enterprise', 'National', 'Alamo', 'Interrent', 'Goldcar',
    'OK Mobility', 'Dollar', 'Thrifty',
  ],
  ehandel: [
    'Amazon', 'IKEA', 'H&M', 'Zara', 'Elgiganten', 'MediaMarkt', 'Komplett', 'Webhallen', 'NetOnNet', 'Stadium',
    'Intersport', 'Adidas', 'Nike', 'Zalando', 'ASOS', 'Boozt', 'Nelly', 'NA-KD', 'Gymshark', 'About You',
    'Shein', 'Wish', 'AliExpress', 'eBay', 'Clas Ohlson', 'Biltema', 'Jula', 'Kjell & Company', 'Apple',
    'Samsung', 'Lyko', 'Kicks', 'Apotek Hjärtat', 'Apoteket', 'Kronans Apotek',
  ],
  banker: [
    'Swedbank', 'SEB', 'Handelsbanken', 'Nordea', 'Danske Bank', 'ICA Banken', 'Länsförsäkringar Bank', 'Sparbanken',
    'Klarna', 'PayPal', 'Stripe', 'American Express', 'Visa', 'Mastercard', 'Revolut', 'Wise', 'Avanza', 'Nordnet',
  ],
  streaming: [
    'Netflix', 'Spotify', 'HBO Max', 'Disney+', 'Viaplay', 'C More', 'Apple TV+', 'Amazon Prime Video',
    'YouTube Premium', 'Tele2', 'Telia', 'Telenor', 'Tre', 'Comviq', 'Halebop', 'Bahnhof', 'Bredbandsbolaget',
    'IP-Only', 'Telavox',
  ],
  gym: [
    'SATS', 'Friskis & Svettis', 'Fitness24Seven', 'Nordic Wellness', 'World Class', 'Actic', 'Nautilus Gym', 'EasyGym',
  ],
  bilhandlare: [
    'Volvo', 'Saab', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Audi', 'Toyota', 'Ford', 'Renault', 'Peugeot',
    'Citroën', 'Opel', 'Skoda', 'Seat', 'Hyundai', 'Kia', 'Nissan', 'Mazda', 'Honda', 'Mitsubishi', 'Subaru',
    'Blocket Bilar', 'Wayke', 'Kvdbil', 'Bytbil', 'AutoUncle', 'Hedin Automotive', 'Bilia', 'Ryds Bilglas',
  ],
  hantverkare: [
    'VVS-firma', 'Elektriker', 'Målare', 'Rörmokare', 'Snickare', 'Byggfirma', 'Takläggare', 'Golvläggare',
    'Fönsterbytare', 'Städfirma', 'Flyttfirma', 'Trädgårdsfirma', 'Fasadmålare', 'Plattsättare', 'Kyltekniker',
  ],
};

// Map question IDs to their relevant company lists
export const questionCompanyMap: Record<string, string[]> = (() => {
  const resor = [
    ...companyData.flygbolag,
    ...companyData.tagoperatorer,
    ...companyData.bussbolag,
    ...companyData.farjeoperatorer,
    ...companyData.hotell,
    ...companyData.hyrbil,
  ];

  return {
    // Resor
    'company': resor, // Used in resor category
    // Köp & e-handel
    'purchase_company': companyData.ehandel,
    // Leverans
    'delivery_company': companyData.ehandel,
    // Betalning
    'bank': companyData.banker,
    'payment_company': companyData.ehandel,
    // Abonnemang
    'subscription_company': [...companyData.streaming, ...companyData.gym],
    // Bilköp
    'car_brand': companyData.bilhandlare,
    'car_dealer': companyData.bilhandlare,
    // Hantverkare
    'service_type': companyData.hantverkare,
  };
})();

export function fuzzyMatch(query: string, items: string[]): string[] {
  if (!query.trim()) return [];
  const lower = query.toLowerCase();
  return items
    .filter(item => {
      const itemLower = item.toLowerCase();
      // Check if query chars appear in order (fuzzy)
      let qi = 0;
      for (let i = 0; i < itemLower.length && qi < lower.length; i++) {
        if (itemLower[i] === lower[qi]) qi++;
      }
      return qi === lower.length;
    })
    .sort((a, b) => {
      const aStarts = a.toLowerCase().startsWith(lower) ? 0 : 1;
      const bStarts = b.toLowerCase().startsWith(lower) ? 0 : 1;
      return aStarts - bStarts || a.localeCompare(b);
    })
    .slice(0, 8);
}
