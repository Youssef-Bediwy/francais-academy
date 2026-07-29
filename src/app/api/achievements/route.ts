import { ok, withAuth } from '@/lib/api';
import { gamificationService } from '@/services/gamification.service';

export const GET = withAuth(async (_req, { user }) => {
  const [achievements, leaderboard] = await Promise.all([
    gamificationService.listAchievements(user.id),
    gamificationService.leaderboard(),
  ]);
  return ok({ achievements, leaderboard });
});
