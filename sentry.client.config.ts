import * as Sentry from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    // 10% in prod, 100% in dev — override in production via SENTRY_TRACES_SAMPLE_RATE if you want lower
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    // Only capture session replays on error, no ongoing session recording — keeps PII surface small
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0,
    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
  });
}
