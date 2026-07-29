import { ok, parseQuery, withErrorHandling } from '@/lib/api';
import { searchQuerySchema } from '@/lib/validation/misc.schema';
import { searchService } from '@/services/search.service';

export const GET = withErrorHandling(async (req) => {
  const query = parseQuery(req, searchQuerySchema);
  return ok(await searchService.run(query));
});
