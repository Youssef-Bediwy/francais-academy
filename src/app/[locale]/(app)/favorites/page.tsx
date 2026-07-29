import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Heart } from 'lucide-react';
import { resolveLocale } from '@/lib/i18n/config';
import { getTranslator } from '@/lib/i18n/dictionaries';
import { getSession } from '@/lib/auth';
import { routes } from '@/constants/routes';
import { favoriteService } from '@/services/favorite.service';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionHeading } from '@/components/ui/section-heading';
import { Tabs } from '@/components/ui/tabs';
import { CourseCard } from '@/components/domain/course-card';

export const metadata = { title: 'Favoris' };

export default async function FavoritesPage({ params }: { params: { locale: string } }) {
  const locale = resolveLocale(params.locale);
  const t = await getTranslator(locale);
  const session = await getSession();
  if (!session) redirect(routes.login(locale));

  const favorites = await favoriteService.list(session.id);
  const isEmpty =
    favorites.courses.length === 0 &&
    favorites.lessons.length === 0 &&
    favorites.flashcards.length === 0;

  if (isEmpty) {
    return (
      <div className="space-y-8">
        <SectionHeading title={t('favorites.title')} description={t('favorites.subtitle')} />
        <EmptyState
          title={t('favorites.emptyTitle')}
          description={t('favorites.emptyDescription')}
          icon={<Heart className="h-8 w-8" />}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeading title={t('favorites.title')} description={t('favorites.subtitle')} />

      <Tabs
        items={[
          {
            value: 'courses',
            label: `${t('favorites.courses')} (${favorites.courses.length})`,
            content: (
              <div className="grid-auto-cards">
                {favorites.courses.map((entry) => (
                  <CourseCard key={entry.favoriteId} course={entry.course} />
                ))}
              </div>
            ),
          },
          {
            value: 'lessons',
            label: `${t('favorites.lessons')} (${favorites.lessons.length})`,
            content: (
              <ul className="space-y-2">
                {favorites.lessons.map((lesson) => (
                  <li key={lesson.favoriteId}>
                    <Link href={routes.lesson(locale, lesson.courseSlug, lesson.slug)}>
                      <Card className="p-4 transition hover:border-brand-300">
                        <p className="font-semibold">{locale === 'ar' ? lesson.titleAr : lesson.titleFr}</p>
                        <p className="mt-1 text-sm text-foreground-muted">
                          {locale === 'ar' ? lesson.summaryAr : lesson.summaryFr}
                        </p>
                      </Card>
                    </Link>
                  </li>
                ))}
              </ul>
            ),
          },
          {
            value: 'flashcards',
            label: `${t('favorites.flashcards')} (${favorites.flashcards.length})`,
            content: (
              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {favorites.flashcards.map((card) => (
                  <li key={card.favoriteId}>
                    <Card className="flex items-center justify-between gap-3 p-4">
                      <p className="font-semibold">{card.frontFr}</p>
                      <p className="font-arabic text-lg text-brand-700" dir="rtl">
                        {card.backAr}
                      </p>
                    </Card>
                  </li>
                ))}
              </ul>
            ),
          },
        ]}
      />
    </div>
  );
}
