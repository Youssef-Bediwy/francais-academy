'use client';

import { useToastContext } from '@/components/ui/toast';

export function useToast() {
  const { push, dismiss } = useToastContext();
  return {
    dismiss,
    toast: push,
    success: (title: string, description?: string) =>
      push({ title, variant: 'success', ...(description ? { description } : {}) }),
    error: (title: string, description?: string) =>
      push({ title, variant: 'error', ...(description ? { description } : {}) }),
    info: (title: string, description?: string) =>
      push({ title, variant: 'info', ...(description ? { description } : {}) }),
  };
}
