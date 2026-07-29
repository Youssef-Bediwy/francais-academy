import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  id: string;
  label: React.ReactNode;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { id, label, description, className, ...props },
  ref,
) {
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className="mt-0.5 h-5 w-5 shrink-0 rounded-md border-border text-brand-600 focus:ring-brand-400"
        aria-describedby={description ? `${id}-description` : undefined}
        {...props}
      />
      <div className="space-y-0.5">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        {description ? (
          <p id={`${id}-description`} className="text-xs text-foreground-muted">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
});
