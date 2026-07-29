import { z } from 'zod';
import { ok, parseBody, withAuth } from '@/lib/api';
import { lessonService } from '@/services/lesson.service';

type Params = { id: string };

const bodySchema = z.object({
  timeSpentSeconds: z.number().int().min(0).max(86_400).default(0),
});

export const POST = withAuth<Params>(async (req, { params, user }) => {
  const { timeSpentSeconds } = await parseBody(req, bodySchema);
  const result = await lessonService.complete(user.id, params.id, timeSpentSeconds);
  return ok(result);
});
