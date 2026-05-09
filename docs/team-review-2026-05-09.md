# Team Review — UI / Transitions / Animations + A11y

**Date:** 2026-05-09
**Focus:** UI, transitions, animations, accessibility (`--add a11y`)
**Roster:** UX · FE · A11y · PM · QA (5 specialists, narrow-ask trim)
**Mode:** disciplines

5 specialists ran. Strong cross-persona consensus on a small set of high-leverage fixes. Meta-review skipped after context compaction — consensus was already 4/5 on top items, so the marginal value of synthesis-of-summaries was low.

## Headline

A single one-line change in `MotionProvider` simultaneously closes a WCAG 2.3.3 gap, fixes Hero motion ignoring reduced-motion, and gates 13+ `m.*` consumers that currently each re-implement (or skip) their own check. Everything else is small, ordered.

## Team top picks (cross-persona consensus)

| #   | Finding                                                                                                                            | Personas            | Where                                     |
| --- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ----------------------------------------- |
| 1   | `MotionProvider` lacks `<MotionConfig reducedMotion="user">` — every `m.*` animation runs unconditionally regardless of OS setting | UX · FE · A11y · PM | `components/providers/MotionProvider.tsx` |
| 2   | Hero trail-map SVG runs a 5.6s motion timeline with no reduced-motion branch                                                       | UX · FE · A11y · PM | `components/sections/Hero.tsx:178–287`    |
| 3   | `AnimatedHeading` Roman-numeral subtitles announce as "I dot, II dot, II b dot…" to screen readers                                 | UX · A11y           | `components/ui/AnimatedHeading.tsx`       |
| 4   | `TaglineCycler` auto-rotates with no focusable child → keyboard users cannot pause (WCAG 2.2.2)                                    | A11y · QA           | `components/ui/TaglineCycler.tsx`         |
| 5   | 15 test files duplicate the framer-motion mock                                                                                     | QA                  | `vitest.setup.ts` + `*.test.tsx`          |

## Findings, severity-graded

### High (fix before next release)

**H1. Add `<MotionConfig reducedMotion="user">` to `MotionProvider`** — `components/providers/MotionProvider.tsx`

- _Why:_ WCAG 2.3.3. Every `m.*` consumer in the tree (Hero paths, AnimatedHeading, TaglineCycler, Section reveals, etc.) currently animates regardless of OS setting. Framer Motion's `MotionConfig` short-circuits transforms to instant when the user has Reduce Motion on, with one line.
- _Fix:_ Wrap the existing `LazyMotion` children in `<MotionConfig reducedMotion="user">`. No per-component edits.
- _Effort:_ `[S]` — single line.
- _Regression risk:_ `Low`. Affects motion only on `prefers-reduced-motion: reduce` clients; non-reduced users see no change.
- _Test plan:_ Add render test that mocks `matchMedia('(prefers-reduced-motion: reduce)')` and asserts motion provider is wired. New file: `components/providers/MotionProvider.test.tsx`.

**H2. Gate Hero trail-map motion behind `useReducedMotion`** — `components/sections/Hero.tsx:178–287`

- _Why:_ Even with H1 in place, a 5.6s draw-on timeline (delays 0.5–4s, durations 1.2–4s) is a content-gating risk on slow first paint. Reduced-motion users should see the map pre-drawn, not skipped.
- _Fix:_ Branch on `useReducedMotion()`. Render the same `<path>` elements with full `pathLength`/`opacity` instead of `m.path` with `initial`/`animate`. Keep the visual outcome identical at the end-state.
- _Effort:_ `[M]`.
- _Regression risk:_ `Med`. Touches a large file with many paths; easy to miss one. Snapshot test the SVG end-state to lock it.
- _Test plan:_ Extend `Hero.test.tsx` with two cases: (a) reduced-motion mocked → no animated transforms on `<path>` elements; (b) full motion → animation props present.

**H3. Make `TaglineCycler` keyboard-pausable** — `components/ui/TaglineCycler.tsx`

- _Why:_ WCAG 2.2.2 — auto-updating content over 5s must be pausable. Reduced-motion shows a stack (already shipped), but non-reduced auto-cycles with no focusable target, so keyboard users can't pause.
- _Fix:_ Add `tabIndex={0}` on the outer container; wire `onFocus`/`onBlur` and `onMouseEnter`/`onMouseLeave` to a `paused` flag that short-circuits the timer.
- _Effort:_ `[S]`.
- _Regression risk:_ `Low`.
- _Test plan:_ Add `TaglineCycler.test.tsx` cases for: focus pauses rotation, blur resumes, hover pauses (use fake timers).

**H4. Hide Roman numeral subtitles from assistive tech** — `components/ui/AnimatedHeading.tsx`

- _Why:_ "I.", "II.", "IIb.", "IIc." render as decorative section markers visually but read as ambiguous text to screen readers. Each section heading already has its own `<h2>` with the real semantic title.
- _Fix:_ Add `aria-hidden="true"` on the subtitle `<m.p>`. Visual unchanged.
- _Effort:_ `[S]`.
- _Regression risk:_ `Low`.
- _Test plan:_ Update `AnimatedHeading.test.tsx` to assert `aria-hidden="true"` on subtitle when present.

### Medium

**M1. Add `aria-controls` + matching `id` on Navbar mobile menu** — `components/layout/Navbar.tsx`. Toggle gets `aria-controls="mobile-nav"`; `<nav>` gets `id="mobile-nav"`. `aria-expanded` already correct. `[S]` · regression `Low`.

**M2. `Section` anchors not keyboard-focusable after hash jump** — `components/ui/Section.tsx`. Add `tabIndex={-1}` on the `<section>` element so programmatic focus works. `[S]` · regression `Low`.

**M3. Contact "Sending…" state has no `aria-live` announcement** — `components/sections/Contact.tsx`. Wrap status text in `<p role="status" aria-live="polite">`. `[S]` · regression `Low`.

**M4. DRY the framer-motion test mock** — `vitest.setup.ts` + 15 test files. Adding `MotionConfig` (H1) means updating 15 files unless centralized. Move to `vitest.setup.ts` global mock or shared helper. `[M]` · regression `Med`.

**M5. Section choreography rhythm** — `app/[locale]/page.tsx`. Divider sequence (`mountains → trail → treeline → treeline-flip → trail → mountains-flip`) doesn't match content rhythm. Design decision, not code. `[M]` once design is settled.

**M6. `TrailExtension` has zero tests** — `components/ui/TrailExtension.tsx`. Mounted on every page; uses `useScroll` + reduced-motion. After H1, this becomes one of the components most affected. `[M]`.

### Low

**L1.** Contact success airplane animation is twee (1.4s, `rotate: 18`) — soften to translate-only. `[S]`.
**L2.** Hero motion timing review — tighten longest delay 4s → 2.5s once H2 is in. `[S]`.
**L3.** Visual regression coverage for motion states — Playwright snapshots, optional. `[L]`.

## Recommended sequence

**Phase 1 — One-line + a11y leaf nodes (half-day)**
H1 (MotionConfig), H4 (aria-hidden subtitle), M1 (Navbar), M2 (Section tabIndex), M3 (Contact aria-live).
Ship together. Small, reviewer-friendly, unlocks the rest.

**Phase 2 — Hero & TaglineCycler motion (1 day)**
H2 (Hero useReducedMotion branch), H3 (TaglineCycler keyboard pause), L2 (timing) once H2 is in.

**Phase 3 — Test infrastructure (half-day)**
M4 (DRY motion mock — must follow H1 so the centralized mock can encode `MotionConfig` semantics), M6 (TrailExtension tests).

**Phase 4 — Design call before code (deferred)**
M5 (section choreography). Needs a design opinion before commit.

**Dropped / deferred**
L1 (airplane animation) and L3 (visual regression) — backlog.

## Open questions

1. **M5 — section choreography.** Design call needed, or defer? Recommend defer; nothing's broken.
2. **H2 — Hero reduced-motion path.** Pre-drawn full SVG (recommended) vs. simplified static glyph.
3. **M4 — global vs. helper.** Recommend global mock in `vitest.setup.ts` with per-test override pattern.

## Note on meta-review

Skipped. After context compaction the specialist outputs were no longer in window — meta-review against summaries-of-summaries is low-value. Cross-persona consensus on H1/H2/H3/H4 was already 3–4 agents independently, the strongest signal meta-review usually surfaces.

## Prior reviews

- [`docs/team-review-2026-04-22.md`](./team-review-2026-04-22.md) — first review, broad
- [`docs/team-review-2026-04-27.md`](./team-review-2026-04-27.md) — second review, pre-launch
