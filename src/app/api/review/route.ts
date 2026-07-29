import { ok, parseBody, parseQuery, withAuth } from '@/lib/api';
import { reviewGradeSchema, reviewQuerySchema } from '@/lib/validation/misc.schema';
import { reviewService } from '@/services/review.service';

export const GET = withAuth(async (req, { user }) => {
  const query = parseQuery(req, reviewQuerySchema);
  const [cards, stats] = await Promise.all([
    reviewService.queue(user.id, query.limit, query.level),
    reviewService.stats(user.id),
  ]);
  return ok({ cards, stats });
});

export const POST = withAuth(async (req, { user }) => {
  const input = await parseBody(req, reviewGradeSchema);
  const result = await reviewService.grade(
    user.id,
    input.flashcardId,
    input.grade,
    input.durationSeconds,
  );
  return ok(result);
});
