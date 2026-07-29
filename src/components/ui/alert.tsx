import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

const styles = {
  info: { box: 'border-ink-200 bg-surface', icon: Info, tone: 'text-ink-600' },
  success: { box: 'border-teal-300 bg-teal-50', icon: CheckCircle2, tone: 'text-teal-700' },
  warning: { box: 'border-sun-300 bg-sun-100', icon: AlertTriangle, tone: 'text-brand-700' },
  danger: { box: 'border-berry-300 bg-berry-100', icon: XCircle, tone: 'text-berry-600' },
} as const;

export interface AlertProps {
  variant?: keyof typeof styles;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

export function Alert({ variant = 'info', title, children, className }: AlertProps) {
  const { box, icon: Icon, tone } = styles[variant];
  return (
    <div
      role={variant === 'danger' ? 'alert' : 'status'}
      className={cn('flex items-start gap-3 rounded-xl border p-4', box, className)}
    >
      <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', tone)} aria-hidden="true" />
      <div className="space-y-1 text-sm">
        {title ? <p className="font-semibold">{title}</p> : null}
        {children ? <div className="text-foreground-muted">{children}</div> : null}
      </div>
    </div>
  );
}
