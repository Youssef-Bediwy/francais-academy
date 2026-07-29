import { cn } from '@/utils/cn';

export interface StatProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: React.ReactNode;
  tone?: 'brand' | 'teal' | 'sun' | 'berry';
  className?: string;
}

const tones = {
  brand: 'bg-brand-100 text-brand-700',
  teal: 'bg-teal-100 text-teal-700',
  sun: 'bg-sun-100 text-brand-700',
  berry: 'bg-berry-100 text-berry-600',
} as const;

export function Stat({ label, value, hint, icon, tone = 'brand', className }: StatProps) {
  return (
    <div className={cn('rounded-2xl border border-border bg-surface p-5 shadow-soft', className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">{label}</p>
        {icon ? (
          <span className={cn('inline-flex h-9 w-9 items-center justify-center rounded-xl', tones[tone])}>
            {icon}
          </span>
        ) : null}
      </div>
      <p className="mt-3 font-display text-3xl font-semibold tabular-nums">{value}</p>
      {hint ? <p className="mt-1 text-xs text-foreground-muted">{hint}</p> : null}
    </div>
  );
}
