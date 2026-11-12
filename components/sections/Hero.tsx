'use client';

import { Button } from '@/components/ui/Button';
import { PosterScene } from '@/components/ui/PosterScene';
import { TaglineCycler } from '@/components/ui/TaglineCycler';
import { socialLinks } from '@/data/social';
import { siteConfig } from '@/data/site';
import { useLocaleContext } from '@/components/providers/LocaleProvider';
import { socialIconMap } from '@/lib/icons';

/** Stagger for the entrance. It is a CSS animation (`animate-rise`), so it
    runs from the server HTML: the name and pitch never wait on hydration
    to become visible. */
const rise = (i: number) => ({ style: { animationDelay: `${0.05 + i * 0.08}s` } });

/**
 * The hero is a park poster: a framed sunset over Longs Peak, the name set
 * in tall poster capitals across the sky, and a caption band along the
 * bottom edge.
 */
export function Hero() {
  const { locale, messages } = useLocaleContext();
  const basePath = `/${locale}`;

  return (
    <section id="hero" className="bg-paper text-cream relative p-2.5 sm:p-4">
      {/* The printed area, inside the poster's cream margin. The sky is a
          stack of flat bands (hard gradient stops), not a blend. */}
      <div
        className="relative isolate flex flex-col overflow-hidden rounded-sm lg:h-[calc(100dvh-4rem-2rem)] lg:min-h-[40rem]"
        style={{
          background:
            'linear-gradient(to bottom, var(--color-pine) 0 40%, var(--color-teal) 40% 56%, #3b7d78 56% 66%, var(--color-mustard) 66% 100%)',
        }}
      >
        <div className="relative z-10 mx-auto w-full max-w-5xl px-5 pt-9 sm:px-6 sm:pt-12 lg:pt-14">
          <div {...rise(0)} className="animate-rise flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-mustard font-display text-lg font-extrabold tracking-[0.16em] break-words uppercase sm:text-xl">
              {messages.hero.subtitle}
            </p>
            {siteConfig.availability && (
              <span className="border-cream/50 text-cream inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
                <span aria-hidden="true" className="bg-mustard h-1.5 w-1.5 rounded-full" />
                {siteConfig.availability}
              </span>
            )}
          </div>

          <h1
            {...rise(1)}
            className="animate-rise text-cream font-display mt-2 text-[clamp(4.5rem,21vw,13rem)] leading-[0.82] font-black tracking-tight break-words uppercase"
          >
            {messages.hero.title}
          </h1>

          {/* The one-sentence pitch stays put; only the supporting line in
              the caption band rotates, so the core message is always there. */}
          <p
            {...rise(2)}
            className="animate-rise text-cream mt-5 max-w-xl text-lg leading-snug font-medium text-balance break-words sm:text-2xl"
          >
            {messages.hero.lede}
          </p>

          <div
            {...rise(3)}
            className="animate-rise mt-6 flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            <Button onNight href={`${basePath}#contact`} className="w-full sm:w-auto">
              {messages.hero.getInTouch}
            </Button>
            <Button
              onNight
              variant="secondary"
              href={`${basePath}#experience`}
              className="bg-pine/60 w-full sm:w-auto"
            >
              {messages.hero.learnMore}
            </Button>
          </div>
        </div>

        {/* The landscape. It takes whatever height is left, with a floor so
            it is never squeezed out on a short screen. */}
        <PosterScene className="-mt-4 block h-[62vw] min-h-56 w-full overflow-visible sm:-mt-12 sm:h-[46vw] lg:-mt-28 lg:h-auto lg:min-h-0 lg:flex-1" />

        {/* Caption band, as along the foot of a poster */}
        <div className="bg-pine text-cream relative z-10">
          <div className="mx-auto flex max-w-5xl flex-col gap-x-8 gap-y-2 px-5 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
            <TaglineCycler
              taglines={messages.hero.taglines}
              // Default 6s; explicit here so the value is co-located with the
              // taglines content and easy to tune per-site if needed.
              intervalMs={6000}
              className="text-cream/90 focus-visible:ring-mustard focus-visible:ring-offset-pine max-w-2xl text-sm break-words sm:text-base"
            />
            <div className="-ml-3 flex shrink-0 items-center md:ml-0">
              {siteConfig.links.resume && (
                <a
                  href={siteConfig.links.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-mustard hover:text-cream focus-visible:ring-mustard font-display flex min-h-11 items-center rounded-sm px-3 text-lg font-extrabold tracking-[0.14em] uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  aria-label={messages.hero.viewResume}
                >
                  {messages.hero.resume}
                </a>
              )}
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
                    className="text-cream hover:text-mustard focus-visible:ring-mustard flex h-12 w-12 touch-manipulation items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <Icon className="h-6 w-6" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
