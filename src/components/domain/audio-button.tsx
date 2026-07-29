'use client';

import { Pause, Volume2 } from 'lucide-react';
import { useAudioPlayer } from '@/hooks/use-audio-player';
import { cn } from '@/utils/cn';

export function AudioButton({
  src,
  label,
  className,
}: {
  src?: string | null;
  label: string;
  className?: string;
}) {
  const { playing, available, toggle } = useAudioPlayer(src);
  if (!available) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-700 transition hover:bg-brand-200',
        className,
      )}
    >
      {playing ? <Pause className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
    </button>
  );
}
