'use client';

import { useEffect } from 'react';

/**
 * Defensive cleanup. This site has never registered a service worker, but a
 * visitor's browser may carry an orphan registration from a different project
 * on the same hostname (a vercel.app preview alias, an old experiment, a
 * sibling domain). An orphan SW intercepts fetches and serves whatever it
 * cached, which presents to users as "the site is showing an old version."
 *
 * On mount, unregister every service worker scoped to this origin and clear
 * the Cache Storage entries. Idempotent — runs once per page load and no-ops
 * when nothing's registered. Renders nothing.
 */
export function SwKillSwitch() {
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
    void (async () => {
      try {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((reg) => reg.unregister()));
      } catch {
        /* noop — best-effort cleanup */
      }
      try {
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((key) => caches.delete(key)));
        }
      } catch {
        /* noop */
      }
    })();
  }, []);

  return null;
}
