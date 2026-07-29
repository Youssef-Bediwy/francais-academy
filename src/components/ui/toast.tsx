'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

export type ToastVariant = 'info' | 'success' | 'error';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toasts: ToastItem[];
  push: (toast: Omit<ToastItem, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const icons = { info: Info, success: CheckCircle2, error: XCircle } as const;
const tones = {
  info: 'border-ink-200',
  success: 'border-teal-300',
  error: 'border-berry-300',
} as const;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (toast: Omit<ToastItem, 'id'>) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((current) => [...current, { ...toast, id }]);
      setTimeout(() => dismiss(id), 4500);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toasts, push, dismiss }), [toasts, push, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed bottom-4 end-4 z-[80] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2"
      >
        {toasts.map((toast) => {
          const Icon = icons[toast.variant];
          return (
            <div
              key={toast.id}
              className={cn(
                'pointer-events-auto flex items-start gap-3 rounded-xl border bg-surface p-4 shadow-lift animate-slide-up',
                tones[toast.variant],
              )}
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
              <div className="flex-1 space-y-0.5">
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.description ? (
                  <p className="text-xs text-foreground-muted">{toast.description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="rounded-md p-1 text-foreground-muted hover:bg-surface-muted"
                aria-label="Fermer la notification"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToastContext(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast doit etre utilise dans un ToastProvider');
  return context;
}
