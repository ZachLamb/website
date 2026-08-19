# Field Journal — Design Spec

**Date:** 2026-08-18
**Approach:** "Field Journal" — cohesive trail-map design system: continuous trail through-line, single-column trail-log timeline, map-plate card language, recruiter-first animation system
**Scope:** Full-site visual pass + two foundation bug fixes (multi-day, section-by-section)
**Audience priority:** Recruiters and hiring managers scanning fast — content legibility always beats decoration.

---

## 1. Foundation Repairs

These land first; everything else builds on them.

### 1.1 Navbar hydration mismatch

`components/layout/Navbar.tsx:84` computes `const mounted = typeof document !== 'undefined'`, a server/client branch that renders the mobile-nav portal differently on server vs. client. React logs a hydration error and regenerates the tree on every load, causing the blank-content flash.

**Fix:** `const [mounted, setMounted] = useState(false)` + `useEffect(() => setMounted(true), [])`. Server and first client render agree (no portal); portal mounts after hydration.

**Test:** update/extend Navbar-related tests; verify no hydration error in the browser console on a fresh load.

### 1.2 Reveal reliability (never-blank rule)

Content sections currently render at `opacity: 0` until Framer `whileInView` fires; during hydration or fast scrolling viewers see empty parchment.

Rules for every entrance animation:

- `viewport={{ once: true, amount: 0.2 }}`
- Duration ≤ 0.35s, stagger ≤ 0.06s per child
- Initial offset ≤ 12px (`opacity: 0, y: 12`), no large slides
- `elevationSlideLeft/Right` (±30px) in `lib/trail-animations.ts` are replaced by the small-offset fade-up

`lib/trail-animations.ts` is the single source for these variants; sections import from it rather than declaring their own.

### 1.3 Text alignment

No `text-right` body text anywhere. Experience cards and Services rows become left-aligned. (The single-column timeline in §4.3 removes the layout that motivated right-alignment.)

---

## 2. Visual System

### 2.1 Typography

- Hero h1 unchanged (`text-6xl md:text-8xl` Cormorant Garamond, existing text-shadow).
- Section headings keep `text-4xl md:text-5xl`, color moves to the deepened forest (§2.2).
- **Kicker lines:** the bare Roman-numeral subtitles above h2s become serif-italic kicker lines that carry both the numeral and a journey phrase, e.g. `II · the trail log`, `VI · end of trail`. Styled `font-serif italic text-sm tracking-[0.2em] text-gold-deep`. Copy per section defined in `messages/en.json` (and locale files) under a new `sections.<id>.kicker` key.

### 2.2 Color

Add to `@theme` in `app/globals.css`:

| Token                 | Value     | Use                                                                                                  |
| --------------------- | --------- | ---------------------------------------------------------------------------------------------------- |
| `--color-forest-deep` | `#243325` | Headings and emphasis text on parchment (raises contrast)                                            |
| `--color-gold-deep`   | `#a67c0b` | Interactive text/links/kickers on parchment (current `#b8860b` fails AA at small sizes on `#f5f0e8`) |

Existing tokens stay. The three parchment tones remain; each tone change is always paired with its divider so the progression reads as intentional. Buttons/badges on the dark hero keep the current gold (contrast there is fine).

### 2.3 Map-plate card language

One card recipe reused across Experience entries, Recommendations, About stat tiles, and Services items — extending `components/ui/Card.tsx` with a `variant="plate"`:

- Fill: `bg-parchment` lightened (`bg-white/40` over parchment) — reads as a lighter plate on the section tone
- Border: 1px `border-bark/15`, rounded-lg
- **Gold corner tick:** 2px gold rule, ~24px long, across the top-left corner (pseudo-element) — the "map plate label" mark
- Corner texture: faint contour-arc SVG (existing data-URI pattern approach) in the bottom-right corner at ≤5% opacity
- Hover: existing lift + topo-pulse retained

---

## 3. Trail Through-Line

`TrailExtension` (scroll-scrubbed dashed line) and `TrailWaypoints` are the right idea rendered too faintly in the far-left gutter.

- **Position:** move both from the viewport gutter to the left edge of the `max-w-5xl` content column (align with the container used by `Section`). Mobile: keep the current near-left-edge position (content column is full-width).
- **Line:** stroke 3px, `rgba(184,134,11,0.5)`, still dashed, still scrubbed by `useScroll` pathLength. Reduced motion: fully drawn.
- **Waypoints → numbered trail markers:** each marker is a gold-stroked circle (~20px) containing the section's existing Roman numeral (sourced from the same numbering the section headings already use, so the two can't diverge) in serif. States: unvisited = outline + parchment fill; passed = gold fill, numeral in forest; active = gold fill + existing glow pulse. Markers double as a progress indicator.
- **Divider crossings:** each `Divider` ridge gains a small gold dot at the x-position where the trail line crosses it, visually splicing line and dividers into one map. Implemented inside `Divider.tsx` (fixed x matching the trail's column offset).
- `TrailExtension` and `TrailWaypoints` share position math — extract the common left-offset calculation into a small helper so they can't drift apart.

---

## 4. Section Redesigns

### 4.1 Hero

- Raise trail-map layer opacities ~1.5× across the SVG (contours to 0.12–0.27, trail to 0.33, markers to 0.3, mountain layers proportionally). The map should be readable as a map at a glance.
- Remove the dashed map-frame rect (its edges clip at viewport edges and read as artifacts). Keep the "TRAIL MAP" label plate.
- **Tagline gap fix:** wrap `TaglineCycler` in a `ResizeObserver`-backed container animating `height` via CSS transition (~300ms), replacing fixed min-height reservation. No layout shift of CTAs beyond the smooth height tween.
- Shorten the one-time draw-on choreography: all hero animation complete by ~2s (currently 5.2s). Trail draw 2s starting at 0.3s; markers stagger within that window; secondary paths overlap.

### 4.2 Trail Guide (About)

- Stat tiles become map plates: gold numeral `text-4xl` serif in `gold-deep`, label in `forest-deep`, plate recipe from §2.3.
- Compass-rose SVG watermark (~200px, ≤6% opacity bark) in the right-side dead space, hidden on mobile.
- Reduce bottom padding to tighten the gap before the divider.

### 4.3 Trail Log (Experience) — single-column trail log

Replace the alternating two-column timeline:

- Trail line runs down the left side of the section content (visually continuous with the §3 through-line); entries stack in a single column to its right, full content width.
- Each entry anchored by a numbered trail marker on the line.
- Date range rendered as a range line: `Feb 2024 —— Sep 2025` with a small arrowhead, styled as a trail distance marker.
- Card = map plate. Keep existing card/detail-panel behavior (`slice(0, 3)` bullets + expand) and all content unchanged.
- Expected result: section height roughly halves; no viewport-scale whitespace voids; all text left-aligned.

### 4.4 What I Bring (Services)

- Replace alternating offset rows with a 2×2 grid (`md:grid-cols-2`) of map plates: icon in a gold-tinted circle top-left, title, description. Left-aligned. Single column on mobile.
- Retire the ghost background illustrations (`illustrationMap`) — invisible at current opacity and unneeded in the grid.

### 4.5 Recommendations

- Cards adopt the plate recipe.
- Marquee keeps its motion; add edge fade masks (`mask-image: linear-gradient` transparent→opaque→transparent) so cards aren't hard-clipped at container edges.

### 4.6 Gear (Skills)

- Category headers restyled as map-legend entries: `— FRONTEND —` with short rule lines either side, gold, tracking-wide.
- Low-opacity elevation-profile SVG (mountain cross-section line, ≤8% parchment on charcoal) along the section bottom to fill the dead space.

### 4.7 Credentials & Contact

- Credentials: entries get plate treatment (lighter fill, corner tick); kicker heading per §2.1.
- Contact: the empty right column below the direct links gets the cairn / "end of trail" motif (stacked-stones SVG + the existing END OF TRAIL rule) moved up from the footer edge, so the column reads as a designed terminus rather than leftover space. Form styling unchanged apart from tokens.

---

## 5. Animation System

Three tiers, all `prefers-reduced-motion` safe (render end-state statically — existing pattern):

1. **Scroll-scrubbed ambience** — trail line pathLength, divider parallax (existing), waypoint fill states. Communicates craft; never gates content.
2. **Entrance reveals** — §1.2 rules: once-only, ≤0.35s, ≤12px offsets, ≤0.06s stagger.
3. **Hover/micro** — topo-pulse, marker glow, button transitions (existing, kept).

Only GPU-composited properties (`transform`, `opacity`) animate on scroll. No pinned scenes, no scroll-jacking.

---

## 6. Testing & Verification

- Update existing vitest suites where markup changes (Experience, Services, Card, Navbar, Section, Divider, TrailExtension/Waypoints, About). Test names describe behavior; content assertions unchanged where content is unchanged.
- New tests: Navbar mounted-state fix (no portal on first render), Card `plate` variant classes, Experience single-column structure.
- Gate per milestone: `npm run lint && npm run typecheck && npm run test && npm run build`.
- Browser verification: fresh-load console clean of hydration errors; visual pass at desktop (~1440px) and 375px mobile; reduced-motion pass renders all content statically.

### Out of scope

- Content/copy changes beyond new kicker strings (all locales get the new `sections.<id>.kicker` keys).
- Nav labels, i18n structure, contact form logic, SEO/meta.
- Projects section (currently not rendered on the page — untouched).

### Security considerations

No new inputs, endpoints, or dependencies; changes are presentational (CSS/SVG/Framer variants) plus a hydration-ordering fix. No new risk surface.
