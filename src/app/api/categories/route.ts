import { created, ok, parseBody, withAdmin, withErrorHandling } from '@/lib/api';
import { categorySchema } from '@/lib/validation/misc.schema';
import { categoryRepository } from '@/repositories/category.repository';
import { courseService } from '@/services/course.service';
import { CacheTag, invalidate } from '@/lib/cache';
import { slugify } from '@/utils/slugify';

export const GET = withErrorHandling(async () => ok(await courseService.categories()));

export const POST = withAdmin(async (req) => {
  const input = await parseBody(req, categorySchema);
  const category = await categoryRepository.create({ ...input, slug: slugify(input.nameFr) });
  invalidate(CacheTag.categories);
  return created(category);
});
