import { created, ok, parseBody, parseQuery, withAdmin, withErrorHandling } from '@/lib/api';
import { buildMeta } from '@/lib/api/response';
import { paginationSchema } from '@/lib/validation/common.schema';
import { createExerciseSchema } from '@/lib/validation/exercise.schema';
import { exerciseRepository } from '@/repositories/exercise.repository';
import { toExerciseDto } from '@/services/mappers';
import { CacheTag, invalidate } from '@/lib/cache';
import { z } from 'zod';

const querySchema = paginationSchema.extend({ lessonId: z.string().optional() });

export const GET = withErrorHandling(async (req) => {
  const query = parseQuery(req, querySchema);
  const { items, total } = await exerciseRepository.findMany(query);
  return ok(items.map(toExerciseDto), buildMeta(query.page, query.perPage, total));
});

export const POST = withAdmin(async (req) => {
  const input = await parseBody(req, createExerciseSchema);
  const { lessonId, questions, ...rest } = input;
  const exercise = await exerciseRepository.create({
    ...rest,
    lesson: { connect: { id: lessonId } },
    questions: {
      create: questions.map((question) => {
        const { answers, ...questionRest } = question;
        return { ...questionRest, answers: { create: answers } };
      }),
    },
  });
  invalidate(CacheTag.exercises, CacheTag.lesson(lessonId));
  return created(toExerciseDto(exercise));
});
