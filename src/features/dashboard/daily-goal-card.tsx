'use client';

import { useState } from 'react';
import { Target } from 'lucide-react';
import type { DailyGoalDto } from '@/types/progress';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { apiFetch } from '@/hooks/use-api';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/components/providers/i18n-provider';

export function DailyGoalCard({ goal }: { goal: DailyGoalDto }) {
  const { t } = useI18n();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(goal);
  const [pending, setPending] = useState(false);

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    try {
      const updated = await apiFetch<DailyGoalDto>('/api/goals', {
        method: 'PATCH',
        body: JSON.stringify({
          targetXp: Number(form.get('targetXp')),
          targetLessons: Number(form.get('targetLessons')),
          targetMinutes: Number(form.get('targetMinutes')),
        }),
      });
      setCurrent(updated);
      setOpen(false);
      toast.success(t('dashboard.goalUpdated'));
    } catch {
      toast.error(t('errors.generic'));
    } finally {
      setPending(false);
    }
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="inline-flex items-center gap-2 text-base font-semibold">
          <Target className="h-4 w-4 text-brand-600" aria-hidden="true" />
          {t('dashboard.dailyGoal')}
        </h3>
        <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
          {t('common.edit')}
        </Button>
      </div>

      <div className="mt-4 space-y-4">
        <ProgressBar
          value={(current.achievedXp / Math.max(1, current.targetXp)) * 100}
          label={`${current.achievedXp} / ${current.targetXp} XP`}
          showValue
        />
        <ProgressBar
          tone="teal"
          value={(current.achievedLessons / Math.max(1, current.targetLessons)) * 100}
          label={`${current.achievedLessons} / ${current.targetLessons} ${t('dashboard.lessons')}`}
        />
        <ProgressBar
          tone="sun"
          value={(current.achievedMinutes / Math.max(1, current.targetMinutes)) * 100}
          label={`${current.achievedMinutes} / ${current.targetMinutes} min`}
        />
      </div>

      <Modal open={open} onOpenChange={setOpen} title={t('dashboard.editGoal')}>
        <form onSubmit={save} className="space-y-4">
          <Input id="targetXp" name="targetXp" type="number" min={10} max={1000} label="XP" defaultValue={current.targetXp} />
          <Input
            id="targetLessons"
            name="targetLessons"
            type="number"
            min={1}
            max={20}
            label={t('dashboard.lessons')}
            defaultValue={current.targetLessons}
          />
          <Input
            id="targetMinutes"
            name="targetMinutes"
            type="number"
            min={5}
            max={480}
            label={t('dashboard.minutes')}
            defaultValue={current.targetMinutes}
          />
          <Button type="submit" block loading={pending}>
            {t('common.save')}
          </Button>
        </form>
      </Modal>
    </Card>
  );
}
