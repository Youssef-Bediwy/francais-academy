import { ForbiddenError, noContent, ok, parseBody, withAdmin } from '@/lib/api';
import { updateUserSchema } from '@/lib/validation/misc.schema';
import { userRepository } from '@/repositories/user.repository';

type Params = { id: string };

export const PATCH = withAdmin<Params>(async (req, { params }) => {
  const input = await parseBody(req, updateUserSchema);
  const user = await userRepository.update(params.id, input);
  const { passwordHash, ...safe } = user;
  return ok(safe);
});

export const DELETE = withAdmin<Params>(async (_req, { params, user }) => {
  if (params.id === user.id) throw new ForbiddenError('Impossible de supprimer son propre compte');
  await userRepository.delete(params.id);
  return noContent();
});
