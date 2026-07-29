import { redirect } from 'next/navigation';
import { Brain, Repeat, Target, TrendingDown } from 'lucide-react';
import { resolveLocale } from '@/lib/i18n/config';
import { getTranslator } from '@/lib/i18n/dictionaries';
import { getSession } from '@/lib/auth';
import { routes } from '@/constants/routes';
import { reviewService } from '@/services/review.service';
import { REVIEW_BATCH_SIZE } from '@/constants';
import { Stat } from '@/components/ui/stat';
import { SectionHeading } from '@/components/ui/section-heading';
import { Card } from '@/components/ui/card';
import { ButtonLink } from '@/components/ui/button';
import { ReviewSession } from '@/features/review/review-session';

export const metadata = { title: 'Revision' };

export default async function ReviewPage({ params }: { params: { locale: string } }) {
  const locale = resolveLocale(params.locale);
  const t = await getTranslator(locale);
  const session = await getSession();
  if (!session) redirect(routes.login(locale));

  const [cards, stats, recommendations] = await Promise.all([
    reviewService.queue(session.id, REVIEW_BATCH_SIZE),
    reviewService.stats(session.id),
    reviewService.recommendations(session.id, 3),
  ]);

  return (
    <div className="space-y-10">
      <SectionHeading title={t('review.title')} description={t('review.subtitle')} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label={t('review.due')} value={stats.due} icon={<Repeat className="h-4 w-4" />} />
        <Stat label={t('review.tracked')} value={stats.tracked} icon={<Brain className="h-4 w-4" />} tone="teal" />
        <Stat label={t('review.mastered')} value={stats.mastered} icon={<Target className="h-4 w-4" />} tone="sun" />
        <Stat label={t('review.lapses')} value={stats.lapses} icon={<TrendingDown className="h-4 w-4" />} tone="berry" />
      </div>

      <ReviewSession cards={cards} />

      {recommendations.courses.length > 0 ? (
        <section>
          <SectionHeading
            title={t('review.recommendations')}
            description={
              recommendations.reason === 'errors' ? t('review.fromErrors') : t('review.fromPopular')
            }
          />
          <ul className="grid gap-3 sm:grid-cols-3">
            {recommendations.courses.map((course) => (
              <li key={course.id}>
                <Card className="flex h-full flex-col gap-3 p-5">
                  <p className="font-semibold">{locale === 'ar' ? course.titleAr : course.titleFr}</p>
                  <p className="line-clamp-2 text-sm text-foreground-muted">
                    {locale === 'ar' ? course.descriptionAr : course.descriptionFr}
                  </p>
                  <ButtonLink
                    href={routes.course(locale, course.slug)}
                    variant="soft"
                    size="sm"
                    className="mt-auto self-start"
                  >
                    {t('course.continue')}
                  </ButtonLink>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
