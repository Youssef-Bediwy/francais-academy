import { redirect } from 'next/navigation';
import { Award, Flame, Clock, Target, TrendingUp, Zap } from 'lucide-react';
import { resolveLocale } from '@/lib/i18n/config';
import { getTranslator } from '@/lib/i18n/dictionaries';
import { getSession } from '@/lib/auth';
import { routes } from '@/constants/routes';
import { progressService } from '@/services/progress.service';
import { courseService } from '@/services/course.service';
import { reviewService } from '@/services/review.service';
import { formatDuration } from '@/utils/format';
import { Card } from '@/components/ui/card';
import { Stat } from '@/components/ui/stat';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/section-heading';
import { EmptyState } from '@/components/ui/empty-state';
import { XpRing } from '@/components/domain/xp-ring';
import { CourseCard } from '@/components/domain/course-card';
import { ActivityChart } from '@/components/charts/activity-chart';
import { DailyGoalCard } from '@/features/dashboard/daily-goal-card';

export const metadata = { title: 'Tableau de bord' };

export default async function DashboardPage({ params }: { params: { locale: string } }) {
  const locale = resolveLocale(params.locale);
  const t = await getTranslator(locale);
  const session = await getSession();
  if (!session) redirect(routes.login(locale));

  const [overview, goal, activity, recent, reviewStats, recommendations] = await Promise.all([
    progressService.overview(session.id),
    progressService.goal(session.id),
    progressService.activity(session.id, 30),
    progressService.recent(session.id, 6),
    reviewService.stats(session.id),
    reviewService.recommendations(session.id, 3),
  ]);

  const recommendedCourses = recommendations.courses.map((course) => ({
    id: course.id,
    slug: course.slug,
    title: { fr: course.titleFr, ar: course.titleAr },
    description: { fr: course.descriptionFr, ar: course.descriptionAr },
    level: course.level,
    estimatedMinutes: course.estimatedMinutes,
    coverImage: course.coverImage,
    lessonCount: course._count.lessons,
    learnerCount: course.learnerCount,
    rating: course.rating,
    category: {
      id: course.category.id,
      slug: course.category.slug,
      skill: course.category.skill,
      name: { fr: course.category.nameFr, ar: course.category.nameAr },
      icon: course.category.icon,
      color: course.category.color,
    },
  }));

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">{t('dashboard.greeting', { name: session.name.split(' ')[0] ?? '' })}</h1>
          <p className="mt-1 text-sm text-foreground-muted">{t('dashboard.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="warning">
            <Flame className="h-3.5 w-3.5" aria-hidden="true" />
            {overview.streakCurrent} {t('dashboard.days')}
          </Badge>
          <Badge variant="brand">{overview.cefrLevel}</Badge>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="XP" value={overview.xp} icon={<Zap className="h-4 w-4" />} hint={t('dashboard.level', { level: overview.level })} />
        <Stat
          label={t('dashboard.timeSpent')}
          value={formatDuration(overview.totalTimeSeconds, locale)}
          icon={<Clock className="h-4 w-4" />}
          tone="teal"
        />
        <Stat
          label={t('dashboard.lessonsCompleted')}
          value={overview.lessonsCompleted}
          icon={<TrendingUp className="h-4 w-4" />}
          tone="sun"
        />
        <Stat
          label={t('dashboard.accuracy')}
          value={`${overview.accuracy} %`}
          icon={<Target className="h-4 w-4" />}
          tone="berry"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center gap-3 p-6 text-center">
          <XpRing
            percent={overview.percentToNextLevel}
            level={overview.level}
            label={t('dashboard.levelShort')}
          />
          <p className="text-sm text-foreground-muted">
            {overview.xpIntoLevel} / {overview.xpForNextLevel} XP
          </p>
        </Card>

        <DailyGoalCard goal={goal} />

        <Card className="space-y-4 p-5">
          <h2 className="text-base font-semibold">{t('dashboard.review')}</h2>
          <p className="font-display text-4xl font-bold tabular-nums">{reviewStats.due}</p>
          <p className="text-sm text-foreground-muted">{t('dashboard.cardsDue')}</p>
          <ButtonLink href={routes.review(locale)} block>
            {t('dashboard.startReview')}
          </ButtonLink>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">{t('dashboard.activity')}</h2>
        <ActivityChart data={activity} label={t('dashboard.activity')} />
      </Card>

      <section>
        <SectionHeading
          title={t('dashboard.recommended')}
          description={
            recommendations.reason === 'errors'
              ? t('dashboard.recommendedErrors')
              : t('dashboard.recommendedPopular')
          }
        />
        {recommendedCourses.length === 0 ? (
          <EmptyState title={t('dashboard.noRecommendation')} />
        ) : (
          <div className="grid-auto-cards">
            {recommendedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionHeading title={t('dashboard.recentActivity')} />
        {recent.length === 0 ? (
          <EmptyState title={t('dashboard.noActivity')} description={t('dashboard.noActivityHint')} />
        ) : (
          <ul className="space-y-2">
            {recent.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface p-4"
              >
                <span className="inline-flex items-center gap-3 text-sm font-medium">
                  <Award className="h-4 w-4 text-brand-600" aria-hidden="true" />
                  {locale === 'ar' ? item.labelAr : item.labelFr}
                </span>
                <span className="text-xs text-foreground-muted">
                  {item.xp > 0 ? `+ ${item.xp} XP` : null}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
