import type { ExerciseType } from '@prisma/client';

export const EXERCISE_TYPES: ExerciseType[] = [
  'MCQ',
  'FLASHCARD',
  'FILL_BLANK',
  'MATCHING',
  'WORD_ORDER',
  'TRUE_FALSE',
  'SENTENCE_COMPLETION',
  'LISTENING',
  'PRONUNCIATION',
];

export const EXERCISE_META: Record<ExerciseType, { labelFr: string; labelAr: string; icon: string }> = {
  MCQ: { labelFr: 'QCM', labelAr: 'اختيار من متعدد', icon: 'list-checks' },
  FLASHCARD: { labelFr: 'Cartes memoire', labelAr: 'بطاقات', icon: 'layers' },
  FILL_BLANK: { labelFr: 'Texte a trous', labelAr: 'املأ الفراغ', icon: 'pencil-line' },
  MATCHING: { labelFr: 'Association', labelAr: 'توصيل', icon: 'git-compare' },
  WORD_ORDER: { labelFr: 'Mots en ordre', labelAr: 'ترتيب الكلمات', icon: 'arrow-left-right' },
  TRUE_FALSE: { labelFr: 'Vrai ou faux', labelAr: 'صح أو خطأ', icon: 'check-check' },
  SENTENCE_COMPLETION: { labelFr: 'Completer la phrase', labelAr: 'أكمل الجملة', icon: 'text-cursor-input' },
  LISTENING: { labelFr: 'Ecoute audio', labelAr: 'استماع', icon: 'headphones' },
  PRONUNCIATION: { labelFr: 'Prononciation', labelAr: 'نطق', icon: 'mic' },
};

/** Types dont la reponse attendue est un texte libre normalise. */
export const FREE_TEXT_TYPES: ExerciseType[] = ['FILL_BLANK', 'SENTENCE_COMPLETION', 'PRONUNCIATION'];
