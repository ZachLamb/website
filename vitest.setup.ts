import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import * as React from 'react';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/en',
  useSearchParams: () => new URLSearchParams(),
}));

// Global framer-motion mock for the entire suite.
//
// Why it lives here instead of being copy-pasted per-file:
//   1) New tests don't need a 15-line fixture; they inherit this default.
//   2) When the framer-motion API surface widens (MotionConfig added in
//      Phase 1, useTransform exercised by TrailExtension's test in Phase 3),
//      we update one place instead of fanning out to every consumer.
//
// Per-file behavior overrides (e.g., flipping useReducedMotion per-test)
// MUST replace this mock locally with their own vi.mock. Vitest resolves
// the test-file vi.mock above the setup-file mock for that file. See
// TaglineCycler.test.tsx / Hero.test.tsx / TrailExtension.test.tsx for the
// hoisted-vi.fn pattern.
vi.mock('framer-motion', () => {
  // Named factory so react/display-name doesn't flag the inner function.
  // The displayName also surfaces a readable label in any failed-render
  // diagnostics (e.g. "MockMotion(path) failed to render").
  const make = (tag: string) => {
    const MockMotion = ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [k: string]: unknown;
    }) => React.createElement(tag as keyof React.JSX.IntrinsicElements, props, children);
    MockMotion.displayName = `MockMotion(${tag})`;
    return MockMotion;
  };

  // Proxy so any m.X / motion.X tag — present and future — works without
  // enumeration. `create` is preserved as a legacy escape hatch.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cache: any = {};
  const factories = new Proxy(cache, {
    get(target, key) {
      if (typeof key !== 'string') return undefined;
      if (key === 'create') return make;
      if (!(key in target)) target[key] = make(key);
      return target[key];
    },
  });

  return {
    motion: factories,
    m: factories,
    useInView: () => true,
    useReducedMotion: () => false,
    useScroll: () => ({ scrollYProgress: { current: 0 } }),
    useTransform: () => ({ current: 0 }),
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => children,
    LazyMotion: ({ children }: { children?: React.ReactNode }) => children,
    MotionConfig: ({ children }: { children?: React.ReactNode }) => children,
    domAnimation: {},
  };
});
