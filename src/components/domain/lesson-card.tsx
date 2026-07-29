'use client';

import Link from 'next/link';
import { CheckCircle2, Circle, Clock, Dumbbell, PlayCircle } from 'lucide-react';
import type { LessonListItem } from '@/types/content';
import { routes } from '@/constants/routes';
import { formatMinutes } from '@/utils/format';
import { cn } from '@/utils/cn';
import { useI18n } from '@/components/providers/i18n-provider';

export function LessonCard({
  lesson,
  courseSlug,
  index,
}: {
  lesson: LessonListItem;
  courseSlug: string;
  index: number;
}) {
  const { t, locale } = useI18n();
  const title = locale === 'ar' ? lesson.title.ar : lesson.title.fr;
  const summary = locale === 'ar' ? lesson.summary.ar : lesson.summary.fr;

  const StatusIcon =
    lesson.status === 'COMPLETED' ? CheckCircle2 : lesson.status === 'IN_PROGRESS' ? PlayCircle : Circle;

  return (
    <li>
      <Link
        href={routes.lesson(locale, courseSlug, lesson.slug)}
        className={cn(
          'flex items-start gap-4 rounded-2xl border border-border bg-surface p-4 transition hover:border-brand-300 hover:shadow-soft',
          lesson.status === 'COMPLETED' && 'border-teal-300/70 bg-teal-50/40',
        )}
      >
        <span
          className={cn(
            'mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold',
            lesson.status === 'COMPLETED' ? 'bg-teal-100 text-teal-700' : 'bg-surface-muted text-foreground-muted',
          )}
          aria-hidden="true"
        >
          {index}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block font-semibold">{title}</span>
          <span className="mt-1 block line-clamp-2 text-sm text-foreground-muted">{summary}</span>
          <span className="mt-2 flex flex-wrap items-center gap-4 text-xs text-foreground-muted">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {formatMinutes(lesson.estimatedMinutes, locale)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Dumbbell className="h-3.5 w-3.5" aria-hidden="true" />
              {lesson.exerciseCount} {t('lesson.exercises')}
            </span>
          </span>
        </span>

        <StatusIcon
          className={cn(
            'h-5 w-5 shrink-0',
            lesson.status === 'COMPLETED' ? 'text-teal-600' : 'text-foreground-muted',
          )}
          aria-label={t(`status.${lesson.status}`)}
        />
      </Link>
    </li>
  );
}
