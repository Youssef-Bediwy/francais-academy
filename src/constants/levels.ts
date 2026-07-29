import type { CefrLevel } from '@prisma/client';

export const CEFR_LEVELS: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const LEVEL_META: Record<CefrLevel, { labelFr: string; labelAr: string; color: string }> = {
  A1: { labelFr: 'Debutant', labelAr: 'مبتدئ', color: 'bg-teal-100 text-teal-700' },
  A2: { labelFr: 'Elementaire', labelAr: 'ابتدائي', color: 'bg-teal-100 text-teal-700' },
  B1: { labelFr: 'Intermediaire', labelAr: 'متوسط', color: 'bg-sun-100 text-brand-700' },
  B2: { labelFr: 'Intermediaire +', labelAr: 'متوسط متقدم', color: 'bg-sun-100 text-brand-700' },
  C1: { labelFr: 'Avance', labelAr: 'متقدم', color: 'bg-berry-100 text-berry-600' },
  C2: { labelFr: 'Maitrise', labelAr: 'إتقان', color: 'bg-berry-100 text-berry-600' },
};

export const levelIndex = (level: CefrLevel) => CEFR_LEVELS.indexOf(level);
