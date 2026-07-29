'use client';

import { useEffect, useRef, useState } from 'react';

/** Compte le temps passe sur une page, en secondes (utilise pour la progression). */
export function useTimer(active = true) {
  const [seconds, setSeconds] = useState(0);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setSeconds(Math.round((Date.now() - startedAt.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [active]);

  return seconds;
}
