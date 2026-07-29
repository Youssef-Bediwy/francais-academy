import { cn } from '@/utils/cn';
import { clampPercent } from '@/utils/format';

export interface ProgressBarProps {
  value: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'brand' | 'teal' | 'sun';
  className?: string;
}

const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' } as const;
const tones = { brand: 'bg-brand-500', teal: 'bg-teal-500', sun: 'bg-sun-500' } as const;

export function ProgressBar({
  value,
  label,
  showValue = false,
  size = 'md',
  tone = 'brand',
  className,
}: ProgressBarProps) {
  const percent = clampPercent(value);
  return (
    <div className={cn('w-full', className)}>
      {label || showValue ? (
        <div className="mb-1.5 flex items-center justify-between text-xs text-foreground-muted">
          {label ? <span>{label}</span> : <span />}
          {showValue ? <span className="font-semibold tabular-nums">{Math.round(percent)} %</span> : null}
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Progression'}
        className={cn('w-full overflow-hidden rounded-full bg-ink-100', heights[size])}
      >
        <div
          className={cn('h-full rounded-full transition-[width] duration-500 ease-out', tones[tone])}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
