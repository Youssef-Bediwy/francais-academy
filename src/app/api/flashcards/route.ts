import { created, ok, parseBody, parseQuery, withAdmin, withErrorHandling } from '@/lib/api';
import { buildMeta } from '@/lib/api/response';
import { cefrLevelSchema, paginationSchema } from '@/lib/validation/common.schema';
import { flashcardSchema } from '@/lib/validation/misc.schema';
import { flashcardRepository } from '@/repositories/flashcard.repository';
import { CacheTag, invalidate } from '@/lib/cache';
import { z } from 'zod';

const querySchema = paginationSchema.extend({
  search: z.string().trim().max(120).optional(),
  level: cefrLevelSchema.optional(),
});

export const GET = withErrorHandling(async (req) => {
  const query = parseQuery(req, querySchema);
  const { items, total } = await flashcardRepository.findMany(query);
  return ok(items, buildMeta(query.page, query.perPage, total));
});

export const POST = withAdmin(async (req) => {
  const input = await parseBody(req, flashcardSchema);
  const card = await flashcardRepository.create(input);
  invalidate(CacheTag.flashcards);
  return created(card);
});
