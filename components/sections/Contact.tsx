'use client';

import { useState, type FormEvent } from 'react';
import { m } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/useHydrated';
import { Send, Mail } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { useLocaleContext } from '@/components/providers/LocaleProvider';
import { socialLinks } from '@/data/social';
import { socialIconMap } from '@/lib/icons';
import { waypointNumber } from '@/lib/waypoints';

// text-base (16px) is load-bearing: iOS Safari zooms the page when a field
// with smaller text takes focus.
const inputClasses =
  'w-full rounded-md border border-paper/25 bg-night px-4 py-3 text-base text-paper placeholder:text-stone/60 transition-colors focus:border-blaze-bright focus:outline-none focus:ring-2 focus:ring-blaze-bright/60';

const labelClasses = 'text-stone mb-2 block font-mono text-xs tracking-[0.18em] uppercase';

const directLinkClasses =
  'text-paper hover:text-blaze-bright focus-visible:ring-blaze-bright flex min-h-12 touch-manipulation items-center gap-3 rounded-sm py-2 transition-colors focus-visible:ring-2 focus-visible:outline-none';

/** Mailto link and display: use NEXT_PUBLIC_CONTACT_EMAIL or fallback so form recipient and link stay in sync when set. */
const contactEmail =
  typeof process.env.NEXT_PUBLIC_CONTACT_EMAIL === 'string' &&
  process.env.NEXT_PUBLIC_CONTACT_EMAIL.trim() !== ''
    ? process.env.NEXT_PUBLIC_CONTACT_EMAIL.trim()
    : 'you@zachlamb.io';

/** Paper airplane SVG for success animation */
function PaperAirplaneIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
    </svg>
  );
}

export function Contact() {
  const { messages } = useLocaleContext();
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          message: formData.get('message'),
        }),
      });

      if (res.ok) {
        form.reset();
        setStatus('success');
      } else {
        let message: string | null = null;
        try {
          const data = await res.json();
          if (typeof (data as { error?: unknown })?.error === 'string') {
            message = (data as { error: string }).error;
          }
        } catch {
          // ignore invalid JSON
        }
        setErrorMessage(message);
        setStatus('error');
      }
    } catch {
      setErrorMessage(null);
      setStatus('error');
    }
  }

  return (
    <Section id="contact" surface="night" after="paper">
      <SectionHeading
        sectionId="contact"
        number={waypointNumber('contact')}
        kicker={messages.kickers.contact}
        onNight
      >
        {messages.contact.heading}
      </SectionHeading>

      <p className="text-stone mt-4 max-w-2xl text-lg">{messages.contact.intro}</p>

      <div className="mt-8 grid grid-cols-1 gap-10 md:mt-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-12">
        <Reveal>
          <Card onNight className="p-5 sm:p-6">
            {status === 'success' ? (
              <div
                className="flex min-h-80 flex-col items-center justify-center py-6 text-center"
                aria-live="polite"
                aria-atomic="true"
                role="status"
              >
                <p className="sr-only">{messages.contact.messageSent}</p>
                <m.div
                  className="text-blaze-bright mb-4 flex justify-center"
                  initial={prefersReducedMotion ? false : { y: 0, opacity: 1, rotate: 0, x: 0 }}
                  animate={
                    prefersReducedMotion
                      ? {}
                      : {
                          y: [0, -16, -96],
                          x: [0, 0, 20],
                          opacity: [1, 1, 0],
                          rotate: [0, 5, 18],
                          scale: [1, 1.15, 0.9],
                        }
                  }
                  transition={{
                    duration: 1.4,
                    times: [0, 0.2, 1],
                    ease: ['easeOut', 'easeOut', 'easeIn'],
                  }}
                >
                  <PaperAirplaneIcon className="h-12 w-12" />
                </m.div>
                <p className="text-paper font-serif text-2xl font-semibold">
                  {messages.contact.successTitle}
                </p>
                <p className="text-stone mt-1 text-base">{messages.contact.successSub}</p>
                <Button
                  type="button"
                  variant="secondary"
                  onNight
                  className="mt-6"
                  onClick={() => setStatus('idle')}
                >
                  {messages.contact.sendAnother}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className={labelClasses}>
                    {messages.contact.name}
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={200}
                    placeholder={messages.contact.namePlaceholder}
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label htmlFor="email" className={labelClasses}>
                    {messages.contact.email}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    required
                    maxLength={320}
                    placeholder={messages.contact.emailPlaceholder}
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label htmlFor="message" className={labelClasses}>
                    {messages.contact.message}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    maxLength={5000}
                    placeholder={messages.contact.messagePlaceholder}
                    className={`${inputClasses} resize-y`}
                  />
                </div>

                <Button type="submit" onNight className="w-full" disabled={status === 'sending'}>
                  {status === 'sending' ? (
                    messages.contact.sending
                  ) : (
                    <>
                      {messages.contact.send}
                      <Send aria-hidden="true" className="h-4 w-4" />
                    </>
                  )}
                </Button>

                <div aria-live="polite" aria-atomic="true">
                  {/* Sending announcement — sr-only because the visible "Sending…"
                      label sits in the disabled submit button, but screen readers
                      don't re-announce a button's text change after it's already
                      been read. Routing the state through this live region makes
                      submit feedback audible to AT users. */}
                  {status === 'sending' && <p className="sr-only">{messages.contact.sending}</p>}
                  {/* Stays until the next attempt: an error that clears itself
                      on a timer can vanish before it has been read. */}
                  {status === 'error' && (
                    <p className="text-center text-sm text-red-300">
                      {errorMessage ?? messages.contact.fallbackError}
                    </p>
                  )}
                </div>
              </form>
            )}
          </Card>
        </Reveal>

        <Reveal delay={0.08}>
          <h3 className="text-blaze-bright flex items-center gap-3 font-mono text-xs font-medium tracking-[0.18em] uppercase">
            {messages.contact.orReachOut}
            <span aria-hidden="true" className="bg-paper/20 h-px flex-1" />
          </h3>

          <ul className="divide-paper/10 mt-3 divide-y">
            {socialLinks.map((link) => {
              const Icon = socialIconMap[link.icon];
              if (!Icon) return null;
              return (
                <li key={link.platform}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${link.platform} (opens in new tab)`}
                    className={directLinkClasses}
                  >
                    <Icon className="text-blaze-bright h-5 w-5 shrink-0" />
                    <span className="font-medium">{link.platform}</span>
                  </a>
                </li>
              );
            })}
            <li>
              <a
                href={`mailto:${contactEmail}`}
                aria-label={`Email ${contactEmail}`}
                className={directLinkClasses}
              >
                <Mail aria-hidden="true" className="text-blaze-bright h-5 w-5 shrink-0" />
                <span className="min-w-0 font-medium break-all">{contactEmail}</span>
              </a>
            </li>
          </ul>

          {/* Summit cairn: the trail's last marker */}
          <div data-cairn aria-hidden="true" className="mt-10 hidden items-end gap-4 md:flex">
            <svg viewBox="0 0 60 64" className="text-paper/30 h-16 w-16 shrink-0">
              <ellipse cx="30" cy="58" rx="22" ry="6" fill="currentColor" opacity="0.5" />
              <ellipse cx="30" cy="48" rx="17" ry="7" fill="currentColor" opacity="0.7" />
              <ellipse cx="30" cy="37" rx="13" ry="6" fill="currentColor" opacity="0.85" />
              <ellipse cx="30" cy="27" rx="9" ry="5" fill="currentColor" />
              <ellipse cx="30" cy="19" rx="5" ry="3.5" fill="currentColor" />
            </svg>
            <p className="text-stone pb-1 font-mono text-[11px] leading-relaxed tracking-[0.18em] uppercase">
              {messages.footer.endOfTrail}
              <br />
              40°15′N 105°37′W
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
