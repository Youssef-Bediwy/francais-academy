import type { CourseSkill } from '@prisma/client';

export const SKILL_ICONS: Record<CourseSkill, string> = {
  GRAMMAR: 'book-open',
  CONJUGATION: 'clock',
  SPELLING: 'spell-check',
  VOCABULARY: 'library',
  PRONUNCIATION: 'mic',
  LISTENING: 'headphones',
  READING: 'file-text',
  EXPRESSIONS: 'message-circle',
  CULTURE: 'landmark',
  EXAM_PREP: 'graduation-cap',
};
