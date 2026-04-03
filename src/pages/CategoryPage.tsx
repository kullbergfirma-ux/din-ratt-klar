import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getCategoryBySlug } from '@/lib/categories';
import { getMockAssessment, getMockLetter, validateBeforeAnalysis } from '@/lib/ai-service';
import { generateCaseId, getTier, setTier, type Tier } from '@/lib/pricing';
import { toast } from 'sonner';

import SEOHead from '@/components/SEOHead';
import { ServiceSchema, FAQSchema } from '@/components/StructuredData';
import UserInfoForm, { type UserProfile } from '@/components/UserInfoForm';
import QuestionFlow from '@/components/QuestionFlow';
import ProgressBar from '@/components/ProgressBar';
import RightsAssessment from '@/components/RightsAssessment';
import LetterDisplay from '@/components/LetterDisplay';
import GuidesSection from '@/components/GuidesSection';
import NotFound from '@/pages/NotFound';
import { ArrowRight } from 'lucide-react';

type Step = 'info' | 'userinfo' | 'questions' | 'loading' | 'assessment' | 'letter';

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = getCategoryBySlug(slug || '');
  const [step, setStep] = useState<Step>('info');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
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
    setStep('userinfo');
    setTimeout(() => toolRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleUserInfoSubmit = (profile: UserProfile) => {
    setUserProfile(profile);
    setStep('questions');
  };

  const handleQuestionsSubmit = (ans: Record<string, string>) => {
    const validationError = validateBeforeAnalysis(category, ans);
    if (validationError) {
      toast.error(validationError);
      return;
    }
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
      const generatedLetter = getMockLetter(category, answers, assessment, userProfile || undefined);
      setLetter(generatedLetter);
    }
  };

  const handleReset = () => {
    setStep('info');
    setUserProfile(null);
    setAnswers({});
    setAssessment('');
    setLetter('');
    setCaseId('');
    setLocalTier('free');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isInFlow = step !== 'info';
  const stepIndex = step === 'userinfo' ? 1 : step === 'questions' ? 2 : 3;

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
              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">{category.seoTitle}</h1>
              <p className="text-lg text-muted-foreground max-w-xl">{category.seoDescription}</p>
            </div>

            <button
              onClick={handleStartFlow}
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground hover:bg-accent/90 font-bold px-6 py-3 rounded-xl shadow-lg transition-colors text-base"
            >
              Starta ditt ärende <ArrowRight className="w-5 h-5" />
            </button>

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

            {category.faqs.length > 0 && (
              <section aria-label="Vanliga frågor" className="mt-16">
                <h2 className="text-xl font-bold text-foreground mb-4">Vanliga frågor</h2>
                <div className="card-elevated divide-y divide-border">
                  {category.faqs.map((faq, i) => (
                    <details key={i} className="group">
                      <summary className="px-5 py-4 text-sm font-medium text-foreground cursor-pointer list-none flex items-center justify-between hover:bg-muted/30 transition-colors">
                        {faq.q}
                        <span className="text-muted-foreground group-open:rotate-180 transition-transform">&#9662;</span>
                      </summary>
                      <p className="px-5 pb-4 text-sm text-muted-foreground">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            <GuidesSection categorySlug={category.slug} categoryTitle={category.title} />
          </div>
        </section>
      )}

      {/* Flow */}
      {isInFlow && (
        <div ref={toolRef} style={{ background: '#F4F6F9', minHeight: '80vh', padding: '48px 16px' }}>
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <ProgressBar current={stepIndex} total={4} />

            <AnimatePresence mode="wait">
              {step === 'userinfo' && (
                <motion.div key="userinfo" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <UserInfoForm categoryTitle={category.title} onSubmit={handleUserInfoSubmit} onBack={handleReset} />
                </motion.div>
              )}

              {step === 'questions' && (
                <motion.div key="questions" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <QuestionFlow category={category} onSubmit={handleQuestionsSubmit} onBack={() => setStep('userinfo')} />
                </motion.div>
              )}

              {step === 'loading' && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div
                    style={{
                      background: '#FFFFFF',
                      borderRadius: 16,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)',
                      border: '1px solid rgba(0,0,0,0.06)',
                      padding: '80px 48px',
                      maxWidth: 640,
                      margin: '0 auto',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ width: 40, height: 40, border: '3px solid #E2E8F0', borderTopColor: '#1B4F8A', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
                    <p style={{ color: '#6B7280', fontWeight: 500 }}>Analyserar din situation mot gällande lagstiftning...</p>
                  </div>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </motion.div>
              )}

              {step === 'assessment' && (
                <motion.div key="assessment" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
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
        </div>
      )}
    </main>
  );
};

export default CategoryPage;
