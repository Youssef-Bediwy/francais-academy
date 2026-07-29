import { z } from 'zod';
import { cefrLevelSchema, idSchema, paginationSchema } from './common.schema';

export const favoriteSchema = z
  .object({
    type: z.enum(['COURSE', 'LESSON', 'FLASHCARD']),
    targetId: idSchema,
  })
  .strict();

export const reviewGradeSchema = z.object({
  flashcardId: idSchema,
  grade: z.enum(['AGAIN', 'HARD', 'GOOD', 'EASY']),
  durationSeconds: z.number().int().min(0).max(3600).default(0),
});

export const reviewQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(20),
  level: cefrLevelSchema.optional(),
});

export const searchQuerySchema = paginationSchema.extend({
  q: z.string().trim().min(1, 'Saisissez un terme').max(120),
  scope: z.enum(['all', 'courses', 'lessons', 'vocabulary']).default('all'),
  level: cefrLevelSchema.optional(),
});

export const flashcardSchema = z.object({
  frontFr: z.string().min(1).max(200),
  backAr: z.string().min(1).max(200),
  hintFr: z.string().max(200).nullish(),
  audioUrl: z.string().url().nullish(),
  level: cefrLevelSchema.default('A1'),
  categoryId: idSchema.nullish(),
  vocabularyId: idSchema.nullish(),
});

export const categorySchema = z.object({
  skill: z.enum([
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
  ]),
  nameFr: z.string().min(2).max(80),
  nameAr: z.string().min(2).max(80),
  descriptionFr: z.string().min(10).max(500),
  descriptionAr: z.string().min(10).max(500),
  icon: z.string().min(1).max(60),
  color: z.string().min(3).max(40),
  position: z.number().int().min(0).default(0),
});

export const dailyGoalSchema = z.object({
  targetXp: z.number().int().min(10).max(1000),
  targetLessons: z.number().int().min(1).max(20),
  targetMinutes: z.number().int().min(5).max(480),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  locale: z.enum(['FR', 'AR']).optional(),
  level: cefrLevelSchema.optional(),
  role: z.enum(['USER', 'ADMIN']).optional(),
  avatarUrl: z.string().url().nullish(),
});

export const trackTimeSchema = z.object({
  lessonId: idSchema.optional(),
  courseId: idSchema.optional(),
  seconds: z.number().int().min(1).max(7200),
});
