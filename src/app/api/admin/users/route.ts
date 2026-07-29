import { z } from 'zod';
import { ok, parseQuery, withAdmin } from '@/lib/api';
import { buildMeta } from '@/lib/api/response';
import { paginationSchema } from '@/lib/validation/common.schema';
import { userRepository } from '@/repositories/user.repository';

const querySchema = paginationSchema.extend({
  search: z.string().trim().max(120).optional(),
  role: z.enum(['USER', 'ADMIN']).optional(),
});

export const GET = withAdmin(async (req) => {
  const query = parseQuery(req, querySchema);
  const { items, total } = await userRepository.findMany(query);
  const safe = items.map(({ passwordHash, ...user }) => user);
  return ok(safe, buildMeta(query.page, query.perPage, total));
});
