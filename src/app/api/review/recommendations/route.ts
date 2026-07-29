import { ok, withAuth } from '@/lib/api';
import { reviewService } from '@/services/review.service';
import { toCourseDto } from '@/services/mappers';

export const GET = withAuth(async (_req, { user }) => {
  const { reason, courses } = await reviewService.recommendations(user.id);
  return ok({ reason, courses: courses.map((course) => toCourseDto(course)) });
});
