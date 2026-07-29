'use client';

import type { CefrLevel } from '@prisma/client';
import { LEVEL_META } from '@/constants/levels';
import { cn } from '@/utils/cn';
import { useI18n } from '@/components/providers/i18n-provider';

export function LevelBadge({ level, className }: { level: CefrLevel; className?: string }) {
  const { locale } = useI18n();
  const meta = LEVEL_META[level];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
        meta.color,
        className,
      )}
    >
      <span>{level}</span>
      <span className="font-normal opacity-80">{locale === 'ar' ? meta.labelAr : meta.labelFr}</span>
    </span>
  );
}
