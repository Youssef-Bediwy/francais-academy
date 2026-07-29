import { ok, parseBody, withAuth } from '@/lib/api';
import { submitExerciseSchema } from '@/lib/validation/exercise.schema';
import { exerciseService } from '@/services/exercise.service';

type Params = { id: string };

export const POST = withAuth<Params>(async (req, { params, user }) => {
  const { answers, durationSeconds } = await parseBody(req, submitExerciseSchema);
  const result = await exerciseService.submit(user.id, params.id, answers, durationSeconds);
  return ok(result);
});
