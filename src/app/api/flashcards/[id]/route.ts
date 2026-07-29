import { NotFoundError, noContent, ok, parseBody, withAdmin, withErrorHandling } from '@/lib/api';
import { flashcardSchema } from '@/lib/validation/misc.schema';
import { flashcardRepository } from '@/repositories/flashcard.repository';
import { CacheTag, invalidate } from '@/lib/cache';

type Params = { id: string };

export const GET = withErrorHandling<Params>(async (_req, { params }) => {
  const card = await flashcardRepository.findById(params.id);
  if (!card) throw new NotFoundError('Carte');
  return ok(card);
});

export const PATCH = withAdmin<Params>(async (req, { params }) => {
  const input = await parseBody(req, flashcardSchema.partial());
  const card = await flashcardRepository.update(params.id, input);
  invalidate(CacheTag.flashcards);
  return ok(card);
});

export const DELETE = withAdmin<Params>(async (_req, { params }) => {
  await flashcardRepository.delete(params.id);
  invalidate(CacheTag.flashcards);
  return noContent();
});
