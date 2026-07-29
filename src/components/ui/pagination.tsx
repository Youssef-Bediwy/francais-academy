'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  labels?: { previous: string; next: string; page: string };
}

function pagesToShow(page: number, totalPages: number): (number | 'gap')[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages = new Set<number>([1, totalPages, page, page - 1, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const output: (number | 'gap')[] = [];
  sorted.forEach((value, index) => {
    const previous = sorted[index - 1];
    if (previous !== undefined && value - previous > 1) output.push('gap');
    output.push(value);
  });
  return output;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
  labels = { previous: 'Precedent', next: 'Suivant', page: 'Page' },
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className={cn('flex items-center justify-center gap-1.5', className)}>
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label={labels.previous}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4 rtl-flip" />
      </button>
      {pagesToShow(page, totalPages).map((value, index) =>
        value === 'gap' ? (
          <span key={`gap-${index}`} className="px-1 text-foreground-muted">
            &hellip;
          </span>
        ) : (
          <button
            key={value}
            type="button"
            onClick={() => onPageChange(value)}
            aria-current={value === page ? 'page' : undefined}
            aria-label={`${labels.page} ${value}`}
            className={cn(
              'inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium transition',
              value === page
                ? 'bg-brand-600 text-white'
                : 'border border-border bg-surface hover:bg-surface-muted',
            )}
          >
            {value}
          </button>
        ),
      )}
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label={labels.next}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4 rtl-flip" />
      </button>
    </nav>
  );
}
