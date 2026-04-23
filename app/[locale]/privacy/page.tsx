import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';
import { BackToHomeLink } from '@/components/ui/BackToHomeLink';
import { siteConfig } from '@/data/site';
import { getMessages, isValidLocale, type Locale } from '@/lib/i18n';

type Props = { params: Promise<{ locale: string }> };

const PRIVACY_CONTACT_EMAIL = 'hello@zachlamb.com';
// TODO: verify — set to the date the policy was actually reviewed/published.
const LAST_UPDATED_ISO = '2026-04-23';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const messages = getMessages(locale as Locale);
  const canonical =
    locale === 'en' ? `${siteConfig.url}/privacy` : `${siteConfig.url}/${locale}/privacy`;
  return {
    title: `${messages.privacy.pageTitle} | ${messages.site.name}`,
    description: messages.privacy.pageDescription,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${messages.privacy.pageTitle} | ${messages.site.name}`,
      description: messages.privacy.pageDescription,
      url: canonical,
      siteName: messages.site.name,
      type: 'article',
    },
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) redirect('/');
  const messages = getMessages(locale as Locale);
  const p = messages.privacy;

  return (
    <Section variant="light" nature={{ leaves: false }}>
      <AnimatedHeading as="h1" subtitle={p.lastUpdated} className="mb-8">
        {p.pageTitle}
      </AnimatedHeading>

      {/* Draft — needs review. This page is a scaffold; all content below should be confirmed by the site owner before it goes to production. */}
      <div
        role="note"
        className="border-gold/40 bg-gold/10 text-bark mb-10 rounded-md border-l-4 px-4 py-3 text-sm"
      >
        <strong className="text-forest font-semibold">Draft — needs review. </strong>
        {p.draftBanner}
      </div>

      <div className="text-bark max-w-3xl space-y-10 text-base leading-relaxed break-words">
        <section aria-labelledby="privacy-at-glance">
          <h2 id="privacy-at-glance" className="text-forest mb-3 font-serif text-2xl font-semibold">
            {p.atGlance.heading}
          </h2>
          <p>{p.atGlance.body}</p>
        </section>

        <section aria-labelledby="privacy-what">
          <h2 id="privacy-what" className="text-forest mb-3 font-serif text-2xl font-semibold">
            {p.whatICollect.heading}
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>{p.whatICollect.contactForm}</li>
            <li>{p.whatICollect.analytics}</li>
          </ul>
        </section>

        <section aria-labelledby="privacy-where">
          <h2 id="privacy-where" className="text-forest mb-3 font-serif text-2xl font-semibold">
            {p.whereItGoes.heading}
          </h2>
          <p>
            {p.whereItGoes.body}{' '}
            <a
              href="https://resend.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-forest hover:text-gold underline underline-offset-4"
            >
              Resend privacy policy
            </a>
            .
          </p>
        </section>

        <section aria-labelledby="privacy-retention">
          {/* TODO: verify — confirm Vercel Analytics retention window and whether indefinite inbox retention matches the owner's actual practice. */}
          <h2 id="privacy-retention" className="text-forest mb-3 font-serif text-2xl font-semibold">
            {p.retention.heading}
          </h2>
          <p>{p.retention.body}</p>
        </section>

        <section aria-labelledby="privacy-rights">
          <h2 id="privacy-rights" className="text-forest mb-3 font-serif text-2xl font-semibold">
            {p.rights.heading}
          </h2>
          <p>
            {p.rights.body}{' '}
            <a
              href={`mailto:${PRIVACY_CONTACT_EMAIL}`}
              className="text-forest hover:text-gold underline underline-offset-4"
            >
              {PRIVACY_CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>

        <section aria-labelledby="privacy-cookies">
          <h2 id="privacy-cookies" className="text-forest mb-3 font-serif text-2xl font-semibold">
            {p.cookies.heading}
          </h2>
          <p>{p.cookies.body}</p>
        </section>

        <section aria-labelledby="privacy-third-parties">
          {/* TODO: verify — confirm sub-processor list is complete. Add any additional processors (error monitoring, form spam filters, etc.) if introduced. */}
          <h2
            id="privacy-third-parties"
            className="text-forest mb-3 font-serif text-2xl font-semibold"
          >
            {p.thirdParties.heading}
          </h2>
          <p className="mb-3">{p.thirdParties.intro}</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-forest hover:text-gold underline underline-offset-4"
              >
                Vercel
              </a>{' '}
              — {p.thirdParties.vercel}
            </li>
            <li>
              <a
                href="https://resend.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-forest hover:text-gold underline underline-offset-4"
              >
                Resend
              </a>{' '}
              — {p.thirdParties.resend}
            </li>
          </ul>
          <p className="mt-3">{p.thirdParties.note}</p>
        </section>

        <section aria-labelledby="privacy-contact">
          <h2 id="privacy-contact" className="text-forest mb-3 font-serif text-2xl font-semibold">
            {p.contact.heading}
          </h2>
          <p>
            {p.contact.body}{' '}
            <a
              href={`mailto:${PRIVACY_CONTACT_EMAIL}`}
              className="text-forest hover:text-gold underline underline-offset-4"
            >
              {PRIVACY_CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>

        <p className="text-stone text-sm">
          {p.lastUpdated} (<time dateTime={LAST_UPDATED_ISO}>{LAST_UPDATED_ISO}</time>)
        </p>

        <div className="pt-4">
          <BackToHomeLink />
        </div>
      </div>
    </Section>
  );
}
