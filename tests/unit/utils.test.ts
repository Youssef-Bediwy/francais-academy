import { describe, expect, it } from 'vitest';
import { levelFromXp } from '@/utils/level';
import { normalizeAnswer, answersMatch, initials, truncate } from '@/utils/text';
import { slugify } from '@/utils/slugify';
import { formatDuration, formatPercent, clampPercent } from '@/utils/format';
import { daysBetween, addDays, startOfDayUtc, toIsoDate } from '@/utils/date';
import { shuffle, chunk, groupBy } from '@/utils/array';
import { createTranslator, pickLocalized } from '@/lib/i18n/translate';
import { XP_PER_LEVEL } from '@/constants/gamification';

describe('levelFromXp', () => {
  it('demarre au niveau 1', () => {
    expect(levelFromXp(0).level).toBe(1);
    expect(levelFromXp(-50).level).toBe(1);
  });

  it('passe au niveau suivant au palier', () => {
    expect(levelFromXp(XP_PER_LEVEL).level).toBe(2);
    expect(levelFromXp(XP_PER_LEVEL * 3 + 10).level).toBe(4);
  });

  it('expose la progression interne', () => {
    const info = levelFromXp(XP_PER_LEVEL + 100);
    expect(info.xpIntoLevel).toBe(100);
    expect(info.percentToNextLevel).toBe(Math.round((100 / XP_PER_LEVEL) * 100));
  });
});

describe('normalisation de texte', () => {
  it('ignore accents, casse et ponctuation', () => {
    expect(normalizeAnswer('  Élève, ')).toBe('eleve');
    expect(answersMatch('Ça va !', 'ca va')).toBe(true);
    expect(answersMatch('chien', 'chat')).toBe(false);
  });

  it('genere des initiales et tronque', () => {
    expect(initials('Karim Haddad')).toBe('KH');
    expect(truncate('abcdef', 4)).toHaveLength(4);
  });
});

describe('slugify', () => {
  it('produit un slug propre', () => {
    expect(slugify('Les bases de la phrase française !')).toBe('les-bases-de-la-phrase-francaise');
  });
});

describe('formatage', () => {
  it('formate les durees', () => {
    expect(formatDuration(5400)).toBe('1 h 30');
    expect(formatDuration(3600)).toBe('1 h');
    expect(formatDuration(120)).toBe('2 min');
  });

  it('borne les pourcentages', () => {
    expect(clampPercent(140)).toBe(100);
    expect(clampPercent(-4)).toBe(0);
    expect(formatPercent(66.6)).toBe('67 %');
  });
});

describe('dates', () => {
  it('compte les jours et normalise a minuit UTC', () => {
    const day = startOfDayUtc(new Date('2026-07-29T18:45:00Z'));
    expect(toIsoDate(day)).toBe('2026-07-29');
    expect(daysBetween(day, addDays(day, 3))).toBe(3);
  });
});

describe('tableaux', () => {
  it('melange sans perdre d element', () => {
    const source = [1, 2, 3, 4, 5];
    const mixed = shuffle(source, 42);
    expect(mixed).toHaveLength(5);
    expect([...mixed].sort()).toEqual(source);
  });

  it('decoupe et regroupe', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(groupBy(['aa', 'ab', 'bc'], (item) => item[0] as 'a' | 'b')).toEqual({
      a: ['aa', 'ab'],
      b: ['bc'],
    });
  });
});

describe('traduction', () => {
  const t = createTranslator({ nav: { courses: 'Cours' }, dashboard: { greeting: 'Bonjour {name}' } });

  it('resout une cle pointee', () => {
    expect(t('nav.courses')).toBe('Cours');
  });

  it('interpole les variables', () => {
    expect(t('dashboard.greeting', { name: 'Karim' })).toBe('Bonjour Karim');
  });

  it('retourne la cle si absente', () => {
    expect(t('nav.inconnu')).toBe('nav.inconnu');
  });

  it('choisit le champ localise', () => {
    const entity = { titleFr: 'Grammaire', titleAr: 'القواعد' };
    expect(pickLocalized(entity, 'title', 'ar')).toBe('القواعد');
    expect(pickLocalized(entity, 'title', 'fr')).toBe('Grammaire');
  });
});
