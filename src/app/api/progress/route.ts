import { ok, withAuth } from '@/lib/api';
import { progressService } from '@/services/progress.service';

export const GET = withAuth(async (_req, { user }) => {
  const [overview, goal, recent] = await Promise.all([
    progressService.overview(user.id),
    progressService.goal(user.id),
    progressService.recent(user.id),
  ]);
  return ok({ overview, goal, recent });
});
