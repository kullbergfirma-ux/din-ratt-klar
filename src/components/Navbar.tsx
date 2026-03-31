import { Scale, Coins, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SITE_CONFIG } from '@/config/site';
import { categories } from '@/lib/categories';

interface Props {
  credits: number;
  onOpenCredits: () => void;
}

const Navbar = ({ credits, onOpenCredits }: Props) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="border-b border-border/50 bg-card/95 backdrop-blur-md sticky top-0 z-50">
      <nav className="max-w-5xl mx-auto flex items-center justify-between py-3 px-4" aria-label="Huvudnavigation">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Scale className="w-5 h-5 text-primary" />
          <span className="font-bold text-foreground text-lg">{SITE_CONFIG.name}</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          {categories.slice(0, 5).map(cat => (
            <Link key={cat.slug} to={`/${cat.slug}`} className="hover:text-foreground transition-colors">
              {cat.title}
            </Link>
          ))}
          <Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onOpenCredits}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Coins className="w-4 h-4" />
            {credits} credits
          </button>
          {isHome && (
            <Link to={`/${categories[0].slug}`}>
              <Button size="sm" className="rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 font-bold">
                Kolla din rätt →
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-foreground" aria-label="Meny">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 bg-card px-4 py-4 space-y-3">
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
          <Link to="/faq" onClick={() => setMobileOpen(false)} className="block w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground">
            Vanliga frågor
          </Link>
          <Link to="/om-oss" onClick={() => setMobileOpen(false)} className="block w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground">
            Om oss
          </Link>
          <div className="pt-2 flex items-center justify-between">
            <button onClick={() => { onOpenCredits(); setMobileOpen(false); }} className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Coins className="w-4 h-4" /> {credits} credits
            </button>
            <Link to={`/${categories[0].slug}`} onClick={() => setMobileOpen(false)}>
              <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold rounded-lg">
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
