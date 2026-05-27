import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { translations, type Language } from '../translations';

const STORAGE_KEY = 'healthyway.lang';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations['ca'];
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LANGUAGES: Language[] = ['ca', 'es', 'en'];
export const LANG_LABELS: Record<Language, string> = { ca: 'CA', es: 'ES', en: 'EN' };

function isLanguage(value: string | null): value is Language {
  return value === 'ca' || value === 'es' || value === 'en';
}

function readStoredLanguage(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isLanguage(stored)) {
      return stored;
    }
  } catch {
    /* ignore */
  }
  return 'ca';
}

function applyDocumentLang(lang: Language) {
  document.documentElement.lang = lang;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(readStoredLanguage);

  useEffect(() => {
    applyDocumentLang(lang);
  }, [lang]);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    applyDocumentLang(next);
  }, []);

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
