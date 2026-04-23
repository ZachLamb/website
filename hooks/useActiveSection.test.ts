import { renderHook, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useActiveSection } from './useActiveSection';

const SECTION_IDS = [
  'hero',
  'about',
  'experience',
  'endorsements',
  'skills',
  'services',
  'education',
  'contact',
];

function createSection(id: string, offsetTop: number, offsetHeight: number) {
  const el = document.createElement('section');
  el.id = id;
  Object.defineProperty(el, 'offsetTop', { configurable: true, value: offsetTop });
  Object.defineProperty(el, 'offsetHeight', { configurable: true, value: offsetHeight });
  document.body.appendChild(el);
  return el;
}

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', { configurable: true, writable: true, value });
}

function fireScroll() {
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });
}

describe('useActiveSection', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      writable: true,
      value: 800,
    });
    setScrollY(0);
    // 8 sections, each 800px tall, starting at offsetTop 0. innerHeight=800 → mid offset=280.
    SECTION_IDS.forEach((id, i) => createSection(id, i * 800, 800));
  });

  afterEach(() => {
    document.querySelectorAll('section').forEach((el) => el.remove());
    setScrollY(0);
  });

  it('returns "hero" on initial mount with scrollY=0', () => {
    // viewportMid = 0 + 280 = 280, inside hero [0, 800)
    const { result } = renderHook(() => useActiveSection());
    expect(result.current).toBe('hero');
  });

  it('returns "about" after scrolling to scrollY=1000', () => {
    // viewportMid = 1000 + 280 = 1280, inside about [800, 1600)
    const { result } = renderHook(() => useActiveSection());
    setScrollY(1000);
    fireScroll();
    expect(result.current).toBe('about');
  });

  it('returns "skills" after scrolling to scrollY=3100', () => {
    // viewportMid = 3100 + 280 = 3380, inside skills [3200, 4000)
    const { result } = renderHook(() => useActiveSection());
    setScrollY(3100);
    fireScroll();
    expect(result.current).toBe('skills');
  });

  it('returns "contact" after scrolling to scrollY=6000', () => {
    // viewportMid = 6000 + 280 = 6280, inside contact [5600, 6400)
    const { result } = renderHook(() => useActiveSection());
    setScrollY(6000);
    fireScroll();
    expect(result.current).toBe('contact');
  });

  it('falls back to "hero" when scrolled past the last section', () => {
    // viewportMid = 6500 + 280 = 6780, beyond contact's end at 6400.
    // Reverse iteration: no section matches either branch, so `current` stays at its
    // initial value of 'hero'. This documents the current implementation's behavior
    // at the past-end edge.
    const { result } = renderHook(() => useActiveSection());
    setScrollY(6500);
    fireScroll();
    expect(result.current).toBe('hero');
  });

  it('does not throw when a scroll event fires after unmount', () => {
    const { unmount } = renderHook(() => useActiveSection());
    unmount();
    expect(() => {
      setScrollY(1000);
      window.dispatchEvent(new Event('scroll'));
    }).not.toThrow();
  });

  it('returns default "hero" when no section elements exist in the DOM', () => {
    document.querySelectorAll('section').forEach((el) => el.remove());
    const { result } = renderHook(() => useActiveSection());
    expect(result.current).toBe('hero');
    expect(() => {
      setScrollY(2000);
      fireScroll();
    }).not.toThrow();
    expect(result.current).toBe('hero');
  });

  it('keeps a stable reference when the active section does not change', () => {
    // The setActive updater guards with `prev !== current ? current : prev`, so when
    // the computed id matches the previous active id, React receives the same
    // reference and does not schedule a re-render.
    const { result } = renderHook(() => useActiveSection());
    const initial = result.current;
    expect(initial).toBe('hero');

    setScrollY(10); // viewportMid = 290, still inside hero [0, 800)
    fireScroll();

    expect(result.current).toBe(initial);
    expect(Object.is(result.current, initial)).toBe(true);
  });
});
