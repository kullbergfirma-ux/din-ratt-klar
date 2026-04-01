import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getCategoryBySlug } from '@/lib/categories';
import { getMockAssessment, getMockLetter } from '@/lib/ai-service';
import { generateCaseId, getTier, setTier, type Tier } from '@/lib/pricing';

import SEOHead from '@/components/SEOHead';
import { ServiceSchema, FAQSchema } from '@/components/StructuredData';
import QuestionFlow from '@/components/QuestionFlow';
import ProgressBar from '@/components/ProgressBar';
import RightsAssessment from '@/components/RightsAssessment';
import LetterDisplay from '@/components/LetterDisplay';
import GuidesSection from '@/components/GuidesSection';
import NotFound from '@/pages/NotFound';
import { ArrowRight } from 'lucide-react';

type Step = 'info' | 'questions' | 'loading' | 'assessment' | 'letter';

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = getCategoryBySlug(slug || '');
  const [step, setStep] = useState<Step>('info');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [assessment, setAssessment] = useState('');
  const [sentiment, setSentiment] = useState<'positive' | 'uncertain' | 'negative'>('positive');
  const [letter, setLetter] = useState('');
  const [caseId, setCaseId] = useState('');
  const [tier, setLocalTier] = useState<Tier>('free');
  const toolRef = useRef<HTMLDivElement>(null);

  if (!category) return <NotFound />;

  const handleStartFlow = () => {
    const newCaseId = generateCaseId();
    setCaseId(newCaseId);
    setLocalTier(getTier(newCaseId));
    setStep('questions');
    setTimeout(() => toolRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleQuestionsSubmit = (ans: Record<string, string>) => {
    setAnswers(ans);
    setStep('loading');
    setTimeout(() => {
      const result = getMockAssessment(category, ans);
      setAssessment(result.assessment);
      setSentiment(result.sentiment);
      setStep('assessment');
    }, 2000);
  };

  const handleUnlock = (newTier: Tier) => {
    setTier(caseId, newTier);
    setLocalTier(newTier);
    if (newTier === 'bas' || newTier === 'komplett') {
      const generatedLetter = getMockLetter(category, answers, assessment);
      setLetter(generatedLetter);
    }
  };

  const handleReset = () => {
    setStep('info');
    setAnswers({});
    setAssessment('');
    setLetter('');
    setCaseId('');
    setLocalTier('free');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isInFlow = step !== 'info';
  const stepIndex = step === 'questions' ? 1 : 2;

  return (
    <main className="min-h-screen">
      <SEOHead
        title={category.seoTitle}
        description={category.seoDescription}
        canonical={`/${category.slug}`}
      />
      <ServiceSchema name={category.title} description={category.seoDescription} />
      {category.faqs.length > 0 && <FAQSchema items={category.faqs} />}

      {/* Category intro */}
      {!isInFlow && (
        <section aria-label={category.title} className="py-16 sm:py-24">
          <div className="max-w-[860px] mx-auto px-4">
            <div className="mb-8">
              <span className="text-5xl mb-4 block">{category.emoji}</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">{category.seoTitle}</h1>
              <p className="text-lg text-muted-foreground max-w-xl">{category.seoDescription}</p>
            </div>

            <button
              onClick={handleStartFlow}
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground hover:bg-accent/90 font-bold px-6 py-3 rounded-xl shadow-lg transition-colors text-base"
            >
              Starta ditt ärende <ArrowRight className="w-5 h-5" />
            </button>

            {/* Legal references */}
            {category.legalInfo.length > 0 && (
              <section aria-label="Lagstiftning" className="mt-16">
                <h2 className="text-xl font-bold text-foreground mb-4">Det här säger lagen</h2>
                <ul className="space-y-2">
                  {category.legalInfo.map((info, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5">§</span>
                      {info}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Category FAQ */}
            {category.faqs.length > 0 && (
              <section aria-label="Vanliga frågor" className="mt-16">
                <h2 className="text-xl font-bold text-foreground mb-4">Vanliga frågor</h2>
                <div className="card-elevated divide-y divide-border">
                  {category.faqs.map((faq, i) => (
                    <details key={i} className="group">
                      <summary className="px-5 py-4 text-sm font-medium text-foreground cursor-pointer list-none flex items-center justify-between hover:bg-muted/30 transition-colors">
                        {faq.q}
                        <span className="text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
                      </summary>
                      <p className="px-5 pb-4 text-sm text-muted-foreground">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Guides for this category */}
            <GuidesSection categorySlug={category.slug} categoryTitle={category.title} />
          </div>
        </section>
      )}

      {/* Flow */}
      {isInFlow && (
        <div ref={toolRef} className="max-w-[860px] mx-auto px-4 py-8">
          <ProgressBar current={stepIndex} total={3} />

          <AnimatePresence mode="wait">
            {step === 'questions' && (
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
                <RightsAssessment
                  assessment={assessment}
                  sentiment={sentiment}
                  tier={tier}
                  letter={letter}
                  onUnlock={handleUnlock}
                  onBack={handleReset}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </main>
  );
};

export default CategoryPage;
