import type { BadgeCriteria, BadgeTier } from '@prisma/client';

export interface BadgeDraft {
  code: string;
  nameFr: string;
  nameAr: string;
  descriptionFr: string;
  descriptionAr: string;
  icon: string;
  tier: BadgeTier;
  criteria: BadgeCriteria;
  threshold: number;
  xpReward: number;
}

const FAMILIES: {
  criteria: BadgeCriteria;
  icon: string;
  thresholds: number[];
  labelFr: (n: number) => string;
  labelAr: (n: number) => string;
  descFr: (n: number) => string;
  descAr: (n: number) => string;
}[] = [
  {
    criteria: 'XP_TOTAL',
    icon: 'zap',
    thresholds: [100, 500, 1000, 2500, 5000, 10000, 25000, 50000],
    labelFr: (n) => `Collectionneur ${n} XP`,
    labelAr: (n) => `جامع ${n} نقطة`,
    descFr: (n) => `Cumuler ${n} points d experience.`,
    descAr: (n) => `جمع ${n} نقطة خبرة.`,
  },
  {
    criteria: 'STREAK_DAYS',
    icon: 'flame',
    thresholds: [3, 7, 14, 30, 60, 100, 180],
    labelFr: (n) => `Serie de ${n} jours`,
    labelAr: (n) => `سلسلة ${n} يومًا`,
    descFr: (n) => `Apprendre ${n} jours d affilee sans interruption.`,
    descAr: (n) => `التعلّم ${n} يومًا متتاليًا دون انقطاع.`,
  },
  {
    criteria: 'LESSONS_COMPLETED',
    icon: 'book-open',
    thresholds: [1, 5, 10, 25, 50, 80, 120],
    labelFr: (n) => `${n} lecon(s) terminee(s)`,
    labelAr: (n) => `${n} درسًا مكتملًا`,
    descFr: (n) => `Terminer ${n} lecon(s) du catalogue.`,
    descAr: (n) => `إكمال ${n} درسًا من الكتالوج.`,
  },
  {
    criteria: 'COURSES_COMPLETED',
    icon: 'graduation-cap',
    thresholds: [1, 3, 5, 10, 15, 20, 30],
    labelFr: (n) => `${n} cours acheve(s)`,
    labelAr: (n) => `${n} دورة مكتملة`,
    descFr: (n) => `Aller au bout de ${n} cours complet(s).`,
    descAr: (n) => `إتمام ${n} دورة كاملة.`,
  },
  {
    criteria: 'EXERCISES_PASSED',
    icon: 'target',
    thresholds: [1, 10, 25, 50, 100, 200, 300],
    labelFr: (n) => `${n} exercice(s) reussi(s)`,
    labelAr: (n) => `${n} تمرينًا ناجحًا`,
    descFr: (n) => `Reussir ${n} exercice(s) au-dessus du seuil.`,
    descAr: (n) => `النجاح في ${n} تمرينًا فوق حدّ النجاح.`,
  },
  {
    criteria: 'FLASHCARDS_REVIEWED',
    icon: 'layers',
    thresholds: [10, 50, 100, 250, 500, 1000, 2000],
    labelFr: (n) => `${n} cartes revisees`,
    labelAr: (n) => `${n} بطاقة مُراجَعة`,
    descFr: (n) => `Reviser ${n} cartes en revision espacee.`,
    descAr: (n) => `مراجعة ${n} بطاقة في المراجعة المتباعدة.`,
  },
  {
    criteria: 'PERFECT_SCORES',
    icon: 'star',
    thresholds: [1, 5, 10, 25, 50, 100, 200],
    labelFr: (n) => `${n} score(s) parfait(s)`,
    labelAr: (n) => `${n} نتيجة كاملة`,
    descFr: (n) => `Obtenir ${n} fois 100 % a un exercice.`,
    descAr: (n) => `الحصول ${n} مرة على 100% في تمرين.`,
  },
];

const TIERS: BadgeTier[] = ['BRONZE', 'BRONZE', 'SILVER', 'SILVER', 'GOLD', 'GOLD', 'PLATINUM', 'PLATINUM'];

/** 50 badges generes a partir de sept familles de criteres. */
export function buildBadges(): BadgeDraft[] {
  const badges: BadgeDraft[] = [];
  for (const family of FAMILIES) {
    family.thresholds.forEach((threshold, index) => {
      badges.push({
        code: `${family.criteria.toLowerCase()}_${threshold}`,
        nameFr: family.labelFr(threshold),
        nameAr: family.labelAr(threshold),
        descriptionFr: family.descFr(threshold),
        descriptionAr: family.descAr(threshold),
        icon: family.icon,
        tier: TIERS[index] ?? 'PLATINUM',
        criteria: family.criteria,
        threshold,
        xpReward: 25 + index * 25,
      });
    });
  }
  return badges;
}
