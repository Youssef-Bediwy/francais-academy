'use client';

import { Tooltip } from '@/components/ui/tooltip';
import { cn } from '@/utils/cn';
import type { ActivityPoint } from '@/types/progress';
import { useI18n } from '@/components/providers/i18n-provider';

function intensity(xp: number): string {
  if (xp === 0) return 'bg-ink-100';
  if (xp < 25) return 'bg-brand-200';
  if (xp < 60) return 'bg-brand-300';
  if (xp < 120) return 'bg-brand-500';
  return 'bg-brand-700';
}

export function StreakCalendar({ activity }: { activity: ActivityPoint[] }) {
  const { t } = useI18n();

  return (
    <div>
      <div className="grid grid-cols-10 gap-1.5 sm:grid-cols-[repeat(15,minmax(0,1fr))]">
        {activity.map((point) => (
          <Tooltip key={point.date} content={`${point.date} : ${point.xp} XP`}>
            <span
              tabIndex={0}
              role="img"
              aria-label={`${point.date} : ${point.xp} XP`}
              className={cn('aspect-square rounded-md', intensity(point.xp))}
            />
          </Tooltip>
        ))}
      </div>
      <p className="mt-3 flex items-center gap-2 text-xs text-foreground-muted">
        {t('progress.less')}
        <span className="inline-flex gap-1">
          {['bg-ink-100', 'bg-brand-200', 'bg-brand-300', 'bg-brand-500', 'bg-brand-700'].map((tone) => (
            <span key={tone} className={cn('h-3 w-3 rounded-sm', tone)} />
          ))}
        </span>
        {t('progress.more')}
      </p>
    </div>
  );
}
