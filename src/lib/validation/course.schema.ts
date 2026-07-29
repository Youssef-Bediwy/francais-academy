import { z } from 'zod';
import { cefrLevelSchema, idSchema, paginationSchema, sortSchema } from './common.schema';

export const courseQuerySchema = paginationSchema.extend({
  search: z.string().trim().max(120).optional(),
  category: z.string().trim().optional(),
  level: cefrLevelSchema.optional(),
  sort: sortSchema.default('popular'),
});

export const createCourseSchema = z.object({
  categoryId: idSchema,
  titleFr: z.string().min(3).max(140),
  titleAr: z.string().min(3).max(140),
  descriptionFr: z.string().min(10).max(1200),
  descriptionAr: z.string().min(10).max(1200),
  level: cefrLevelSchema,
  estimatedMinutes: z.number().int().min(5).max(6000).default(60),
  coverImage: z.string().url().nullish(),
  position: z.number().int().min(0).default(0),
  isPublished: z.boolean().default(true),
});

export const updateCourseSchema = createCourseSchema.partial();

export type CourseQuery = z.infer<typeof courseQuerySchema>;
export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
