import { Scale, Coins, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  credits: number;
  onOpenCredits: () => void;
  onReset: () => void;
  onStart: () => void;
  showCta?: boolean;
}

const Navbar = ({ credits, onOpenCredits, onReset, onStart, showCta = true }: Props) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="border-b border-border/50 bg-card/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between py-3 px-4">
        <button onClick={onReset} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Scale className="w-5 h-5 text-primary" />
          <span className="font-bold text-foreground text-lg">Rätten.se</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <button onClick={() => scrollTo('hur-fungerar')} className="hover:text-foreground transition-colors">Så fungerar det</button>
          <button onClick={() => scrollTo('kategorier')} className="hover:text-foreground transition-colors">Ärenden</button>
          <button onClick={() => scrollTo('priser')} className="hover:text-foreground transition-colors">Priser</button>
          <button onClick={() => scrollTo('faq')} className="hover:text-foreground transition-colors">Vanliga frågor</button>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onOpenCredits}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Coins className="w-4 h-4" />
            {credits} credits
          </button>
          {showCta && (
            <Button onClick={onStart} size="sm" className="rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 font-bold">
              Starta ärende
            </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-foreground">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 bg-card px-4 py-4 space-y-3">
          <button onClick={() => scrollTo('hur-fungerar')} className="block w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground">Så fungerar det</button>
          <button onClick={() => scrollTo('kategorier')} className="block w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground">Ärenden</button>
          <button onClick={() => scrollTo('priser')} className="block w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground">Priser</button>
          <button onClick={() => scrollTo('faq')} className="block w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground">Vanliga frågor</button>
          <div className="pt-2 flex items-center justify-between">
            <button onClick={() => { onOpenCredits(); setMobileOpen(false); }} className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Coins className="w-4 h-4" /> {credits} credits
            </button>
            <Button onClick={() => { onStart(); setMobileOpen(false); }} size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold rounded-lg">
              Starta ärende
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
