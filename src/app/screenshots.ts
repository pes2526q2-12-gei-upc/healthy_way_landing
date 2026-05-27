import type { Language } from './context/LanguageContext';

export const SCREENSHOT_STEPS = [
  { file: '01-home.png', titleKey: 'showcase1Title' as const },
  { file: '02-zona-capturada.png', titleKey: 'showcase2Title' as const },
  { file: '03-explorar-rutas.png', titleKey: 'showcase3Title' as const },
  { file: '04-ver-ruta.png', titleKey: 'showcase4Title' as const },
  { file: '05-ruta-en-marcha.png', titleKey: 'showcase5Title' as const },
  { file: '06-ranking.png', titleKey: 'showcase6Title' as const },
  { file: '07-chat.png', titleKey: 'showcase7Title' as const },
  { file: '08-descuento.png', titleKey: 'showcase8Title' as const },
] as const;

export function screenshotUrl(lang: Language, file: string): string {
  return `${import.meta.env.BASE_URL}screenshots/${lang}/${file}`;
}
