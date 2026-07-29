'use client';

import Link from 'next/link';
import { ArrowRight, Target } from 'lucide-react';
import type { ExerciseDto } from '@/types/content';
import { EXERCISE_META } from '@/constants/exercises';
import { routes } from '@/constants/routes';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/components/providers/i18n-provider';

export function ExerciseCard({ exercise }: { exercise: ExerciseDto }) {
  const { t, locale } = useI18n();
  const meta = EXERCISE_META[exercise.type];
  const title = locale === 'ar' ? exercise.title.ar : exercise.title.fr;
  const instructions = locale === 'ar' ? exercise.instructions.ar : exercise.instructions.fr;

  return (
    <Card as="article" interactive className="flex h-full flex-col p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <Badge variant="outline" size="sm">
          {locale === 'ar' ? meta.labelAr : meta.labelFr}
        </Badge>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700">
          <Target className="h-3.5 w-3.5" aria-hidden="true" />
          {exercise.points} XP
        </span>
      </div>

      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1.5 line-clamp-2 text-sm text-foreground-muted">{instructions}</p>

      <p className="mt-3 text-xs text-foreground-muted">
        {exercise.questions.length} {t('exercise.questions')} &middot; {t('exercise.passingScore')}{' '}
        {exercise.passingScore} %
      </p>

      <Link
        href={routes.exercise(locale, exercise.id)}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
      >
        {t('exercise.start')}
        <ArrowRight className="h-4 w-4 rtl-flip" aria-hidden="true" />
      </Link>
    </Card>
  );
}
