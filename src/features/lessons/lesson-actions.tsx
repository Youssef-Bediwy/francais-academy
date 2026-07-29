'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/hooks/use-api';
import { useToast } from '@/hooks/use-toast';
import { useTimer } from '@/hooks/use-timer';
import { useI18n } from '@/components/providers/i18n-provider';

interface CompleteResponse {
  xpEarned: number;
  levelUp: boolean;
  newBadges: { nameFr: string; nameAr: string }[];
}

export function LessonActions({
  lessonId,
  completed,
  authenticated,
}: {
  lessonId: string;
  completed: boolean;
  authenticated: boolean;
}) {
  const { t, locale } = useI18n();
  const toast = useToast();
  const router = useRouter();
  const seconds = useTimer();
  const [done, setDone] = useState(completed);
  const [pending, setPending] = useState(false);

  if (!authenticated) return null;

  const complete = async () => {
    setPending(true);
    try {
      const result = await apiFetch<CompleteResponse>(`/api/lessons/${lessonId}/complete`, {
        method: 'POST',
        body: JSON.stringify({ timeSpentSeconds: seconds }),
      });
      setDone(true);
      toast.success(t('lesson.completed'), result.xpEarned > 0 ? `+ ${result.xpEarned} XP` : undefined);
      if (result.levelUp) toast.info(t('progress.levelUp'));
      for (const badge of result.newBadges ?? []) {
        toast.info(t('achievements.unlocked'), locale === 'ar' ? badge.nameAr : badge.nameFr);
      }
      router.refresh();
    } catch {
      toast.error(t('errors.generic'));
    } finally {
      setPending(false);
    }
  };

  return (
    <Button onClick={complete} loading={pending} disabled={done} variant={done ? 'success' : 'primary'}>
      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
      {t(done ? 'lesson.alreadyCompleted' : 'lesson.markCompleted')}
    </Button>
  );
}
