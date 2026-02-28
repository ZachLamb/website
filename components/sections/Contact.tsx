'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Send, Github, Linkedin, Mail } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';
import { Button } from '@/components/ui/Button';
import { socialLinks } from '@/data/social';

const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  github: Github,
  linkedin: Linkedin,
};

const inputClasses =
  'w-full rounded-lg border border-bark/30 bg-charcoal px-4 py-3 text-parchment placeholder:text-stone/50 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gold transition-all';

const contactEmail = 'hello@zachlamb.com';

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
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const timer = setTimeout(() => setStatus('idle'), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');

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
        setStatus('error');
      }
    } catch {
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
        Leave a Note at Camp
      </AnimatedHeading>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-stone mt-4 text-lg"
      >
        Whether it&rsquo;s about code, the trail ahead, or Oreos — drop a note and I&rsquo;ll get
        back to you from base camp. I typically reply within a day.
      </motion.p>

      <div ref={ref} className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="relative min-h-[320px]">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
              className="border-gold/20 bg-gold/5 flex flex-col items-center justify-center rounded-lg border py-12 text-center"
              aria-live="polite"
              aria-atomic="true"
              role="status"
            >
              <p className="sr-only">Message sent!</p>
              <motion.div
                className="text-gold mb-4 flex justify-center"
                initial={prefersReducedMotion ? false : { y: 0, opacity: 1 }}
                animate={
                  prefersReducedMotion ? {} : { y: [-24, -80], opacity: [1, 0], rotate: [0, 12] }
                }
                transition={{ duration: 1.2, ease: 'easeOut' }}
              >
                <PaperAirplaneIcon className="h-12 w-12" />
              </motion.div>
              <p className="text-parchment font-serif text-xl font-semibold">
                Note left at base camp
              </p>
              <p className="text-stone mt-1 text-sm">Your message is on its way.</p>
              <Button
                type="button"
                variant="secondary"
                className="mt-6"
                onClick={() => setStatus('idle')}
              >
                Send another
              </Button>
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
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={200}
                  placeholder="Fellow Hiker"
                  className={inputClasses}
                />
              </div>

              <div>
                <label htmlFor="email" className="text-parchment mb-1 block text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={320}
                  placeholder="hiker@trailmail.com"
                  className={inputClasses}
                />
              </div>

              <div>
                <label htmlFor="message" className="text-parchment mb-1 block text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  maxLength={5000}
                  placeholder="What's on your mind?"
                  className={inputClasses}
                />
              </div>

              <Button type="submit" className="w-full gap-2" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send Message'}
                <Send className="h-4 w-4" />
              </Button>

              <div aria-live="polite" aria-atomic="true">
                {status === 'error' && (
                  <p className="text-center text-sm text-red-400">
                    Something went wrong. Please try again.
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
            Or reach out directly
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
