'use client';

import { useSyncExternalStore } from 'react';
import { useReducedMotion } from 'framer-motion';

const subscribe = () => () => {};

/**
 * False on the server and during hydration, true afterwards. Gate any render
 * branch that depends on a browser-only value (prefers-reduced-motion, media
 * queries) on it, so the first client render matches the server HTML.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

/**
 * framer-motion's useReducedMotion, but false until hydration finishes. The
 * server can't know the preference, so anything that renders differently for
 * reduced motion must use this or the first client render won't match the
 * server HTML (React #418). Components that drop animation props when it
 * flips should remount the affected subtree (key on the value) so nothing is
 * left at its initial opacity or transform.
 */
export function usePrefersReducedMotion(): boolean {
  const hydrated = useHydrated();
  return (useReducedMotion() ?? false) && hydrated;
}
