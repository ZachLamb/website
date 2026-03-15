/**
 * Trail map marker icon identifiers (used in the hero trail map).
 */
export type MarkerIcon =
  | 'peak'
  | 'pine'
  | 'compass'
  | 'lake'
  | 'campfire'
  | 'elk'
  | 'columbine'
  | 'flag';

export interface TripMarker {
  x: number;
  y: number;
  delay: number;
  icon: MarkerIcon;
  label?: string;
}

export interface Trip {
  id: string;
  name: string;
  description?: string;
  /** Main trail path (SVG path d attribute). */
  trailPath: string;
  /** Optional secondary/decoration paths for the map. */
  secondaryTrailPaths?: string[];
  markers: TripMarker[];
}

const mainTrailPath =
  'M 60 80 C 120 40 180 60 240 110 S 340 160 400 130 S 500 80 560 120 S 640 200 620 280 S 560 360 480 380 S 380 400 320 440 S 240 500 200 560 S 160 620 220 660';

const secondTrailPath =
  'M 740 60 C 700 120 720 180 680 240 S 640 280 660 340 S 620 400 580 460 S 520 500 500 560 S 440 600 400 640 S 340 680 300 720';

const thirdTrailPath =
  'M 120 200 Q 280 120 420 180 T 660 260 T 720 380 Q 680 520 520 580 T 280 620';

/**
 * Demo trip used when no trip is selected (e.g. hero trail map).
 * Matches the original hardcoded trail: Trailhead → Bear Lake → Longs Peak → Dream Lake → Base Camp → Summit.
 */
export const demoTrip: Trip = {
  id: 'demo',
  name: 'Rocky Mountain National Park — Bear Lake to Summit',
  description:
    'A classic route from Bear Lake trailhead past Dream Lake to base camp and summit. The trail map on the homepage follows this trip.',
  trailPath: mainTrailPath,
  secondaryTrailPaths: [secondTrailPath, thirdTrailPath],
  markers: [
    { x: 60, y: 80, delay: 1.6, icon: 'compass', label: 'Trailhead' },
    { x: 240, y: 110, delay: 2.0, icon: 'pine', label: 'Bear Lake' },
    { x: 400, y: 130, delay: 2.3, icon: 'elk' },
    { x: 560, y: 120, delay: 2.6, icon: 'peak', label: 'Longs Peak' },
    { x: 620, y: 280, delay: 2.9, icon: 'columbine' },
    { x: 480, y: 380, delay: 3.2, icon: 'lake', label: 'Dream Lake' },
    { x: 320, y: 440, delay: 3.5, icon: 'pine' },
    { x: 200, y: 560, delay: 3.8, icon: 'campfire', label: 'Base Camp' },
    { x: 220, y: 660, delay: 4.1, icon: 'flag', label: 'Summit' },
  ],
};
