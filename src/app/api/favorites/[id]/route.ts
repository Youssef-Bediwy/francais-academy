import { noContent, withAuth } from '@/lib/api';
import { favoriteService } from '@/services/favorite.service';

type Params = { id: string };

export const DELETE = withAuth<Params>(async (_req, { params, user }) => {
  await favoriteService.remove(user.id, params.id);
  return noContent();
});
