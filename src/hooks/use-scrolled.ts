'use client';

import { useSyncExternalStore } from 'react';

/**
 * True once the page has scrolled past `threshold`. Reads window.scrollY
 * through useSyncExternalStore so the value is correct on a mid-page refresh
 * without setting state inside an effect.
 */
export function useScrolled(threshold = 50): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener('scroll', onStoreChange, { passive: true });
      return () => window.removeEventListener('scroll', onStoreChange);
    },
    () => window.scrollY > threshold,
    () => false,
  );
}
