import { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { controlClasses, describedBy, Field } from './field';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  hint?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { id, label, hint, error, icon, className, required, ...props },
  ref,
) {
  const control = (
    <div className="relative">
      {icon ? (
        <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-foreground-muted">
          {icon}
        </span>
      ) : null}
      <input
        ref={ref}
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(controlClasses, icon && 'ps-10', error && 'border-berry-400', className)}
        {...props}
      />
    </div>
  );

  if (!label) return control;
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required}>
      {control}
    </Field>
  );
});
