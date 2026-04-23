# Team review — 2026-04-22

Multi-persona review of zachlamb.io. Branch at review time: `main @ 30f6e80`.

## Roster

- PM, UX, FE, BE, Architect, QA (disciplines mode)
- SME1: Senior Engineering Recruiter / Tech Hiring Manager (strategic/funnel lens)
- SME2: Technical Recruiter / Sourcer (tactical/pipeline lens) — added in second pass at user request
- Meta-reviewer (Step 2.5)

## Intent answers (from user)

1. **Site intent:** job-seeking artifact with personal flare.
2. **EU/i18n:** locale support was a tech exercise; user wants to lean into privacy/GDPR posture regardless.
3. **`hello@zachlamb.com` vs `zachlamb.io`:** Resend owns the `.com` forwarding (so not broken, just inconsistent); confirm + align.
4. **Employer surfacing:** keep site employer-agnostic (no "Currently at Circadence" in Hero/OG).

Severity implications: resume link + hero tagline + dual-label nav + sourcer signals elevated from "contingent High" to Critical. Privacy page elevated from Phase 4 to Phase 2 Critical.

## Plan

### Critical

- **[BE]** Spoofable `x-forwarded-for` rate-limit key in [app/api/contact/route.ts:22-28](../app/api/contact/route.ts). Use `x-vercel-forwarded-for` first. [S]
- **[BE]** No Origin/Referer check on POST [app/api/contact/route.ts:45](../app/api/contact/route.ts). Add allowlist. [S]
- **[Meta]** No privacy policy / GDPR notice for a 6-locale site collecting PII via Resend. Add `/privacy` page + footer link. [S]
- **[PM/SME1/SME2]** No resume link ([data/site.ts:12](../data/site.ts)) + Hero tagline leads with Oreos, not stack — confirmed job-seeking. [S]

### High

- **[BE]** In-memory rate-limit Map is per-lambda-instance on Vercel. [M]
- **[BE]** No CSP, no HSTS in [next.config.ts](../next.config.ts). [M]
- **[UX]** NatureElements animate forever with no `useReducedMotion` guard — [components/ui/NatureElements.tsx](../components/ui/NatureElements.tsx). Framer inline transforms bypass the global CSS override. [S]
- **[FE/QA]** [hooks/useActiveSection.ts:23-49](../hooks/useActiveSection.ts) — 8× `getElementById` + layout reads on every scroll tick, unthrottled; zero tests. [S]
- **[Architect/QA]** Nav/section contract duplicated in 4 places — add structural test. [S-M]
- **[QA/Architect]** [proxy.ts](../proxy.ts), [lib/i18n.ts](../lib/i18n.ts) `getLocaleFromAcceptLanguage`, `LocaleProvider` throw branch — all zero tests. [M]
- **[QA]** No `messages/*.json` key-parity test. [S]

### Medium

- Email domain mismatch `hello@zachlamb.com` vs `zachlamb.io` — align after user confirms. [S]
- Remove dead deps: `next-auth`, `@vercel/kv`, `jsdom` + scrub [.env.example](../.env.example) + stale `/myspace` in [app/robots.ts:6](../app/robots.ts). [S]
- `useReducedMotion` missing on Contact form slide-ins and Hero map draw-in. [S]
- `LanguageDropdown` discards hash on locale switch. [S]
- Mobile menu sets `overflow:hidden` on `<html>` — breaks iOS scroll restoration. [S]
- `RESEND_FROM_EMAIL` fallback to `onboarding@resend.dev` — fail-closed. [S]
- Missing `generateStaticParams` for `[locale]`. [S]
- Extend vitest coverage `include` + add `typecheck` to pre-push. [S]
- Add Resend cost alerting + Sentry + uptime monitoring. [M]

### Low

- LazyMotion + `m` migration [M]; trim Cormorant weights [S]; `no-explicit-any` → `warn` [S]; normalize "Sr." → "Senior" [S]; dedupe `basePath` derivation [S]; shared framer-motion mock [S].

### Recommended sequence

1. **Phase 1 — Security & cleanup** (≈ half-day): dead deps, stale refs, Origin check, trusted IP, CSP/HSTS, `RESEND_FROM_EMAIL` fail-closed, coverage include + pre-push typecheck.
2. **Phase 2 — Content & positioning** (contingent on user-provided copy): resume PDF, hero tagline rewrite in 6 locales, dual-label nav, siteConfig fields (location/remote/availability/email), privacy page.
3. **Phase 3 — Structural & testing** (≈ half-day): proxy + i18n + useActiveSection tests, locale parity, nav-section sync; rAF-throttle; gate NatureElements on `useReducedMotion`.
4. **Phase 4 — Polish & observability:** Sentry, cost alerting, LazyMotion, iOS scroll, hash preservation, font weight trim.

### Dropped / deferred

- "Selected Work" section with 3 projects (SME1) — new feature, separate effort.
- `/resume` dense print route (SME2).
- All-sections-to-RSC refactor (FE M1).

### Baseline

To be recorded after `npm install && npm test` before any code changes.
