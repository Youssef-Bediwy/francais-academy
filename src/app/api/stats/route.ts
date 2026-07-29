import { ok, withErrorHandling } from '@/lib/api';
import { statisticsService } from '@/services/statistics.service';

export const revalidate = 300;

export const GET = withErrorHandling(async () => ok(await statisticsService.platform()));
