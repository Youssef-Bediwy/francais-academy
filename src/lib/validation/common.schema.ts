import { z } from 'zod';
import { PAGINATION } from '@/constants';

export const cefrLevelSchema = z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);
export const skillSchema = z.enum([
  'GRAMMAR',
  'CONJUGATION',
  'SPELLING',
  'VOCABULARY',
  'PRONUNCIATION',
  'LISTENING',
  'READING',
  'EXPRESSIONS',
  'CULTURE',
  'EXAM_PREP',
]);
export const exerciseTypeSchema = z.enum([
  'MCQ',
  'FLASHCARD',
  'FILL_BLANK',
  'MATCHING',
  'WORD_ORDER',
  'TRUE_FALSE',
  'SENTENCE_COMPLETION',
  'LISTENING',
  'PRONUNCIATION',
]);
export const localeSchema = z.enum(['fr', 'ar']);
export const idSchema = z.string().min(1, 'Identifiant requis');

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(PAGINATION.defaultPage),
  perPage: z.coerce
    .number()
    .int()
    .positive()
    .max(PAGINATION.maxPerPage)
    .default(PAGINATION.defaultPerPage),
});

export const sortSchema = z.enum(['recent', 'popular', 'level', 'alphabetical', 'progress']);

export type PaginationInput = z.infer<typeof paginationSchema>;
export type SortOption = z.infer<typeof sortSchema>;
