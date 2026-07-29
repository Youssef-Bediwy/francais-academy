import { courseRepository } from '@/repositories/course.repository';
import { lessonRepository } from '@/repositories/lesson.repository';
import { vocabularyRepository } from '@/repositories/vocabulary.repository';
import { toCourseDto } from './mappers';
import type { z } from 'zod';
import type { searchQuerySchema } from '@/lib/validation/misc.schema';

export type SearchQuery = z.infer<typeof searchQuerySchema>;

export const searchService = {
  async run(query: SearchQuery) {
    const wantsCourses = query.scope === 'all' || query.scope === 'courses';
    const wantsLessons = query.scope === 'all' || query.scope === 'lessons';
    const wantsWords = query.scope === 'all' || query.scope === 'vocabulary';

    const [courses, lessons, words] = await Promise.all([
      wantsCourses
        ? courseRepository.findMany({
            page: query.page,
            perPage: query.perPage,
            search: query.q,
            level: query.level,
            sort: 'popular',
          })
        : Promise.resolve({ items: [], total: 0 }),
      wantsLessons
        ? lessonRepository.findMany({ page: query.page, perPage: query.perPage, search: query.q })
        : Promise.resolve({ items: [], total: 0 }),
      wantsWords
        ? vocabularyRepository.findMany({
            page: query.page,
            perPage: query.perPage,
            search: query.q,
            level: query.level,
          })
        : Promise.resolve({ items: [], total: 0 }),
    ]);

    return {
      query: query.q,
      courses: { items: courses.items.map((c) => toCourseDto(c)), total: courses.total },
      lessons: {
        items: lessons.items.map((lesson) => ({
          id: lesson.id,
          slug: lesson.slug,
          courseId: lesson.courseId,
          titleFr: lesson.titleFr,
          titleAr: lesson.titleAr,
          summaryFr: lesson.summaryFr,
          summaryAr: lesson.summaryAr,
        })),
        total: lessons.total,
      },
      vocabulary: { items: words.items, total: words.total },
      total: courses.total + lessons.total + words.total,
    };
  },
};
