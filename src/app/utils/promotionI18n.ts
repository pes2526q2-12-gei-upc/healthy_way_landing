export const PROMOTION_LOCALES = ['ca', 'es', 'en'] as const;
export type PromotionLocale = (typeof PROMOTION_LOCALES)[number];

export type PromotionDescriptionI18n = {
  ca?: string | null;
  es?: string | null;
  en?: string | null;
};

export function resolveLocalizedDescription(
  descriptionI18n: PromotionDescriptionI18n | null | undefined,
  locale: PromotionLocale | null | undefined,
  legacyDescription: string | null | undefined,
): string | null {
  if (locale && descriptionI18n?.[locale]) {
    return descriptionI18n[locale] ?? null;
  }
  for (const key of PROMOTION_LOCALES) {
    if (descriptionI18n?.[key]) {
      return descriptionI18n[key] ?? null;
    }
  }
  return legacyDescription ?? null;
}
