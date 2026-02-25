'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { socialLinks } from '@/data/social';

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  github: Github,
  linkedin: Linkedin,
};

const trailPath =
  'M 60 80 C 120 40 180 60 240 110 S 340 160 400 130 S 500 80 560 120 S 640 200 620 280 S 560 360 480 380 S 380 400 320 440 S 240 500 200 560 S 160 620 220 660';

type MarkerIcon = 'peak' | 'pine' | 'compass' | 'lake' | 'campfire' | 'elk' | 'columbine' | 'flag';

interface TrailMarker {
  x: number;
  y: number;
  delay: number;
  icon: MarkerIcon;
  label?: string;
}

const trailMarkers: TrailMarker[] = [
  { x: 60, y: 80, delay: 1.6, icon: 'compass', label: 'Trailhead' },
  { x: 240, y: 110, delay: 2.0, icon: 'pine', label: 'Bear Lake' },
  { x: 400, y: 130, delay: 2.3, icon: 'elk' },
  { x: 560, y: 120, delay: 2.6, icon: 'peak', label: "Longs Peak" },
  { x: 620, y: 280, delay: 2.9, icon: 'columbine' },
  { x: 480, y: 380, delay: 3.2, icon: 'lake', label: 'Dream Lake' },
  { x: 320, y: 440, delay: 3.5, icon: 'pine' },
  { x: 200, y: 560, delay: 3.8, icon: 'campfire', label: 'Base Camp' },
  { x: 220, y: 660, delay: 4.1, icon: 'flag', label: "Summit" },
];

function PeakIcon() {
  return (
    <>
      <path
        d="M-12 8 L-4-10 L0-2 L4-10 L12 8 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M-2-6 L0-2 L2-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.6"
      />
    </>
  );
}

function PineIcon() {
  return (
    <>
      <path d="M0-10 L3-3 L1.5-3 L4 2 L-4 2 L-1.5-3 L-3-3 Z" fill="currentColor" opacity="0.8" />
      <rect x="-0.8" y="2" width="1.6" height="4" fill="currentColor" opacity="0.6" />
    </>
  );
}

function CompassIcon() {
  return (
    <>
      <circle cx="0" cy="0" r="8" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M0-6 L1.5 0 L0 6 L-1.5 0 Z" fill="currentColor" opacity="0.7" />
      <line x1="-6" y1="0" x2="6" y2="0" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
    </>
  );
}

function LakeIcon() {
  return (
    <>
      <ellipse cx="0" cy="0" rx="10" ry="5" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.7" />
      <path d="M-6 1 Q-3-1 0 1 Q3 3 6 1" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
    </>
  );
}

function CampfireIcon() {
  return (
    <>
      <path d="M0-8 Q3-4 1 0 Q4 2 0 6 Q-4 2 -1 0 Q-3-4 0-8 Z" fill="currentColor" opacity="0.6" />
      <line x1="-5" y1="6" x2="5" y2="6" stroke="currentColor" strokeWidth="1.2" />
      <line x1="-4" y1="8" x2="4" y2="8" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
    </>
  );
}

function ElkIcon() {
  return (
    <g transform="scale(0.9)">
      <ellipse cx="0" cy="2" rx="6" ry="3.5" fill="currentColor" opacity="0.6" />
      <circle cx="-5" cy="-2" r="2.5" fill="currentColor" opacity="0.6" />
      <path d="M-7-4 L-10-10 M-7-4 L-8-11 M-7-4 L-6-10" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.5" />
      <line x1="-3" y1="5" x2="-3" y2="9" stroke="currentColor" strokeWidth="0.8" />
      <line x1="3" y1="5" x2="3" y2="9" stroke="currentColor" strokeWidth="0.8" />
    </g>
  );
}

function ColumbineIcon() {
  return (
    <g transform="scale(0.8)">
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse
          key={angle}
          cx="0"
          cy="-6"
          rx="2.5"
          ry="5"
          fill="currentColor"
          opacity="0.5"
          transform={`rotate(${angle})`}
        />
      ))}
      <circle cx="0" cy="0" r="2" fill="currentColor" opacity="0.8" />
    </g>
  );
}

function FlagIcon() {
  return (
    <>
      <line x1="0" y1="-9" x2="0" y2="9" stroke="currentColor" strokeWidth="1.2" />
      <path d="M0-9 L9-5 L0-1 Z" fill="currentColor" opacity="0.7" />
    </>
  );
}

const markerIcons: Record<MarkerIcon, React.FC> = {
  peak: PeakIcon,
  pine: PineIcon,
  compass: CompassIcon,
  lake: LakeIcon,
  campfire: CampfireIcon,
  elk: ElkIcon,
  columbine: ColumbineIcon,
  flag: FlagIcon,
};

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-forest text-parchment"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <svg
          viewBox="0 0 800 750"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
        >
          <motion.path
            d={trailPath}
            stroke="rgba(245,240,232,0.10)"
            strokeWidth="2"
            strokeDasharray="8 6"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
          />

          {trailMarkers.map((marker) => {
            const Icon = markerIcons[marker.icon];
            return (
              <motion.g
                key={`${marker.x}-${marker.y}`}
                transform={`translate(${marker.x}, ${marker.y})`}
                className="text-parchment/10"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: marker.delay, ease: 'easeOut' }}
              >
                <Icon />
                {marker.label && (
                  <text
                    y={marker.icon === 'peak' ? -16 : 18}
                    textAnchor="middle"
                    fill="currentColor"
                    fontSize="9"
                    fontFamily="var(--font-serif)"
                    letterSpacing="0.05em"
                    opacity="0.7"
                  >
                    {marker.label}
                  </text>
                )}
              </motion.g>
            );
          })}

          {/* Elevation contour hints */}
          <motion.ellipse
            cx="540" cy="140" rx="80" ry="40"
            fill="none" stroke="rgba(245,240,232,0.04)" strokeWidth="0.8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.5 }}
          />
          <motion.ellipse
            cx="540" cy="140" rx="55" ry="28"
            fill="none" stroke="rgba(245,240,232,0.03)" strokeWidth="0.8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.7 }}
          />
          <motion.ellipse
            cx="470" cy="390" rx="50" ry="25"
            fill="none" stroke="rgba(245,240,232,0.03)" strokeWidth="0.8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 3.1 }}
          />
        </svg>
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center"
      >
        <motion.p
          variants={fadeUp}
          className="font-sans text-sm uppercase tracking-widest text-gold"
        >
          Senior Software Engineer
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="mt-4 font-serif text-5xl font-bold text-parchment md:text-7xl"
        >
          Zach Lamb
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-6 max-w-2xl text-lg text-stone md:text-xl"
        >
          I build tools for people — and I&rsquo;m always up for a conversation
          about code, the outdoors, or Oreos.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Button href="#about">Begin the Journey</Button>
          <Button variant="secondary" href="#contact">
            Leave a Note at Camp
          </Button>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-6 flex items-center gap-5"
        >
          {socialLinks.map((link) => {
            const Icon = iconMap[link.icon];
            if (!Icon) return null;
            return (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.platform}
                className="text-stone transition-colors hover:text-gold"
              >
                <Icon className="h-5 w-5" />
              </a>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
