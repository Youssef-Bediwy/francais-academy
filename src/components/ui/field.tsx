import { cn } from '@/utils/cn';

export interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

/** Enveloppe accessible partagee par tous les controles de formulaire. */
export function Field({ id, label, hint, error, required, className, children }: FieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
        {required ? (
          <span className="text-berry-500" aria-hidden="true">
            {' *'}
          </span>
        ) : null}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-xs text-foreground-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-berry-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const describedBy = (id: string, hint?: string, error?: string) =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined;

export const controlClasses =
  'w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground-muted/70 transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200 disabled:cursor-not-allowed disabled:bg-surface-muted';
