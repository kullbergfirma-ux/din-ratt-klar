import { type Category } from '@/lib/categories';
import { type UserProfile } from '@/components/UserInfoForm';
import { supabase } from '@/integrations/supabase/client';

export function validateBeforeAnalysis(category: Category, answers: Record<string, string>): string | null {
  const narrativeQuestionIds = category.questions
    .filter(q => q.type === 'text')
    .filter(q => {
      const content = `${q.label} ${q.placeholder ?? ''}`.toLowerCase();
      return /(beskriv|vad hände|vad är felet|vad är problemet|situationen|problemet|vad sa de|kontaktat)/.test(content);
    })
    .map(q => q.id);

  const hasShortNarrativeAnswer = narrativeQuestionIds.some(fieldId => {
    const value = answers[fieldId];
    return typeof value === 'string' && value.trim().length > 0 && value.trim().length < 30;
  });

  if (hasShortNarrativeAnswer) {
    return 'Beskriv ditt ärende mer detaljerat så att vi kan göra en korrekt bedömning.';
  }

  const noProblemKeywords = [
    'fungerar bra', 'nöjd', 'inga problem', 'vill bara testa', 'testar',
    'allt är som det ska', 'inget fel', 'fungerar perfekt', 'är nöjd',
    'bara testa', 'provkör', 'inga klagomål', 'allt fungerar',
    'testing', 'test', 'just testing', 'bara kollar', 'inte köpt',
    'inte något fel', 'inget problem',
  ];
  const allText = Object.values(answers).join(' ').toLowerCase();
  for (const keyword of noProblemKeywords) {
    if (allText.includes(keyword)) {
      return 'Det verkar inte finnas ett aktivt problem i ditt ärende. Fyll i vad som faktiskt gick fel för att få en bedömning.';
    }
  }

  return null;
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function getAIAssessment(
  category: Category,
  answers: Record<string, string>,
  files?: Record<string, File[]>
): Promise<{ assessment: string; sentiment: 'positive' | 'uncertain' | 'negative' }> {
  const answersText = category.questions
    .filter(q => answers[q.id])
    .map(q => `${q.label}: ${answers[q.id]}`)
    .join('\n');

  // Build file descriptions for the edge function
  let fileDescriptions = '';
  if (files) {
    const fileNames: string[] = [];
    for (const [questionId, fileList] of Object.entries(files)) {
      for (const file of fileList) {
        fileNames.push(`${questionId}: ${file.name} (${file.type})`);
      }
    }
    if (fileNames.length > 0) {
      fileDescriptions = '\n\nUppladdade filer:\n' + fileNames.join('\n');
    }
  }

  const { data, error } = await supabase.functions.invoke('ai-assess', {
    body: {
      type: 'assessment',
      categoryTitle: category.title,
      answersText: answersText + fileDescriptions,
    },
  });

  if (error) throw error;

  if (data.error) {
    throw new Error(data.error);
  }

  return {
    assessment: data.assessment || '',
    sentiment: data.sentiment || 'uncertain',
  };
}

export async function getAILetter(
  category: Category,
  answers: Record<string, string>,
  assessment: string,
  profile?: UserProfile
): Promise<string> {
  const answersText = category.questions
    .filter(q => answers[q.id])
    .map(q => `${q.label}: ${answers[q.id]}`)
    .join('\n');

  const { data, error } = await supabase.functions.invoke('ai-assess', {
    body: {
      type: 'letter',
      categoryTitle: category.title,
      answersText,
      assessment,
      profile: profile ? {
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        postalCode: profile.postalCode,
        city: profile.city,
        streetAddress: profile.streetAddress,
        counterparty: profile.counterparty,
      } : undefined,
    },
  });

  if (error) throw error;

  if (data.error) {
    throw new Error(data.error);
  }

  return data.letter || '';
}
