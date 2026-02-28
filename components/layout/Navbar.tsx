'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocaleContext } from '@/components/providers/LocaleProvider';
import { useActiveSection } from '@/hooks/useActiveSection';
import { LanguageDropdown } from '@/components/ui/LanguageDropdown';

const navLinkIds = [
  { key: 'trailGuide' as const, href: '#about', id: 'about' },
  { key: 'trailLog' as const, href: '#experience', id: 'experience' },
  { key: 'recommendations' as const, href: '#endorsements', id: 'endorsements' },
  { key: 'gear' as const, href: '#skills', id: 'skills' },
  { key: 'lodge' as const, href: '#services', id: 'services' },
  { key: 'credentials' as const, href: '#education', id: 'education' },
  { key: 'contact' as const, href: '#contact', id: 'contact' },
];

export function Navbar() {
  const { locale, messages } = useLocaleContext();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useActiveSection();
  const menuRef = useRef<HTMLUListElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

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
  const navLinks = navLinkIds.map((item) => ({
    label: messages.nav[item.key],
    href: item.href,
    id: item.id,
  }));

  return (
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
        <ul ref={menuRef} className="mx-auto flex max-w-5xl flex-col px-6 pb-4">
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
          <li className="px-3 py-2">
            <LanguageDropdown compact id="language-select-mobile" />
          </li>
        </ul>
      </div>
    </header>
  );
}
