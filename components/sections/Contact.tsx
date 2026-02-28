'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Send, Github, Linkedin, Mail } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';
import { Button } from '@/components/ui/Button';
import { useLocaleContext } from '@/components/providers/LocaleProvider';
import { socialLinks } from '@/data/social';

const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  github: Github,
  linkedin: Linkedin,
};

const inputClasses =
  'w-full rounded-lg border border-bark/30 bg-charcoal px-4 py-3 text-parchment placeholder:text-stone/50 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gold transition-all';

/** Mailto link and display: use NEXT_PUBLIC_CONTACT_EMAIL or fallback so form recipient and link stay in sync when set. */
const contactEmail =
  typeof process.env.NEXT_PUBLIC_CONTACT_EMAIL === 'string' &&
  process.env.NEXT_PUBLIC_CONTACT_EMAIL.trim() !== ''
    ? process.env.NEXT_PUBLIC_CONTACT_EMAIL.trim()
    : 'hello@zachlamb.com';

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
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const timer = setTimeout(() => {
        setStatus('idle');
        setErrorMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

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

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <Section variant="dark" id="contact" nature={{ fireflies: true }}>
      <AnimatedHeading
        sectionId="contact"
        subtitle="VI."
        className="[&_h2]:text-parchment [&_p]:text-gold"
      >
        {messages.contact.heading}
      </AnimatedHeading>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-stone mt-4 text-lg"
      >
        {messages.contact.intro}
      </motion.p>

      <div ref={ref} className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="relative min-h-[320px]">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.5,
                type: 'spring',
                stiffness: 400,
                damping: 25,
              }}
              className="border-gold/20 bg-gold/5 flex flex-col items-center justify-center rounded-lg border py-12 text-center"
              aria-live="polite"
              aria-atomic="true"
              role="status"
            >
              <p className="sr-only">{messages.contact.messageSent}</p>
              <motion.div
                className="text-gold mb-4 flex justify-center"
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
              </motion.div>
              <motion.p
                className="text-parchment font-serif text-xl font-semibold"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.35,
                }}
              >
                {messages.contact.successTitle}
              </motion.p>
              <motion.p
                className="text-stone mt-1 text-sm"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: 0.55,
                }}
              >
                {messages.contact.successSub}
              </motion.p>
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: 0.75,
                }}
              >
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-6"
                  onClick={() => setStatus('idle')}
                >
                  {messages.contact.sendAnother}
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div>
                <label htmlFor="name" className="text-parchment mb-1 block text-sm font-medium">
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
                <label htmlFor="email" className="text-parchment mb-1 block text-sm font-medium">
                  {messages.contact.email}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={320}
                  placeholder={messages.contact.emailPlaceholder}
                  className={inputClasses}
                />
              </div>

              <div>
                <label htmlFor="message" className="text-parchment mb-1 block text-sm font-medium">
                  {messages.contact.message}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  maxLength={5000}
                  placeholder={messages.contact.messagePlaceholder}
                  className={inputClasses}
                />
              </div>

              <Button type="submit" className="w-full gap-2" disabled={status === 'sending'}>
                {status === 'sending' ? (
                  <span className="flex items-center justify-center gap-2">
                    {!prefersReducedMotion && (
                      <span className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="h-1.5 w-1.5 rounded-full bg-current opacity-60"
                            animate={{
                              opacity: [0.4, 1, 0.4],
                              scale: [0.9, 1.1, 0.9],
                            }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              delay: i * 0.15,
                            }}
                          />
                        ))}
                      </span>
                    )}
                    {messages.contact.sending}
                  </span>
                ) : (
                  <>
                    {messages.contact.send}
                    <Send className="h-4 w-4" />
                  </>
                )}
              </Button>

              <div aria-live="polite" aria-atomic="true">
                {status === 'error' && (
                  <p className="text-center text-sm text-red-400">
                    {errorMessage ?? messages.contact.fallbackError}
                  </p>
                )}
              </div>
            </motion.form>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-parchment mb-6 font-serif text-xl font-semibold">
            {messages.contact.orReachOut}
          </h3>

          <div className="space-y-1">
            {socialLinks.map((link) => {
              const Icon = iconMap[link.icon];
              if (!Icon) return null;
              return (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${link.platform} (opens in new tab)`}
                  className="text-parchment hover:text-gold focus-visible:ring-gold focus-visible:ring-offset-charcoal flex min-h-11 touch-manipulation items-center gap-3 rounded-md py-3 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <Icon className="text-gold h-5 w-5 shrink-0" />
                  <span className="font-medium">{link.platform}</span>
                </a>
              );
            })}

            <a
              href={`mailto:${contactEmail}`}
              aria-label={`Email ${contactEmail}`}
              className="text-parchment hover:text-gold focus-visible:ring-gold focus-visible:ring-offset-charcoal flex min-h-11 touch-manipulation items-center gap-3 rounded-md py-3 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <Mail className="text-gold h-5 w-5 shrink-0" />
              <span className="font-medium">{contactEmail}</span>
            </a>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
