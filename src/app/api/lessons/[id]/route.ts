import { NotFoundError, noContent, ok, parseBody, withAdmin, withErrorHandling } from '@/lib/api';
import { updateLessonSchema } from '@/lib/validation/lesson.schema';
import { lessonRepository } from '@/repositories/lesson.repository';
import { CacheTag, invalidate } from '@/lib/cache';

type Params = { id: string };

export const GET = withErrorHandling<Params>(async (_req, { params }) => {
  const lesson = await lessonRepository.findById(params.id);
  if (!lesson) throw new NotFoundError('Lecon');
  return ok(lesson);
});

export const PATCH = withAdmin<Params>(async (req, { params }) => {
  const input = await parseBody(req, updateLessonSchema);
  const { courseId, ...rest } = input;
  const lesson = await lessonRepository.update(params.id, {
    ...rest,
    ...(courseId ? { course: { connect: { id: courseId } } } : {}),
  });
  invalidate(CacheTag.lessons, CacheTag.lesson(params.id));
  return ok(lesson);
});

export const DELETE = withAdmin<Params>(async (_req, { params }) => {
  await lessonRepository.delete(params.id);
  invalidate(CacheTag.lessons);
  return noContent();
});
