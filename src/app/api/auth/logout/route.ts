import { noContent, withErrorHandling } from '@/lib/api';
import { authService } from '@/services/auth.service';

export const POST = withErrorHandling(async () => {
  authService.logout();
  return noContent();
});
