'use client';

import Link from 'next/link';
import { BookOpen, Clock, Star, Users } from 'lucide-react';
import type { CourseDto } from '@/types/content';
import { routes } from '@/constants/routes';
import { formatCompact, formatMinutes } from '@/utils/format';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { LevelBadge } from './level-badge';
import { FavoriteButton } from './favorite-button';
import { useI18n } from '@/components/providers/i18n-provider';

export function CourseCard({ course, showFavorite = true }: { course: CourseDto; showFavorite?: boolean }) {
  const { t, locale } = useI18n();
  const title = locale === 'ar' ? course.title.ar : course.title.fr;
  const description = locale === 'ar' ? course.description.ar : course.description.fr;
  const categoryName = locale === 'ar' ? course.category.name.ar : course.category.name.fr;

  return (
    <Card as="article" interactive className="flex h-full flex-col p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <Badge variant="brand" size="sm">
          {categoryName}
        </Badge>
        <div className="flex items-center gap-2">
          <LevelBadge level={course.level} />
          {showFavorite ? <FavoriteButton type="COURSE" targetId={course.id} /> : null}
        </div>
      </div>

      <h3 className="text-lg font-semibold leading-snug">
        <Link href={routes.course(locale, course.slug)} className="hover:text-brand-700">
          {title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-3 text-sm text-foreground-muted">{description}</p>

      <dl className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-foreground-muted">
        <div className="flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
          <dt className="sr-only">{t('course.lessons')}</dt>
          <dd>
            {course.lessonCount} {t('course.lessons')}
          </dd>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          <dt className="sr-only">{t('course.duration')}</dt>
          <dd>{formatMinutes(course.estimatedMinutes, locale)}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" aria-hidden="true" />
          <dt className="sr-only">{t('course.learners')}</dt>
          <dd>{formatCompact(course.learnerCount, locale)}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <Star className="h-3.5 w-3.5 fill-sun-500 text-sun-500" aria-hidden="true" />
          <dt className="sr-only">{t('course.rating')}</dt>
          <dd className="tabular-nums">{course.rating.toFixed(1)}</dd>
        </div>
      </dl>

      {course.progress && course.progress.percentage > 0 ? (
        <ProgressBar
          className="mt-4"
          size="sm"
          value={course.progress.percentage}
          label={t('course.yourProgress')}
          showValue
        />
      ) : null}

      <Link
        href={routes.course(locale, course.slug)}
        className="mt-5 inline-flex text-sm font-semibold text-brand-700 hover:underline"
      >
        {course.progress && course.progress.percentage > 0 ? t('course.continue') : t('course.start')}
        <span aria-hidden="true" className="ms-1 rtl:rotate-180">
          &rarr;
        </span>
      </Link>
    </Card>
  );
}
