'use client';

import { useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import { Github, Linkedin } from 'lucide-react';
import { siteConfig } from '@/data/site';
import { useLocaleContext } from '@/components/providers/LocaleProvider';

function FooterMountains() {
  return (
    <div aria-hidden="true" className="absolute inset-x-0 top-0 -translate-y-[99%]">
      <svg
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        className="block w-full"
        style={{ height: '40px' }}
      >
        <path
          d="M0 60 L0 40 L60 25 L120 38 L200 15 L280 32 L360 10 L440 28 L520 18 L600 35 L680 12 L760 30 L840 20 L920 38 L1000 15 L1080 32 L1160 22 L1200 35 L1200 60Z"
          fill="var(--color-charcoal)"
        />
      </svg>
    </div>
  );
}

export function Footer() {
  const { locale, messages } = useLocaleContext();
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const basePath = pathname?.startsWith('/')
    ? pathname.split('/').slice(0, 2).join('/')
    : `/${locale}`;

  return (
    <footer className="bg-charcoal text-parchment relative">
      <FooterMountains />
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.6 }}
        className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-8 pb-[max(2rem,env(safe-area-inset-bottom))]"
      >
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <a
            href={`${basePath}#hero`}
            aria-label={messages.footer.backToTop}
            className="text-stone/60 hover:text-gold focus-visible:ring-gold focus-visible:ring-offset-charcoal rounded text-xs font-medium tracking-wider uppercase transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {messages.footer.backToTop}
          </a>
          {siteConfig.links.resume && (
            <a
              href={siteConfig.links.resume}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={messages.footer.viewResume}
              className="text-stone/60 hover:text-gold focus-visible:ring-gold focus-visible:ring-offset-charcoal rounded text-xs font-medium tracking-wider uppercase transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {messages.footer.resume}
            </a>
          )}
        </div>

        <p className="text-stone/60 flex flex-wrap items-center justify-center gap-3 text-xs tracking-[0.25em] uppercase">
          <motion.span
            initial={{ width: 0 }}
            animate={isInView ? { width: 32 } : { width: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-stone/30 inline-block h-px shrink-0"
          />
          <motion.svg
            viewBox="0 0 16 16"
            className="text-gold/40 h-3 w-3 shrink-0"
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <path
              d="M8 1 C10 3 12 6 11 10 C10 13 8 15 8 15 C8 15 6 13 5 10 C4 6 6 3 8 1Z"
              fill="currentColor"
            />
          </motion.svg>
          <span className="text-center">{messages.footer.endOfTrail}</span>
          <motion.svg
            viewBox="0 0 16 16"
            className="text-gold/40 h-3 w-3 shrink-0"
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <path
              d="M8 1 C10 3 12 6 11 10 C10 13 8 15 8 15 C8 15 6 13 5 10 C4 6 6 3 8 1Z"
              fill="currentColor"
            />
          </motion.svg>
          <motion.span
            initial={{ width: 0 }}
            animate={isInView ? { width: 32 } : { width: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-stone/30 inline-block h-px shrink-0"
          />
        </p>

        <div className="flex items-center gap-2">
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub (opens in new tab)"
            className="text-stone hover:text-gold focus-visible:ring-gold focus-visible:ring-offset-charcoal flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-full transition-all duration-300 hover:scale-110 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn (opens in new tab)"
            className="text-stone hover:text-gold focus-visible:ring-gold focus-visible:ring-offset-charcoal flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-full transition-all duration-300 hover:scale-110 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        </div>

        <p className="text-stone text-sm">
          &copy; {new Date().getFullYear()} {messages.site.name}
        </p>
      </motion.div>
    </footer>
  );
}
