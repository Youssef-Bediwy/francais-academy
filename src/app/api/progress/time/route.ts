import { BadRequestError, ok, parseBody, withAuth } from '@/lib/api';
import { trackTimeSchema } from '@/lib/validation/misc.schema';
import { lessonService } from '@/services/lesson.service';

export const POST = withAuth(async (req, { user }) => {
  const input = await parseBody(req, trackTimeSchema);
  if (!input.lessonId) throw new BadRequestError('lessonId est requis');
  return ok(await lessonService.trackTime(user.id, input.lessonId, input.seconds));
});
