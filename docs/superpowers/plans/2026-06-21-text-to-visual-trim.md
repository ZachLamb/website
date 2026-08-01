# Text-to-Visual Trim Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce text heaviness in About, Experience, and Skills sections by replacing dense paragraphs with stats, chips, and collapsible sections.

**Architecture:** Three independent section rewrites touching component files, data files, and all 6 locale message files. Each task is a self-contained section change that can be reviewed independently. The locale parity test enforces key structure consistency across all locales.

**Tech Stack:** Next.js 16, React 19, TypeScript 6, Tailwind CSS v4, Framer Motion 12, Vitest 4

## Global Constraints

- All changes must work across all 6 locales (`en`, `es`, `de`, `it`, `ja`, `zh`)
- `Messages` type is inferred from `en.json` via `lib/i18n.ts` — all locale files must have identical key structure
- Respect `prefers-reduced-motion` — entrance animations use Framer Motion which already honors the global CSS reset
- Mobile-first: all layouts must work at 360px. Grid layouts collapse to single column on mobile.
- No new dependencies
- The contour texture backgrounds, nature elements, and section dividers are unchanged
- Run `pnpm typecheck` and `pnpm vitest run messages/locale-parity.test.ts` after every task to verify

---

### Task 1: About — Stats Row

**Files:**

- Modify: `messages/en.json`
- Modify: `messages/es.json`
- Modify: `messages/de.json`
- Modify: `messages/it.json`
- Modify: `messages/ja.json`
- Modify: `messages/zh.json`
- Modify: `components/sections/About.tsx`

**Interfaces:**

- Consumes: `messages.about.body` (changed from 2-element to 1-element array), `messages.about.stats` (new), `messages.about.personalNote` (new)
- Produces: No exports consumed by other tasks

- [ ] **Step 1: Update `messages/en.json` — about section**

Replace the `about` block. The `body` array shrinks to 1 element (sentence 1 only). Add `stats` array and `personalNote` key. Remove paragraph 2 entirely.

```json
"about": {
  "heading": "Trail Guide",
  "body": [
    "I'm a Technical Product Manager with a frontend engineering background, which means I own the roadmap, run the team, and can still go deep on the technical decisions that actually matter."
  ],
  "stats": [
    { "value": "10+", "label": "Years Building" },
    { "value": "5", "label": "Industries" },
    { "value": "CSM", "label": "Certified" },
    { "value": "IC↔PM", "label": "Dual Track" }
  ],
  "personalNote": "When I'm not at my desk, I'm teaching yoga, hiking Colorado's trails, or trying to settle the Oreo debate once and for all.",
  "focusAreas": "Technical Product Management · Roadmap Ownership · React & TypeScript · AI/LLM Integration · Cross-functional Leadership · Certified ScrumMaster"
}
```

- [ ] **Step 2: Update `messages/es.json` — about section**

```json
"about": {
  "heading": "Guía del Sendero",
  "body": [
    "Soy Technical Product Manager con experiencia en ingeniería frontend, lo que significa que soy responsable de la hoja de ruta, dirijo el equipo y puedo profundizar en las decisiones técnicas que realmente importan."
  ],
  "stats": [
    { "value": "10+", "label": "Años Construyendo" },
    { "value": "5", "label": "Industrias" },
    { "value": "CSM", "label": "Certificado" },
    { "value": "IC↔PM", "label": "Doble Perfil" }
  ],
  "personalNote": "Cuando no estoy en mi escritorio, enseño yoga, recorro los senderos de Colorado o intento resolver el debate de las Oreo de una vez por todas.",
  "focusAreas": "Gestión Técnica de Producto · Responsabilidad de Roadmap · React y TypeScript · Integración AI/LLM · Liderazgo Interfuncional · Certified ScrumMaster"
}
```

- [ ] **Step 3: Update `messages/de.json` — about section**

```json
"about": {
  "heading": "Wegweiser",
  "body": [
    "Ich bin Technical Product Manager mit Frontend-Engineering-Hintergrund — das heißt, ich verantworte die Roadmap, leite das Team und kann trotzdem bei den technischen Entscheidungen in die Tiefe gehen, die wirklich zählen."
  ],
  "stats": [
    { "value": "10+", "label": "Jahre Erfahrung" },
    { "value": "5", "label": "Branchen" },
    { "value": "CSM", "label": "Zertifiziert" },
    { "value": "IC↔PM", "label": "Doppelrolle" }
  ],
  "personalNote": "Wenn ich nicht am Schreibtisch sitze, unterrichte ich Yoga, wandere auf Colorados Trails oder versuche, die Oreo-Debatte ein für alle Mal zu klären.",
  "focusAreas": "Technisches Produktmanagement · Roadmap-Verantwortung · React & TypeScript · AI/LLM-Integration · Bereichsübergreifende Führung · Certified ScrumMaster"
}
```

- [ ] **Step 4: Update `messages/it.json` — about section**

```json
"about": {
  "heading": "Guida del Sentiero",
  "body": [
    "Sono un Technical Product Manager con background in ingegneria frontend, il che significa che gestisco la roadmap, guido il team e posso ancora approfondire le decisioni tecniche che contano davvero."
  ],
  "stats": [
    { "value": "10+", "label": "Anni di Esperienza" },
    { "value": "5", "label": "Settori" },
    { "value": "CSM", "label": "Certificato" },
    { "value": "IC↔PM", "label": "Doppio Ruolo" }
  ],
  "personalNote": "Quando non sono alla scrivania, insegno yoga, percorro i sentieri del Colorado o cerco di risolvere una volta per tutte il dibattito sugli Oreo.",
  "focusAreas": "Gestione Tecnica del Prodotto · Gestione Roadmap · React e TypeScript · Integrazione AI/LLM · Leadership Interfunzionale · Certified ScrumMaster"
}
```

- [ ] **Step 5: Update `messages/ja.json` — about section**

```json
"about": {
  "heading": "トレイルガイド",
  "body": [
    "フロントエンドエンジニアリングのバックグラウンドを持つテクニカルプロダクトマネージャーです。ロードマップの責任を持ち、チームを率い、本当に重要な技術的意思決定に深く関わることができます。"
  ],
  "stats": [
    { "value": "10年+", "label": "開発経験" },
    { "value": "5", "label": "業界" },
    { "value": "CSM", "label": "認定資格" },
    { "value": "IC↔PM", "label": "二刀流" }
  ],
  "personalNote": "デスクを離れているときは、ヨガを教えたり、コロラドのトレイルをハイキングしたり、オレオ論争に決着をつけようとしています。",
  "focusAreas": "テクニカルプロダクトマネジメント · ロードマップ管理 · React & TypeScript · AI/LLM統合 · 部門横断リーダーシップ · 認定スクラムマスター"
}
```

- [ ] **Step 6: Update `messages/zh.json` — about section**

```json
"about": {
  "heading": "向导",
  "body": [
    "我是一名具有前端工程背景的技术产品经理，这意味着我负责路线图、管理团队，并能深入参与真正重要的技术决策。"
  ],
  "stats": [
    { "value": "10+", "label": "年开发经验" },
    { "value": "5", "label": "个行业" },
    { "value": "CSM", "label": "认证" },
    { "value": "IC↔PM", "label": "双轨角色" }
  ],
  "personalNote": "不在办公桌前时，我会教瑜伽、徒步科罗拉多的步道，或者试图一劳永逸地解决奥利奥之争。",
  "focusAreas": "技术产品管理 · 路线图负责 · React 和 TypeScript · AI/LLM 集成 · 跨职能领导 · 认证 ScrumMaster"
}
```

- [ ] **Step 7: Rewrite `components/sections/About.tsx`**

Replace the entire file content:

```tsx
'use client';

import { useRef } from 'react';
import { m, useInView } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';
import { useLocaleContext } from '@/components/providers/LocaleProvider';

export function About() {
  const { messages } = useLocaleContext();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const pullQuote = messages.about.body[0] ?? '';
  const focusAreas = messages.about.focusAreas.split(' · ').filter(Boolean);

  return (
    <Section variant="light" id="about" nature={{ leaves: true, birds: true }}>
      <AnimatedHeading sectionId="about" subtitle="I." className="mb-8">
        {messages.about.heading}
      </AnimatedHeading>

      <div ref={ref}>
        {/* Pull-quote: sentence 1 at display size with gold left accent */}
        <m.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-bark border-gold max-w-3xl border-l-2 pl-4 text-xl leading-relaxed break-words md:text-2xl"
        >
          {pullQuote}
        </m.p>

        {/* Stats grid */}
        <div className="mt-8 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
          {messages.about.stats.map((stat, i) => (
            <m.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="border-gold/30 rounded-lg border border-dashed px-4 py-3 text-center"
            >
              <div className="text-gold font-serif text-3xl font-bold">{stat.value}</div>
              <div className="text-stone mt-1 text-xs">{stat.label}</div>
            </m.div>
          ))}
        </div>

        {/* Personal closer */}
        <m.p
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-bark mt-6 max-w-3xl text-sm italic"
        >
          {messages.about.personalNote}
        </m.p>

        {/* Focus area pills */}
        <m.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-6 flex max-w-3xl flex-wrap gap-2"
        >
          {focusAreas.map((area) => (
            <span
              key={area}
              className="border-bark/20 bg-sand text-bark inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs"
            >
              {area}
            </span>
          ))}
        </m.div>
      </div>
    </Section>
  );
}
```

- [ ] **Step 8: Run tests and typecheck**

Run: `pnpm typecheck && pnpm vitest run messages/locale-parity.test.ts`
Expected: Both pass. The locale parity test verifies all 6 locale files have matching key structure (including the new `about.stats` array and `about.personalNote` key).

- [ ] **Step 9: Commit**

```bash
git add components/sections/About.tsx messages/en.json messages/es.json messages/de.json messages/it.json messages/ja.json messages/zh.json
git commit -m "feat(about): replace paragraph 2 with stats grid and personal closer"
```

---

### Task 2: Experience — Featured Roles + Collapsible History

**Files:**

- Modify: `data/experience.ts`
- Modify: `components/sections/Experience.tsx`
- Modify: `messages/en.json`
- Modify: `messages/es.json`
- Modify: `messages/de.json`
- Modify: `messages/it.json`
- Modify: `messages/ja.json`
- Modify: `messages/zh.json`

**Interfaces:**

- Consumes: `ExperienceEntry` type (adding `featured` field), `AutoHeight` component from `@/components/ui/AutoHeight`
- Produces: No exports consumed by other tasks

- [ ] **Step 1: Add `featured` field to `data/experience.ts`**

Add `featured: boolean` to the type and set it on each entry. The first 4 entries (circadence, starbucks, stellarfi, sana-benefits) are `featured: true`. All others are `featured: false`.

In the `ExperienceEntry` type, add the field:

```typescript
export type ExperienceEntry = {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string[];
  techStack: string[];
  featured: boolean;
};
```

Then add `featured: true` to the circadence, starbucks, stellarfi, and sana-benefits entries, and `featured: false` to all 7 remaining entries (purple, regis-company, charter, freelance, gogo-business-aviation, playful-computation, cu-boulder-it).

- [ ] **Step 2: Add i18n keys to all 6 locale files**

Add to the `experience` object in each locale file:

**en.json:**

```json
"experience": {
  "more": "more",
  "viewFullHistory": "View full trail history",
  "hideHistory": "Hide earlier roles"
}
```

**es.json:**

```json
"experience": {
  "more": "más",
  "viewFullHistory": "Ver historial completo",
  "hideHistory": "Ocultar roles anteriores"
}
```

**de.json:**

```json
"experience": {
  "more": "weitere",
  "viewFullHistory": "Vollständigen Werdegang anzeigen",
  "hideHistory": "Frühere Rollen ausblenden"
}
```

**it.json:**

```json
"experience": {
  "more": "altri",
  "viewFullHistory": "Mostra tutto il percorso",
  "hideHistory": "Nascondi ruoli precedenti"
}
```

**ja.json:**

```json
"experience": {
  "more": "件",
  "viewFullHistory": "すべての経歴を表示",
  "hideHistory": "過去の経歴を非表示"
}
```

**zh.json:**

```json
"experience": {
  "more": "更多",
  "viewFullHistory": "查看完整经历",
  "hideHistory": "隐藏早期经历"
}
```

- [ ] **Step 3: Modify `components/sections/Experience.tsx` — add bullet cap and expandable**

Three changes to this file:

**Change A:** In the `CardContent` component, cap inline bullets at 3. Find the `<ul>` that maps `entry.description` and change the map to `.slice(0, 3)`:

Replace:

```tsx
        {entry.description.map((item, i) => (
```

With:

```tsx
        {entry.description.slice(0, 3).map((item, i) => (
```

**Change B:** In the `Experience` component, split experiences into featured and non-featured, and add expandable state. Replace the `Experience` component function body with:

```tsx
export function Experience() {
  const { messages } = useLocaleContext();
  const [hoveredEntry, setHoveredEntry] = useState<ExperienceEntry | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = () => setIsDesktop(mq.matches);
    mq.addEventListener('change', handler);
    handler();
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!hoveredEntry) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setHoveredEntry(null);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [hoveredEntry]);

  const featuredExperiences = experiences.filter((e) => e.featured);
  const olderExperiences = experiences.filter((e) => !e.featured);
  const olderDateRange =
    olderExperiences.length > 0
      ? `${olderExperiences[olderExperiences.length - 1].startDate.split(' ')[1]}–${olderExperiences[0].endDate === 'Present' ? 'Present' : olderExperiences[0].endDate.split(' ')[1]}`
      : '';

  return (
    <Section variant="light" id="experience" mapFrame nature={{ leaves: true, pines: true }}>
      <div className="bg-parchment/95 sticky top-16 z-30 -mx-4 mb-12 px-4 py-2 backdrop-blur-sm sm:-mx-6 sm:px-6 md:static md:mx-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
        <AnimatedHeading sectionId="experience" subtitle="II." className="md:mb-0">
          {messages.sections.experience}
        </AnimatedHeading>
      </div>

      <AnimatePresence>
        {isDesktop && hoveredEntry && (
          <ExperienceDetailPanel
            key={hoveredEntry.id}
            entry={hoveredEntry}
            side={experiences.indexOf(hoveredEntry) % 2 === 0 ? 'right' : 'left'}
            moreLabel={messages.experience.more}
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-8">
        {featuredExperiences.map((entry, i) => (
          <TimelineCard key={entry.id} entry={entry} index={i} onHover={setHoveredEntry} />
        ))}
      </div>

      {olderExperiences.length > 0 && (
        <div className="mt-8">
          <button
            type="button"
            onClick={() => setShowHistory((prev) => !prev)}
            className="border-gold/40 text-gold hover:border-gold/60 focus-visible:ring-gold flex w-full items-center justify-between rounded-lg border border-dashed px-5 py-3 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <span className="font-medium">
              {showHistory ? '▾' : '▸'}{' '}
              {showHistory ? messages.experience.hideHistory : messages.experience.viewFullHistory}
            </span>
            <span className="text-stone text-sm">
              {olderExperiences.length} earlier roles · {olderDateRange}
            </span>
          </button>

          <AutoHeight>
            {showHistory && (
              <div className="mt-8 flex flex-col gap-8">
                {olderExperiences.map((entry, i) => (
                  <TimelineCard
                    key={entry.id}
                    entry={entry}
                    index={featuredExperiences.length + i}
                    onHover={setHoveredEntry}
                  />
                ))}
              </div>
            )}
          </AutoHeight>
        </div>
      )}
    </Section>
  );
}
```

**Change C:** Add the `AutoHeight` import at the top of the file:

```tsx
import { AutoHeight } from '@/components/ui/AutoHeight';
```

- [ ] **Step 4: Run tests and typecheck**

Run: `pnpm typecheck && pnpm vitest run messages/locale-parity.test.ts`
Expected: Both pass.

- [ ] **Step 5: Commit**

```bash
git add data/experience.ts components/sections/Experience.tsx messages/en.json messages/es.json messages/de.json messages/it.json messages/ja.json messages/zh.json
git commit -m "feat(experience): show 4 featured roles, collapse 7 older behind expandable"
```

---

### Task 3: Skills — Grouped Chip Grid

**Files:**

- Modify: `data/skills.ts`
- Modify: `components/sections/Skills.tsx`
- Modify: `messages/en.json`
- Modify: `messages/es.json`
- Modify: `messages/de.json`
- Modify: `messages/it.json`
- Modify: `messages/ja.json`
- Modify: `messages/zh.json`

**Interfaces:**

- Consumes: `skillCategories` from `data/skills.ts` (shape unchanged), `messages.skills.intro` (updated text)
- Produces: No exports consumed by other tasks

- [ ] **Step 1: Trim Practices category in `data/skills.ts`**

In the `practices` category, make these changes:

- Rename `'Technical Product Management'` → `'Product Management'`
- Remove the `{ name: 'Stakeholder Communication', years: 1 }` entry
- Remove the `{ name: 'Roadmap Ownership', years: 1 }` entry

The resulting practices skills array should be:

```typescript
{
  id: 'practices',
  name: 'Practices',
  skills: [
    { name: 'Agile/Scrum', years: 8 },
    { name: 'Product Management', years: 1 },
    { name: 'Cross-functional Leadership', years: 1 },
    { name: 'Product Design', years: 6 },
    { name: 'UI/UX', years: 10 },
    { name: 'E2E Testing', years: 2 },
    { name: 'AI/LLM Integration', years: 1 },
  ],
},
```

- [ ] **Step 2: Update skills intro text in all 6 locale files**

Replace `skills.intro` and remove `skills.scaleDescription`, `skills.yearAbbrev`, `skills.yearAbbrevPlural` from each locale file. The `skills` object should have only `intro` as its key.

**en.json:**

```json
"skills": {
  "intro": "The tools and practices I reach for — trail-tested and production-ready."
}
```

**es.json:**

```json
"skills": {
  "intro": "Las herramientas y prácticas que uso — probadas en el camino y listas para producción."
}
```

**de.json:**

```json
"skills": {
  "intro": "Die Werkzeuge und Praktiken, auf die ich setze — wegerprobt und produktionsreif."
}
```

**it.json:**

```json
"skills": {
  "intro": "Gli strumenti e le pratiche che utilizzo — testati sul campo e pronti per la produzione."
}
```

**ja.json:**

```json
"skills": {
  "intro": "実践で選ぶツールとプラクティス — 実戦で試され、本番対応済み。"
}
```

**zh.json:**

```json
"skills": {
  "intro": "我常用的工具和实践 —— 经实战验证，可用于生产环境。"
}
```

- [ ] **Step 3: Rewrite `components/sections/Skills.tsx` to chip grid**

Replace the entire file content:

```tsx
'use client';

import { useRef } from 'react';
import { m, useInView } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';
import { useLocaleContext } from '@/components/providers/LocaleProvider';
import { skillCategories } from '@/data/skills';

export function Skills() {
  const { messages } = useLocaleContext();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <Section variant="dark" id="skills" nature={{ fireflies: true }}>
      <AnimatedHeading
        sectionId="skills"
        subtitle="III."
        className="[&_p]:text-gold [&_h2]:text-parchment"
      >
        {messages.sections.skills}
      </AnimatedHeading>

      <p className="text-stone/90 mt-4 max-w-2xl text-base">{messages.skills.intro}</p>

      <div ref={ref} className="mt-10 grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-2">
        {skillCategories.map((category, i) => (
          <m.div
            key={category.id}
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <h3 className="text-gold mb-3 text-sm font-semibold tracking-wider uppercase">
              {category.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span
                  key={skill.name}
                  className="bg-moss/20 border-moss/30 text-parchment/85 rounded-md border px-3 py-1.5 text-sm"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </m.div>
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 4: Run tests and typecheck**

Run: `pnpm typecheck && pnpm vitest run messages/locale-parity.test.ts`
Expected: Both pass. The removed message keys (`scaleDescription`, `yearAbbrev`, `yearAbbrevPlural`) must be gone from all 6 locale files for parity to pass.

- [ ] **Step 5: Commit**

```bash
git add data/skills.ts components/sections/Skills.tsx messages/en.json messages/es.json messages/de.json messages/it.json messages/ja.json messages/zh.json
git commit -m "feat(skills): replace proficiency bars with grouped chip grid"
```

---

### Task 4: Visual Verification

**Files:**

- No file changes — this is a verification task

**Interfaces:**

- Consumes: All changes from Tasks 1-3

- [ ] **Step 1: Start dev server and take screenshots**

Run: `pnpm dev` (if not already running)

Take screenshots at 360px (mobile) and 1280px (desktop) of the About, Experience, and Skills sections using Playwright or the browser. Verify:

1. **About (desktop):** Pull-quote sentence + 4-stat grid (4 columns) + italic closer + focus pills
2. **About (mobile):** Pull-quote + 4-stat grid (2×2) + italic closer + pills wrapping
3. **Experience (desktop):** 4 featured roles with alternating timeline + "View full trail history" button
4. **Experience (mobile):** 4 roles stacked + expandable button
5. **Experience expandable:** Click "View full trail history" — 7 older roles appear with smooth animation
6. **Skills (desktop):** 4 category groups in 2-column grid with chips
7. **Skills (mobile):** Single column chip grid

- [ ] **Step 2: Spot-check a non-Latin locale**

Navigate to `/ja` or `/zh` and verify:

- Stats grid values render correctly (e.g. `10年+` in Japanese)
- Skills chips render with correct text
- Experience expandable button text is translated

- [ ] **Step 3: Test reduced motion**

In Chrome DevTools → Rendering → check "Emulate CSS prefers-reduced-motion: reduce". Reload. Verify:

- Stats cards appear without animation
- Experience cards appear without animation
- Skills chips appear without animation
- Experience expandable still works (height transition may be instant)
