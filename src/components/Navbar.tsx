import { Scale, Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SITE_CONFIG } from '@/config/site';
import { categories } from '@/lib/categories';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const visibleCats = categories.slice(0, 6);
  const moreCats = categories.slice(6);

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
        <div className="hidden lg:flex items-center gap-4 text-sm font-medium text-muted-foreground">
          {visibleCats.map(cat => (
            <Link key={cat.slug} to={`/${cat.slug}`} className="hover:text-foreground transition-colors whitespace-nowrap">
              {cat.title}
            </Link>
          ))}
          {moreCats.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
                className="hover:text-foreground transition-colors flex items-center gap-1"
              >
                Mer <ChevronDown className={`w-3 h-3 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
              </button>
              {moreOpen && (
                <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-lg shadow-lg py-2 min-w-[200px] z-50">
                  {moreCats.map(cat => (
                    <Link
                      key={cat.slug}
                      to={`/${cat.slug}`}
                      className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                      onClick={() => setMoreOpen(false)}
                    >
                      {cat.emoji} {cat.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
          <Link to="/guider" className="hover:text-foreground transition-colors">Guider</Link>
          <Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
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
          {categories.map(cat => (
            <Link
              key={cat.slug}
              to={`/${cat.slug}`}
              onClick={() => setMobileOpen(false)}
              className="block w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {cat.emoji} {cat.title}
            </Link>
          ))}
          <div className="border-t border-border/50 pt-3 space-y-3">
            <Link to="/guider" onClick={() => setMobileOpen(false)} className="block w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground">
              📖 Guider
            </Link>
            <Link to="/faq" onClick={() => setMobileOpen(false)} className="block w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground">
              Vanliga frågor
            </Link>
            <Link to="/om-oss" onClick={() => setMobileOpen(false)} className="block w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground">
              Om oss
            </Link>
          </div>
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
