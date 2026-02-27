'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Github, Linkedin } from 'lucide-react';
import { siteConfig } from '@/data/site';

export function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <footer className="bg-charcoal text-parchment">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.6 }}
        className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-8"
      >
        <p className="text-stone/60 flex items-center gap-2 text-xs tracking-[0.25em] uppercase">
          <motion.span
            initial={{ width: 0 }}
            animate={isInView ? { width: 24 } : { width: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-stone/30 inline-block h-px"
          />
          End of Trail
          <motion.span
            initial={{ width: 0 }}
            animate={isInView ? { width: 24 } : { width: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-stone/30 inline-block h-px"
          />
        </p>

        <div className="flex items-center gap-4">
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-stone hover:text-gold transition-all duration-300 hover:scale-110"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-stone hover:text-gold transition-all duration-300 hover:scale-110"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        </div>

        <p className="text-stone text-sm">
          &copy; {new Date().getFullYear()} {siteConfig.name}
        </p>
      </motion.div>
    </footer>
  );
}
