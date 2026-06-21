'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { X, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocaleContext } from '@/components/providers/LocaleProvider';
import { useActiveSection } from '@/hooks/useActiveSection';
import { LanguageDropdown } from '@/components/ui/LanguageDropdown';
import { hasPublishedProjects } from '@/data/projects';

export const navLinkIds = [
  { key: 'trailGuide' as const, href: '#about', id: 'about' },
  { key: 'trailLog' as const, href: '#experience', id: 'experience' },
  { key: 'selectedWork' as const, href: '#projects', id: 'projects' },
  { key: 'recommendations' as const, href: '#endorsements', id: 'endorsements' },
  { key: 'gear' as const, href: '#skills', id: 'skills' },
  { key: 'lodge' as const, href: '#services', id: 'services' },
  { key: 'credentials' as const, href: '#education', id: 'education' },
  { key: 'contact' as const, href: '#contact', id: 'contact' },
] as const;

export function Navbar() {
  const { locale, messages } = useLocaleContext();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useActiveSection();
  const menuRef = useRef<HTMLUListElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  /* Lock scroll with a position:fixed pattern so iOS Safari preserves scroll position.
     Setting overflow:hidden on <html> causes iOS to scroll to top on open and jank on close. */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const shouldLock = mobileOpen && isMobile;

    if (shouldLock) {
      const savedScrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${savedScrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
    }

    const mq = window.matchMedia('(max-width: 767px)');
    const onResize = () => {
      if (!mq.matches) {
        setMobileOpen(false);
      }
    };

    mq.addEventListener('change', onResize);

    // Make page content inert while overlay is open (focus trap)
    const main = document.getElementById('main-content');
    const footer = document.querySelector('footer');
    if (mobileOpen) {
      main?.setAttribute('inert', '');
      footer?.setAttribute('inert', '');
    }

    return () => {
      main?.removeAttribute('inert');
      footer?.removeAttribute('inert');
      // Restore on cleanup (also fires when mobileOpen flips to false).
      // Do NOT touch document.documentElement — that was the iOS bug.
      if (document.body.style.position === 'fixed') {
        const restoreY = Math.abs(parseInt(document.body.style.top || '0', 10));
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        window.scrollTo(0, restoreY);
      }
      mq.removeEventListener('change', onResize);
    };
  }, [mobileOpen]);

  const mounted = typeof document !== 'undefined';

  const prevMobileOpen = useRef(false);
  // Focus first nav link when mobile menu opens; return focus to toggle when it closes
  useEffect(() => {
    if (mobileOpen && menuRef.current) {
      const first = menuRef.current.querySelector<HTMLAnchorElement>('a[href]');
      first?.focus();
    } else if (prevMobileOpen.current && !mobileOpen && toggleButtonRef.current) {
      toggleButtonRef.current.focus();
    }
    prevMobileOpen.current = mobileOpen;
  }, [mobileOpen]);

  const basePath = pathname?.startsWith('/')
    ? pathname.split('/').slice(0, 2).join('/')
    : `/${locale}`;
  // Drop the Selected Work entry when no projects are published. Projects.tsx
  // returns null in the same condition so the section + nav entry vanish in
  // lockstep — no broken anchor link, no 9-item nav row that wraps on small
  // laptops just to reach a section that isn't there.
  const navLinks = navLinkIds
    .filter((item) => hasPublishedProjects || item.id !== 'projects')
    .map((item) => ({
      label: messages.nav[item.key],
      href: item.href,
      id: item.id,
    }));

  return (
    <>
    <header className="bg-parchment/90 border-bark/10 sticky top-0 z-50 border-b pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6"
      >
        <a
          href={`${basePath}#hero`}
          className="group text-forest hover:text-forest/80 flex items-center gap-2 font-serif text-xl font-semibold transition-colors"
          aria-label={messages.nav.backToTop}
        >
          <Compass className="text-gold h-5 w-5 transition-transform duration-500 group-hover:rotate-45" />
          {messages.site.name}
        </a>

        {/* Desktop links + language dropdown */}
        <ul className="hidden flex-wrap items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <li key={link.href} className="shrink-0">
                <a
                  href={link.href}
                  data-nav-link
                  className={cn(
                    'relative text-sm whitespace-nowrap transition-colors after:absolute after:bottom-[-2px] after:left-0 after:h-px after:transition-all after:duration-300 hover:after:w-full',
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
          <li className="shrink-0">
            <LanguageDropdown id="language-select-desktop" />
          </li>
        </ul>

        {/* Mobile toggle – 44px min touch target */}
        <button
          ref={toggleButtonRef}
          type="button"
          className="text-bark flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-md md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? messages.nav.closeMenu : messages.nav.openMenu}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
        >
          <Compass
            className={cn(
              'h-6 w-6 transition-transform duration-500',
              mobileOpen ? 'rotate-[360deg] text-gold' : '',
            )}
          />
        </button>
      </nav>

    </header>

      {/* Mobile fullscreen overlay — portaled to <body> so backdrop-blur on <header> doesn't create a containing block that traps the fixed positioning */}
      {mounted && createPortal(
        <div
          id="mobile-nav"
          role={mobileOpen ? 'dialog' : undefined}
          aria-modal={mobileOpen ? 'true' : undefined}
          aria-label={mobileOpen ? messages.nav.openMenu : undefined}
          className={cn(
            'fixed inset-0 z-[60] flex flex-col items-center justify-center bg-forest transition-opacity duration-300 md:hidden',
            mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
          )}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M0 20h40M20 0v40' fill='none' stroke='%23f5f0e8' stroke-width='0.15' opacity='0.04'/%3E%3C/svg%3E")`,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileOpen(false);
          }}
        >
          {/* Close button — same position as toggle */}
          <button
            type="button"
            className="text-parchment hover:text-gold absolute top-[env(safe-area-inset-top)] right-0 flex min-h-11 min-w-11 touch-manipulation items-center justify-center p-6"
            onClick={() => setMobileOpen(false)}
            aria-label={messages.nav.closeMenu}
          >
            <X className="h-6 w-6" />
          </button>
          <ul ref={menuRef} className="flex flex-col items-center gap-6">
            {navLinks.map((link, i) => (
              <li
                key={link.href}
                style={{
                  transitionDelay: mobileOpen ? `${i * 50}ms` : '0ms',
                  opacity: mobileOpen ? 1 : 0,
                  transform: mobileOpen ? 'translateY(0)' : 'translateY(16px)',
                  transition: 'opacity 300ms ease, transform 300ms ease',
                }}
              >
                <a
                  href={link.href}
                  className="text-parchment hover:text-gold focus-visible:ring-gold flex min-h-11 touch-manipulation items-center rounded-md px-4 py-2 font-serif text-xl transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li
              className="border-parchment/10 mt-4 border-t pt-4"
              style={{
                transitionDelay: mobileOpen ? `${navLinks.length * 50}ms` : '0ms',
                opacity: mobileOpen ? 1 : 0,
                transform: mobileOpen ? 'translateY(0)' : 'translateY(16px)',
                transition: 'opacity 300ms ease, transform 300ms ease',
              }}
            >
              <LanguageDropdown compact id="language-select-mobile" />
            </li>
          </ul>
        </div>,
        document.body,
      )}
    </>
  );
}
