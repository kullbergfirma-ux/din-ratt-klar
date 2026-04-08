import { Scale, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SITE_CONFIG } from '@/config/site';

const navLinks = [
  { to: '/', label: 'Hem' },
  { to: '/arenden', label: 'Ärenden' },
  { to: '/priser', label: 'Priser' },
  { to: '/guider', label: 'Guider' },
  { to: '/faq', label: 'Vanliga frågor' },
  { to: '/om-oss', label: 'Om oss' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleCTA = (e: React.MouseEvent) => {
    if (isHome) {
      e.preventDefault();
      const el = document.getElementById('kategorier');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="border-b border-border/50 bg-card/95 backdrop-blur-md sticky top-0 z-50">
      <nav className="max-w-5xl mx-auto flex items-center justify-between py-3 px-4" aria-label="Huvudnavigation">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Scale className="w-5 h-5 text-primary" />
          <span className="font-bold text-foreground text-lg">{SITE_CONFIG.name}</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className="hover:text-foreground transition-colors">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Link to={isHome ? '/#kategorier' : '/'} onClick={handleCTA}>
            <Button size="sm" className="rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 font-bold">
              Kolla din rätt →
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-foreground" aria-label="Meny">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border/50 bg-card px-4 py-4 space-y-3">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link to={isHome ? '/#kategorier' : '/'} onClick={(e) => { handleCTA(e); setMobileOpen(false); }}>
              <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold rounded-lg w-full">
                Kolla din rätt →
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
