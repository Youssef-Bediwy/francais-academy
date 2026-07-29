import { cn } from '@/utils/cn';

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  align?: 'start' | 'center';
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
  align = 'start',
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between',
        align === 'center' && 'sm:flex-col sm:items-center sm:text-center',
        className,
      )}
    >
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600">{eyebrow}</p>
        ) : null}
        <h2 className="text-2xl sm:text-3xl">{title}</h2>
        {description ? (
          <p className="max-w-2xl text-sm text-foreground-muted sm:text-base">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
