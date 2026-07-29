import { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { controlClasses, describedBy, Field } from './field';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { id, label, hint, error, className, required, rows = 4, ...props },
  ref,
) {
  const control = (
    <textarea
      ref={ref}
      id={id}
      rows={rows}
      required={required}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy(id, hint, error)}
      className={cn(controlClasses, 'resize-y', error && 'border-berry-400', className)}
      {...props}
    />
  );

  if (!label) return control;
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required}>
      {control}
    </Field>
  );
});
