import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import { controlClasses, describedBy, Field } from './field';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  options: SelectOption[];
  label?: string;
  hint?: string;
  error?: string;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { id, options, label, hint, error, placeholder, className, required, ...props },
  ref,
) {
  const control = (
    <div className="relative">
      <select
        ref={ref}
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(controlClasses, 'appearance-none pe-10', className)}
        {...props}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 end-3 my-auto h-4 w-4 text-foreground-muted"
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
