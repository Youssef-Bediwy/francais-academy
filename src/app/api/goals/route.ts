import { ok, parseBody, withAuth } from '@/lib/api';
import { dailyGoalSchema } from '@/lib/validation/misc.schema';
import { gamificationRepository } from '@/repositories/gamification.repository';
import { progressService } from '@/services/progress.service';
import { startOfDayUtc } from '@/utils/date';

export const GET = withAuth(async (_req, { user }) => ok(await progressService.goal(user.id)));

export const PATCH = withAuth(async (req, { user }) => {
  const input = await parseBody(req, dailyGoalSchema);
  const today = startOfDayUtc();
  await gamificationRepository.upsertGoal(
    user.id,
    today,
    { userId: user.id, date: today, ...input },
    input,
  );
  return ok(await progressService.goal(user.id));
});
