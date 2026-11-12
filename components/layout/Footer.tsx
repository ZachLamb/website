'use client';

import { usePathname } from 'next/navigation';
import { siteConfig } from '@/data/site';
import { socialLinks } from '@/data/social';
import { socialIconMap } from '@/lib/icons';
import { useLocaleContext } from '@/components/providers/LocaleProvider';

const linkClasses =
  'text-stone hover:text-blaze-bright focus-visible:ring-blaze-bright flex min-h-11 items-center rounded-sm font-mono text-xs tracking-[0.16em] uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none';

export function Footer() {
  const { locale, messages } = useLocaleContext();
  const pathname = usePathname();
  const basePath = pathname?.startsWith('/')
    ? pathname.split('/').slice(0, 2).join('/')
    : `/${locale}`;

  return (
    // The map's margin: the night sheet continues from the contact section,
    // ruled off with a single line.
    <footer className="bg-night topo-night text-paper border-paper/15 border-t">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 pt-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-paper flex items-center gap-3 font-mono text-xs tracking-[0.2em] uppercase">
            <span aria-hidden="true" className="bg-blaze-bright h-2 w-2 shrink-0 rotate-45" />
            {messages.footer.endOfTrail}
          </p>
          <p className="text-stone mt-2 text-sm">
            &copy; {new Date().getFullYear()} {messages.site.name}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <a href={`${basePath}#hero`} className={linkClasses}>
            {messages.footer.backToTop}
          </a>
          {siteConfig.links.resume && (
            <a
              href={siteConfig.links.resume}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={messages.footer.viewResume}
              className={linkClasses}
            >
              {messages.footer.resume}
            </a>
          )}
          <a href={`${basePath}/privacy`} className={linkClasses}>
            {messages.footer.privacy}
          </a>
          <span className="-ml-3 flex items-center md:ml-0">
            {socialLinks.map((link) => {
              const Icon = socialIconMap[link.icon];
              if (!Icon) return null;
              return (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${link.platform} (opens in new tab)`}
                  className="text-stone hover:text-blaze-bright focus-visible:ring-blaze-bright flex h-11 w-11 touch-manipulation items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </span>
        </div>
      </div>
    </footer>
  );
}
