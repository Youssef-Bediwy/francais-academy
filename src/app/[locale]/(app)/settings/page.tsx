import { redirect } from 'next/navigation';
import { resolveLocale } from '@/lib/i18n/config';
import { getTranslator } from '@/lib/i18n/dictionaries';
import { getSession } from '@/lib/auth';
import { routes } from '@/constants/routes';
import { progressService } from '@/services/progress.service';
import { userRepository } from '@/repositories/user.repository';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { SectionHeading } from '@/components/ui/section-heading';
import { LocaleSwitcher } from '@/components/layout/locale-switcher';
import { DailyGoalCard } from '@/features/dashboard/daily-goal-card';
import { formatDate } from '@/utils/format';

export const metadata = { title: 'Parametres' };

export default async function SettingsPage({ params }: { params: { locale: string } }) {
  const locale = resolveLocale(params.locale);
  const t = await getTranslator(locale);
  const session = await getSession();
  if (!session) redirect(routes.login(locale));

  const [profile, goal] = await Promise.all([
    userRepository.findById(session.id),
    progressService.goal(session.id),
  ]);

  return (
    <div className="space-y-8">
      <SectionHeading title={t('settings.title')} description={t('settings.subtitle')} />

      <Card className="flex flex-wrap items-center gap-5 p-6">
        <Avatar name={session.name} src={profile?.avatarUrl} size="lg" />
        <div className="space-y-1">
          <p className="text-lg font-semibold">{session.name}</p>
          <p className="text-sm text-foreground-muted">{session.email}</p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Badge variant="brand" size="sm">
              {profile?.level ?? 'A1'}
            </Badge>
            <Badge variant="outline" size="sm">
              {session.role}
            </Badge>
            {profile ? (
              <span className="text-xs text-foreground-muted">
                {t('settings.memberSince')} {formatDate(profile.createdAt, locale)}
              </span>
            ) : null}
          </div>
        </div>
      </Card>

      <Card className="flex flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <h2 className="font-semibold">{t('settings.language')}</h2>
          <p className="text-sm text-foreground-muted">{t('settings.languageHint')}</p>
        </div>
        <LocaleSwitcher />
      </Card>

      <DailyGoalCard goal={goal} />
    </div>
  );
}
