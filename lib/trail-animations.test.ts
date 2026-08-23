import {
  trailFadeUp,
  waypointPop,
  elevationSlideLeft,
  elevationSlideRight,
} from './trail-animations';

type VisibleState = { transition?: { duration?: number } };
type HiddenState = { x?: number; y?: number };

describe('trail-animations (never-blank rule)', () => {
  const variants = { trailFadeUp, waypointPop, elevationSlideLeft, elevationSlideRight };

  it.each(Object.entries(variants))('%s hidden offset is ≤ 12px', (_name, v) => {
    const hidden = v.hidden as HiddenState;
    expect(Math.abs(hidden.x ?? 0)).toBeLessThanOrEqual(12);
    expect(Math.abs(hidden.y ?? 0)).toBeLessThanOrEqual(12);
  });

  it.each(Object.entries(variants))('%s visible duration is ≤ 0.35s', (_name, v) => {
    const visible = v.visible as VisibleState;
    // spring-based variants have no duration — that's fine; only check tweens
    if (visible.transition?.duration !== undefined) {
      expect(visible.transition.duration).toBeLessThanOrEqual(0.35);
    }
  });
});
