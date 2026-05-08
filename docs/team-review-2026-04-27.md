# Team review — 2026-04-27

Multi-persona review of zachlamb.io. Branch at review time: `main @ 8ba742c`.

Prior review: `docs/team-review-2026-04-22.md` (almost entirely shipped between
`30f6e80..8ba742c` — ~33 commits, ~7000 net lines).

## Roster

- PM, UX, FE, BE, Architect, QA (disciplines mode)
- SME: Privacy Researcher (the `/privacy` page just landed and was unreviewed)
- Meta-reviewer (Step 2.5)

## Baseline (pre-implementation)

- Tests: 237 passing across 35 files
- Typecheck / lint / format / build: all clean
- npm audit: 0 vulnerabilities
- Coverage: 91.1 / 79.1 / 88.3 / 92.6 (vs thresholds 76/64/76/80)

## Plan summary

The site has matured significantly. The strongest themes from this round:
**observability gaps** (Sentry instrumented but not actually capturing the
errors that matter; Upstash env vars unset in prod), **artifact drift**
(resume PDF and `data/experience.ts` out of sync, Selected Work shipped with
placeholder content), **TaglineCycler a11y gaps**, **privacy page is
half-finalized** (live but draft banner showing, Sentry undisclosed).

## Critical (Phase 1)

- **[BE / Meta-upgraded]** Resend failures silent — never reach Sentry.
  [`app/api/contact/route.ts:117-124`](../app/api/contact/route.ts) catches
  both error branches; `instrumentation.ts:12`'s `captureRequestError` only
  catches _uncaught_ errors. Add `Sentry.captureException` (no PII). [S]
- **[BE]** Rate-limit Redis errors only `console.error`
  ([`lib/rate-limit.ts:71-74`](../lib/rate-limit.ts)). Persistent Upstash
  outage silently disables abuse gate. Add `Sentry.captureException` with
  `level: 'warning'`. [S]
- **[SME]** Sentry processes visitor data but **not disclosed** in privacy
  page's "Third parties". GDPR Art. 13(1)(e) gap. CSP at
  [`next.config.ts:27`](../next.config.ts) already whitelists Sentry ingest.
  Add Sentry to the third-party list + `data/sub-processors.ts` source of
  truth. [S]
- **[FE / Architect / QA — merged]** Resume PDF stale (last regen at `5f6135f`,
  before `2371854`'s Gogo internship add) AND structurally drift-prone
  ([`scripts/generate-resume.py:128-211`](../scripts/generate-resume.py)
  duplicates `data/experience.ts`). Regenerate now; bridge later. [S regen]
- **[BE/Operational]** Upstash env vars not set in any Vercel environment
  — limiter degrades silently to per-instance Map. Add a startup warn when
  `VERCEL_ENV === 'production'`. [S]

## High

- **[UX H1]** TaglineCycler has no `aria-live` / `role="status"`. [S]
- **[UX H2]** 3s interval violates WCAG 2.2.2; reduced-motion shows only the
  longest tagline. [S]
- **[UX H3]** Tagline cycle CLS — line 1 wraps to 3 lines @ 360px. [S]
- **[UX H5]** `availability: 'Open to remote'` hardcoded English. [S]
- **[BE]** `lib/rate-limit.ts:65` pipeline cast unsafe — `null <= 5 → true`. [S]
- **[QA + BE merged]** No direct `lib/rate-limit.ts` tests. [S]
- **[Architect H2]** [`lib/i18n.ts:38-43`](../lib/i18n.ts) eager imports of
  all 6 locale JSONs. [S]
- **[QA H2]** [`lib/nav-section-contract.test.ts`](../lib/nav-section-contract.test.ts)
  reverse direction not asserted. [S]
- **[QA H1]**
  [`components/providers/SwKillSwitch.test.tsx`](../components/providers/SwKillSwitch.test.tsx)
  leaks global state. [S]
- **[SME]** Privacy page: lawful basis (Art. 6) never declared; "indefinitely"
  retention conflicts with Art. 5(1)(e); no transfer mechanism; no minors;
  no complaint pathway. [M]

## Medium

- **[UX H4]** Nav wraps to 2 rows on ≤1024px. [S]
- **[UX M2]** "Legal content displayed in English." banner is itself in
  English — non-EN readers can't parse. [S]
- **[UX/PM/SME]** `/privacy` ships `index: true` AND a "Draft — needs review"
  banner. Choose: finalize or `noindex`. [S]
- **[FE M3]** [`SwKillSwitch.tsx`](../components/providers/SwKillSwitch.tsx)
  — gate `caches.delete()` on `regs.length > 0`. [S]
- **[Architect M3]** Privacy English-only invariant unenforced — strip
  `privacy.*` from non-EN message files. [S]
- **[PM]** Selected Work shipped with placeholder repos + self-deprecating
  copy. Hide section on empty OR replace. **Open question.** [S–M]
- **[BE PII audit]** Add `sendDefaultPii: false` to edge + client Sentry
  configs for symmetry. [S]
- **[Architect H3]** `basePath` derivation duplicated in Navbar/Footer. [S]
- **[QA test-quality]** Framer-motion mock copy-pasted across 15 files. [S]
- **[QA cross-cutting]** Locale-parity treats arrays as opaque leaves. [S]
- **[QA M2]** Pre-push omits `format:check`. [S]
- **[SME C2]** `LAST_UPDATED_ISO` and JSON `lastUpdated` will drift. [S]
- **[Meta]** No synthetic monitor of `you@zachlamb.io →
zachlamb94@gmail.com` forwarding chain. [S–M]

## Low

- Resume PDF dead Python imports + no-op `letterSpace` kwarg
- Hero map/trail draw doesn't respect `useReducedMotion` (consider
  `<MotionConfig reducedMotion="user">`)
- Roman-numeral subtitles `II.`/`IIb.`/`IIc.` read as typo
- Sitemap missing `/privacy`
- Footer mailto link missing
- `availability` lacks specificity
- `text-stone` on `bg-forest` borderline contrast — measure
- `data/projects.test.ts` should assert `https:` protocol
- Sentry `SENTRY_TRACES_SAMPLE_RATE` env override ignored
- CCPA "not a 'business'" line + minors statement
- Supply-chain audit (lucide v1 / @sentry/nextjs / @upstash/redis advisories)

## Resolved contradictions

- **`lib/rate-limit.ts` test severity** (QA: Critical vs BE: Medium) → High.
  Behavior covered transitively, but the rate limiter is security-relevant
  code that the integration mock doesn't fully exercise.
- **PM "hardcoded `you@zachlamb.io`" Critical** → dropped. Meta correctly
  identifies this as a misread; the alias is real (Resend-forwarded).
  Single-source-of-truth concern survives at Medium for the JSON draft
  banner string.
- **SwKillSwitch lifetime** (FE: `regs.length > 0`; Architect: localStorage
  flag) → FE wins. Idempotent and stateless.
- **Selected Work disposition** → Open Question.

## Recommended sequence

- **Phase 1** (≈ half-day, this run): Sentry hooks for Resend + rate-limit
  errors; Sentry sub-processor disclosure; pipeline result validation;
  regenerate resume PDF; startup warn when Upstash unset in prod.
- **Phase 2**: TaglineCycler a11y/WCAG/CLS; nav 1024px wrap; privacy
  lawful-basis + retention + transfer + minors + complaint pathway;
  hide/replace Selected Work; finalize OR `noindex` privacy.
- **Phase 3**: `lib/rate-limit.test.ts`; resume↔data parity test + Python
  JSON bridge; SwKillSwitch gate; `lib/i18n` lazy imports; reverse nav
  contract; locale-parity array support; DRY framer-motion mock; pre-push
  `format:check`; sendDefaultPii symmetry.
- **Phase 4**: Playwright e2e; basePath hook; Sentry config DRY; Hero
  reduced-motion; CI gates (Lighthouse / size / axe / Codecov / Python
  check); supply-chain audit; synthetic forwarding monitor; date-derived
  `lastUpdated`.

## Open questions (deferred)

1. Selected Work — hide on empty OR replace placeholders with strongest
   current projects?
2. Privacy page — finalize or `noindex`?
3. Upstash + Sentry env vars in Vercel prod — set them, or accept the
   graceful-fallback state?
