import { useState, useCallback } from 'react';
import { type Category } from '@/lib/categories';
import { getCredits, useCredit } from '@/lib/credits';
import { getMockAssessment, getMockLetter } from '@/lib/ai-service';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, Coins } from 'lucide-react';

import CategorySelector from '@/components/CategorySelector';
import QuestionFlow from '@/components/QuestionFlow';
import ProgressBar from '@/components/ProgressBar';
import RightsAssessment from '@/components/RightsAssessment';
import LetterDisplay from '@/components/LetterDisplay';
import CreditModal from '@/components/CreditModal';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

type Step = 'home' | 'questions' | 'loading' | 'assessment' | 'letter';

const Index = () => {
  const [step, setStep] = useState<Step>('home');
  const [category, setCategory] = useState<Category | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [assessment, setAssessment] = useState('');
  const [sentiment, setSentiment] = useState<'positive' | 'uncertain' | 'negative'>('positive');
  const [letter, setLetter] = useState('');
  const [credits, setCredits] = useState(getCredits());
  const [showCreditModal, setShowCreditModal] = useState(false);
  const { toast } = useToast();

  const refreshCredits = useCallback(() => setCredits(getCredits()), []);

  const handleCategorySelect = (cat: Category) => {
    setCategory(cat);
    setStep('questions');
  };

  const handleQuestionsSubmit = (ans: Record<string, string>) => {
    setAnswers(ans);
    setStep('loading');

    // Simulate AI processing
    setTimeout(() => {
      const result = getMockAssessment(category!, ans);
      setAssessment(result.assessment);
      setSentiment(result.sentiment);
      setStep('assessment');
    }, 2000);
  };

  const handleGenerateLetter = () => {
    if (credits <= 0) {
      setShowCreditModal(true);
      return;
    }

    const success = useCredit();
    if (!success) {
      setShowCreditModal(true);
      return;
    }

    refreshCredits();
    const generatedLetter = getMockLetter(category!, answers, assessment);
    setLetter(generatedLetter);
    setStep('letter');
    toast({ title: 'Kravbrev genererat!', description: '1 credit har använts.' });
  };

  const handleReset = () => {
    setStep('home');
    setCategory(null);
    setAnswers({});
    setAssessment('');
    setLetter('');
  };

  const stepIndex = step === 'home' ? 0 : step === 'questions' ? 1 : 2;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container max-w-[860px] mx-auto flex items-center justify-between py-3 px-4">
          <button onClick={handleReset} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Scale className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground text-lg">Rätten.se</span>
          </button>
          <button
            onClick={() => setShowCreditModal(true)}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Coins className="w-4 h-4" />
            {credits} credits
          </button>
        </div>
      </header>

      <main className="container max-w-[860px] mx-auto px-4 py-8">
        {step !== 'home' && (
          <ProgressBar current={stepIndex} total={3} />
        )}

        <AnimatePresence mode="wait">
          {step === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-10 mt-4">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
                  Förstå dina rättigheter
                </h1>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  Beskriv din situation och få en bedömning baserad på svensk och EU-lagstiftning — plus ett färdigt kravbrev.
                </p>
              </div>

              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Vad gäller ditt ärende?
              </h2>
              <CategorySelector onSelect={handleCategorySelect} />
              <FAQ />
            </motion.div>
          )}

          {step === 'questions' && category && (
            <motion.div
              key="questions"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <QuestionFlow
                category={category}
                onSubmit={handleQuestionsSubmit}
                onBack={handleReset}
              />
            </motion.div>
          )}

          {step === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
              <p className="text-muted-foreground font-medium">
                Analyserar din situation mot gällande lagstiftning...
              </p>
            </motion.div>
          )}

          {step === 'assessment' && (
            <motion.div
              key="assessment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <RightsAssessment
                assessment={assessment}
                sentiment={sentiment}
                onGenerateLetter={handleGenerateLetter}
                onBack={handleReset}
                credits={credits}
              />
            </motion.div>
          )}

          {step === 'letter' && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <LetterDisplay letter={letter} onBack={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <div className="container max-w-[860px] mx-auto px-4">
        <Footer />
      </div>

      <CreditModal
        open={showCreditModal}
        onClose={() => setShowCreditModal(false)}
        onPurchase={refreshCredits}
      />
    </div>
  );
};

export default Index;
