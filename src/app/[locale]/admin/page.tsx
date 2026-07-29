import { resolveLocale } from '@/lib/i18n/config';
import { getTranslator } from '@/lib/i18n/dictionaries';
import { statisticsService } from '@/services/statistics.service';
import { Card } from '@/components/ui/card';
import { Stat } from '@/components/ui/stat';
import { Avatar } from '@/components/ui/avatar';
import { DistributionChart } from '@/components/charts/distribution-chart';

export const metadata = { title: 'Administration' };

export default async function AdminOverviewPage({ params }: { params: { locale: string } }) {
  const locale = resolveLocale(params.locale);
  const t = await getTranslator(locale);
  const [stats, totals] = await Promise.all([statisticsService.admin(), statisticsService.platform()]);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label={t('admin.totalUsers')} value={stats.totals} />
        <Stat label={t('admin.activeUsers')} value={stats.activeUsers} tone="teal" />
        <Stat label={t('admin.exerciseAttempts')} value={stats.results} tone="sun" />
        <Stat label={t('admin.completions')} value={stats.completions} tone="berry" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label={t('admin.courses')} value={totals.courses} />
        <Stat label={t('admin.lessons')} value={totals.lessons} />
        <Stat label={t('admin.exercises')} value={totals.exercises} />
        <Stat label={t('admin.words')} value={totals.words} />
      </div>

      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">{t('admin.levelDistribution')}</h2>
        <DistributionChart
          label={t('admin.levelDistribution')}
          data={stats.levels.map((row) => ({ name: row.level, value: row.count }))}
        />
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">{t('admin.topLearners')}</h2>
        <ol className="space-y-2">
          {stats.topLearners.map((learner, index) => (
            <li key={learner.id} className="flex items-center gap-4 rounded-xl border border-border p-3">
              <span className="w-5 text-sm font-bold text-foreground-muted">{index + 1}</span>
              <Avatar name={learner.name} src={learner.avatarUrl} size="sm" />
              <span className="flex-1 text-sm font-medium">{learner.name}</span>
              <span className="text-sm font-semibold text-brand-700">{learner.xp} XP</span>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
