import { ok, withAuth } from '@/lib/api';
import { progressService } from '@/services/progress.service';

export const GET = withAuth(async (_req, { user }) => {
  const overview = await progressService.overview(user.id);
  return ok({ user, overview });
});
