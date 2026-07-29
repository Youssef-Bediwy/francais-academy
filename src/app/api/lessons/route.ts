import { created, ok, parseBody, parseQuery, withAdmin, withErrorHandling } from '@/lib/api';
import { buildMeta } from '@/lib/api/response';
import { createLessonSchema, lessonQuerySchema } from '@/lib/validation/lesson.schema';
import { lessonRepository } from '@/repositories/lesson.repository';
import { CacheTag, invalidate } from '@/lib/cache';
import { slugify } from '@/utils/slugify';

export const GET = withErrorHandling(async (req) => {
  const query = parseQuery(req, lessonQuerySchema);
  const { items, total } = await lessonRepository.findMany(query);
  return ok(items, buildMeta(query.page, query.perPage, total));
});

export const POST = withAdmin(async (req) => {
  const input = await parseBody(req, createLessonSchema);
  const { courseId, examples, ...rest } = input;
  const lesson = await lessonRepository.create({
    ...rest,
    examples,
    slug: `${slugify(input.titleFr)}-${Date.now().toString(36)}`,
    course: { connect: { id: courseId } },
  });
  invalidate(CacheTag.lessons, CacheTag.course(courseId));
  return created(lesson);
});
