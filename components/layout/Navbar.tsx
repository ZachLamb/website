'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/data/site';
import { useActiveSection } from '@/hooks/useActiveSection';

const navLinks = [
  { label: 'Trail Guide', href: '#about', id: 'about' },
  { label: 'Trail Log', href: '#experience', id: 'experience' },
  { label: 'Recommendations', href: '#endorsements', id: 'endorsements' },
  { label: 'Gear', href: '#skills', id: 'skills' },
  { label: 'Lodge', href: '#services', id: 'services' },
  { label: 'Credentials', href: '#education', id: 'education' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useActiveSection();

  /* Only lock scroll when mobile menu is open and viewport is actually mobile (fixes desktop scroll) */
  useEffect(() => {
    const isMobile =
      typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
    const shouldLock = mobileOpen && isMobile;

    if (shouldLock) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    const mq = window.matchMedia('(max-width: 767px)');
    const onResize = () => {
      if (!mq.matches) {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        setMobileOpen(false);
      }
    };

    mq.addEventListener('change', onResize);
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      mq.removeEventListener('change', onResize);
    };
  }, [mobileOpen]);

  return (
    <header className="bg-parchment/90 border-bark/10 sticky top-0 z-50 border-b pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6"
      >
        <a
          href="#hero"
          className="group text-forest hover:text-forest/80 flex items-center gap-2 font-serif text-xl font-semibold transition-colors"
          aria-label="Zach Lamb – back to top"
        >
          <Compass className="text-gold h-5 w-5 transition-transform duration-500 group-hover:rotate-45" />
          {siteConfig.name}
        </a>

        {/* Desktop links */}
        <ul className="hidden gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn(
                    'relative text-sm transition-colors after:absolute after:bottom-[-2px] after:left-0 after:h-px after:transition-all after:duration-300 hover:after:w-full',
                    isActive
                      ? 'text-gold after:bg-gold font-medium after:w-full'
                      : 'text-bark after:bg-gold hover:text-gold after:w-0 hover:after:w-full',
                  )}
                  aria-current={isActive ? 'location' : undefined}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Mobile toggle – 44px min touch target */}
        <button
          type="button"
          className="text-bark flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-md md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      <div
        className={cn(
          'border-bark/10 overflow-hidden border-b md:hidden',
          mobileOpen ? 'block' : 'hidden',
        )}
      >
        <ul className="mx-auto flex max-w-5xl flex-col px-6 pb-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-bark hover:bg-sand/50 hover:text-gold flex min-h-11 touch-manipulation items-center rounded-md px-3 py-3 text-sm transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
