import { forwardRef } from 'react';
import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { Spinner } from './spinner';

export const buttonVariants = cva(
  'inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 active:scale-[.98]',
  {
    variants: {
      variant: {
        primary: 'bg-brand-600 text-white shadow-soft hover:bg-brand-700',
        secondary: 'bg-ink-900 text-white hover:bg-ink-800',
        outline: 'border border-border bg-surface text-foreground hover:bg-surface-muted',
        ghost: 'text-foreground hover:bg-surface-muted',
        soft: 'bg-brand-100 text-brand-700 hover:bg-brand-200',
        success: 'bg-teal-600 text-white hover:bg-teal-700',
        danger: 'bg-berry-500 text-white hover:bg-berry-600',
        link: 'text-brand-700 underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-5 text-sm',
        lg: 'h-12 px-7 text-base',
        icon: 'h-10 w-10',
      },
      block: { true: 'w-full' },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

type BaseProps = VariantProps<typeof buttonVariants> & {
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export type ButtonProps = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, block, loading = false, disabled, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, block }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Spinner className="h-4 w-4" /> : null}
      {children}
    </button>
  );
});

export type ButtonLinkProps = BaseProps &
  Omit<React.ComponentProps<typeof Link>, 'className' | 'children'>;

export function ButtonLink({ className, variant, size, block, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={cn(buttonVariants({ variant, size, block }), className)} {...props}>
      {children}
    </Link>
  );
}
