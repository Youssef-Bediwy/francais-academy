import { redirect } from 'next/navigation';
import { resolveLocale } from '@/lib/i18n/config';
import { getTranslator } from '@/lib/i18n/dictionaries';
import { getSession } from '@/lib/auth';
import { routes } from '@/constants/routes';
import { progressService } from '@/services/progress.service';
import { exerciseService } from '@/services/exercise.service';
import { formatDuration } from '@/utils/format';
import { Card } from '@/components/ui/card';
import { Stat } from '@/components/ui/stat';
import { ProgressBar } from '@/components/ui/progress-bar';
import { SectionHeading } from '@/components/ui/section-heading';
import { Badge } from '@/components/ui/badge';
import { StreakCalendar } from '@/components/domain/streak-calendar';
import { ActivityChart } from '@/components/charts/activity-chart';

export const metadata = { title: 'Progression' };

export default async function ProgressPage({ params }: { params: { locale: string } }) {
  const locale = resolveLocale(params.locale);
  const t = await getTranslator(locale);
  const session = await getSession();
  if (!session) redirect(routes.login(locale));

  const [overview, activity, history] = await Promise.all([
    progressService.overview(session.id),
    progressService.activity(session.id, 30),
    exerciseService.history(session.id, 10),
  ]);

  return (
    <div className="space-y-10">
      <SectionHeading title={t('progress.title')} description={t('progress.subtitle')} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="XP" value={overview.xp} />
        <Stat label={t('progress.streak')} value={`${overview.streakCurrent} / ${overview.streakLongest}`} tone="sun" />
        <Stat label={t('progress.time')} value={formatDuration(overview.totalTimeSeconds, locale)} tone="teal" />
        <Stat label={t('progress.exercises')} value={overview.exercisesPassed} tone="berry" />
      </div>

      <Card className="space-y-5 p-6">
        <h2 className="text-lg font-semibold">{t('progress.global')}</h2>
        <ProgressBar value={overview.globalPercentage} label={t('progress.courses')} showValue tone="teal" />
        <ProgressBar value={overview.percentToNextLevel} label={t('progress.nextLevel')} showValue />
        <ProgressBar value={overview.accuracy} label={t('progress.accuracy')} showValue tone="sun" />
        <dl className="grid gap-4 pt-2 sm:grid-cols-3">
          <div>
            <dt className="text-xs text-foreground-muted">{t('progress.coursesCompleted')}</dt>
            <dd className="font-display text-2xl font-semibold">{overview.coursesCompleted}</dd>
          </div>
          <div>
            <dt className="text-xs text-foreground-muted">{t('progress.lessonsCompleted')}</dt>
            <dd className="font-display text-2xl font-semibold">{overview.lessonsCompleted}</dd>
          </div>
          <div>
            <dt className="text-xs text-foreground-muted">{t('progress.cardsReviewed')}</dt>
            <dd className="font-display text-2xl font-semibold">{overview.flashcardsReviewed}</dd>
          </div>
        </dl>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">{t('progress.calendar')}</h2>
        <StreakCalendar activity={activity} />
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">{t('progress.xpChart')}</h2>
        <ActivityChart data={activity} label={t('progress.xpChart')} />
      </Card>

      <section>
        <SectionHeading title={t('progress.lastResults')} />
        <ul className="space-y-2">
          {history.map((result) => (
            <li
              key={result.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface p-4"
            >
              <span className="text-sm font-medium">
                {locale === 'ar' ? result.exercise.titleAr : result.exercise.titleFr}
              </span>
              <span className="flex items-center gap-3">
                <Badge variant={result.passed ? 'success' : 'danger'} size="sm">
                  {result.percentage} %
                </Badge>
                <span className="text-xs text-foreground-muted tabular-nums">
                  {result.correctCount} / {result.totalCount}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
