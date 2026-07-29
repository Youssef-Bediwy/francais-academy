import { cn } from '@/utils/cn';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

export interface RadioGroupProps {
  name: string;
  legend: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function RadioGroup({ name, legend, options, value, onChange, className }: RadioGroupProps) {
  return (
    <fieldset className={cn('space-y-2', className)}>
      <legend className="mb-2 text-sm font-medium">{legend}</legend>
      {options.map((option) => {
        const id = `${name}-${option.value}`;
        const checked = value === option.value;
        return (
          <label
            key={option.value}
            htmlFor={id}
            className={cn(
              'flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition',
              checked ? 'border-brand-400 bg-brand-50' : 'border-border hover:bg-surface-muted',
            )}
          >
            <input
              id={id}
              type="radio"
              name={name}
              value={option.value}
              checked={checked}
              onChange={() => onChange?.(option.value)}
              className="mt-0.5 h-4 w-4 border-border text-brand-600 focus:ring-brand-400"
            />
            <span className="space-y-0.5">
              <span className="block text-sm font-medium">{option.label}</span>
              {option.description ? (
                <span className="block text-xs text-foreground-muted">{option.description}</span>
              ) : null}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}
