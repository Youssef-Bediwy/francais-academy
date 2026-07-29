'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Lightbulb, Send } from 'lucide-react';
import type { ExerciseDto } from '@/types/content';
import type { ExerciseCorrection, SubmittedAnswer } from '@/types/exercise';
import { EXERCISE_META } from '@/constants/exercises';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { AudioButton } from '@/components/domain/audio-button';
import { apiFetch } from '@/hooks/use-api';
import { useToast } from '@/hooks/use-toast';
import { useTimer } from '@/hooks/use-timer';
import { useI18n } from '@/components/providers/i18n-provider';
import { AnswerInput } from './answer-inputs';
import { ExerciseResult } from './exercise-result';

export function ExerciseRunner({ exercise }: { exercise: ExerciseDto }) {
  const { t, locale } = useI18n();
  const toast = useToast();
  const seconds = useTimer();

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, SubmittedAnswer>>({});
  const [correction, setCorrection] = useState<ExerciseCorrection | null>(null);
  const [pending, setPending] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const question = exercise.questions[index];
  const meta = EXERCISE_META[exercise.type];
  const total = exercise.questions.length;
  const answered = useMemo(() => Object.keys(answers).length, [answers]);

  const labels = {
    placeholder: t('exercise.typeAnswer'),
    choose: t('exercise.choose'),
    moveUp: t('exercise.moveUp'),
    moveDown: t('exercise.moveDown'),
  };

  if (!question) return null;

  const submit = async () => {
    setPending(true);
    try {
      const result = await apiFetch<{ correction: ExerciseCorrection; newBadges: { nameFr: string; nameAr: string }[] }>(
        `/api/exercises/${exercise.id}/submit`,
        {
          method: 'POST',
          body: JSON.stringify({
            answers: Object.values(answers),
            durationSeconds: seconds,
          }),
        },
      );
      setCorrection(result.correction);
      if (result.correction.passed) toast.success(t('exercise.passed'));
      for (const badge of result.newBadges ?? []) {
        toast.info(t('achievements.unlocked'), locale === 'ar' ? badge.nameAr : badge.nameFr);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('errors.generic'));
    } finally {
      setPending(false);
    }
  };

  const retry = () => {
    setCorrection(null);
    setAnswers({});
    setIndex(0);
  };

  if (correction) return <ExerciseResult correction={correction} onRetry={retry} />;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge variant="brand">{locale === 'ar' ? meta.labelAr : meta.labelFr}</Badge>
        <p className="text-sm text-foreground-muted">
          {t('exercise.question')} {index + 1} / {total}
        </p>
      </div>

      <ProgressBar value={((index + 1) / total) * 100} size="sm" />

      <Card className="space-y-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 id={`prompt-${question.id}`} className="font-display text-xl leading-snug">
            {locale === 'ar' ? question.promptAr : question.promptFr}
          </h2>
          <AudioButton src={question.audioUrl} label={t('exercise.listen')} />
        </div>

        <AnswerInput
          type={exercise.type}
          question={question}
          value={answers[question.id] ?? { questionId: question.id }}
          onChange={(answer) => setAnswers((current) => ({ ...current, [question.id]: answer }))}
          locale={locale}
          labels={labels}
        />

        {question.hintFr || question.hintAr ? (
          <div>
            <Button variant="ghost" size="sm" onClick={() => setShowHint((value) => !value)}>
              <Lightbulb className="h-4 w-4" aria-hidden="true" />
              {t('exercise.hint')}
            </Button>
            {showHint ? (
              <p className="mt-2 rounded-xl bg-sun-100 p-3 text-sm text-brand-800">
                {locale === 'ar' ? question.hintAr : question.hintFr}
              </p>
            ) : null}
          </div>
        ) : null}
      </Card>

      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={() => {
            setShowHint(false);
            setIndex((value) => Math.max(0, value - 1));
          }}
          disabled={index === 0}
        >
          <ChevronLeft className="h-4 w-4 rtl-flip" aria-hidden="true" />
          {t('common.previous')}
        </Button>

        {index < total - 1 ? (
          <Button
            onClick={() => {
              setShowHint(false);
              setIndex((value) => Math.min(total - 1, value + 1));
            }}
          >
            {t('common.next')}
            <ChevronRight className="h-4 w-4 rtl-flip" aria-hidden="true" />
          </Button>
        ) : (
          <Button onClick={submit} loading={pending} disabled={answered === 0}>
            <Send className="h-4 w-4" aria-hidden="true" />
            {t('exercise.submit')}
          </Button>
        )}
      </div>

      <p className="text-center text-xs text-foreground-muted">
        {answered} / {total} {t('exercise.answered')}
      </p>
    </div>
  );
}
