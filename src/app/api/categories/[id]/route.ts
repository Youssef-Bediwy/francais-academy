import { NotFoundError, noContent, ok, parseBody, withAdmin, withErrorHandling } from '@/lib/api';
import { categorySchema } from '@/lib/validation/misc.schema';
import { categoryRepository } from '@/repositories/category.repository';
import { CacheTag, invalidate } from '@/lib/cache';

type Params = { id: string };

export const GET = withErrorHandling<Params>(async (_req, { params }) => {
  const category = await categoryRepository.findById(params.id);
  if (!category) throw new NotFoundError('Categorie');
  return ok(category);
});

export const PATCH = withAdmin<Params>(async (req, { params }) => {
  const input = await parseBody(req, categorySchema.partial());
  const category = await categoryRepository.update(params.id, input);
  invalidate(CacheTag.categories);
  return ok(category);
});

export const DELETE = withAdmin<Params>(async (_req, { params }) => {
  await categoryRepository.delete(params.id);
  invalidate(CacheTag.categories, CacheTag.courses);
  return noContent();
});
