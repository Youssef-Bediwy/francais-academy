export const locales = ['fr', 'ar'] as const;
export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = 'fr';

export const direction: Record<AppLocale, 'ltr' | 'rtl'> = { fr: 'ltr', ar: 'rtl' };

export const localeNames: Record<AppLocale, string> = { fr: 'Francais', ar: 'العربية' };

export const htmlLang: Record<AppLocale, string> = { fr: 'fr-FR', ar: 'ar' };

export function isLocale(value: unknown): value is AppLocale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

export function resolveLocale(value: unknown): AppLocale {
  return isLocale(value) ? value : defaultLocale;
}

export const getDirection = (locale: AppLocale) => direction[locale];
export const isRtl = (locale: AppLocale) => direction[locale] === 'rtl';
