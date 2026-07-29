'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' } as const;

/** Modale accessible : focus trap, Escape, aria-labelledby geres par Radix. */
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'md',
  className,
}: ModalProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 animate-fade-in bg-ink-950/50 backdrop-blur-sm" />
        <DialogPrimitive.Content
          className={cn(
            'fixed start-1/2 top-1/2 z-50 w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rtl:translate-x-1/2',
            'animate-scale-in rounded-2xl border border-border bg-surface p-6 shadow-lift',
            sizes[size],
            className,
          )}
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <DialogPrimitive.Title className="text-lg font-semibold">{title}</DialogPrimitive.Title>
              {description ? (
                <DialogPrimitive.Description className="text-sm text-foreground-muted">
                  {description}
                </DialogPrimitive.Description>
              ) : null}
            </div>
            <DialogPrimitive.Close
              className="rounded-lg p-1.5 text-foreground-muted transition hover:bg-surface-muted"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>
          </div>
          {children}
          {footer ? <div className="mt-6 flex justify-end gap-3">{footer}</div> : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
