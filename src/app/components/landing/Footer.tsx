import { useLanguage } from '../../context/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative z-10 bg-slate-900 py-10 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-lg font-semibold text-white">{t.footerBrand}</p>
        <p className="mt-1 text-sm">{t.footerTagline}</p>
        <p className="mt-6 text-sm">{t.footerCopyright}</p>
      </div>
    </footer>
  );
}
