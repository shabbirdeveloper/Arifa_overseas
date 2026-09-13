'use client';

import { useSyncExternalStore } from 'react';

/**
 * Light/dark theme state.
 *
 * The class on <body> is the single source of truth — a blocking script in the
 * document head applies it before first paint so there is no flash of the wrong
 * palette. `useSyncExternalStore` is how React reads external mutable state
 * like that without tearing, and it keeps hydration correct: the server
 * snapshot is always "dark", then React re-reads the real value on the client.
 */

const THEME_KEY = 'theme';
const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

const getSnapshot = () => document.body.classList.contains('light-theme');
const getServerSnapshot = () => false;

export function useIsLightTheme(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function toggleTheme(): void {
  const isLight = document.body.classList.toggle('light-theme');
  try {
    window.localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');
  } catch {
    // Private mode or blocked storage — the toggle still works for this visit.
  }
  listeners.forEach((listener) => listener());
}
