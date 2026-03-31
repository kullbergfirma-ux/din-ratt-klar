import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { FileText, ArrowLeft } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';

interface Props {
  assessment: string;
  sentiment: 'positive' | 'uncertain' | 'negative';
  onGenerateLetter: () => void;
  onBack: () => void;
  credits: number;
}

const sentimentStyles = {
  positive: 'border-l-4 border-l-success',
  uncertain: 'border-l-4 border-l-warning',
  negative: 'border-l-4 border-l-destructive',
};

const RightsAssessment = ({ assessment, sentiment, onGenerateLetter, onBack, credits }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={`card-elevated p-6 sm:p-8 ${sentimentStyles[sentiment]}`}>
        <h2 className="text-xl font-bold text-foreground mb-4">Din rättighetsbedömning</h2>
        <div className="prose prose-sm max-w-none text-foreground/90 mb-6">
          <ReactMarkdown>{assessment}</ReactMarkdown>
        </div>
      </div>

      <div className="mt-4 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
        {SITE_CONFIG.disclaimer}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Button variant="ghost" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="w-4 h-4" />
          Ny sökning
        </Button>
        <Button
          onClick={onGenerateLetter}
          className="flex-1 gap-2 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
        >
          <FileText className="w-4 h-4" />
          Generera kravbrev (1 credit)
          <span className="text-xs opacity-80">— {credits} kvar</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default RightsAssessment;
