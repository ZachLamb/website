import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  MAP_HEIGHT,
  MAP_WIDTH,
  ROUTE_POINTS,
  SUMMIT,
  routePath,
  waypointsAlongRoute,
} from './trail-route';

describe('trail route', () => {
  it('stays inside the map', () => {
    for (const [x, y] of ROUTE_POINTS) {
      expect(x).toBeGreaterThan(0);
      expect(x).toBeLessThan(MAP_WIDTH);
      expect(y).toBeGreaterThan(0);
      expect(y).toBeLessThan(MAP_HEIGHT);
    }
  });

  it('is drawn in the same coordinate space as the terrain image', () => {
    const svg = readFileSync(join(process.cwd(), 'public/topo/hero-map.svg'), 'utf8');
    expect(svg).toContain(`viewBox="0 0 ${MAP_WIDTH} ${MAP_HEIGHT}"`);
  });

  it('ends on the summit', () => {
    const [x, y] = ROUTE_POINTS[ROUTE_POINTS.length - 1];
    expect(Math.hypot(x - SUMMIT[0], y - SUMMIT[1])).toBeLessThan(10);
  });

  it('builds one continuous path through every point', () => {
    const [startX, startY] = ROUTE_POINTS[0];
    const [endX, endY] = ROUTE_POINTS[ROUTE_POINTS.length - 1];
    expect(routePath.startsWith(`M${startX} ${startY}`)).toBe(true);
    expect(routePath.endsWith(`${endX} ${endY}`)).toBe(true);
    expect(routePath.match(/M/g)).toHaveLength(1);
    expect(routePath.match(/C/g)).toHaveLength(ROUTE_POINTS.length - 1);
  });
});

describe('waypointsAlongRoute', () => {
  it('returns the number of waypoints asked for', () => {
    expect(waypointsAlongRoute(0)).toEqual([]);
    expect(waypointsAlongRoute(7)).toHaveLength(7);
    expect(waypointsAlongRoute(8)).toHaveLength(8);
  });

  it('puts the first on the trailhead and the last on the route end', () => {
    const points = waypointsAlongRoute(7);
    const [startX, startY] = ROUTE_POINTS[0];
    const [endX, endY] = ROUTE_POINTS[ROUTE_POINTS.length - 1];
    expect(points[0].left).toBeCloseTo((startX / MAP_WIDTH) * 100, 0);
    expect(points[0].top).toBeCloseTo((startY / MAP_HEIGHT) * 100, 0);
    expect(points[6].left).toBeCloseTo((endX / MAP_WIDTH) * 100, 0);
    expect(points[6].top).toBeCloseTo((endY / MAP_HEIGHT) * 100, 0);
  });

  it('reports progress evenly from 0 to 1', () => {
    const points = waypointsAlongRoute(5);
    expect(points.map((p) => p.progress)).toEqual([0, 0.25, 0.5, 0.75, 1]);
  });

  it.each([7, 8])('keeps %i markers far enough apart to tap on a 320px-wide phone', (count) => {
    // The map is ~278px wide on the narrowest phone we support; markers are
    // 28px across. Require centres at least 30px apart at that size.
    const width = 278;
    const height = width * (MAP_HEIGHT / MAP_WIDTH);
    const points = waypointsAlongRoute(count).map((p) => [
      (p.left / 100) * width,
      (p.top / 100) * height,
    ]);
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const gap = Math.hypot(points[i][0] - points[j][0], points[i][1] - points[j][1]);
        expect(gap).toBeGreaterThanOrEqual(30);
      }
    }
  });

  it('handles a single waypoint', () => {
    expect(waypointsAlongRoute(1)).toHaveLength(1);
    expect(waypointsAlongRoute(1)[0].progress).toBe(0);
  });
});
