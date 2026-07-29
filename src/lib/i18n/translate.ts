import type { AppLocale } from './config';

export type Messages = Record<string, unknown>;
export type Translator = (key: string, vars?: Record<string, string | number>) => string;

function lookup(messages: Messages, key: string): unknown {
  return key.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, messages);
}

/** Cree un traducteur : cles pointees + interpolation {variable}. */
export function createTranslator(messages: Messages): Translator {
  return (key, vars) => {
    const value = lookup(messages, key);
    if (typeof value !== 'string') return key;
    if (!vars) return value;
    return value.replace(/\{(\w+)\}/g, (match, name: string) =>
      name in vars ? String(vars[name]) : match,
    );
  };
}

/** Choisit le champ localise d'une entite bilingue (titleFr / titleAr). */
export function pickLocalized<T extends Record<string, unknown>>(
  entity: T,
  base: string,
  locale: AppLocale,
): string {
  const suffix = locale === 'ar' ? 'Ar' : 'Fr';
  const value = entity[`${base}${suffix}`] ?? entity[`${base}Fr`];
  return typeof value === 'string' ? value : '';
}
