'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { motion, useInView } from 'framer-motion';
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

export function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

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
    <Section variant="dark" id="contact">
      <AnimatedHeading
        subtitle="VI."
        className="[&_h2]:text-parchment [&_p]:text-gold"
      >
        Leave a Note at Camp
      </AnimatedHeading>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-4 text-lg text-stone"
      >
        Whether it&rsquo;s about code, the trail ahead, or Oreos — drop a
        note and I&rsquo;ll get back to you from base camp.
      </motion.p>

      <div ref={ref} className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-parchment">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              maxLength={200}
              placeholder="Fellow Hiker"
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-parchment">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              maxLength={320}
              placeholder="hiker@trailmail.com"
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="message" className="mb-1 block text-sm font-medium text-parchment">
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
            {status === 'success' && (
              <p className="text-center text-sm text-gold">Message sent!</p>
            )}
            {status === 'error' && (
              <p className="text-center text-sm text-red-400">
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="mb-6 font-serif text-xl font-semibold text-parchment">
            Or reach out directly
          </h3>

          <div className="space-y-4">
            {socialLinks.map((link) => {
              const Icon = iconMap[link.icon];
              if (!Icon) return null;
              return (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-parchment transition-colors hover:text-gold"
                >
                  <Icon className="h-5 w-5 text-gold" />
                  <span className="font-medium">{link.platform}</span>
                </a>
              );
            })}

            <a
              href={`mailto:${contactEmail}`}
              className="flex items-center gap-3 text-parchment transition-colors hover:text-gold"
            >
              <Mail className="h-5 w-5 text-gold" />
              <span className="font-medium">{contactEmail}</span>
            </a>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
