const Footer = () => (
  <footer className="mt-20 pb-8 text-center">
    <div className="card-elevated p-4 text-xs text-muted-foreground leading-relaxed">
      Rätten.se ger vägledning baserad på gällande svensk och EU-lagstiftning. Detta ersätter inte professionell juridisk rådgivning. Vid komplexa ärenden rekommenderar vi kontakt med{' '}
      <a href="https://www.konsumentverket.se" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
        Konsumentverket
      </a>{' '}
      eller en jurist.
    </div>
    <p className="mt-4 text-xs text-muted-foreground">
      © {new Date().getFullYear()} Rätten.se — Dina rättigheter, förenklat.
    </p>
  </footer>
);

export default Footer;
