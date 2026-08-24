# Field Journal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the Field Journal design system — trail through-line, map-plate cards, single-column trail log, recruiter-first animations — plus two foundation bug fixes, across the portfolio site.

**Architecture:** Next.js 16 App Router portfolio, all sections are client components under `components/sections/`, shared UI under `components/ui/`, Framer Motion (`m.*` via LazyMotion) for animation, Tailwind 4 tokens in `app/globals.css` `@theme`, localized strings in `messages/*.json` (6 locales, parity-tested).

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, framer-motion 12, vitest + @testing-library/react.

**Spec:** `docs/superpowers/specs/2026-08-18-field-journal-design.md`

## Global Constraints

- Entrance animations: duration ≤ 0.35s, stagger ≤ 0.06s/child, initial offset ≤ 12px, `viewport={{ once: true, amount: 0.2 }}` (or `useInView(ref, { once: true })` equivalents).
- All body text left-aligned — no `text-right` on prose.
- Only `transform`/`opacity` animate on scroll. `prefers-reduced-motion` renders end-state statically (existing patterns).
- New color tokens: `--color-forest-deep: #243325`, `--color-gold-deep: #a67c0b`. Never put secrets in `NEXT_PUBLIC_*`.
- Use the `m.*` components (LazyMotion), never `motion.*`.
- Verification gate per task: the test command shown in that task; full gate `npm run lint && npm run typecheck && npm run test && npm run build` in the final task.
- Locale files `messages/{en,de,es,it,ja,zh}.json` must stay key-identical (`messages/locale-parity.test.ts` enforces this).
- Commit after each task; husky + lint-staged run prettier automatically.
- Do not modify `data/*` content or `messages` copy except the new `kickers` keys.

---

### Task 1: Fix Navbar hydration mismatch

**Files:**

- Modify: `components/layout/Navbar.tsx:3,84`
- Test: `components/layout/Navbar.test.tsx`

**Interfaces:**

- Consumes: nothing new.
- Produces: no API change; `Navbar` renders the mobile-nav portal only after client mount.

**Context:** `components/layout/Navbar.tsx:84` is `const mounted = typeof document !== 'undefined';` — truthy during hydration on the client but falsy during SSR, so server HTML lacks `#mobile-nav` while the client's first render includes it. React throws a hydration mismatch (visible in the browser console) and regenerates the tree.

- [ ] **Step 1: Write the failing test**

Append to `components/layout/Navbar.test.tsx` inside the existing `describe('Navbar', ...)`:

```tsx
it('renders the mobile-nav portal only after mount (hydration-safe)', () => {
  // Server snapshot: renderToString has no effects, so a hydration-safe
  // Navbar must NOT include the portal container in server HTML.
  // In jsdom, renderWithLocale runs effects, so after render the portal exists.
  renderWithLocale(<Navbar />);
  expect(document.getElementById('mobile-nav')).toBeInTheDocument();
});
```

And a server-render assertion as a separate test file is overkill; instead assert the mount gating directly: temporarily mock `useEffect` is fragile, so test the observable contract — the portal must be attached to `document.body` (portal target) and the component must not crash when effects run:

```tsx
it('portals the mobile nav to document.body', () => {
  renderWithLocale(<Navbar />);
  const overlay = document.getElementById('mobile-nav');
  expect(overlay?.parentElement).toBe(document.body);
});
```

- [ ] **Step 2: Run tests to verify current behavior**

Run: `npx vitest run components/layout/Navbar.test.tsx`
Expected: PASS (these pass before and after — they pin the behavior the fix must preserve). The bug itself is only observable in a real SSR pass; the regression guard is the code-level change below plus the browser check in Step 5.

- [ ] **Step 3: Implement the mount-state fix**

In `components/layout/Navbar.tsx`, replace line 84:

```tsx
const mounted = typeof document !== 'undefined';
```

with a state + effect pair (place the state near the other `useState` at the top of the component, and the effect immediately after):

```tsx
// Hydration-safe portal gate: server and first client render agree (no
// portal); the portal mounts in an effect after hydration completes.
const [mounted, setMounted] = useState(false);
useEffect(() => {
  setMounted(true);
}, []);
```

No import changes needed (`useState`, `useEffect` already imported).

- [ ] **Step 4: Run tests**

Run: `npx vitest run components/layout/Navbar.test.tsx`
Expected: PASS (all existing + 2 new tests).

- [ ] **Step 5: Browser verification**

Run `npm run dev`, open `http://localhost:3000/en` with devtools console open. Expected: **no** "Hydration failed" error. Stop the dev server.

- [ ] **Step 6: Commit**

```bash
git add components/layout/Navbar.tsx components/layout/Navbar.test.tsx
git commit -m "fix(navbar): gate mobile-nav portal on post-mount state to fix hydration mismatch"
```

---

### Task 2: Retune shared animation variants (never-blank rule)

**Files:**

- Modify: `lib/trail-animations.ts`
- Test: Create `lib/trail-animations.test.ts`

**Interfaces:**

- Consumes: nothing.
- Produces: same exported names (`trailFadeUp`, `waypointPop`, `elevationSlideLeft`, `elevationSlideRight`) with retuned values. Consumers (`Services.tsx`, `Contact.tsx`, `Endorsements.tsx`, `Education.tsx`) need no changes — the slide variants become small-offset fades in place.

- [ ] **Step 1: Write the failing test**

Create `lib/trail-animations.test.ts`:

```ts
import {
  trailFadeUp,
  waypointPop,
  elevationSlideLeft,
  elevationSlideRight,
} from './trail-animations';

type VisibleState = { transition?: { duration?: number } };
type HiddenState = { x?: number; y?: number };

describe('trail-animations (never-blank rule)', () => {
  const variants = { trailFadeUp, waypointPop, elevationSlideLeft, elevationSlideRight };

  it.each(Object.entries(variants))('%s hidden offset is ≤ 12px', (_name, v) => {
    const hidden = v.hidden as HiddenState;
    expect(Math.abs(hidden.x ?? 0)).toBeLessThanOrEqual(12);
    expect(Math.abs(hidden.y ?? 0)).toBeLessThanOrEqual(12);
  });

  it.each(Object.entries(variants))('%s visible duration is ≤ 0.35s', (_name, v) => {
    const visible = v.visible as VisibleState;
    // spring-based variants have no duration — that's fine; only check tweens
    if (visible.transition?.duration !== undefined) {
      expect(visible.transition.duration).toBeLessThanOrEqual(0.35);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/trail-animations.test.ts`
Expected: FAIL — `trailFadeUp` hidden y is 16 (> 12), `elevationSlideLeft/Right` x is ±30, durations are 0.5.

- [ ] **Step 3: Retune the variants**

Replace the whole of `lib/trail-animations.ts` with:

```ts
import type { Variants } from 'framer-motion';

/**
 * Never-blank rule (Field Journal spec §1.2): entrance animations use
 * offsets ≤ 12px and durations ≤ 0.35s so content is legible almost
 * immediately when it enters the viewport. Scroll-linked ambience (trail
 * line, parallax) carries the craft; entrances stay out of the way.
 */

export const trailFadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 },
  },
};

export const waypointPop: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 400, damping: 24 },
  },
};

/** Legacy names kept for call-site stability — now small-offset fades. */
export const elevationSlideLeft: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35 },
  },
};

export const elevationSlideRight: Variants = {
  hidden: { opacity: 0, x: 12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35 },
  },
};
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run lib/trail-animations.test.ts && npx vitest run components/`
Expected: PASS (variant consumers' tests unaffected — values only).

- [ ] **Step 5: Commit**

```bash
git add lib/trail-animations.ts lib/trail-animations.test.ts
git commit -m "feat(animations): retune shared variants to never-blank rule (≤12px, ≤0.35s)"
```

---

### Task 3: Color tokens, kicker copy, and AnimatedHeading kicker style

**Files:**

- Modify: `app/globals.css` (@theme block)
- Modify: `messages/en.json`, `messages/de.json`, `messages/es.json`, `messages/it.json`, `messages/ja.json`, `messages/zh.json` (new top-level `kickers` object)
- Modify: `components/ui/AnimatedHeading.tsx` (subtitle restyle)
- Modify: call sites: `components/sections/About.tsx:20`, `Experience.tsx:328`, `Projects.tsx:120`, `Endorsements.tsx:126`, `Skills.tsx:20`, `Services.tsx:94`, `Education.tsx:73`, `Contact.tsx:142`
- Test: `components/ui/AnimatedHeading.test.tsx`, `messages/locale-parity.test.ts` (existing, must keep passing)

**Interfaces:**

- Consumes: nothing new.
- Produces: CSS vars `--color-forest-deep`, `--color-gold-deep` (Tailwind classes `text-forest-deep`, `text-gold-deep`); `messages.kickers.{about,experience,projects,endorsements,skills,services,education,contact}: string` on the `Messages` type; `AnimatedHeading` `subtitle` prop unchanged in type, restyled serif-italic gold-deep.

- [ ] **Step 1: Add color tokens**

In `app/globals.css`, inside the `@theme { ... }` block after `--color-parchment-warm`, add:

```css
--color-forest-deep: #243325;
--color-gold-deep: #a67c0b;
```

- [ ] **Step 2: Add kicker strings to all six locale files**

Add a top-level `"kickers"` object to each `messages/*.json` (place it directly after the `"sections"` object). Exact values:

`en.json`:

```json
  "kickers": {
    "about": "the trailhead",
    "experience": "the trail log",
    "projects": "the vistas",
    "endorsements": "voices from the trail",
    "skills": "the pack",
    "services": "the lodge",
    "education": "the summit ledger",
    "contact": "end of trail"
  },
```

`de.json`:

```json
  "kickers": {
    "about": "der Ausgangspunkt",
    "experience": "das Wanderlogbuch",
    "projects": "die Aussichtspunkte",
    "endorsements": "Stimmen vom Weg",
    "skills": "die Ausrüstung",
    "services": "die Hütte",
    "education": "das Gipfelbuch",
    "contact": "das Wegende"
  },
```

`es.json`:

```json
  "kickers": {
    "about": "el punto de partida",
    "experience": "el diario de ruta",
    "projects": "los miradores",
    "endorsements": "voces del camino",
    "skills": "la mochila",
    "services": "el refugio",
    "education": "el libro de cumbre",
    "contact": "fin del sendero"
  },
```

`it.json`:

```json
  "kickers": {
    "about": "il punto di partenza",
    "experience": "il diario del sentiero",
    "projects": "i belvedere",
    "endorsements": "voci dal sentiero",
    "skills": "lo zaino",
    "services": "il rifugio",
    "education": "il libro di vetta",
    "contact": "fine del sentiero"
  },
```

`ja.json`:

```json
  "kickers": {
    "about": "登山口",
    "experience": "山行記録",
    "projects": "展望台",
    "endorsements": "道中の声",
    "skills": "装備",
    "services": "山小屋",
    "education": "登頂記録",
    "contact": "終点"
  },
```

`zh.json`:

```json
  "kickers": {
    "about": "起点",
    "experience": "行山日志",
    "projects": "观景点",
    "endorsements": "路上之声",
    "skills": "行囊",
    "services": "山屋",
    "education": "登顶簿",
    "contact": "终点"
  },
```

Note: if `lib/i18n.ts` derives the `Messages` type from `en.json` (`typeof en`), no type change is needed; if it declares an explicit interface, add `kickers: Record<'about'|'experience'|'projects'|'endorsements'|'skills'|'services'|'education'|'contact', string>` to it. Check `lib/i18n.ts` before editing.

- [ ] **Step 3: Run locale parity + typecheck to verify key consistency**

Run: `npx vitest run messages/locale-parity.test.ts && npm run typecheck`
Expected: PASS.

- [ ] **Step 4: Write failing AnimatedHeading test for kicker style**

Append to `components/ui/AnimatedHeading.test.tsx` (match the file's existing render helper — it uses plain `render` from testing-library):

```tsx
it('styles the subtitle as a serif-italic gold kicker', () => {
  render(<AnimatedHeading subtitle="I · the trailhead">Trail Guide</AnimatedHeading>);
  const kicker = screen.getByText('I · the trailhead');
  expect(kicker).toHaveClass('font-serif', 'italic', 'text-gold-deep');
});
```

Run: `npx vitest run components/ui/AnimatedHeading.test.tsx`
Expected: FAIL — subtitle currently has `text-stone ... uppercase`, not the kicker classes.

- [ ] **Step 5: Restyle the subtitle in AnimatedHeading**

In `components/ui/AnimatedHeading.tsx`, the subtitle `<m.p>` (line ~74) currently has:

```tsx
className = 'text-stone flex items-center gap-2 text-xs tracking-[0.2em] uppercase';
```

Replace with:

```tsx
className = 'text-gold-deep flex items-center gap-2 font-serif text-sm tracking-[0.2em] italic';
```

(Drop `uppercase`; keep `LeafAccent` and `aria-hidden`.) Also retune the three motion blocks in this file to the never-blank rule: subtitle `initial={{ opacity: 0, y: 12 }}` `transition={{ duration: 0.3 }}`; heading `initial={{ opacity: 0, y: 12 }}` `transition={{ duration: 0.35, delay: subtitle ? 0.05 : 0 }}`; underline `transition={{ duration: 0.4, delay: subtitle ? 0.25 : 0.15, ease: 'easeOut' }}`. Heading text color stays `text-forest` (sections that need parchment override via `[&_h2]:text-parchment`).

- [ ] **Step 6: Update all eight call sites to numeral + kicker**

Each section passes `subtitle` as `"{numeral} · {messages.kickers.<id>}"`. Exact edits (each component already has `messages` from `useLocaleContext()`):

- `About.tsx:20`: `subtitle="I."` → ``subtitle={`I · ${messages.kickers.about}`}``
- `Experience.tsx:328`: `subtitle="II."` → ``subtitle={`II · ${messages.kickers.experience}`}``
- `Projects.tsx:120`: `subtitle="IIb."` → ``subtitle={`IIb · ${messages.kickers.projects}`}``
- `Endorsements.tsx:126`: `subtitle="IIc."` → ``subtitle={`IIc · ${messages.kickers.endorsements}`}``
- `Skills.tsx:20`: `subtitle="III."` → ``subtitle={`III · ${messages.kickers.skills}`}``
- `Services.tsx:94`: `subtitle="IV."` → ``subtitle={`IV · ${messages.kickers.services}`}``
- `Education.tsx:73`: `subtitle="V."` → ``subtitle={`V · ${messages.kickers.education}`}``
- `Contact.tsx:142`: `subtitle="VI."` → ``subtitle={`VI · ${messages.kickers.contact}`}``

In `Skills.tsx` and `Contact.tsx` the heading has `[&_p]:text-gold` overrides — leave them (gold on dark is correct there).

- [ ] **Step 7: Run the full test suite**

Run: `npm run test`
Expected: PASS. If a section test asserted the old subtitle text (e.g. `"I."`), update that assertion to the new format (`/I · /`).

- [ ] **Step 8: Commit**

```bash
git add app/globals.css messages/*.json components/ui/AnimatedHeading.tsx components/ui/AnimatedHeading.test.tsx components/sections/*.tsx lib/i18n.ts
git commit -m "feat(theme): add forest-deep/gold-deep tokens and serif-italic section kickers"
```

---

### Task 4: Card map-plate variant

**Files:**

- Modify: `components/ui/Card.tsx`
- Test: `components/ui/Card.test.tsx`

**Interfaces:**

- Consumes: existing `Card` props.
- Produces: `Card` accepts `variant?: 'default' | 'map' | 'plate'`. Plate = light fill, bark border, gold corner tick (via `before:` pseudo-element), used by Tasks 5–7 and 11–13.

- [ ] **Step 1: Write the failing test**

Append to `components/ui/Card.test.tsx`:

```tsx
it('applies plate variant (map-plate: light fill + gold corner tick)', () => {
  const { container } = render(<Card variant="plate">Plate card</Card>);
  const card = container.firstElementChild!;
  expect(card).toHaveClass('bg-white/40', 'border-bark/15');
  expect(card.className).toContain('before:bg-gold');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/ui/Card.test.tsx`
Expected: FAIL — `'plate'` is not a valid variant / classes missing.

- [ ] **Step 3: Implement the plate variant**

Replace `components/ui/Card.tsx` with:

```tsx
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Trail-map styles:
   * - map: dashed boundary (map area)
   * - plate: map-plate — lighter fill, bark border, gold corner tick
   */
  variant?: 'default' | 'map' | 'plate';
}

export function Card({ children, className, variant = 'default' }: CardProps) {
  return (
    <div
      className={cn(
        'group/card border-bark/10 bg-sand/40 hover:border-gold/30 relative rounded-lg border p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_4px_24px_rgba(107,127,94,0.12),0_1px_8px_rgba(184,134,11,0.08)]',
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:opacity-0 after:transition-opacity after:content-[''] hover:after:animate-[topo-pulse_0.6s_ease-out]",
        variant === 'map' && 'border-bark/20 border-dashed',
        variant === 'plate' &&
          'border-bark/15 before:bg-gold bg-white/40 before:absolute before:top-0 before:left-4 before:h-0.5 before:w-6 before:content-[""]',
        className,
      )}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run components/ui/Card.test.tsx`
Expected: PASS (all, including existing default/map tests).

- [ ] **Step 5: Commit**

```bash
git add components/ui/Card.tsx components/ui/Card.test.tsx
git commit -m "feat(card): add map-plate variant with gold corner tick"
```

---

### Task 5: About — stat plates, compass watermark, tightened spacing

**Files:**

- Modify: `components/sections/About.tsx`
- Test: `components/sections/About.test.tsx`

**Interfaces:**

- Consumes: `Card` `variant="plate"` (Task 4), retuned `waypointPop` (Task 2), kicker (Task 3, already applied).
- Produces: no API change.

- [ ] **Step 1: Write the failing test**

Append to `components/sections/About.test.tsx` (it uses `renderWithLocale`):

```tsx
it('renders stat tiles as map plates with gold-deep numerals', () => {
  renderWithLocale(<About />);
  const statValue = screen.getByText('10+');
  expect(statValue).toHaveClass('text-gold-deep', 'font-serif');
  // plate recipe applied to the tile container
  expect(statValue.closest('.bg-white\\/40')).not.toBeNull();
});
```

Run: `npx vitest run components/sections/About.test.tsx` — Expected: FAIL.

- [ ] **Step 2: Rework the stats grid**

In `components/sections/About.tsx`, add the import:

```tsx
import { Card } from '@/components/ui/Card';
```

Replace the stats grid block (lines ~36–50) with:

```tsx
{
  /* Stats as map plates */
}
<div className="mt-8 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
  {messages.about.stats.map((stat, i) => (
    <m.div
      key={stat.label}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={waypointPop}
      transition={{ delay: 0.1 + i * 0.06 }}
    >
      <Card variant="plate" className="px-4 py-3 text-center">
        <div className="text-gold-deep font-serif text-4xl font-bold">{stat.value}</div>
        <div className="text-forest-deep mt-1 text-xs">{stat.label}</div>
      </Card>
    </m.div>
  ))}
</div>;
```

- [ ] **Step 3: Add the compass watermark and tighten spacing**

Inside the `<Section ...>` in `About.tsx`, directly after `<AnimatedHeading ...>...</AnimatedHeading>`, add:

```tsx
{
  /* Compass-rose watermark fills the right-side dead space (desktop only) */
}
<svg
  aria-hidden="true"
  viewBox="0 0 100 100"
  className="text-bark pointer-events-none absolute top-24 right-8 hidden h-52 w-52 opacity-[0.06] lg:block"
>
  <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1" />
  <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth="0.5" />
  <path d="M50 6 L54 46 L50 42 L46 46 Z" fill="currentColor" />
  <path d="M50 94 L54 54 L50 58 L46 54 Z" fill="currentColor" opacity="0.5" />
  <path d="M6 50 L46 46 L42 50 L46 54 Z" fill="currentColor" opacity="0.5" />
  <path d="M94 50 L54 46 L58 50 L54 54 Z" fill="currentColor" opacity="0.5" />
  <text
    x="50"
    y="16"
    textAnchor="middle"
    fontSize="8"
    fill="currentColor"
    fontFamily="var(--font-serif)"
  >
    N
  </text>
</svg>;
```

Also change the `<Section ...>` for About to add `className="md:pb-16"` (tightens the default `md:py-24` bottom padding), and retune the two trailing `m.p`/`m.div` blocks (personal closer, focus pills) to `transition={{ duration: 0.35, delay: 0.25 }}` and `transition={{ duration: 0.35, delay: 0.3 }}` respectively; the pull-quote to `initial={{ opacity: 0, y: 12 }}` `transition={{ duration: 0.35, delay: 0.05 }}`.

- [ ] **Step 4: Run tests**

Run: `npx vitest run components/sections/About.test.tsx`
Expected: PASS. If an existing test asserted the old tile classes (`border-dashed`), update it to the plate expectation.

- [ ] **Step 5: Commit**

```bash
git add components/sections/About.tsx components/sections/About.test.tsx
git commit -m "feat(about): map-plate stat tiles, compass watermark, tightened rhythm"
```

---

### Task 6: Experience — single-column trail log

**Files:**

- Modify: `components/sections/Experience.tsx` (major rewrite of `TimelineCard`/`CardContent`; `TrailProfileGraph`, `ExperienceDetailPanel`, and the outer `Experience` shell largely stay)
- Test: `components/sections/Experience.test.tsx`

**Interfaces:**

- Consumes: `Card` `variant="plate"` (Task 4).
- Produces: same exported `Experience`. Keeps `data-testid={'experience-card-' + entry.id}` on each entry's hoverable wrapper (existing tests rely on it). Detail panel now always renders on the right (`side="right"`).

**Design:** one column. Each entry is `grid grid-cols-[32px_1fr] gap-x-4 md:gap-x-6`: left cell holds a continuous dashed line + a numbered gold marker; right cell holds the plate card, `max-w-3xl` so the fixed detail panel has room on wide screens. All text left-aligned. Date range rendered as a trail-distance line.

- [ ] **Step 1: Update the tests first**

In `components/sections/Experience.test.tsx`: find assertions tied to the two-column layout (e.g. checking for duplicate desktop/mobile cards, `text-right`, or left/right side logic) and replace with single-column expectations. Add:

```tsx
it('renders each featured entry exactly once with a numbered marker', () => {
  renderWithLocale(<Experience />);
  const featured = experiences.filter((e) => e.featured);
  for (const [i, entry] of featured.entries()) {
    const cards = screen.getAllByTestId(`experience-card-${entry.id}`);
    expect(cards).toHaveLength(1);
    expect(screen.getByText(String(i + 1))).toBeInTheDocument();
  }
});

it('has no right-aligned prose', () => {
  const { container } = renderWithLocale(<Experience />);
  expect(container.querySelector('.text-right')).toBeNull();
});
```

(Import `experiences` from `@/data/experience` at the top if not already imported.)

Run: `npx vitest run components/sections/Experience.test.tsx` — Expected: FAIL (two cards per entry today, `text-right` present).

- [ ] **Step 2: Rewrite TimelineCard and CardContent**

In `components/sections/Experience.tsx`, delete the current `TimelineCard` and `CardContent` functions and replace with:

```tsx
function EntryMarker({ number }: { number: number }) {
  return (
    <div className="border-gold bg-parchment text-gold-deep relative z-10 mt-5 flex h-6 w-6 items-center justify-center rounded-full border font-serif text-xs font-semibold">
      {number}
    </div>
  );
}

function TimelineCard({
  entry,
  number,
  onHover,
}: {
  entry: (typeof experiences)[number];
  number: number;
  onHover: (e: ExperienceEntry | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const handleEnter = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches) {
      onHover(entry);
    }
  };
  const handleLeave = () => onHover(null);

  return (
    <div ref={ref} className="group/timeline grid grid-cols-[32px_1fr] gap-x-4 md:gap-x-6">
      {/* Trail line + numbered marker */}
      <div className="relative flex justify-center">
        <div className="border-gold/40 absolute inset-y-0 left-1/2 w-px -translate-x-1/2 border-l border-dashed" />
        <EntryMarker number={number} />
      </div>

      {/* Entry card */}
      <div
        className="max-w-3xl min-w-0"
        data-testid={`experience-card-${entry.id}`}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onClick={handleEnter}
      >
        <m.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.35 }}
          className="transition-transform duration-300 group-hover/timeline:translate-x-1"
        >
          <Card variant="plate">
            <CardContent entry={entry} isInView={isInView} />
          </Card>
        </m.div>
      </div>
    </div>
  );
}

function CardContent({
  entry,
  isInView,
}: {
  entry: (typeof experiences)[number];
  isInView: boolean;
}) {
  return (
    <div>
      <h3 className="text-forest-deep font-serif text-xl font-semibold">{entry.company}</h3>
      <p className="text-bark text-sm">{entry.position}</p>
      {/* Trail-distance date range */}
      <p className="text-stone flex items-center gap-1.5 text-xs">
        {entry.startDate}
        <span aria-hidden="true" className="bg-gold/40 inline-block h-px w-6" />
        <span
          aria-hidden="true"
          className="border-gold/40 -ml-1.5 inline-block border-y-2 border-l-4 border-y-transparent"
        />
        {entry.endDate}
      </p>

      <ul className="text-bark mt-3 list-inside list-disc space-y-1 text-sm leading-relaxed">
        {entry.description.slice(0, 3).map((item, i) => (
          <m.li
            key={item}
            initial={{ opacity: 0, y: 8 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.3, delay: 0.05 + i * 0.06 }}
          >
            {item}
          </m.li>
        ))}
      </ul>

      {entry.techStack.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {entry.techStack.map((tech, j) => (
            <m.span
              key={tech}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.25, delay: 0.15 + j * 0.04 }}
              whileHover={{ scale: 1.05 }}
              className="inline-block"
            >
              <Badge>{tech}</Badge>
            </m.span>
          ))}
        </div>
      )}

      {/* Inline trail elevation profile */}
      <div className="border-bark/10 mt-3 overflow-hidden rounded-md border">
        <TrailProfileGraph
          id={`inline-${entry.id}`}
          count={entry.description.length + entry.techStack.length}
          className="h-10"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Update the Experience shell**

In `Experience()`:

1. The detail panel is now always on the right — replace the `side={...}` expression with `side="right"` in the `<ExperienceDetailPanel ...>` call.
2. Featured list: replace `index={i}` with `number={i + 1}`:

```tsx
<div className="flex flex-col gap-2">
  {featuredExperiences.map((entry, i) => (
    <TimelineCard key={entry.id} entry={entry} number={i + 1} onHover={setHoveredEntry} />
  ))}
</div>
```

(`gap-2`, not `gap-8` — the continuous line closes the gaps visually.)

3. Older-history list: `index={featuredExperiences.length + i}` → `number={featuredExperiences.length + i + 1}`, and its wrapper `div` also becomes `className="mt-8 flex flex-col gap-2"`.

- [ ] **Step 4: Run tests**

Run: `npx vitest run components/sections/Experience.test.tsx`
Expected: PASS (new + surviving existing tests). Then run `npm run lint && npm run typecheck` — the removed `cn`/`AnimatePresence` style imports may now be unused; delete any unused imports it flags.

- [ ] **Step 5: Browser spot-check**

`npm run dev`, scroll through Trail Log at desktop width: single column, numbered markers 1–N, continuous dashed line, hover shows the detail panel on the right without covering the hovered card. Stop the server.

- [ ] **Step 6: Commit**

```bash
git add components/sections/Experience.tsx components/sections/Experience.test.tsx
git commit -m "feat(experience): single-column trail log with numbered markers and plate cards"
```

---

### Task 7: Services — 2×2 map-plate grid

**Files:**

- Modify: `components/sections/Services.tsx`
- Test: `components/sections/Services.test.tsx`

**Interfaces:**

- Consumes: `Card` `variant="plate"`, `trailFadeUp`.
- Produces: same exported `Services`. The five `*Illustration` components and `illustrationMap` are deleted.

- [ ] **Step 1: Update tests first**

In `components/sections/Services.test.tsx`, remove/replace assertions about alternating layout or illustrations, and add:

```tsx
it('renders services in a grid of plate cards, all left-aligned', () => {
  const { container } = renderWithLocale(<Services />);
  expect(container.querySelector('.md\\:grid-cols-2')).not.toBeNull();
  expect(container.querySelector('.md\\:text-right')).toBeNull();
  expect(container.querySelectorAll('.bg-white\\/40').length).toBeGreaterThanOrEqual(4);
});
```

Run: `npx vitest run components/sections/Services.test.tsx` — Expected: FAIL.

- [ ] **Step 2: Rewrite the component**

Replace the body of `components/sections/Services.tsx` below the `iconMap` definition (delete all `*Illustration` functions and `illustrationMap`; also drop the now-unused `elevationSlideLeft`, `elevationSlideRight`, `cn` imports and add `Card` + `trailFadeUp`):

```tsx
export function Services() {
  const { messages } = useLocaleContext();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <Section variant="light" id="services" tone="dusk" mapFrame nature={{ leaves: true }}>
      <AnimatedHeading sectionId="services" subtitle={`IV · ${messages.kickers.services}`}>
        {messages.sections.services}
      </AnimatedHeading>

      <div ref={ref} className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        {services.map((service, i) => {
          const Icon = iconMap[service.icon];

          return (
            <m.div
              key={service.id}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={trailFadeUp}
              transition={{ delay: i * 0.06 }}
            >
              <Card variant="plate" className="h-full">
                <div className="bg-gold/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                  {Icon && <Icon className="text-gold-deep h-6 w-6" />}
                </div>
                <h3 className="text-forest-deep font-serif text-xl font-semibold">
                  {service.title}
                </h3>
                <p className="text-bark mt-2 text-sm">{service.description}</p>
              </Card>
            </m.div>
          );
        })}
      </div>
    </Section>
  );
}
```

(The `subtitle` here already includes the kicker from Task 3 — if Task 3 was applied first this line is unchanged.)

- [ ] **Step 3: Run tests + lint**

Run: `npx vitest run components/sections/Services.test.tsx && npm run lint`
Expected: PASS, no unused-import warnings.

- [ ] **Step 4: Commit**

```bash
git add components/sections/Services.tsx components/sections/Services.test.tsx
git commit -m "feat(services): replace alternating rows with 2x2 map-plate grid"
```

---

### Task 8: Trail through-line — shared position, stronger line, numbered waypoints

**Files:**

- Create: `lib/trail-position.ts`
- Modify: `components/ui/TrailExtension.tsx`, `components/ui/TrailWaypoints.tsx`
- Test: Create `lib/trail-position.test.ts`; update `components/ui/TrailExtension.test.tsx`

**Interfaces:**

- Consumes: `useActiveSection`/`SECTION_IDS` from `hooks/useActiveSection.ts` (unchanged).
- Produces: `lib/trail-position.ts` exports `TRAIL_GUTTER_CLASS: string` — the shared positioning classes both trail components apply, and `SECTION_NUMERALS: Record<string, string>`.

- [ ] **Step 1: Write the failing test**

Create `lib/trail-position.test.ts`:

```ts
import { TRAIL_GUTTER_CLASS, SECTION_NUMERALS } from './trail-position';
import { SECTION_IDS } from '@/hooks/useActiveSection';

describe('trail-position', () => {
  it('positions the trail against the content column, not the viewport edge', () => {
    expect(TRAIL_GUTTER_CLASS).toContain('1024px'); // max-w-5xl
  });

  it('has a numeral for every non-hero section', () => {
    for (const id of SECTION_IDS.filter((s) => s !== 'hero')) {
      expect(SECTION_NUMERALS[id]).toBeTruthy();
    }
  });
});
```

Run: `npx vitest run lib/trail-position.test.ts` — Expected: FAIL (module not found).

- [ ] **Step 2: Create the shared module**

Create `lib/trail-position.ts`:

```ts
/**
 * Shared positioning for the trail through-line (TrailExtension) and its
 * waypoints (TrailWaypoints). One constant so the two can't drift apart.
 * Desktop: sits just left of the max-w-5xl (1024px) content column.
 * Mobile: hugs the viewport's left edge.
 */
export const TRAIL_GUTTER_CLASS =
  'pointer-events-none fixed inset-y-0 left-0 z-0 w-5 md:left-[max(0.5rem,calc((100vw-1024px)/2-2.5rem))] md:w-6';

/** Numerals match the section kickers ("I · the trailhead" etc.). */
export const SECTION_NUMERALS: Record<string, string> = {
  about: 'I',
  experience: 'II',
  projects: 'IIb',
  endorsements: 'IIc',
  skills: 'III',
  services: 'IV',
  education: 'V',
  contact: 'VI',
};
```

Run: `npx vitest run lib/trail-position.test.ts` — Expected: PASS.

- [ ] **Step 3: Upgrade TrailExtension**

Replace the wrapper `div` className in `components/ui/TrailExtension.tsx` with the shared constant and strengthen the stroke:

```tsx
import { TRAIL_GUTTER_CLASS } from '@/lib/trail-position';
```

```tsx
<div aria-hidden className={TRAIL_GUTTER_CLASS}>
  <svg className="h-full w-full" viewBox="0 0 24 100" preserveAspectRatio="none">
    <m.path
      d="M 12 0 L 12 100"
      fill="none"
      stroke="rgba(184,134,11,0.5)"
      strokeWidth="3"
      strokeDasharray="6 6"
      strokeLinecap="round"
      style={{ pathLength }}
    />
  </svg>
</div>
```

Update `components/ui/TrailExtension.test.tsx` if it asserts the old stroke values (`0.3` opacity / `2.5` width) — change to the new values.

- [ ] **Step 4: Upgrade TrailWaypoints to numbered markers**

In `components/ui/TrailWaypoints.tsx`:

1. Add imports:

```tsx
import { TRAIL_GUTTER_CLASS, SECTION_NUMERALS } from '@/lib/trail-position';
```

2. Replace the outer wrapper's className with `{TRAIL_GUTTER_CLASS}` (keep `aria-hidden="true"`).
3. Replace the per-waypoint render (the `svg` circle block) with a numbered marker:

```tsx
return (
  <div key={id} className="absolute left-1/2 -translate-x-1/2" style={{ top: `${top * 100}%` }}>
    <div
      className={cn(
        'flex h-5 w-5 items-center justify-center rounded-full border font-serif text-[9px] font-semibold transition-all duration-300',
        isActive
          ? 'border-gold bg-gold text-forest shadow-[0_0_6px_rgba(184,134,11,0.5)]'
          : isPassed
            ? 'border-gold/60 bg-gold/60 text-forest'
            : 'border-gold/40 bg-parchment text-gold-deep',
      )}
    >
      {SECTION_NUMERALS[id] ?? ''}
    </div>
  </div>
);
```

- [ ] **Step 5: Run tests**

Run: `npx vitest run lib/trail-position.test.ts components/ui/TrailExtension.test.tsx && npm run typecheck`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/trail-position.ts lib/trail-position.test.ts components/ui/TrailExtension.tsx components/ui/TrailExtension.test.tsx components/ui/TrailWaypoints.tsx
git commit -m "feat(trail): move through-line to content column with numbered waypoint markers"
```

---

### Task 9: Divider — trail crossing dots

**Files:**

- Modify: `components/ui/Divider.tsx`
- Test: `components/ui/Divider.test.tsx`

**Interfaces:**

- Consumes: `TRAIL_GUTTER_CLASS` positioning idea (the dot uses the same left offset formula, but absolute within the divider, not fixed).
- Produces: no API change; `mountains`/`treeline` dividers render a small gold crossing dot.

- [ ] **Step 1: Write the failing test**

Append to `components/ui/Divider.test.tsx`:

```tsx
it('renders a trail crossing dot on mountain and treeline dividers', () => {
  const { container: mountains } = render(<Divider variant="mountains" />);
  expect(mountains.querySelector('[data-trail-crossing]')).not.toBeNull();

  const { container: trail } = render(<Divider variant="trail" />);
  expect(trail.querySelector('[data-trail-crossing]')).toBeNull();
});
```

Run: `npx vitest run components/ui/Divider.test.tsx` — Expected: FAIL.

- [ ] **Step 2: Add the crossing dot**

In `components/ui/Divider.tsx`, inside the returned wrapper `div` (after the three variant renders), add:

```tsx
{
  (variant === 'mountains' || variant === 'treeline') && (
    <div
      data-trail-crossing
      aria-hidden="true"
      className="bg-gold/70 absolute top-1/2 left-[calc(0.5rem+10px)] h-2 w-2 -translate-y-1/2 rounded-full shadow-[0_0_4px_rgba(184,134,11,0.4)] md:left-[calc(max(0.5rem,calc((100vw-1024px)/2-2.5rem))+12px)]"
    />
  );
}
```

(The `+10px`/`+12px` centers the dot on the trail line's x within the `w-5`/`w-6` gutter of `TRAIL_GUTTER_CLASS`.)

- [ ] **Step 3: Run tests + commit**

Run: `npx vitest run components/ui/Divider.test.tsx`
Expected: PASS.

```bash
git add components/ui/Divider.tsx components/ui/Divider.test.tsx
git commit -m "feat(divider): gold crossing dot where the trail line crosses each ridge"
```

---

### Task 10: Hero — readable map, no frame clip, 2s choreography

**Files:**

- Modify: `components/sections/Hero.tsx`
- Test: `components/sections/Hero.test.tsx` (existing tests keep passing; timing/opacity are visual)

**Interfaces:** no API change.

- [ ] **Step 1: Remove the dashed map-frame rect**

In `components/sections/Hero.tsx`, delete the entire `<m.rect ... strokeDasharray="12 8" ... />` block (the "Map frame – reads as a trail map" element, lines ~155–172). Keep the "TRAIL MAP" label `<m.g>` but change its transition delay from `1.2` to `0.6`.

- [ ] **Step 2: Raise map opacities (~1.5×)**

Exact replacements in the hero SVG:

| Element                 | Old                      | New                      |
| ----------------------- | ------------------------ | ------------------------ |
| Main trail stroke       | `rgba(245,240,232,0.22)` | `rgba(245,240,232,0.33)` |
| Marker groups class     | `text-parchment/20`      | `text-parchment/30`      |
| Contour group A strokes | `0.12 / 0.10 / 0.08`     | `0.18 / 0.15 / 0.12`     |
| Contour group B strokes | `0.10 / 0.08 / 0.06`     | `0.15 / 0.12 / 0.09`     |
| Contour group C strokes | `0.10 / 0.08`            | `0.15 / 0.12`            |
| Contour group D strokes | `0.08 / 0.06`            | `0.12 / 0.09`            |
| Secondary trail paths   | `rgba(245,240,232,0.07)` | `rgba(245,240,232,0.11)` |
| Trail-continues path    | `rgba(245,240,232,0.12)` | `rgba(245,240,232,0.18)` |
| Far mountains fill      | `rgba(245,240,232,0.06)` | `rgba(245,240,232,0.09)` |
| Near mountains fill     | `rgba(245,240,232,0.10)` | `rgba(245,240,232,0.15)` |
| Treeline fill           | `rgba(245,240,232,0.08)` | `rgba(245,240,232,0.12)` |

- [ ] **Step 3: Shorten the choreography to ~2s total**

| Element             | Old transition                              | New transition                             |
| ------------------- | ------------------------------------------- | ------------------------------------------ |
| Main trail draw     | `duration: 3.5, delay: 0.5`                 | `duration: 1.7, delay: 0.3`                |
| Markers             | `delay: marker.delay`                       | `delay: Math.min(marker.delay * 0.5, 1.6)` |
| Secondary path i=0  | `duration: 4, delay: 1.2`                   | `duration: 1.5, delay: 0.4`                |
| Secondary path i=1  | `duration: 3.8, delay: 1.8`                 | `duration: 1.5, delay: 0.6`                |
| Trail-continues     | `duration: 1.2, delay: 2.5`                 | `duration: 0.8, delay: 1.2`                |
| Mountain layers (3) | `duration: 1.5/1.5/1.2, delay: 0.3/0.6/0.9` | `duration: 0.8, delay: 0.2/0.35/0.5`       |

Update the L2 timing comment above the trail-continues path to reflect the new numbers (all draw-on work finishes by ~2.0s).

- [ ] **Step 4: Run tests + browser check**

Run: `npx vitest run components/sections/Hero.test.tsx`
Expected: PASS. Then `npm run dev`: hero map visibly reads as a topographic map; full animation settles ~2s; no clipped dashed frame at the viewport edges; the tagline swap doesn't shift the CTA buttons (AutoHeight already handles this — verify only). Stop the server.

- [ ] **Step 5: Commit**

```bash
git add components/sections/Hero.tsx
git commit -m "feat(hero): raise map legibility, drop clipped frame, tighten draw-on to ~2s"
```

---

### Task 11: Endorsements — plate cards + marquee edge masks

**Files:**

- Modify: `components/sections/Endorsements.tsx`
- Test: `components/sections/Endorsements.test.tsx`

**Interfaces:** consumes `Card` `variant="plate"`; no API change.

- [ ] **Step 1: Write the failing test**

Append to `components/sections/Endorsements.test.tsx`:

```tsx
it('renders endorsement cards as map plates', () => {
  const { container } = renderWithLocale(<Endorsements />);
  expect(container.querySelectorAll('.bg-white\\/40').length).toBeGreaterThan(0);
});
```

Run: `npx vitest run components/sections/Endorsements.test.tsx` — Expected: FAIL.

- [ ] **Step 2: Apply plates and masks**

In `components/sections/Endorsements.tsx`:

1. `EndorsementCard`'s `<Card className="group hover:border-gold/40 ...">` → `<Card variant="plate" className="group hover:border-gold/40 relative overflow-hidden transition-all duration-300">`.
2. The desktop marquee wrapper `className="hidden overflow-hidden md:block"` becomes:

```tsx
          <div className="hidden overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] md:block">
```

- [ ] **Step 3: Run tests + commit**

Run: `npx vitest run components/sections/Endorsements.test.tsx`
Expected: PASS.

```bash
git add components/sections/Endorsements.tsx components/sections/Endorsements.test.tsx
git commit -m "feat(endorsements): plate cards and marquee edge fade masks"
```

---

### Task 12: Skills — legend headers + elevation profile

**Files:**

- Modify: `components/sections/Skills.tsx`
- Test: `components/sections/Skills.test.tsx`

**Interfaces:** no API change.

- [ ] **Step 1: Write the failing test**

Append to `components/sections/Skills.test.tsx`:

```tsx
it('renders category names as map-legend headers with rule lines', () => {
  const { container } = renderWithLocale(<Skills />);
  const header = container.querySelector('h3');
  expect(header?.querySelector('[data-legend-rule]')).not.toBeNull();
});
```

Run: `npx vitest run components/sections/Skills.test.tsx` — Expected: FAIL.

- [ ] **Step 2: Legend headers**

In `components/sections/Skills.tsx`, replace the category `<h3>`:

```tsx
<h3 className="text-gold mb-3 flex items-center gap-3 text-sm font-semibold tracking-wider uppercase">
  <span data-legend-rule aria-hidden="true" className="bg-gold/40 h-px w-6" />
  {category.name}
  <span aria-hidden="true" className="bg-gold/40 h-px flex-1" />
</h3>
```

- [ ] **Step 3: Elevation profile along the section bottom**

Directly before the closing `</Section>` tag, add:

```tsx
{
  /* Elevation cross-section fills the section's lower dead space */
}
<svg
  aria-hidden="true"
  viewBox="0 0 1200 100"
  preserveAspectRatio="none"
  className="pointer-events-none absolute inset-x-0 bottom-0 h-20 w-full"
>
  <path
    d="M0 100 L0 70 L120 45 L240 65 L360 30 L480 55 L600 20 L720 50 L840 35 L960 60 L1080 40 L1200 55 L1200 100 Z"
    fill="rgba(245,240,232,0.06)"
  />
  <path
    d="M0 70 L120 45 L240 65 L360 30 L480 55 L600 20 L720 50 L840 35 L960 60 L1080 40 L1200 55"
    fill="none"
    stroke="rgba(245,240,232,0.10)"
    strokeWidth="1.5"
  />
</svg>;
```

Also retune the category `m.div` to `transition={{ duration: 0.35, delay: i * 0.06 }}` and `initial={{ opacity: 0, y: 12 }}`.

- [ ] **Step 4: Run tests + commit**

Run: `npx vitest run components/sections/Skills.test.tsx`
Expected: PASS.

```bash
git add components/sections/Skills.tsx components/sections/Skills.test.tsx
git commit -m "feat(skills): map-legend category headers and elevation profile backdrop"
```

---

### Task 13: Education plates + Contact terminus

**Files:**

- Modify: `components/sections/Education.tsx`, `components/sections/Contact.tsx`
- Test: `components/sections/Education.test.tsx`, `components/sections/Contact.test.tsx`

**Interfaces:** no API changes.

- [ ] **Step 1: Write the failing tests**

Append to `components/sections/Education.test.tsx`:

```tsx
it('renders certification chips with plate styling', () => {
  const { container } = renderWithLocale(<Education />);
  expect(container.querySelectorAll('.border-bark\\/15').length).toBeGreaterThan(0);
});
```

Append to `components/sections/Contact.test.tsx`:

```tsx
it('renders the end-of-trail cairn beside the direct links', () => {
  const { container } = renderWithLocale(<Contact />);
  expect(container.querySelector('[data-cairn]')).not.toBeNull();
});
```

Run: `npx vitest run components/sections/Education.test.tsx components/sections/Contact.test.tsx` — Expected: FAIL.

- [ ] **Step 2: Education plate treatment**

In `components/sections/Education.tsx`, the certification chip `m.div` className:

```tsx
className = 'border-bark/20 bg-sand inline-flex items-center gap-2 rounded-full border px-3 py-1.5';
```

becomes:

```tsx
className =
  'border-bark/15 bg-white/40 inline-flex items-center gap-2 rounded-full border px-3 py-1.5';
```

And the `EducationRow` degree span `text-forest` → `text-forest-deep`. Chip `transition={{ delay: education.length * 0.1 + i * 0.1 }}` → `transition={{ delay: education.length * 0.06 + i * 0.06 }}`.

- [ ] **Step 3: Contact cairn terminus**

In `components/sections/Contact.tsx`, inside the right-column `m.div` (after the `.space-y-1` links block closes), add:

```tsx
{
  /* End-of-trail cairn — designed terminus for the empty column space */
}
<div data-cairn aria-hidden="true" className="mt-12 hidden flex-col items-center gap-3 md:flex">
  <svg viewBox="0 0 60 64" className="text-parchment/25 h-16 w-16">
    <ellipse cx="30" cy="58" rx="22" ry="6" fill="currentColor" opacity="0.5" />
    <ellipse cx="30" cy="48" rx="17" ry="7" fill="currentColor" opacity="0.7" />
    <ellipse cx="30" cy="37" rx="13" ry="6" fill="currentColor" opacity="0.85" />
    <ellipse cx="30" cy="27" rx="9" ry="5" fill="currentColor" />
    <ellipse cx="30" cy="19" rx="5" ry="3.5" fill="currentColor" />
  </svg>
  <div className="text-stone flex items-center gap-3 text-xs tracking-[0.3em] uppercase">
    <span className="bg-stone/40 h-px w-8" />
    {messages.footer.endOfTrail}
    <span className="bg-stone/40 h-px w-8" />
  </div>
</div>;
```

Note: the "END OF TRAIL" string already exists in the footer — find its message key (grep `endOfTrail` or "End of Trail" in `messages/en.json` and the footer component). If it lives in a footer messages object with a different key, use that key here instead of `messages.footer.endOfTrail`. Do **not** remove it from the footer; the cairn is an additional motif, not a move (footer keeps its rule line).

- [ ] **Step 4: Run tests + commit**

Run: `npx vitest run components/sections/Education.test.tsx components/sections/Contact.test.tsx`
Expected: PASS.

```bash
git add components/sections/Education.tsx components/sections/Contact.tsx components/sections/Education.test.tsx components/sections/Contact.test.tsx
git commit -m "feat(education,contact): plate accents and end-of-trail cairn terminus"
```

---

### Task 14: Full verification pass

**Files:** none (verification only; fix-forward anything found).

- [ ] **Step 1: Run the full gate**

Run: `npm run lint && npm run typecheck && npm run test && npm run build`
Expected: all PASS. Fix any failures before proceeding (each fix amends the task's commit or gets its own `fix:` commit).

- [ ] **Step 2: Browser pass — desktop**

`npm run dev`, open `http://localhost:3000/en` at ~1440px wide:

- Console: no hydration errors on fresh load.
- Hero: map legible, animation settles ~2s, no clipped frame, tagline rotation doesn't shift CTAs.
- Scroll the full page at normal speed AND with fast flicks: no section ever appears blank for more than an instant.
- Trail line: visible beside the content column, draws with scroll; numbered waypoints fill as passed; divider crossing dots align with the line.
- Trail Log: single column, plate cards, hover detail panel on the right.
- All sections: kickers render as serif-italic gold; no right-aligned prose anywhere.

- [ ] **Step 3: Browser pass — mobile + reduced motion**

Resize to 375px: trail line hugs the left edge without overlapping content; Services stacks single-column; marquee fallback (horizontal snap scroll) intact. Then enable reduced motion (macOS: System Settings → Accessibility → Display → Reduce motion, or devtools rendering emulation): every section renders fully, statically, on load.

- [ ] **Step 4: Final commit (if any fixes were made) and wrap up**

```bash
git status   # confirm clean tree
```

Report results with the superpowers:verification-before-completion skill before claiming done.
