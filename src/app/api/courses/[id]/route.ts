import { noContent, ok, parseBody, withAdmin, withErrorHandling } from '@/lib/api';
import { updateCourseSchema } from '@/lib/validation/course.schema';
import { courseRepository } from '@/repositories/course.repository';
import { courseService } from '@/services/course.service';
import { CacheTag, invalidate } from '@/lib/cache';

type Params = { id: string };

export const GET = withErrorHandling<Params>(async (_req, { params }) =>
  ok(await courseService.byId(params.id)),
);

export const PATCH = withAdmin<Params>(async (req, { params }) => {
  const input = await parseBody(req, updateCourseSchema);
  const { categoryId, ...rest } = input;
  const course = await courseRepository.update(params.id, {
    ...rest,
    ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
  });
  invalidate(CacheTag.courses, CacheTag.course(params.id));
  return ok(course);
});

export const DELETE = withAdmin<Params>(async (_req, { params }) => {
  await courseRepository.delete(params.id);
  invalidate(CacheTag.courses);
  return noContent();
});
