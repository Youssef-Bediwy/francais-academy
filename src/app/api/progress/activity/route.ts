import { z } from 'zod';
import { ok, parseQuery, withAuth } from '@/lib/api';
import { progressService } from '@/services/progress.service';

const querySchema = z.object({ days: z.coerce.number().int().min(7).max(90).default(30) });

export const GET = withAuth(async (req, { user }) => {
  const { days } = parseQuery(req, querySchema);
  return ok(await progressService.activity(user.id, days));
});
