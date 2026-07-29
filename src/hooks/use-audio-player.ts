'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function useAudioPlayer(src?: string | null) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(Boolean(src));

  useEffect(() => {
    setAvailable(Boolean(src));
    if (!src) return;
    const audio = new Audio(src);
    audioRef.current = audio;
    const onEnd = () => setPlaying(false);
    const onError = () => {
      setAvailable(false);
      setPlaying(false);
    };
    audio.addEventListener('ended', onEnd);
    audio.addEventListener('error', onError);
    return () => {
      audio.pause();
      audio.removeEventListener('ended', onEnd);
      audio.removeEventListener('error', onError);
      audioRef.current = null;
    };
  }, [src]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play().then(() => setPlaying(true)).catch(() => setAvailable(false));
    } else {
      audio.pause();
      setPlaying(false);
    }
  }, []);

  return { playing, available, toggle };
}
