'use client';

import { motion } from 'framer-motion';

function LeafSVG({ variant = 0 }: { variant?: number }) {
  if (variant === 1) {
    return (
      <svg viewBox="0 0 20 24" fill="currentColor" className="h-full w-full">
        <path
          d="M10 0 C14 4 18 10 16 18 C14 22 10 24 10 24 C10 24 6 22 4 18 C2 10 6 4 10 0Z"
          opacity="0.6"
        />
        <path d="M10 4 L10 22" stroke="currentColor" strokeWidth="0.4" opacity="0.3" fill="none" />
      </svg>
    );
  }
  if (variant === 2) {
    return (
      <svg viewBox="0 0 24 20" fill="currentColor" className="h-full w-full">
        <path d="M2 10 C4 4 10 0 18 2 C22 4 24 10 20 14 C16 18 8 18 2 10Z" opacity="0.5" />
        <path
          d="M4 10 Q12 8 20 12"
          stroke="currentColor"
          strokeWidth="0.3"
          opacity="0.3"
          fill="none"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 24" fill="currentColor" className="h-full w-full">
      <path
        d="M8 0 C12 6 14 12 12 18 C10 22 8 24 8 24 C8 24 6 22 4 18 C2 12 4 6 8 0Z"
        opacity="0.55"
      />
      <path d="M8 6 L8 20" stroke="currentColor" strokeWidth="0.3" opacity="0.3" fill="none" />
    </svg>
  );
}

interface FloatingLeaf {
  id: number;
  x: number;
  size: number;
  variant: number;
  duration: number;
  delay: number;
  drift: number;
  rotation: number;
}

function generateLeaves(count: number, seed: number): FloatingLeaf[] {
  const leaves: FloatingLeaf[] = [];
  for (let i = 0; i < count; i++) {
    const hash = ((seed + i) * 2654435761) % 2 ** 32;
    leaves.push({
      id: i,
      x: hash % 100,
      size: 10 + (hash % 14),
      variant: hash % 3,
      duration: 18 + (hash % 20),
      delay: hash % 15,
      drift: -30 + (hash % 60),
      rotation: hash % 360,
    });
  }
  return leaves;
}

export function FloatingLeaves({
  count = 8,
  color = 'text-moss/15',
  seed = 42,
}: {
  count?: number;
  color?: string;
  seed?: number;
}) {
  const leaves = generateLeaves(count, seed);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          className={`absolute ${color}`}
          style={{
            left: `${leaf.x}%`,
            width: leaf.size,
            height: leaf.size,
            top: '-5%',
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, leaf.drift, leaf.drift * 0.5],
            rotate: [leaf.rotation, leaf.rotation + 180, leaf.rotation + 360],
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <LeafSVG variant={leaf.variant} />
        </motion.div>
      ))}
    </div>
  );
}

export function BirdSilhouettes({ count = 3 }: { count?: number }) {
  const birds = Array.from({ length: count }, (_, i) => ({
    id: i,
    y: 15 + i * 20,
    duration: 25 + i * 8,
    delay: i * 6,
    size: 18 + (i % 2) * 8,
    startX: i % 2 === 0 ? -10 : 110,
    endX: i % 2 === 0 ? 110 : -10,
  }));

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {birds.map((bird) => (
        <motion.div
          key={bird.id}
          className="text-bark/8 absolute"
          style={{ top: `${bird.y}%`, width: bird.size, height: bird.size }}
          animate={{
            left: [`${bird.startX}%`, `${bird.endX}%`],
            y: [0, -15, 5, -10, 0],
          }}
          transition={{
            duration: bird.duration,
            delay: bird.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <svg viewBox="0 0 24 12" fill="currentColor" className="h-full w-full">
            <path d="M12 6 C10 2 6 0 0 2 C4 2 8 4 12 6Z" opacity="0.8" />
            <path d="M12 6 C14 2 18 0 24 2 C20 2 16 4 12 6Z" opacity="0.8" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

export function PineTreeSilhouette({
  position = 'left',
  className = '',
}: {
  position?: 'left' | 'right';
  className?: string;
}) {
  const isLeft = position === 'left';

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute bottom-0 ${isLeft ? 'left-0' : 'right-0'} ${className}`}
    >
      <svg
        viewBox="0 0 120 200"
        fill="currentColor"
        className={`h-48 w-auto opacity-[0.04] ${isLeft ? '' : '-scale-x-100'}`}
      >
        <path d="M60 0 L80 50 L70 45 L90 90 L75 85 L95 130 L80 125 L100 170 L20 170 L40 125 L25 130 L45 85 L30 90 L50 45 L40 50 Z" />
        <rect x="52" y="170" width="16" height="30" />
      </svg>
    </div>
  );
}

export function Fireflies({ count = 12 }: { count?: number }) {
  const dots = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 5 + ((i * 37) % 90),
    y: 10 + ((i * 53) % 80),
    duration: 3 + (i % 4) * 1.5,
    delay: (i * 0.7) % 5,
    size: 2 + (i % 2),
  }));

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          className="bg-gold-light/30 absolute rounded-full"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.size,
            height: dot.size,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.2, 0.5],
            y: [0, -8, 0],
            x: [0, dot.id % 2 === 0 ? 4 : -4, 0],
          }}
          transition={{
            duration: dot.duration,
            delay: dot.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export function MistLayer({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 bottom-0 ${className}`}
    >
      <motion.div
        className="h-32 w-full"
        style={{
          background: 'linear-gradient(to top, rgba(245,240,232,0.08), transparent)',
        }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
