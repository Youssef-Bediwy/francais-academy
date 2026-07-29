import { ok, parseBody, withAuth } from '@/lib/api';
import { favoriteSchema } from '@/lib/validation/misc.schema';
import { favoriteService } from '@/services/favorite.service';

export const GET = withAuth(async (_req, { user }) => ok(await favoriteService.list(user.id)));

export const POST = withAuth(async (req, { user }) => {
  const input = await parseBody(req, favoriteSchema);
  return ok(await favoriteService.toggle(user.id, input.type, input.targetId));
});
