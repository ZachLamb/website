import { hasPublishedProjects } from '@/data/projects';
import { formatWaypoint, navLinkIds, waypointNumber, waypoints } from './waypoints';

describe('waypoints', () => {
  it('lists the page sections in order, about first and contact last', () => {
    expect(waypoints[0].id).toBe('about');
    expect(waypoints[waypoints.length - 1].id).toBe('contact');
  });

  it('includes projects only while a project is published', () => {
    expect(waypoints.some((w) => w.id === 'projects')).toBe(hasPublishedProjects);
    expect(waypoints).toHaveLength(navLinkIds.length - (hasPublishedProjects ? 0 : 1));
  });

  it('numbers sections consecutively from 1 with no gap for a hidden section', () => {
    expect(waypoints.map((w) => waypointNumber(w.id))).toEqual(waypoints.map((_, i) => i + 1));
  });

  it('returns 0 for a section that is not on the page', () => {
    if (!hasPublishedProjects) expect(waypointNumber('projects')).toBe(0);
  });

  it('prints numbers as two digits', () => {
    expect(formatWaypoint(3)).toBe('03');
    expect(formatWaypoint(12)).toBe('12');
  });
});
