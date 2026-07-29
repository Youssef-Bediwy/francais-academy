'use client';

import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import type { ExerciseCorrection } from '@/types/exercise';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { cn } from '@/utils/cn';
import { useI18n } from '@/components/providers/i18n-provider';

export function ExerciseResult({
  correction,
  onRetry,
}: {
  correction: ExerciseCorrection;
  onRetry: () => void;
}) {
  const { t, locale } = useI18n();

  return (
    <div className="space-y-6 animate-slide-up">
      <Card className="p-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-foreground-muted">
          {t('exercise.result')}
        </p>
        <p className="mt-2 font-display text-5xl font-bold tabular-nums">{correction.percentage} %</p>
        <p className="mt-1 text-sm text-foreground-muted">
          {correction.correctCount} / {correction.totalCount} {t('exercise.correctAnswers')}
        </p>
        <ProgressBar
          className="mx-auto mt-5 max-w-sm"
          value={correction.percentage}
          tone={correction.passed ? 'teal' : 'brand'}
        />
        {correction.xpEarned > 0 ? (
          <p className="mt-4 inline-flex rounded-full bg-sun-100 px-3 py-1.5 text-sm font-semibold text-brand-700">
            + {correction.xpEarned} XP
          </p>
        ) : null}
      </Card>

      <Alert variant={correction.passed ? 'success' : 'warning'} title={t(correction.passed ? 'exercise.passed' : 'exercise.failed')}>
        {t(correction.passed ? 'exercise.passedHint' : 'exercise.failedHint')}
      </Alert>

      <ol className="space-y-3">
        {correction.corrections.map((item, index) => (
          <li
            key={item.questionId}
            className={cn(
              'rounded-2xl border p-4',
              item.correct ? 'border-teal-300 bg-teal-50/50' : 'border-berry-300 bg-berry-100/40',
            )}
          >
            <div className="flex items-start gap-3">
              {item.correct ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" aria-hidden="true" />
              ) : (
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-berry-600" aria-hidden="true" />
              )}
              <div className="space-y-1.5 text-sm">
                <p className="font-semibold">
                  {t('exercise.question')} {index + 1}
                </p>
                <p className="text-foreground-muted">
                  <span className="font-medium text-foreground">{t('exercise.yourAnswer')} :</span>{' '}
                  {item.given.length > 0 ? item.given.join(', ') : t('exercise.noAnswer')}
                </p>
                {!item.correct ? (
                  <p className="text-foreground-muted">
                    <span className="font-medium text-foreground">{t('exercise.expected')} :</span>{' '}
                    {item.expected.join(', ')}
                  </p>
                ) : null}
                <p className="rounded-lg bg-surface p-3 text-foreground-muted">
                  {locale === 'ar' ? item.explanationAr : item.explanationFr}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <Button onClick={onRetry} variant="outline" block>
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        {t('exercise.retry')}
      </Button>
    </div>
  );
}
