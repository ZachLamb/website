import { hasPublishedProjects } from '@/data/projects';

/**
 * Every section the page can show after the hero, in page order. One list
 * feeds the navbar, the hero map's markers and legend, the side rail and the
 * number in each section heading, so a waypoint's number is the same
 * everywhere it appears.
 */
export const navLinkIds = [
  { key: 'trailGuide' as const, href: '#about', id: 'about' },
  { key: 'lodge' as const, href: '#services', id: 'services' },
  { key: 'trailLog' as const, href: '#experience', id: 'experience' },
  { key: 'selectedWork' as const, href: '#projects', id: 'projects' },
  { key: 'recommendations' as const, href: '#endorsements', id: 'endorsements' },
  { key: 'gear' as const, href: '#skills', id: 'skills' },
  { key: 'credentials' as const, href: '#education', id: 'education' },
  { key: 'contact' as const, href: '#contact', id: 'contact' },
] as const;

export type WaypointId = (typeof navLinkIds)[number]['id'];

/**
 * The waypoints actually on the page. Projects renders nothing until a
 * project is published, so it is dropped here too and the numbering closes
 * up around it.
 */
export const waypoints = navLinkIds.filter(
  (item) => hasPublishedProjects || item.id !== 'projects',
);

/** 1-based position of a section along the trail; 0 if it is not on the page. */
export function waypointNumber(id: WaypointId): number {
  return waypoints.findIndex((item) => item.id === id) + 1;
}

/** Two-digit form used wherever a waypoint number is printed: 3 -> "03". */
export function formatWaypoint(n: number): string {
  return String(n).padStart(2, '0');
}
