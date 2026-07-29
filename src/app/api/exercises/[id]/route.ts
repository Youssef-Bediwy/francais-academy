import { noContent, ok, parseBody, withAdmin, withErrorHandling } from '@/lib/api';
import { updateExerciseSchema } from '@/lib/validation/exercise.schema';
import { exerciseRepository } from '@/repositories/exercise.repository';
import { exerciseService } from '@/services/exercise.service';
import { toExerciseDto } from '@/services/mappers';
import { CacheTag, invalidate } from '@/lib/cache';

type Params = { id: string };

export const GET = withErrorHandling<Params>(async (_req, { params }) =>
  ok(await exerciseService.detail(params.id)),
);

export const PATCH = withAdmin<Params>(async (req, { params }) => {
  const input = await parseBody(req, updateExerciseSchema);
  const { lessonId, ...rest } = input;
  const exercise = await exerciseRepository.update(params.id, {
    ...rest,
    ...(lessonId ? { lesson: { connect: { id: lessonId } } } : {}),
  });
  invalidate(CacheTag.exercises);
  return ok(toExerciseDto(exercise));
});

export const DELETE = withAdmin<Params>(async (_req, { params }) => {
  await exerciseRepository.delete(params.id);
  invalidate(CacheTag.exercises);
  return noContent();
});
