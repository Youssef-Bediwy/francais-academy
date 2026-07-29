import { notFound } from 'next/navigation';
import { BookOpen, Clock, Star, Users } from 'lucide-react';
import { resolveLocale } from '@/lib/i18n/config';
import { getTranslator } from '@/lib/i18n/dictionaries';
import { getSession } from '@/lib/auth';
import { courseService } from '@/services/course.service';
import { routes } from '@/constants/routes';
import { formatCompact, formatMinutes } from '@/utils/format';
import { NotFoundError } from '@/lib/api/errors';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { LevelBadge } from '@/components/domain/level-badge';
import { FavoriteButton } from '@/components/domain/favorite-button';
import { LessonCard } from '@/components/domain/lesson-card';

interface PageProps {
  params: { locale: string; slug: string };
}

export async function generateMetadata({ params }: PageProps) {
  const locale = resolveLocale(params.locale);
  try {
    const { course } = await courseService.detail(params.slug);
    return {
      title: locale === 'ar' ? course.title.ar : course.title.fr,
      description: locale === 'ar' ? course.description.ar : course.description.fr,
    };
  } catch {
    return { title: 'Cours' };
  }
}

export default async function CourseDetailPage({ params }: PageProps) {
  const locale = resolveLocale(params.locale);
  const t = await getTranslator(locale);
  const session = await getSession();

  let data;
  try {
    data = await courseService.detail(params.slug, session?.id);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  const { course, lessons } = data;
  const title = locale === 'ar' ? course.title.ar : course.title.fr;
  const description = locale === 'ar' ? course.description.ar : course.description.fr;
  const categoryName = locale === 'ar' ? course.category.name.ar : course.category.name.fr;

  const facts = [
    { icon: BookOpen, label: t('course.lessons'), value: course.lessonCount },
    { icon: Clock, label: t('course.duration'), value: formatMinutes(course.estimatedMinutes, locale) },
    { icon: Users, label: t('course.learners'), value: formatCompact(course.learnerCount, locale) },
    { icon: Star, label: t('course.rating'), value: course.rating.toFixed(1) },
  ];

  return (
    <div className="container-page py-10">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: routes.home(locale) },
          { label: t('nav.courses'), href: routes.courses(locale) },
          { label: title },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="brand">{categoryName}</Badge>
            <LevelBadge level={course.level} />
            <FavoriteButton type="COURSE" targetId={course.id} />
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-foreground-muted">{description}</p>

          <dl className="mt-6 grid gap-4 sm:grid-cols-4">
            {facts.map((fact) => {
              const Icon = fact.icon;
              return (
                <div key={fact.label} className="rounded-xl border border-border bg-surface p-4">
                  <dt className="flex items-center gap-1.5 text-xs text-foreground-muted">
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {fact.label}
                  </dt>
                  <dd className="mt-1 font-display text-xl font-semibold tabular-nums">{fact.value}</dd>
                </div>
              );
            })}
          </dl>

          <h2 className="mt-10 text-2xl">{t('course.programme')}</h2>
          <ul className="mt-4 space-y-3">
            {lessons.map((lesson, index) => (
              <LessonCard key={lesson.id} lesson={lesson} courseSlug={course.slug} index={index + 1} />
            ))}
          </ul>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <Card className="space-y-4 p-5">
            <h2 className="text-base font-semibold">{t('course.yourProgress')}</h2>
            <ProgressBar value={course.progress?.percentage ?? 0} showValue tone="teal" />
            <p className="text-sm text-foreground-muted">
              {lessons.filter((lesson) => lesson.status === 'COMPLETED').length} / {lessons.length}{' '}
              {t('course.lessonsCompleted')}
            </p>
          </Card>

          <Card className="space-y-3 p-5">
            <h2 className="text-base font-semibold">{t('course.included')}</h2>
            <ul className="space-y-2 text-sm text-foreground-muted">
              <li>&bull; {t('course.included1')}</li>
              <li>&bull; {t('course.included2')}</li>
              <li>&bull; {t('course.included3')}</li>
              <li>&bull; {t('course.included4')}</li>
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}
