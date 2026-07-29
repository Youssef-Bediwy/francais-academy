import { z } from 'zod';
import { idSchema, paginationSchema } from './common.schema';

export const lessonExampleSchema = z.object({
  fr: z.string().min(1),
  ar: z.string().min(1),
  audioUrl: z.string().url().optional(),
});

export const lessonQuerySchema = paginationSchema.extend({
  courseId: idSchema.optional(),
  search: z.string().trim().max(120).optional(),
});

export const createLessonSchema = z.object({
  courseId: idSchema,
  titleFr: z.string().min(3).max(160),
  titleAr: z.string().min(3).max(160),
  summaryFr: z.string().min(10).max(400),
  summaryAr: z.string().min(10).max(400),
  contentFr: z.string().min(20),
  contentAr: z.string().min(20),
  explanationFr: z.string().min(10),
  explanationAr: z.string().min(10),
  examples: z.array(lessonExampleSchema).default([]),
  illustrationUrl: z.string().url().nullish(),
  audioUrl: z.string().url().nullish(),
  position: z.number().int().min(0).default(0),
  estimatedMinutes: z.number().int().min(1).max(240).default(12),
  xpReward: z.number().int().min(0).max(500).default(20),
  isPublished: z.boolean().default(true),
});

export const updateLessonSchema = createLessonSchema.partial();

export const completeLessonSchema = z.object({
  lessonId: idSchema,
  timeSpentSeconds: z.number().int().min(0).max(24 * 3600).default(0),
});

export type CreateLessonInput = z.infer<typeof createLessonSchema>;
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;
