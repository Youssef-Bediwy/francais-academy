import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full font-medium leading-none',
  {
    variants: {
      variant: {
        neutral: 'bg-ink-100 text-ink-700',
        brand: 'bg-brand-100 text-brand-700',
        success: 'bg-teal-100 text-teal-700',
        warning: 'bg-sun-100 text-brand-700',
        danger: 'bg-berry-100 text-berry-600',
        outline: 'border border-border text-foreground-muted',
      },
      size: { sm: 'px-2 py-1 text-[11px]', md: 'px-2.5 py-1.5 text-xs' },
    },
    defaultVariants: { variant: 'neutral', size: 'md' },
  },
);

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}
