'use client';

import { useEffect } from 'react';

/**
 * Stops the page scrolling behind a full-screen overlay.
 *
 * Uses the position:fixed pattern because `overflow: hidden` on <html> makes
 * iOS Safari jump to the top. The body is pinned at its current offset and
 * put back on unlock.
 *
 * The restore must be instant. <html> has `scroll-behavior: smooth`, so a
 * plain scrollTo() animates from 0 back to the saved offset — and the
 * animation was being cut short, leaving the reader hundreds of pixels from
 * where they had been.
 *
 * `onUnlocked` runs after the page is scrollable again, which is the first
 * moment a scroll to an in-page target can work.
 */
export function useBodyScrollLock(locked: boolean, onUnlocked?: () => void) {
  useEffect(() => {
    if (!locked) return;

    const { body } = document;
    const scrollY = window.scrollY;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
    };
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';

    return () => {
      Object.assign(body.style, previous);
      window.scrollTo({ top: scrollY, left: 0, behavior: 'instant' });
      onUnlocked?.();
    };
    // onUnlocked is read at unlock time only; callers pass a stable callback.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locked]);
}
