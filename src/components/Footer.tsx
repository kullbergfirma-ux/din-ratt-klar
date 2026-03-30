import { Scale } from 'lucide-react';

const Footer = () => (
  <footer className="bg-foreground text-white/70 py-16">
    <div className="max-w-5xl mx-auto px-4">
      <div className="grid sm:grid-cols-3 gap-10 mb-12">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Scale className="w-5 h-5 text-white" />
            <span className="font-bold text-white text-lg">Rätten.se</span>
          </div>
          <p className="text-sm leading-relaxed">
            Vi hjälper dig förstå och hävda dina konsumenträttigheter — snabbt, enkelt och baserat på gällande lag.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-bold text-white mb-3 text-sm uppercase tracking-wider">Tjänsten</h4>
          <ul className="space-y-2 text-sm">
            <li><button onClick={() => document.getElementById('hur-fungerar')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">Så fungerar det</button></li>
            <li><button onClick={() => document.getElementById('kategorier')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">Ärenden vi hanterar</button></li>
            <li><button onClick={() => document.getElementById('priser')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">Priser</button></li>
            <li><button onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">Vanliga frågor</button></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="font-bold text-white mb-3 text-sm uppercase tracking-wider">Resurser</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="https://www.konsumentverket.se" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Konsumentverket</a></li>
            <li><a href="https://www.arn.se" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">ARN</a></li>
            <li><a href="https://www.hyresnamnden.se" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Hyresnämnden</a></li>
            <li><a href="https://www.kronofogden.se" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Kronofogden</a></li>
          </ul>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="border-t border-white/10 pt-8">
        <p className="text-xs leading-relaxed text-white/50 mb-4">
          Rätten.se ger vägledning baserad på gällande svensk och EU-lagstiftning. Detta ersätter inte professionell juridisk rådgivning. Vid komplexa ärenden rekommenderar vi kontakt med Konsumentverket eller en jurist.
        </p>
        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} Rätten.se — Dina rättigheter, förenklat.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
