import { ok, withAdmin } from '@/lib/api';
import { statisticsService } from '@/services/statistics.service';

export const GET = withAdmin(async () => ok(await statisticsService.admin()));
