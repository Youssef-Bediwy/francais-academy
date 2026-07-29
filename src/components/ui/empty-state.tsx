import { cn } from '@/utils/cn';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-surface px-6 py-14 text-center',
        className,
      )}
    >
      {icon ? <div className="text-brand-500">{icon}</div> : null}
      <p className="text-lg font-semibold">{title}</p>
      {description ? (
        <p className="max-w-md text-sm text-foreground-muted">{description}</p>
      ) : null}
      {action}
    </div>
  );
}
