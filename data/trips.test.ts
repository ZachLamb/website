import { describe, it, expect } from 'vitest';
import { demoTrip } from './trips';

describe('trips', () => {
  describe('demoTrip', () => {
    it('has required trip fields', () => {
      expect(demoTrip.id).toBe('demo');
      expect(demoTrip.name).toBeDefined();
      expect(demoTrip.trailPath).toBeDefined();
      expect(Array.isArray(demoTrip.markers)).toBe(true);
    });

    it('has markers with x, y, delay, icon, and optional label', () => {
      for (const m of demoTrip.markers) {
        expect(typeof m.x).toBe('number');
        expect(typeof m.y).toBe('number');
        expect(typeof m.delay).toBe('number');
        expect([
          'peak',
          'pine',
          'compass',
          'lake',
          'campfire',
          'elk',
          'columbine',
          'flag',
        ]).toContain(m.icon);
      }
    });

    it('has the same number of markers as the original hero trail', () => {
      expect(demoTrip.markers).toHaveLength(9);
    });

    it('has secondary trail paths when used for hero decoration', () => {
      expect(demoTrip.secondaryTrailPaths).toBeDefined();
      expect(demoTrip.secondaryTrailPaths!.length).toBeGreaterThanOrEqual(1);
    });
  });
});
