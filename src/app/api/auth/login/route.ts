import { ok, parseBody, withErrorHandling } from '@/lib/api';
import { loginSchema } from '@/lib/validation/auth.schema';
import { authService } from '@/services/auth.service';

export const runtime = 'nodejs';

export const POST = withErrorHandling(async (req) => {
  const input = await parseBody(req, loginSchema);
  const user = await authService.login(input);
  return ok(user);
});
