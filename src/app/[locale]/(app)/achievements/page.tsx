import { redirect } from 'next/navigation';
import { Lock, Trophy } from 'lucide-react';
import { resolveLocale } from '@/lib/i18n/config';
import { getTranslator } from '@/lib/i18n/dictionaries';
import { getSession } from '@/lib/auth';
import { routes } from '@/constants/routes';
import { gamificationService } from '@/services/gamification.service';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { SectionHeading } from '@/components/ui/section-heading';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/utils/cn';

export const metadata = { title: 'Succes' };

const tierTone = {
  BRONZE: 'bg-brand-100 text-brand-800',
  SILVER: 'bg-ink-100 text-ink-700',
  GOLD: 'bg-sun-100 text-brand-700',
  PLATINUM: 'bg-teal-100 text-teal-700',
} as const;

export default async function AchievementsPage({ params }: { params: { locale: string } }) {
  const locale = resolveLocale(params.locale);
  const t = await getTranslator(locale);
  const session = await getSession();
  if (!session) redirect(routes.login(locale));

  const [achievements, leaderboard] = await Promise.all([
    gamificationService.listAchievements(session.id),
    gamificationService.leaderboard(10),
  ]);

  const unlocked = achievements.filter((item) => item.unlocked).length;

  return (
    <div className="space-y-10">
      <SectionHeading
        title={t('achievements.title')}
        description={t('achievements.subtitle', { unlocked, total: achievements.length })}
      />

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((badge) => (
          <li key={badge.id}>
            <Card className={cn('h-full p-5', !badge.unlocked && 'opacity-70')}>
              <div className="flex items-start justify-between gap-3">
                <span
                  className={cn(
                    'inline-flex h-11 w-11 items-center justify-center rounded-xl',
                    tierTone[badge.tier],
                  )}
                >
                  {badge.unlocked ? (
                    <Trophy className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Lock className="h-5 w-5" aria-hidden="true" />
                  )}
                </span>
                <Badge size="sm" variant="outline">
                  {badge.tier}
                </Badge>
              </div>
              <h2 className="mt-3 font-semibold">{locale === 'ar' ? badge.nameAr : badge.nameFr}</h2>
              <p className="mt-1 text-sm text-foreground-muted">
                {locale === 'ar' ? badge.descriptionAr : badge.descriptionFr}
              </p>
              <ProgressBar
                className="mt-4"
                size="sm"
                tone={badge.unlocked ? 'teal' : 'brand'}
                value={(badge.progress / Math.max(1, badge.threshold)) * 100}
                label={`${badge.progress} / ${badge.threshold}`}
              />
            </Card>
          </li>
        ))}
      </ul>

      <section>
        <SectionHeading title={t('achievements.leaderboard')} />
        <ol className="space-y-2">
          {leaderboard.map((entry, index) => (
            <li
              key={entry.id}
              className={cn(
                'flex items-center gap-4 rounded-xl border border-border bg-surface p-4',
                entry.id === session.id && 'border-brand-400 bg-brand-50',
              )}
            >
              <span className="w-6 font-display text-lg font-bold text-foreground-muted">{index + 1}</span>
              <Avatar name={entry.name} src={entry.avatarUrl} size="sm" />
              <span className="flex-1 text-sm font-medium">{entry.name}</span>
              <span className="text-sm font-semibold tabular-nums text-brand-700">{entry.xp} XP</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
