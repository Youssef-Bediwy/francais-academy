import { NotFoundError } from '@/lib/api/errors';
import { courseRepository } from '@/repositories/course.repository';
import { lessonRepository } from '@/repositories/lesson.repository';
import { categoryRepository } from '@/repositories/category.repository';
import { progressRepository } from '@/repositories/progress.repository';
import { toCategoryDto, toCourseDto, toLessonListItem } from './mappers';
import type { CategoryDto, CourseDto, LessonListItem } from '@/types/content';
import type { Paginated } from '@/types/api';
import type { CourseQuery } from '@/lib/validation/course.schema';

export const courseService = {
  async list(query: CourseQuery, userId?: string): Promise<Paginated<CourseDto>> {
    const { items, total } = await courseRepository.findMany({
      page: query.page,
      perPage: query.perPage,
      search: query.search,
      categorySlug: query.category,
      level: query.level,
      sort: query.sort,
    });

    const progressByCourse = userId
      ? new Map(
          (await progressRepository.findForCourses(userId, items.map((c) => c.id))).map((p) => [
            p.courseId,
            p,
          ]),
        )
      : null;

    return {
      items: items.map((course) =>
        progressByCourse
          ? toCourseDto(course, progressByCourse.get(course.id) ?? null)
          : toCourseDto(course),
      ),
      meta: {
        page: query.page,
        perPage: query.perPage,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.perPage)),
      },
    };
  },

  async popular(take = 6): Promise<CourseDto[]> {
    const courses = await courseRepository.findPopular(take);
    return courses.map((course) => toCourseDto(course));
  },

  async categories(): Promise<CategoryDto[]> {
    const categories = await categoryRepository.findAll();
    return categories.map(toCategoryDto);
  },

  async detail(slug: string, userId?: string) {
    const course = await courseRepository.findBySlug(slug);
    if (!course) throw new NotFoundError('Cours');

    const lessons = await lessonRepository.findByCourseId(course.id);
    const progressByLesson = userId
      ? new Map(
          (await progressRepository.findForLessons(userId, lessons.map((l) => l.id))).map((p) => [
            p.lessonId,
            p,
          ]),
        )
      : null;
    const courseProgress = userId ? await progressRepository.findForCourse(userId, course.id) : null;

    const lessonItems: LessonListItem[] = lessons.map((lesson) =>
      progressByLesson
        ? toLessonListItem(lesson, progressByLesson.get(lesson.id) ?? null)
        : toLessonListItem(lesson),
    );

    return {
      course: userId ? toCourseDto(course, courseProgress) : toCourseDto(course),
      lessons: lessonItems,
    };
  },

  async byId(id: string): Promise<CourseDto> {
    const course = await courseRepository.findById(id);
    if (!course) throw new NotFoundError('Cours');
    return toCourseDto(course);
  },
};
