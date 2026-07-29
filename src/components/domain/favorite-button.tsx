'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import type { FavoriteType } from '@prisma/client';
import { apiFetch } from '@/hooks/use-api';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/components/providers/i18n-provider';
import { cn } from '@/utils/cn';

export function FavoriteButton({
  type,
  targetId,
  initial = false,
  className,
}: {
  type: FavoriteType;
  targetId: string;
  initial?: boolean;
  className?: string;
}) {
  const { t } = useI18n();
  const toast = useToast();
  const [favorited, setFavorited] = useState(initial);
  const [pending, setPending] = useState(false);

  const toggle = async () => {
    setPending(true);
    try {
      const result = await apiFetch<{ favorited: boolean }>('/api/favorites', {
        method: 'POST',
        body: JSON.stringify({ type, targetId }),
      });
      setFavorited(result.favorited);
      toast.success(result.favorited ? t('favorites.added') : t('favorites.removed'));
    } catch {
      toast.error(t('errors.generic'));
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={favorited}
      aria-label={favorited ? t('favorites.remove') : t('favorites.add')}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface transition hover:bg-surface-muted disabled:opacity-50',
        className,
      )}
    >
      <Heart
        className={cn('h-4 w-4', favorited ? 'fill-berry-500 text-berry-500' : 'text-foreground-muted')}
      />
    </button>
  );
}
