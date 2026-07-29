import { cn } from '@/utils/cn';

export interface XpRingProps {
  percent: number;
  level: number;
  label: string;
  size?: number;
  className?: string;
}

/** Anneau de progression SVG (aucune dependance graphique). */
export function XpRing({ percent, level, label, size = 120, className }: XpRingProps) {
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percent));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className={cn('inline-flex flex-col items-center gap-2', className)}>
      <svg width={size} height={size} role="img" aria-label={`${label} : ${Math.round(clamped)} %`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-ink-100"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-brand-500 transition-[stroke-dashoffset] duration-700"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text
          x="50%"
          y="46%"
          textAnchor="middle"
          className="fill-foreground font-display text-2xl font-bold"
        >
          {level}
        </text>
        <text x="50%" y="64%" textAnchor="middle" className="fill-foreground-muted text-[10px]">
          {label}
        </text>
      </svg>
    </div>
  );
}
