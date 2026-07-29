import { created, parseBody, withErrorHandling } from '@/lib/api';
import { registerSchema } from '@/lib/validation/auth.schema';
import { authService } from '@/services/auth.service';

export const runtime = 'nodejs';

export const POST = withErrorHandling(async (req) => {
  const input = await parseBody(req, registerSchema);
  const user = await authService.register(input);
  return created(user);
});
