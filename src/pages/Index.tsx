import { useState, useCallback, useRef } from 'react';
import { type Category } from '@/lib/categories';
import { getCredits, useCredit } from '@/lib/credits';
import { getMockAssessment, getMockLetter } from '@/lib/ai-service';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import CategoriesSection from '@/components/CategoriesSection';
import FeaturesSection from '@/components/FeaturesSection';
import PricingSection from '@/components/PricingSection';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

import QuestionFlow from '@/components/QuestionFlow';
import ProgressBar from '@/components/ProgressBar';
import RightsAssessment from '@/components/RightsAssessment';
import LetterDisplay from '@/components/LetterDisplay';
import CreditModal from '@/components/CreditModal';
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
  const toolRef = useRef<HTMLDivElement>(null);

  const refreshCredits = useCallback(() => setCredits(getCredits()), []);

  const handleCategorySelect = (cat: Category) => {
    setCategory(cat);
    setStep('questions');
    setTimeout(() => toolRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleStartFlow = () => {
    document.getElementById('kategorier')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuestionsSubmit = (ans: Record<string, string>) => {
    setAnswers(ans);
    setStep('loading');
    setTimeout(() => {
      const result = getMockAssessment(category!, ans);
      setAssessment(result.assessment);
      setSentiment(result.sentiment);
      setStep('assessment');
    }, 2000);
  };

  const handleGenerateLetter = () => {
    if (credits <= 0) { setShowCreditModal(true); return; }
    const success = useCredit();
    if (!success) { setShowCreditModal(true); return; }
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isInFlow = step !== 'home';
  const stepIndex = step === 'questions' ? 1 : 2;

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        credits={credits}
        onOpenCredits={() => setShowCreditModal(true)}
        onReset={handleReset}
        onStart={handleStartFlow}
        showCta={!isInFlow}
      />

      {!isInFlow && (
        <>
          <HeroSection onStart={handleStartFlow} />
          <HowItWorks />
          <CategoriesSection onSelect={handleCategorySelect} />
          <FeaturesSection />
          <PricingSection onOpenCredits={() => setShowCreditModal(true)} />
          <div id="faq" className="py-20 sm:py-28 bg-background">
            <div className="max-w-3xl mx-auto px-4">
              <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">Vanliga frågor</h2>
              </div>
              <FAQ />
            </div>
          </div>
        </>
      )}

      {isInFlow && (
        <div ref={toolRef} className="max-w-[860px] mx-auto px-4 py-8">
          <ProgressBar current={stepIndex} total={3} />

          <AnimatePresence mode="wait">
            {step === 'questions' && category && (
              <motion.div key="questions" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <QuestionFlow category={category} onSubmit={handleQuestionsSubmit} onBack={handleReset} />
              </motion.div>
            )}

            {step === 'loading' && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                <p className="text-muted-foreground font-medium">Analyserar din situation mot gällande lagstiftning...</p>
              </motion.div>
            )}

            {step === 'assessment' && (
              <motion.div key="assessment" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <RightsAssessment assessment={assessment} sentiment={sentiment} onGenerateLetter={handleGenerateLetter} onBack={handleReset} credits={credits} />
              </motion.div>
            )}

            {step === 'letter' && (
              <motion.div key="letter" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <LetterDisplay letter={letter} onBack={handleReset} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <Footer />

      <CreditModal open={showCreditModal} onClose={() => setShowCreditModal(false)} onPurchase={refreshCredits} />
    </div>
  );
};

export default Index;
