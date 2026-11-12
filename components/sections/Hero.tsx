'use client';

import { Button } from '@/components/ui/Button';
import { TaglineCycler } from '@/components/ui/TaglineCycler';
import { TrailMap } from '@/components/ui/TrailMap';
import { socialLinks } from '@/data/social';
import { siteConfig } from '@/data/site';
import { useLocaleContext } from '@/components/providers/LocaleProvider';
import { socialIconMap } from '@/lib/icons';
import { waypoints } from '@/lib/waypoints';

/** Stagger for the entrance. It is a CSS animation (`animate-rise`), so it
    runs from the server HTML: the name and pitch never wait on hydration
    to become visible. */
const rise = (i: number) => ({ style: { animationDelay: `${0.05 + i * 0.08}s` } });

export function Hero() {
  const { locale, messages } = useLocaleContext();
  const basePath = `/${locale}`;

  const stops = waypoints.map((item) => ({
    id: item.id,
    href: item.href,
    label: messages.nav[item.key],
  }));

  return (
    <section id="hero" className="bg-paper topo-paper text-ink relative">
      {/* Fills the first screen from lg up (minus the 4rem header); on
          smaller screens the copy sets the height and the map follows. */}
      <div className="mx-auto grid max-w-5xl min-w-0 grid-cols-1 items-center gap-10 px-5 pt-10 pb-14 sm:px-6 sm:pt-14 sm:pb-16 lg:min-h-[calc(100dvh-4rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.04fr)] lg:gap-12 lg:py-16">
        <div className="min-w-0">
          <div {...rise(0)} className="animate-rise">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <p className="text-blaze font-mono text-xs font-medium tracking-[0.18em] break-words uppercase sm:text-sm">
                {messages.hero.subtitle}
              </p>
              {siteConfig.availability && (
                <span className="border-ink/25 text-ink bg-paper-raised inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
                  <span aria-hidden="true" className="bg-blaze h-1.5 w-1.5 rounded-full" />
                  {siteConfig.availability}
                </span>
              )}
            </div>
          </div>

          <h1
            {...rise(1)}
            className="animate-rise text-ink mt-5 font-serif text-6xl leading-[0.95] font-bold tracking-tight break-words sm:text-7xl lg:text-8xl"
          >
            {messages.hero.title}
          </h1>

          {/* The one-sentence pitch stays put; only the supporting line below
              it rotates, so the core message is readable at any moment. */}
          <p
            {...rise(2)}
            className="animate-rise text-ink mt-6 max-w-xl text-xl leading-snug font-medium text-balance break-words sm:text-2xl"
          >
            {messages.hero.lede}
          </p>

          <div {...rise(3)} className="animate-rise">
            <TaglineCycler
              taglines={messages.hero.taglines}
              // Default 6s; explicit here so the value is co-located with the
              // taglines content and easy to tune per-site if needed.
              intervalMs={6000}
              className="text-ink-soft border-blaze/60 mt-5 max-w-xl border-l-2 pl-4 text-base break-words md:text-lg"
            />
          </div>

          <div
            {...rise(4)}
            className="animate-rise mt-8 flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            <Button href={`${basePath}#contact`} className="w-full sm:w-auto">
              {messages.hero.getInTouch}
            </Button>
            <Button
              variant="secondary"
              href={`${basePath}#experience`}
              className="w-full sm:w-auto"
            >
              {messages.hero.learnMore}
            </Button>
          </div>

          <div
            {...rise(5)}
            className="animate-rise mt-5 flex flex-wrap items-center gap-x-4 gap-y-1"
          >
            {siteConfig.links.resume && (
              <a
                href={siteConfig.links.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink hover:text-blaze focus-visible:ring-blaze decoration-blaze/50 hover:decoration-blaze flex min-h-11 items-center rounded-sm text-sm font-medium underline underline-offset-4 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                aria-label={messages.hero.viewResume}
              >
                {messages.hero.resume}
              </a>
            )}
            <span className="flex items-center">
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
                    className="text-ink-soft hover:text-blaze focus-visible:ring-blaze flex h-12 w-12 touch-manipulation items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <Icon className="h-6 w-6" />
                  </a>
                );
              })}
            </span>
          </div>
        </div>

        <div {...rise(3)} className="animate-rise min-w-0">
          <TrailMap
            stops={stops}
            title={messages.hero.mapTitle}
            legendLabel={messages.hero.mapLegend}
          />
        </div>
      </div>
    </section>
  );
}
