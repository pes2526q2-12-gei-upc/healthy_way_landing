import { useLanguage, LANGUAGES, LANG_LABELS } from '../context/LanguageContext';

type LanguageSwitcherProps = {
  variant?: 'hero' | 'light';
  className?: string;
};

export function LanguageSwitcher({ variant = 'light', className = '' }: LanguageSwitcherProps) {
  const { lang, setLang } = useLanguage();

  const base =
    variant === 'hero'
      ? 'absolute top-4 right-4 z-20 flex gap-1'
      : 'flex gap-1';

  return (
    <div className={`${base} ${className}`.trim()}>
      {LANGUAGES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={
            variant === 'hero'
              ? `rounded px-3 py-1 text-sm font-semibold transition ${
                  lang === l
                    ? 'bg-white text-brand shadow'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`
              : `rounded px-3 py-1 text-sm font-semibold transition ${
                  lang === l
                    ? 'bg-brand text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`
          }
        >
          {LANG_LABELS[l]}
        </button>
      ))}
    </div>
  );
}
