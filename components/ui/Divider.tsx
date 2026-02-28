'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

type DividerVariant = 'mountains' | 'treeline' | 'trail';

interface DividerProps {
  className?: string;
  variant?: DividerVariant;
  flip?: boolean;
}

function MountainDivider({ flip }: { flip: boolean }) {
  return (
    <svg
      viewBox="0 0 1200 80"
      preserveAspectRatio="none"
      className={cn('block w-full', flip && '-scale-y-100')}
      style={{ height: '60px' }}
    >
      <path
        d="M0 80 L0 55 L80 35 L150 50 L220 20 L300 45 L380 15 L440 40 L520 10 L600 38 L680 18 L750 42 L830 8 L900 35 L960 22 L1040 40 L1120 25 L1200 45 L1200 80Z"
        className="fill-bark/6"
      />
      <path
        d="M0 80 L0 60 L100 45 L200 55 L280 30 L360 50 L460 25 L540 48 L640 20 L720 45 L800 28 L880 50 L980 35 L1060 48 L1140 38 L1200 50 L1200 80Z"
        className="fill-bark/4"
      />
    </svg>
  );
}

function TreelineDivider({ flip }: { flip: boolean }) {
  return (
    <svg
      viewBox="0 0 1200 60"
      preserveAspectRatio="none"
      className={cn('block w-full', flip && '-scale-y-100')}
      style={{ height: '50px' }}
    >
      {/* Tree silhouettes along a gentle ridge */}
      <path
        d="M0 60 L0 50 L30 48 L50 30 L55 48 L70 25 L75 48 L90 35 L95 48 L120 20 L125 48 L150 40 L170 28 L175 48 L200 45 L230 18 L235 48 L260 42 L290 22 L295 48 L320 38 L350 15 L355 48 L380 45 L410 25 L415 48 L440 40 L470 20 L475 48 L500 42 L530 28 L535 48 L560 35 L590 12 L595 48 L620 45 L650 30 L655 48 L680 38 L710 22 L715 48 L740 42 L770 18 L775 48 L800 40 L830 25 L835 48 L860 45 L890 20 L895 48 L920 35 L950 28 L955 48 L980 42 L1010 15 L1015 48 L1040 38 L1070 30 L1075 48 L1100 45 L1130 22 L1135 48 L1160 40 L1190 32 L1200 48 L1200 60Z"
        className="fill-forest/6"
      />
    </svg>
  );
}

function TrailDivider({ isInView }: { isInView: boolean }) {
  return (
    <div className="relative flex items-center justify-center py-4">
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: '100%' } : { width: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="border-bark/15 h-0 border-t border-dashed"
        style={{ maxWidth: '100%' }}
      />
      <div className="bg-parchment absolute px-3">
        <motion.svg
          viewBox="0 0 24 24"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-gold h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            d="M12 2 L15 10 L12 8 L9 10Z"
            fill="currentColor"
            fillOpacity={0.2}
            strokeLinejoin="round"
          />
          <circle cx="12" cy="15" r="3" />
          <path d="M12 18 L12 22" />
          <path d="M8 20 L16 20" />
        </motion.svg>
      </div>
    </div>
  );
}

export function Divider({ className, variant = 'trail', flip = false }: DividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });

  return (
    <div ref={ref} className={cn('relative my-0 overflow-hidden', className)}>
      {variant === 'mountains' && <MountainDivider flip={flip} />}
      {variant === 'treeline' && <TreelineDivider flip={flip} />}
      {variant === 'trail' && <TrailDivider isInView={isInView} />}
    </div>
  );
}
