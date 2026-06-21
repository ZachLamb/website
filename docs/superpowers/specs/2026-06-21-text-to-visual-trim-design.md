# Text-to-Visual Trim Design Spec

**Goal:** Reduce text heaviness across the portfolio site by replacing dense paragraphs with visual communication — stats, chips, and collapsible sections — while preserving all content for users who want the full picture.

**Scope:** Three sections — About, Experience, Skills. All other sections (Services, Education, Endorsements, Contact, Hero) are unchanged.

**Approach:** Surgical Trim + Smart Visuals. Keep the current section structure and theme; make targeted replacements where text can be communicated faster visually.

## Global Constraints

- All changes must work across all 6 locales (`en`, `es`, `de`, `it`, `ja`, `zh`)
- Respect `prefers-reduced-motion` — entrance animations use Framer Motion which already honors the global CSS reset
- Mobile-first: all layouts must work at 360px. Grid layouts collapse to single column on mobile.
- No new dependencies
- Existing data files (`data/skills.ts`, `data/experience.ts`) retain their current shape — display logic changes, not data structure changes (exception: adding a `featured` field to experience entries)
- The contour texture backgrounds, nature elements, and section dividers are unchanged
- `Messages` type is inferred from `en.json` via `lib/i18n.ts` — all locale files must have identical key structure

---

## Section 1: About — Stats Row

### Current State
Two dense paragraphs (~150 words each) + focus area pills. The pull-quote first paragraph is styled nicely but the second paragraph is a wall of text that buries key facts.

### Design

**Keep:**
- Pull-quote first paragraph with gold left border, trimmed to **sentence 1 only**: "I'm a Technical Product Manager with a frontend engineering background, which means I own the roadmap, run the team, and can still go deep on the technical decisions that actually matter."
- Focus area pills unchanged

**Replace paragraph 2 with a stats grid:**

Four stat cards in a responsive grid (4 columns desktop, 2×2 mobile):

| Stat | Value | Label |
|------|-------|-------|
| Years | `10+` | Years Building |
| Industries | `5` | Industries |
| Certification | `CSM` | Certified |
| Role style | `IC↔PM` | Dual Track |

Each card: gold large value text (`font-serif text-3xl font-bold text-gold`), small stone-colored label below (`text-stone text-xs`). Dashed `border-gold/30` border, `rounded-lg`. Animated entrance on scroll (staggered per card via Framer Motion).

Both stat values and labels are i18n message keys so CJK locales can adjust formatting (e.g. `10+` → `10年+` in Japanese).

**Add a short italic personal closer** below the stats grid:
> When I'm not at my desk, I'm teaching yoga, hiking Colorado's trails, or trying to settle the Oreo debate once and for all.

This is the last sentence from the current paragraph 2 — keeps the personality without the surrounding wall of text.

### i18n Impact
- New message keys under `about.stats` — array of `{ value: string, label: string }` objects (4 items)
- New message key: `about.personalNote` (the italic closer)
- `about.body` changes from a 2-element array to a 1-element array (sentence 1 only) in all 6 locale files
- The remaining `about.body` paragraphs and sentences 2-4 are deleted from all locale files

### Files
- Modify: `components/sections/About.tsx`
- Modify: `messages/en.json`, `messages/es.json`, `messages/de.json`, `messages/it.json`, `messages/ja.json`, `messages/zh.json`

---

## Section 2: Experience — Featured Roles + Collapsible History

### Current State
11 timeline entries all expanded with 2-7 bullet descriptions each. The Circadence entry alone has 7 long bullets. On desktop the alternating timeline is visually interesting but the content volume is overwhelming.

### Design

**Add a `featured` boolean to experience entries.** Featured roles are shown by default; non-featured roles are hidden behind an expandable.

**Featured roles** (4 entries):
1. Circadence (Technical Product Manager, Sep 2025–Present)
2. Starbucks (Sr. React Developer, Feb 2024–Sep 2025)
3. StellarFi (Senior Software Engineer, May 2023–Jan 2024)
4. Sana Benefits (Software Engineer, Oct 2022–Feb 2023)

**Hidden roles** (7 entries): Purple, The Regis Company, Charter Communications, Freelance Designer, Gogo Business Aviation, Lab for Playful Computation, CU Boulder IT/MCDB

**Bullet cap:** Featured roles show a maximum of 3 bullet points inline. If the data has more than 3, only the first 3 render. The data file keeps all bullets for the hover detail panel. The detail panel continues to show up to 4 bullets (its existing cap) — this is fine since the panel is opt-in on hover.

**"View full trail history" expandable:**
- Rendered below the last featured role's timeline card
- Dashed `border-gold/40` border, `rounded-lg` container, padded
- Shows: `▸ View full trail history` (gold text) + `7 earlier roles · 2015–2022` (stone text, counts and date range derived from data)
- On click: expands to reveal the remaining 7 roles in the same timeline format (alternating cards, waypoints, badges)
- Toggles to `▾ Hide earlier roles` when expanded
- Smooth height animation using the existing `AutoHeight` component wrapping the expanded content
- Non-featured roles continue their alternating index from where featured roles left off (so the timeline visual stays consistent)

**Everything else unchanged:** Timeline visual, waypoint markers, alternating layout, tech badges, hover detail panel, sticky heading on mobile, trail profile graphs.

### i18n Impact
- New message keys: `experience.viewFullHistory`, `experience.hideHistory`
- Existing `experience.more` key unchanged

### Data Change
Add `featured: boolean` to `ExperienceEntry` type and set it on each entry in `data/experience.ts`.

### Files
- Modify: `data/experience.ts` (add `featured` field)
- Modify: `components/sections/Experience.tsx` (filter by featured, add expandable, cap inline bullets at 3)
- Modify: `messages/en.json`, `messages/es.json`, `messages/de.json`, `messages/it.json`, `messages/ja.json`, `messages/zh.json`

---

## Section 3: Skills — Grouped Chip Grid

### Current State
Horizontal proficiency bars sorted by years, grouped into 4 categories in a 2-column grid. Each bar has a hover-to-reveal years tooltip. ~28 skills total across 4 categories creates a long vertical scroll, especially on mobile.

### Design

**Replace proficiency bars with a chip grid:**
- Each skill renders as a rounded chip: `bg-moss/20 border border-moss/30 rounded-md px-3 py-1.5 text-sm text-parchment/85`
- Chips wrap in a flex container per category
- 4 categories displayed in a 2-column grid on desktop (`md:grid-cols-2`), single column on mobile
- Category heading: gold uppercase label (`text-gold text-sm font-semibold tracking-wider uppercase`)

**Remove:**
- Proficiency bars
- Years tooltip on hover
- The `.sort((a, b) => b.years - a.years)` ordering (chips don't need proficiency ordering — keep data file order)
- Scale description footer text (`skills.scaleDescription` message key)
- `skills.yearAbbrev` and `skills.yearAbbrevPlural` message keys
- The `maxYearsForScale` import in the component (keep export in `data/skills.ts` for backwards compat)

**Keep:**
- Dark section variant with contour texture background and fireflies nature element
- Staggered entrance animation per category (Framer Motion fade-in)
- Section heading and intro text (but update intro text — see below)
- All technical skill names (Frontend, Backend, Tools & Infrastructure categories) — no trimming

**Update intro text:** Change from "Years of hands-on experience with each technology — trail-tested and production-ready." to something that doesn't reference "years" since the bars are gone. New text: "The tools and practices I reach for — trail-tested and production-ready." (Update in all 6 locale files.)

**Consolidate Practices category:** The Practices category has redundant long-named entries. Changes:
- "Technical Product Management" → "Product Management"
- "Stakeholder Communication" → remove (covered by "Product Management")
- "Roadmap Ownership" → remove (covered by "Product Management")
- All other Practices entries unchanged

This trims Practices from 9 items to 7.

### Files
- Modify: `components/sections/Skills.tsx` (rewrite to chip grid)
- Modify: `data/skills.ts` (trim Practices category, rename "Technical Product Management")
- Modify: `messages/en.json`, `messages/es.json`, `messages/de.json`, `messages/it.json`, `messages/ja.json`, `messages/zh.json` (remove `skills.scaleDescription`, `skills.yearAbbrev`, `skills.yearAbbrevPlural`; update `skills.intro`)

---

## Summary of Vertical Space Impact

| Section | Current Height (est.) | Proposed Height (est.) | Reduction |
|---------|----------------------|----------------------|-----------|
| About | ~400px | ~280px | ~30% |
| Experience | ~2800px (11 roles) | ~1200px (4 roles) + expandable | ~57% |
| Skills | ~600px | ~300px | ~50% |
| **Total saved** | | | **~1600px of scroll** |

## Testing

- All 6 locales render correctly (spot-check en, es, ja for Latin/CJK coverage)
- Experience expandable opens/closes smoothly with AutoHeight animation
- Mobile layout (360px): stats grid 2×2, skills grid single column, experience expandable works
- Tablet (768px): stats grid 4-col, skills grid 2-col, experience timeline alternating
- `prefers-reduced-motion`: animations disabled
- Existing locale parity test passes after message key updates
- Verify the nav overlay portal fix (committed separately) still works after these changes
