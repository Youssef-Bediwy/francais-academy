import { cn } from '@/utils/cn';

export function Card({
  className,
  as: Tag = 'div',
  interactive = false,
  ...props
}: React.HTMLAttributes<HTMLElement> & { as?: 'div' | 'article' | 'section' | 'li'; interactive?: boolean }) {
  return (
    <Tag
      className={cn(
        'rounded-2xl border border-border bg-surface shadow-soft',
        interactive && 'card-hover',
        className,
      )}
      {...props}
    />
  );
}

export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col gap-1 p-5 pb-0', className)} {...props} />
);

export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn('text-lg font-semibold', className)} {...props} />
);

export const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-sm text-foreground-muted', className)} {...props} />
);

export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-5', className)} {...props} />
);

export const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex items-center gap-3 border-t border-border p-5', className)} {...props} />
);
