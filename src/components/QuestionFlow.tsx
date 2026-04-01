import { useState } from 'react';
import { type Category, type CategoryQuestion } from '@/lib/categories';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import AutocompleteInput from '@/components/AutocompleteInput';
import { questionCompanyMap } from '@/data/companies';

interface Props {
  category: Category;
  onSubmit: (answers: Record<string, string>) => void;
  onBack: () => void;
}

const QuestionFlow = ({ category, onSubmit, onBack }: Props) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQ, setCurrentQ] = useState(0);

  // Filter questions based on conditional logic
  const getVisibleQuestions = (): CategoryQuestion[] => {
    return category.questions.filter(q => {
      if (q.showWhen) {
        const depAnswer = answers[q.showWhen.questionId];
        return q.showWhen.values.includes(depAnswer);
      }
      return true;
    });
  };

  const questions = getVisibleQuestions();
  const question = questions[currentQ];
  if (!question) return null;

  const isLast = currentQ === questions.length - 1;
  const canProceed = !!answers[question.id]?.trim();

  const handleNext = () => {
    if (isLast) {
      onSubmit(answers);
    } else {
      setCurrentQ(currentQ + 1);
    }
  };

  const handlePrev = () => {
    if (currentQ === 0) {
      onBack();
    } else {
      setCurrentQ(currentQ - 1);
    }
  };

  const hasSuggestions = (qId: string): string[] | undefined => {
    return questionCompanyMap[qId];
  };

  const renderInput = (q: CategoryQuestion) => {
    const value = answers[q.id] || '';
    const onChange = (val: string) => setAnswers({ ...answers, [q.id]: val });
    const suggestions = hasSuggestions(q.id);

    if (q.type === 'select' && q.options) {
      return (
        <div className="flex flex-wrap gap-2">
          {q.options.map((opt) => (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                value === opt
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-foreground border-border hover:border-primary/40'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      );
    }

    if (q.type === 'date') {
      return (
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      );
    }

    // Text input — with or without autocomplete
    if (suggestions) {
      return (
        <AutocompleteInput
          value={value}
          onChange={onChange}
          suggestions={suggestions}
          placeholder={q.placeholder}
          onKeyDown={(e) => e.key === 'Enter' && canProceed && handleNext()}
        />
      );
    }

    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={q.placeholder}
        className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        onKeyDown={(e) => e.key === 'Enter' && canProceed && handleNext()}
      />
    );
  };

  return (
    <motion.div
      key={currentQ}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
    >
      <div className="card-elevated p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">{category.emoji}</span>
          <div>
            <p className="text-xs text-muted-foreground font-medium">
              Fråga {currentQ + 1} av {questions.length}
            </p>
            <h3 className="text-lg font-semibold text-foreground">{question.label}</h3>
          </div>
        </div>

        <div className="mb-8">{renderInput(question)}</div>

        <div className="flex justify-between">
          <Button variant="ghost" onClick={handlePrev} className="gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            Tillbaka
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLast ? 'Analysera' : 'Nästa'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default QuestionFlow;
