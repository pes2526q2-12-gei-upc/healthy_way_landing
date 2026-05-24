import { createContext, useContext, useState, type ReactNode } from 'react';
import { translations, type Language } from '../translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations['ca'];
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LANGUAGES: Language[] = ['ca', 'es', 'en'];
export const LANG_LABELS: Record<Language, string> = { ca: 'CA', es: 'ES', en: 'EN' };

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('ca');
  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
