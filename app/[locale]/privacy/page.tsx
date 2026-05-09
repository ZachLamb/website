import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';
import { BackToHomeLink } from '@/components/ui/BackToHomeLink';
import { siteConfig } from '@/data/site';
import { subProcessors } from '@/data/sub-processors';
import { getMessages, isValidLocale, locales } from '@/lib/i18n';

type Props = { params: Promise<{ locale: string }> };

const PRIVACY_CONTACT_EMAIL = 'you@zachlamb.io';
const LAST_UPDATED_ISO = '2026-04-27';

// Intentional: the privacy policy is rendered in English for every locale.
// Non-English translations of legal text in messages/*.json are placeholder
// drafts and should not be served. We still honor /<locale>/privacy URLs so
// the route shape matches the rest of the site (and language switcher / SEO
// hreflang keep working), but the body text always comes from messages/en.json.
// The in-page banner informs users; canonical points at /en/privacy.
// Do not "fix" this by swapping getMessages('en') back to getMessages(locale)
// until every translation file has reviewed, jurisdiction-accurate legal text.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const messages = getMessages('en');
  const canonical = `${siteConfig.url}/privacy`;
  const requestedUrl =
    locale === 'en' ? `${siteConfig.url}/privacy` : `${siteConfig.url}/${locale}/privacy`;
  return {
    title: `${messages.privacy.pageTitle} | ${messages.site.name}`,
    description: messages.privacy.pageDescription,
    alternates: {
      canonical,
      languages: Object.fromEntries(
        locales.map((loc) => [
          loc,
          loc === 'en' ? `${siteConfig.url}/privacy` : `${siteConfig.url}/${loc}/privacy`,
        ]),
      ) as Record<string, string>,
    },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${messages.privacy.pageTitle} | ${messages.site.name}`,
      description: messages.privacy.pageDescription,
      url: requestedUrl,
      siteName: messages.site.name,
      type: 'article',
    },
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) redirect('/');
  // See comment above generateMetadata: privacy body is always English.
  const messages = getMessages('en');
  const p = messages.privacy;

  return (
    <Section variant="light" nature={{ leaves: false }}>
      <AnimatedHeading as="h1" subtitle={p.lastUpdated} className="mb-8">
        {p.pageTitle}
      </AnimatedHeading>

      {/* Language notice: served in English for every locale — see header comment above generateMetadata. */}
      <div
        role="note"
        className="border-forest/40 bg-forest/5 text-bark mb-4 rounded-md border-l-4 px-4 py-3 text-sm"
      >
        <strong className="text-forest font-semibold">Legal content displayed in English. </strong>
        This page is available at the same URL in every language but the policy itself is maintained
        in English for accuracy. If you need this information in another language, please contact{' '}
        <a
          href={`mailto:${PRIVACY_CONTACT_EMAIL}`}
          className="text-forest hover:text-gold underline underline-offset-4"
        >
          {PRIVACY_CONTACT_EMAIL}
        </a>
        .
      </div>

      <div className="mb-6" />

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
          <h2 id="privacy-retention" className="text-forest mb-3 font-serif text-2xl font-semibold">
            {p.retention.heading}
          </h2>
          <p>{p.retention.body}</p>
        </section>

        {/* Lawful basis — GDPR Art. 13(1)(c). Phrasing kept conservative;
            revisit if the site adds features that change the basis (e.g.
            marketing emails would shift to consent under Art. 6(1)(a)). */}
        <section aria-labelledby="privacy-lawful-basis">
          <h2
            id="privacy-lawful-basis"
            className="text-forest mb-3 font-serif text-2xl font-semibold"
          >
            Lawful basis
          </h2>
          <p>
            For the contact form: <strong>legitimate interest</strong> (GDPR Art. 6(1)(f)) —
            specifically, replying to inbound inquiries you initiated. For aggregate analytics: also{' '}
            <strong>legitimate interest</strong>, kept minimal and cookieless. If you&apos;d rather
            not have your message processed, don&apos;t submit the form — there&apos;s no other
            collection point on this site.
          </p>
        </section>

        {/* International transfers — GDPR Art. 13(1)(f). The phrasing
            is intentionally generic so it stays accurate as vendors enter
            and leave the DPF participant list; for the current status of
            any specific vendor, the right source is that vendor's own
            privacy/trust page (linked under "Third parties" below). */}
        <section aria-labelledby="privacy-transfers">
          <h2 id="privacy-transfers" className="text-forest mb-3 font-serif text-2xl font-semibold">
            International transfers
          </h2>
          <p>
            The third-party services listed below process data in the United States. For visitors in
            the EU, UK, or other regions with adequacy-equivalent privacy laws, transfers rely on
            the EU–US Data Privacy Framework where the vendor participates, and on Standard
            Contractual Clauses otherwise. Each vendor&apos;s current transfer-mechanism status is
            documented in their own privacy policy, linked under &ldquo;Third parties&rdquo; below.
          </p>
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
          {/* Complaint pathway — required by GDPR Art. 13(2)(d) for EU/UK visitors. */}
          <p className="mt-3">
            If you believe I have mishandled your data, you have the right to lodge a complaint with
            your local supervisory authority. UK visitors can contact the{' '}
            <a
              href="https://ico.org.uk/make-a-complaint/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-forest hover:text-gold underline underline-offset-4"
            >
              ICO
            </a>
            ; EU visitors can find their national DPA via the{' '}
            <a
              href="https://www.edpb.europa.eu/about-edpb/about-edpb/members_en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-forest hover:text-gold underline underline-offset-4"
            >
              EDPB members list
            </a>
            .
          </p>
        </section>

        {/* Children — added per privacy review. Many regimes (GDPR Art. 8 +
            US COPPA among others) expect a clear "not for under-16s" line. */}
        <section aria-labelledby="privacy-minors">
          <h2 id="privacy-minors" className="text-forest mb-3 font-serif text-2xl font-semibold">
            Children
          </h2>
          <p>
            This site is not directed at children under 16, and I do not knowingly collect
            information from them. If you believe a child has submitted information through the
            contact form, email{' '}
            <a
              href={`mailto:${PRIVACY_CONTACT_EMAIL}`}
              className="text-forest hover:text-gold underline underline-offset-4"
            >
              {PRIVACY_CONTACT_EMAIL}
            </a>{' '}
            and I&apos;ll delete it.
          </p>
        </section>

        {/* CCPA — defensive disclosure. As a single-operator personal site
            with no e-commerce, no advertising, and no PI sale, none of
            CCPA's "business" thresholds (revenue, data volume, sale of PI)
            apply. The affirmative no-sell/no-share clause is added as a
            trust signal beyond what's strictly required. */}
        <section aria-labelledby="privacy-ccpa">
          <h2 id="privacy-ccpa" className="text-forest mb-3 font-serif text-2xl font-semibold">
            California (CCPA)
          </h2>
          <p>
            I am not a &ldquo;business&rdquo; as defined by the California Consumer Privacy Act
            (CCPA). I do not sell or share personal information for cross-context behavioral
            advertising. If that ever changes, this notice will be updated and a &ldquo;Do Not Sell
            or Share&rdquo; link will appear in the footer.
          </p>
        </section>

        <section aria-labelledby="privacy-cookies">
          <h2 id="privacy-cookies" className="text-forest mb-3 font-serif text-2xl font-semibold">
            {p.cookies.heading}
          </h2>
          <p>{p.cookies.body}</p>
        </section>

        <section aria-labelledby="privacy-third-parties">
          {/* Sub-processors come from data/sub-processors.ts (single source of
              truth). To add a new processor to the disclosure, add it there. */}
          <h2
            id="privacy-third-parties"
            className="text-forest mb-3 font-serif text-2xl font-semibold"
          >
            {p.thirdParties.heading}
          </h2>
          <p className="mb-3">{p.thirdParties.intro}</p>
          <ul className="list-disc space-y-2 pl-6">
            {subProcessors.map((proc) => (
              <li key={proc.id}>
                <a
                  href={proc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-forest hover:text-gold underline underline-offset-4"
                >
                  {proc.name}
                </a>{' '}
                — {proc.purpose}
              </li>
            ))}
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
