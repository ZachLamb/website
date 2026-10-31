import { renderHook } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import { useHydrated, usePrefersReducedMotion } from './useHydrated';

// The visitor prefers reduced motion throughout this file.
vi.mock('framer-motion', () => ({ useReducedMotion: () => true }));

function serverRender(hook: () => boolean) {
  function Probe() {
    return createElement('span', null, String(hook()));
  }
  return renderToString(createElement(Probe));
}

describe('useHydrated', () => {
  it('is true once rendered on the client', () => {
    expect(renderHook(() => useHydrated()).result.current).toBe(true);
  });

  it('is false when rendered on the server', () => {
    expect(serverRender(useHydrated)).toContain('false');
  });
});

describe('usePrefersReducedMotion', () => {
  it('reports the preference on the client', () => {
    expect(renderHook(() => usePrefersReducedMotion()).result.current).toBe(true);
  });

  it('is false on the server, matching what the first client render must produce', () => {
    expect(serverRender(usePrefersReducedMotion)).toContain('false');
  });
});
