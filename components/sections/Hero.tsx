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
  'M 80 50 Q 200 30 320 120 T 560 180 Q 680 220 720 320 T 600 450 Q 480 500 360 460 T 160 520 Q 80 560 120 650';

const trailMarkers = [
  { x: 80, y: 50, delay: 1.8, icon: 'pine' as const },
  { x: 320, y: 120, delay: 2.2, icon: 'compass' as const },
  { x: 560, y: 180, delay: 2.6, icon: 'mountain' as const },
  { x: 600, y: 450, delay: 3.0, icon: 'pine' as const },
  { x: 160, y: 520, delay: 3.4, icon: 'flag' as const },
];

function PineIcon() {
  return (
    <path
      d="M0-10 L4 0 L2 0 L5 6 L-5 6 L-2 0 L-4 0 Z M-1 6 L1 6 L1 10 L-1 10 Z"
      fill="currentColor"
    />
  );
}

function CompassIcon() {
  return (
    <>
      <circle cx="0" cy="0" r="7" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M0-5 L2 0 L0 5 L-2 0 Z" fill="currentColor" />
    </>
  );
}

function MountainIcon() {
  return (
    <path
      d="M-8 6 L-2-6 L0-2 L2-6 L8 6 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  );
}

function FlagIcon() {
  return (
    <>
      <line x1="0" y1="-8" x2="0" y2="8" stroke="currentColor" strokeWidth="1.2" />
      <path d="M0-8 L8-4 L0 0 Z" fill="currentColor" />
    </>
  );
}

const markerIcons = { pine: PineIcon, compass: CompassIcon, mountain: MountainIcon, flag: FlagIcon };

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-forest text-parchment"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <svg
          viewBox="0 0 800 700"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
        >
          <motion.path
            d={trailPath}
            stroke="rgba(245,240,232,0.12)"
            strokeWidth="2"
            strokeDasharray="8 6"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, ease: 'easeInOut', delay: 0.5 }}
          />

          {trailMarkers.map((marker) => {
            const Icon = markerIcons[marker.icon];
            return (
              <motion.g
                key={`${marker.x}-${marker.y}`}
                transform={`translate(${marker.x}, ${marker.y})`}
                className="text-parchment/10"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: marker.delay }}
              >
                <Icon />
              </motion.g>
            );
          })}
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
