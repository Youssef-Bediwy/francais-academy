import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Fil d'Ariane" className={cn('mb-4', className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-foreground-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-brand-700 hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined} className={isLast ? 'font-medium text-foreground' : ''}>
                  {item.label}
                </span>
              )}
              {!isLast ? <ChevronRight className="h-3.5 w-3.5 rtl-flip" aria-hidden="true" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
