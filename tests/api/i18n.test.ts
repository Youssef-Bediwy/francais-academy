import { describe, expect, it } from 'vitest';
import fr from '@/messages/fr.json';
import ar from '@/messages/ar.json';
import { getDirection, isLocale, locales, resolveLocale } from '@/lib/i18n/config';

function flatten(input: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(input).flatMap(([key, value]) =>
    value && typeof value === 'object'
      ? flatten(value as Record<string, unknown>, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  );
}

describe('internationalisation', () => {
  it('expose deux locales et la bonne direction', () => {
    expect(locales).toEqual(['fr', 'ar']);
    expect(getDirection('ar')).toBe('rtl');
    expect(getDirection('fr')).toBe('ltr');
  });

  it('valide et retombe sur le francais', () => {
    expect(isLocale('ar')).toBe(true);
    expect(isLocale('es')).toBe(false);
    expect(resolveLocale('es')).toBe('fr');
  });

  it('garde les dictionnaires strictement synchronises', () => {
    const frKeys = flatten(fr as Record<string, unknown>).sort();
    const arKeys = flatten(ar as Record<string, unknown>).sort();
    expect(arKeys).toEqual(frKeys);
    expect(frKeys.length).toBeGreaterThan(300);
  });

  it('conserve les variables d interpolation dans les deux langues', () => {
    expect((fr as Record<string, Record<string, string>>).dashboard!.greeting).toContain('{name}');
    expect((ar as Record<string, Record<string, string>>).dashboard!.greeting).toContain('{name}');
  });
});
