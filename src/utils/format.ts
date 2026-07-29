import type { AppLocale } from '@/lib/i18n/config';

const intlLocale: Record<AppLocale, string> = { fr: 'fr-FR', ar: 'ar' };

export function formatNumber(value: number, locale: AppLocale = 'fr'): string {
  return new Intl.NumberFormat(intlLocale[locale]).format(value);
}

export function formatCompact(value: number, locale: AppLocale = 'fr'): string {
  return new Intl.NumberFormat(intlLocale[locale], { notation: 'compact' }).format(value);
}

export function formatDate(date: Date | string, locale: AppLocale = 'fr'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(intlLocale[locale], { dateStyle: 'long' }).format(d);
}

/** 3600 -> "1 h", 5400 -> "1 h 30", 120 -> "2 min". */
export function formatDuration(seconds: number, locale: AppLocale = 'fr'): string {
  const total = Math.max(0, Math.round(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const hourUnit = locale === 'ar' ? 'س' : 'h';
  const minuteUnit = locale === 'ar' ? 'د' : 'min';
  if (hours && minutes) return `${hours} ${hourUnit} ${String(minutes).padStart(2, '0')}`;
  if (hours) return `${hours} ${hourUnit}`;
  if (minutes) return `${minutes} ${minuteUnit}`;
  return locale === 'ar' ? `${total} ث` : `${total} s`;
}

export function formatMinutes(minutes: number, locale: AppLocale = 'fr'): string {
  return formatDuration(minutes * 60, locale);
}

export const formatPercent = (value: number) => `${Math.round(clampPercent(value))} %`;

export const clampPercent = (value: number) => Math.min(100, Math.max(0, value));
