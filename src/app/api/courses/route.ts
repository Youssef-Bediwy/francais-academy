import { created, ok, parseBody, parseQuery, withAdmin, withErrorHandling } from '@/lib/api';
import { courseQuerySchema, createCourseSchema } from '@/lib/validation/course.schema';
import { courseService } from '@/services/course.service';
import { courseRepository } from '@/repositories/course.repository';
import { getSession } from '@/lib/auth';
import { CacheTag, invalidate } from '@/lib/cache';
import { slugify } from '@/utils/slugify';

export const GET = withErrorHandling(async (req) => {
  const query = parseQuery(req, courseQuerySchema);
  const session = await getSession();
  const result = await courseService.list(query, session?.id);
  return ok(result.items, result.meta);
});

export const POST = withAdmin(async (req) => {
  const { categoryId, ...rest } = await parseBody(req, createCourseSchema);
  const course = await courseRepository.create({
    ...rest,
    slug: `${slugify(rest.titleFr)}-${Date.now().toString(36)}`,
    category: { connect: { id: categoryId } },
  });
  invalidate(CacheTag.courses);
  return created(course);
});
