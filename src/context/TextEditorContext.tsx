import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TextEditorContextType {
  texts: Record<string, string>;
  isAdmin: boolean;
  editingKey: string | null;
  setEditingKey: (key: string | null) => void;
  saveText: (key: string, value: string) => Promise<void>;
  getText: (key: string, fallback: string) => string;
}

const TextEditorContext = createContext<TextEditorContextType>({
  texts: {},
  isAdmin: false,
  editingKey: null,
  setEditingKey: () => {},
  saveText: async () => {},
  getText: (_, fallback) => fallback,
});

export const TextEditorProvider = ({ children }: { children: ReactNode }) => {
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAdmin(!!session);
    });

    supabase.auth.getSession().then(({ data }) => {
      setIsAdmin(!!data.session);
    });

    supabase.from('site_texts').select('*').then(({ data }) => {
      if (data) {
        const map: Record<string, string> = {};
        (data as { key: string; value: string }[]).forEach((row) => { map[row.key] = row.value; });
        setTexts(map);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const saveText = async (key: string, value: string) => {
    setTexts(prev => ({ ...prev, [key]: value }));
    await supabase.from('site_texts').upsert({ key, value, updated_at: new Date().toISOString() } as any, { onConflict: 'key' });
  };

  const getText = (key: string, fallback: string) => texts[key] ?? fallback;

  return (
    <TextEditorContext.Provider value={{ texts, isAdmin, editingKey, setEditingKey, saveText, getText }}>
      {children}
    </TextEditorContext.Provider>
  );
};

export const useTextEditor = () => useContext(TextEditorContext);
