import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Copy, Download, Check, ArrowLeft } from 'lucide-react';

interface Props {
  letter: string;
  onBack: () => void;
}

const LetterDisplay = ({ letter, onBack }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([letter], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kravbrev.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-xl font-bold text-foreground mb-4">Ditt kravbrev</h2>

      <div className="paper-card p-6 sm:p-8 text-sm leading-relaxed whitespace-pre-wrap text-foreground/90 max-h-[500px] overflow-y-auto">
        {letter}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Button variant="ghost" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="w-4 h-4" />
          Ny sökning
        </Button>
        <Button onClick={handleCopy} variant="outline" className="gap-2">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Kopierat!' : 'Kopiera'}
        </Button>
        <Button onClick={handleDownload} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Download className="w-4 h-4" />
          Ladda ner .txt
        </Button>
      </div>
    </motion.div>
  );
};

export default LetterDisplay;
