/**
 * Single source of truth for the third-party processors that handle visitor
 * data on this site. The privacy page renders this list verbatim — adding a
 * processor here is the only way to add it to the privacy notice.
 *
 * Why this lives in a typed module rather than messages/*.json:
 * 1. The privacy page is rendered in English regardless of URL locale (see
 *    app/[locale]/privacy/page.tsx header comment), so per-locale strings
 *    are unnecessary churn.
 * 2. Forcing the data to live next to the code that renders it makes the
 *    "you added a processor without disclosing it" mistake structurally
 *    harder — adding a Sentry init or a new fetch destination should
 *    surface as a missing entry here, caught by code review.
 *
 * If a processor is added to package.json (e.g. a new analytics dep, an
 * error tracker, a form spam filter), it must appear here before the
 * privacy page can be considered accurate.
 */
export type SubProcessor = {
  /** Stable id; used as React key. */
  id: string;
  /** Display name. */
  name: string;
  /** Vendor's privacy-policy URL. */
  url: string;
  /** Short clause completing the sentence "<Name> — <purpose>." */
  purpose: string;
};

export const subProcessors: readonly SubProcessor[] = [
  {
    id: 'vercel',
    name: 'Vercel',
    url: 'https://vercel.com/legal/privacy-policy',
    purpose:
      'hosts the site and provides privacy-preserving aggregate analytics. Aggregate metrics only; the script does not set cookies and does not build an individual profile of you.',
  },
  {
    id: 'resend',
    name: 'Resend',
    url: 'https://resend.com/legal/privacy-policy',
    purpose:
      'delivers the email generated when you submit the contact form. Resend processes your name, email address, and message strictly to deliver that one email to my inbox.',
  },
  {
    id: 'sentry',
    name: 'Sentry',
    url: 'https://sentry.io/privacy/',
    purpose:
      'collects application errors so I can fix them. Captured events include the URL, browser/OS user agent, viewport size, and a session replay only when an error fires (text content is masked, media is blocked). No cookies, no analytics tracking. Sentry is only active when DSN environment variables are set; you can request that I disable it for your sessions.',
  },
] as const;
