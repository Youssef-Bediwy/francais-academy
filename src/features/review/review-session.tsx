'use client';

import { useState } from 'react';
import { Eye, RotateCcw, Volume2 } from 'lucide-react';
import type { FlashcardDto } from '@/types/content';
import type { ReviewGrade } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { EmptyState } from '@/components/ui/empty-state';
import { AudioButton } from '@/components/domain/audio-button';
import { apiFetch } from '@/hooks/use-api';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/components/providers/i18n-provider';
import { cn } from '@/utils/cn';

const grades: { grade: ReviewGrade; key: string; tone: string }[] = [
  { grade: 'AGAIN', key: 'review.again', tone: 'bg-berry-500 hover:bg-berry-600 text-white' },
  { grade: 'HARD', key: 'review.hard', tone: 'bg-sun-500 hover:bg-sun-600 text-ink-900' },
  { grade: 'GOOD', key: 'review.good', tone: 'bg-teal-500 hover:bg-teal-600 text-white' },
  { grade: 'EASY', key: 'review.easy', tone: 'bg-brand-600 hover:bg-brand-700 text-white' },
];

export function ReviewSession({ cards }: { cards: FlashcardDto[] }) {
  const { t } = useI18n();
  const toast = useToast();
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(0);

  const card = cards[index];

  if (!card) {
    return (
      <EmptyState
        title={t('review.emptyTitle')}
        description={t('review.emptyDescription')}
        icon={<RotateCcw className="h-8 w-8" />}
      />
    );
  }

  const grade = async (value: ReviewGrade) => {
    setPending(true);
    try {
      await apiFetch('/api/review', {
        method: 'POST',
        body: JSON.stringify({ flashcardId: card.id, grade: value, durationSeconds: 8 }),
      });
      setDone((current) => current + 1);
      setRevealed(false);
      setIndex((current) => current + 1);
    } catch {
      toast.error(t('errors.generic'));
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <ProgressBar
        value={(done / cards.length) * 100}
        label={t('review.progress')}
        showValue
        tone="teal"
      />

      <Card className="relative flex min-h-72 flex-col items-center justify-center gap-5 p-8 text-center">
        <Badge variant="outline" size="sm" className="absolute start-4 top-4">
          {card.level}
        </Badge>
        <AudioButton src={card.audioUrl} label={t('review.listen')} className="absolute end-4 top-4" />

        <p className="font-display text-3xl font-semibold">{card.frontFr}</p>

        {card.hintFr && !revealed ? (
          <p className="text-sm text-foreground-muted">{card.hintFr}</p>
        ) : null}

        {revealed ? (
          <p className="font-arabic text-3xl text-brand-700 animate-fade-in" dir="rtl">
            {card.backAr}
          </p>
        ) : (
          <Button variant="soft" onClick={() => setRevealed(true)}>
            <Eye className="h-4 w-4" aria-hidden="true" />
            {t('review.reveal')}
          </Button>
        )}
      </Card>

      {revealed ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {grades.map((item) => (
            <button
              key={item.grade}
              type="button"
              disabled={pending}
              onClick={() => void grade(item.grade)}
              className={cn(
                'rounded-xl px-3 py-3 text-sm font-semibold transition disabled:opacity-50',
                item.tone,
              )}
            >
              {t(item.key)}
            </button>
          ))}
        </div>
      ) : (
        <p className="flex items-center justify-center gap-2 text-center text-sm text-foreground-muted">
          <Volume2 className="h-4 w-4" aria-hidden="true" />
          {t('review.instructions')}
        </p>
      )}
    </div>
  );
}
