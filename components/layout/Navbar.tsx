'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { m, useScroll } from 'framer-motion';
import { Compass, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocaleContext } from '@/components/providers/LocaleProvider';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { LanguageDropdown } from '@/components/ui/LanguageDropdown';
import { formatWaypoint, navLinkIds, waypoints } from '@/lib/waypoints';

// Re-exported: lib/nav-section-contract.test.ts and other callers read the
// nav list from here.
export { navLinkIds };

/**
 * How far down the trail the reader is, as a route line along the bottom of
 * the header. framer writes the transform straight to the element, so
 * scrolling never re-renders React or restyles the document.
 */
function TrailProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <m.div
      aria-hidden="true"
      data-trail-progress
      className="bg-blaze absolute inset-x-0 -bottom-px h-0.5 origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

export function Navbar() {
  const { locale, messages } = useLocaleContext();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const activeSection = useActiveSection();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  /** Section to scroll to once the menu has closed and the page can scroll. */
  const pendingTarget = useRef<string | null>(null);
  /** Set when a link closed the menu: focus belongs to its section then. */
  const focusGoesToSection = useRef(false);

  const scrollToPending = useCallback(() => {
    const id = pendingTarget.current;
    pendingTarget.current = null;
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    // Next frame: the body has only just been unpinned in this one.
    requestAnimationFrame(() => {
      target.scrollIntoView();
      target.focus({ preventScroll: true });
    });
  }, []);

  useBodyScrollLock(mobileOpen, scrollToPending);

  // While the menu is open: Escape closes it, the page behind is inert, and
  // growing the window past the mobile breakpoint closes it.
  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onBreakpoint = () => {
      if (desktop.matches) setMobileOpen(false);
    };
    const main = document.getElementById('main-content');
    const footer = document.querySelector('footer');

    document.addEventListener('keydown', onKeyDown);
    desktop.addEventListener('change', onBreakpoint);
    main?.setAttribute('inert', '');
    footer?.setAttribute('inert', '');

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      desktop.removeEventListener('change', onBreakpoint);
      main?.removeAttribute('inert');
      footer?.removeAttribute('inert');
    };
  }, [mobileOpen]);

  // Hydration-safe portal gate: server and first client render agree (no
  // portal); the portal mounts in an effect after hydration completes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const wasOpen = useRef(false);
  // Move focus into the menu when it opens; hand it back to the toggle when
  // it closes, unless a link was chosen (focus then goes to that section).
  useEffect(() => {
    if (mobileOpen) {
      menuRef.current
        ?.querySelector<HTMLElement>('button, a[href]')
        ?.focus({ preventScroll: true });
    } else if (wasOpen.current && !focusGoesToSection.current) {
      // preventScroll: the header is always on screen, and letting focus
      // scroll here fights the scroll position the lock has just restored.
      toggleButtonRef.current?.focus({ preventScroll: true });
    }
    focusGoesToSection.current = false;
    wasOpen.current = mobileOpen;
  }, [mobileOpen]);

  const basePath = pathname?.startsWith('/')
    ? pathname.split('/').slice(0, 2).join('/')
    : `/${locale}`;
  // Sections only exist on the home page. From anywhere else (the privacy
  // page) a bare "#about" would go nowhere, so links carry the home path.
  const onHome = pathname === basePath || pathname === '/';
  const navLinks = waypoints.map((item, i) => ({
    label: messages.nav[item.key],
    href: onHome ? item.href : `${basePath}${item.href}`,
    id: item.id,
    number: formatWaypoint(i + 1),
  }));

  function onMobileLinkClick(e: React.MouseEvent<HTMLAnchorElement>, id: string, href: string) {
    if (!onHome) return; // a real navigation: let the browser do it
    // The page is pinned while the menu is open, so the browser's own jump
    // to the anchor would be measured against a frozen page. Close first,
    // then scroll once the lock is released.
    e.preventDefault();
    pendingTarget.current = id;
    focusGoesToSection.current = true;
    window.history.pushState(null, '', href);
    setMobileOpen(false);
  }

  return (
    <>
      <header
        data-print-hidden
        className="bg-paper/90 border-contour/40 sticky top-0 z-50 border-b pt-[env(safe-area-inset-top)] backdrop-blur-md"
      >
        <nav
          aria-label="Main navigation"
          className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 pr-2 pl-5 sm:px-6"
        >
          <a
            href={`${basePath}#hero`}
            className="group text-ink focus-visible:ring-blaze flex min-h-11 items-center gap-2 rounded-sm font-serif text-xl font-semibold whitespace-nowrap focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-label={messages.nav.backToTop}
          >
            <Compass
              aria-hidden="true"
              className="text-blaze h-5 w-5 transition-transform duration-500 group-hover:rotate-45"
            />
            {messages.site.name}
          </a>

          {/* Desktop links + language dropdown */}
          <ul className="hidden items-center gap-5 lg:flex xl:gap-6">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <li key={link.id} className="shrink-0">
                  <a
                    href={link.href}
                    data-nav-link
                    className={cn(
                      'focus-visible:ring-blaze relative rounded-sm py-2 text-sm whitespace-nowrap transition-colors after:absolute after:bottom-0.5 after:left-0 after:h-0.5 after:transition-all after:duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                      isActive
                        ? 'text-ink after:bg-blaze font-medium after:w-full'
                        : 'text-ink-soft after:bg-blaze hover:text-ink after:w-0 hover:after:w-full',
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

          {/* Mobile toggle: 48px touch target */}
          <button
            ref={toggleButtonRef}
            type="button"
            className="text-ink focus-visible:ring-blaze flex h-12 w-12 touch-manipulation items-center justify-center rounded-md focus-visible:ring-2 focus-visible:outline-none lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label={messages.nav.openMenu}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            <Menu aria-hidden="true" className="h-6 w-6" />
          </button>
        </nav>
        <TrailProgress />
      </header>

      {/* Mobile menu, portaled to <body>: backdrop-blur on the header makes
          it the containing block for fixed descendants, which would trap
          the overlay inside the 64px bar. */}
      {mounted &&
        createPortal(
          <div
            id="mobile-nav"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label={messages.nav.openMenu}
            // inert while closed: the links are invisible then, and must not
            // stay reachable by Tab or by a screen reader.
            inert={!mobileOpen}
            className={cn(
              'bg-paper topo-paper fixed inset-0 z-[60] flex flex-col overflow-y-auto overscroll-contain transition-opacity duration-200 lg:hidden',
              mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
          >
            {/* Same height and padding as the header, so the close button
                lands exactly where the menu button was. */}
            <div className="border-contour/40 box-content flex h-16 shrink-0 items-center justify-between border-b pt-[env(safe-area-inset-top)] pr-2 pl-5 sm:px-6">
              <span className="text-ink flex items-center gap-2 font-serif text-xl font-semibold">
                <Compass aria-hidden="true" className="text-blaze h-5 w-5" />
                {messages.site.name}
              </span>
              <button
                type="button"
                className="text-ink focus-visible:ring-blaze flex h-12 w-12 touch-manipulation items-center justify-center rounded-md focus-visible:ring-2 focus-visible:outline-none"
                onClick={() => setMobileOpen(false)}
                aria-label={messages.nav.closeMenu}
              >
                <X aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>

            <ul className="px-5 pt-2 sm:px-6">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <li key={link.id} className="border-contour/30 border-b">
                    <a
                      href={link.href}
                      aria-current={isActive ? 'location' : undefined}
                      onClick={(e) => onMobileLinkClick(e, link.id, link.href)}
                      className="text-ink focus-visible:ring-blaze flex min-h-14 touch-manipulation items-center gap-4 rounded-sm py-2 focus-visible:ring-2 focus-visible:outline-none"
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-medium',
                          isActive ? 'bg-blaze text-paper' : 'border-blaze text-blaze border',
                        )}
                      >
                        {link.number}
                      </span>
                      <span className="font-serif text-2xl font-semibold">{link.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="mt-auto px-5 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6">
              <LanguageDropdown compact id="language-select-mobile" />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
