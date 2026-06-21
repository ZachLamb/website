# Text-to-Visual Trim Design Spec

**Goal:** Reduce text heaviness across the portfolio site by replacing dense paragraphs with visual communication — stats, chips, and collapsible sections — while preserving all content for users who want the full picture.

**Scope:** Three sections — About, Experience, Skills. All other sections (Services, Education, Endorsements, Contact, Hero) are unchanged.

**Approach:** Surgical Trim + Smart Visuals. Keep the current section structure and theme; make targeted replacements where text can be communicated faster visually.

## Global Constraints

- All changes must work across all 7 locales (en, es, de, it, ja, zh, + any others in `messages/`)
- Respect `prefers-reduced-motion` — entrance animations use Framer Motion which already honors the global CSS reset
- Mobile-first: all layouts must work at 360px. Grid layouts collapse to single column on mobile.
- No new dependencies
- Existing data files (`data/skills.ts`, `data/experience.ts`) retain their current shape — display logic changes, not data structure changes (exception: adding a `featured` field to experience entries)
- The contour texture backgrounds, nature elements, and section dividers are unchanged

---

## Section 1: About — Stats Row

### Current State
Two dense paragraphs (~150 words each) + focus area pills. The pull-quote first paragraph is styled nicely but the second paragraph is a wall of text that buries key facts.

### Design

**Keep:**
- Pull-quote first paragraph with gold left border (trimmed to first two sentences only — ending at "...decisions that actually matter.")
- Focus area pills unchanged

**Replace paragraph 2 with a stats grid:**

Four stat cards in a responsive grid (4 columns desktop, 2×2 mobile):

| Stat | Value | Label |
|------|-------|-------|
| Years | `10+` | Years Building |
| Industries | `5` | Industries |
| Certification | `CSM` | Certified |
| Role style | `IC↔PM` | Dual Track |

Each card: gold large value text (font-serif, text-3xl), small stone-colored label below. Dashed gold/30 border, rounded corners. Animated entrance on scroll (staggered per card).

**Add a short italic personal closer** below the stats grid:
> When I'm not at my desk, I'm teaching yoga, hiking Colorado's trails, or trying to settle the Oreo debate once and for all.

This is the last sentence from the current paragraph 2 — keeps the personality without the surrounding wall of text.

### i18n Impact
- The stats grid uses new message keys: `about.stats.yearsBuilding`, `about.stats.industries`, `about.stats.certified`, `about.stats.dualTrack` (value + label pairs)
- The personal closer uses a new key: `about.personalNote`
- The trimmed first paragraph uses the existing `about.body[0]` key but the content is shortened in all locale files
- Paragraph 2 (`about.body[1]`) is removed from all locale files

### Files
- Modify: `components/sections/About.tsx`
- Modify: `messages/en.json` (and all other locale files)

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

**Bullet cap:** Featured roles show a maximum of 3 bullet points. If the data has more than 3, only the first 3 render. The data file keeps all bullets (for the detail panel and for future use).

**"View full trail history" expandable:**
- Rendered below the last featured role
- Dashed gold border, rounded container
- Shows: `▸ View full trail history` + `7 earlier roles · 2016–2022` (counts and date range derived from data)
- On click: expands to reveal the remaining 7 roles in the same timeline format
- Toggles to `▾ Hide earlier roles` when expanded
- Smooth height animation using the existing AutoHeight component or CSS transition

**Everything else unchanged:** Timeline visual, waypoint markers, alternating layout, tech badges, hover detail panel, sticky heading on mobile.

### Data Change
Add `featured: boolean` to `ExperienceEntry` type and set it on each entry in `data/experience.ts`.

### Files
- Modify: `data/experience.ts` (add `featured` field)
- Modify: `components/sections/Experience.tsx` (filter by featured, add expandable)

---

## Section 3: Skills — Grouped Chip Grid

### Current State
Horizontal proficiency bars sorted by years, grouped into 4 categories in a 2-column grid. Each bar has a hover-to-reveal years tooltip. ~28 skills total across 4 categories creates a long vertical scroll, especially on mobile.

### Design

**Replace proficiency bars with a chip grid:**
- Each skill renders as a rounded chip: `bg-moss/20 border border-moss/30 rounded-md px-3 py-1.5 text-sm text-parchment/85`
- Chips wrap in a flex container per category
- 4 categories displayed in a 2-column grid on desktop, single column on mobile
- Category heading: gold uppercase label (`text-gold text-sm font-semibold tracking-wider uppercase`)

**Remove:**
- Proficiency bars
- Years tooltip on hover
- Scale description footer text (`scaleDescription` message key)
- The `maxYearsForScale` export is no longer used by the component (keep in data file for backwards compat)

**Keep:**
- Dark section variant with contour texture background
- Staggered entrance animation per category (Framer Motion fade-in)
- Section heading and intro text
- All skill names — no trimming of the list itself (the chip format is compact enough)

**Simplification:** The Practices category has long names ("Technical Product Management", "Cross-functional Leadership", "Stakeholder Communication"). Shorten display names:
- "Technical Product Management" → "Product Management"
- "Cross-functional Leadership" → "Cross-functional Leadership" (keep)
- "Stakeholder Communication" → remove (covered by "Product Management")
- "Roadmap Ownership" → remove (covered by "Product Management")

This trims Practices from 9 items to 7.

### Files
- Modify: `components/sections/Skills.tsx` (rewrite to chip grid)
- Modify: `data/skills.ts` (trim Practices category)
- Modify: `messages/en.json` (remove `skills.scaleDescription`, `skills.yearAbbrev`, `skills.yearAbbrevPlural` — and equivalents in all locale files)

---

## Summary of Vertical Space Impact

| Section | Current Height (est.) | Proposed Height (est.) | Reduction |
|---------|----------------------|----------------------|-----------|
| About | ~400px | ~280px | ~30% |
| Experience | ~2800px (11 roles) | ~1200px (4 roles) + expandable | ~57% |
| Skills | ~600px | ~300px | ~50% |
| **Total saved** | | | **~1600px of scroll** |

## Testing

- All 7 locales render correctly (spot-check en, es, ja for Latin/CJK coverage)
- Experience expandable opens/closes smoothly
- Mobile layout (360px): stats grid 2×2, skills grid single column, experience expandable works
- `prefers-reduced-motion`: animations disabled
- Existing tests pass (locale parity test may need message key updates)
