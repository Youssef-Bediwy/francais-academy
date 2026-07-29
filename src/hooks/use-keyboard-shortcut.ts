'use client';

import { useEffect } from 'react';

export function useKeyboardShortcut(keys: string[], handler: (event: KeyboardEvent) => void) {
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (keys.includes(event.key)) handler(event);
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [keys, handler]);
}
