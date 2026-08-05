# Designer Review — Whole App

## Context

Andres wants a designer perspective on the entire habit tracking app (React Native / Expo, iOS / Android / Web). The app has a rich surface area — habits list, create flow, detail/edit, analytics, library/templates, character/gamification, onboarding, settings, modals, empty states — and a mature design system (warm earth tones, Literata + DM Sans, 280ms spring motion language). Recent git history shows ongoing polish work (library rewrite, smooth sheet transitions, filter/sort copy, growth-type picker), which suggests design quality is being actively tended and a fresh external eye is wanted.

Decisions already locked in (from clarifying questions):
- **Visual-first review** — critique from rendered output, not code-only
- **Broad sweep + deep-dive** — severity-ranked findings across every screen, then 2–3 deeper audits on the areas the broad pass flags as most problematic
- **Designer picks priorities** — no area pre-excluded; auth/legal included

## Approach

Because React Native doesn't have a URL-routable preview and native rendering isn't easily automatable, the review uses **Expo web** (`npm run dev`) as the rendering surface. Playwright via `BrowserAgent` drives navigation and screenshots; the `Designer` subagent (multimodal — reads PNGs via Read tool) critiques each frame alongside the backing source for context.

**Caveats to call out in the final report:**
- Expo web rendering ≠ native iOS/Android in some cases (haptics, native pickers, bottom sheets, drag-to-reorder gestures)
- Navigation is component-state driven (see `HabitsApp.tsx`, `useViewNavigation`), so BrowserAgent clicks through rather than URL-navigating
- Some flows need fixtures (seeded habits, unlocked achievements, completed onboarding); any unreachable state gets noted as a gap, not faked

## Phases

### Phase 1 — Boot preview + capture screen inventory (~single BrowserAgent)

1. Start dev server: `npm run dev` (runs Convex + Expo web, backgrounded)
2. Wait for web server to respond on its port (Expo web typically `:8081` or `:19006`)
3. One `BrowserAgent` walks a deterministic route through the app, capturing PNGs to `.context/designer-review/screenshots/{area}/{state}.png`:
   - Onboarding (each step) → Auth → Habits list (empty, seeded, sorted) → Habit card variants → Create habit modal (each step) → Drag-reorder state → Habit detail (calendar / goals / stats tabs) → Habit edit (name / reminder / algorithm pickers) → Analytics (main, heatmaps, timeline, export) → Library/Templates (browse, category, search, fullsize preview, import wizard, featured pack) → Character (avatar, achievements, attributes, celebration) → Settings modal → Archived modal → Motivation (vision board, WOOP, rescue) → Every empty state
4. Produces `.context/designer-review/SCREEN-MAP.md` — inventory linking each PNG to the source file it came from

### Phase 2 — Broad sweep (4 parallel `Designer` agents)

Each Designer owns a coverage slice, reads its screenshots plus the source files for context, and writes a severity-ranked findings doc:

| Agent | Coverage | Output |
|---|---|---|
| 1 | Design system & motion — tokens, typography, color, spacing, dark mode, component primitives | `.context/designer-review/01-design-system.md` |
| 2 | Core habit flows — list, card, create, detail, edit, drag | `.context/designer-review/02-core-habits.md` |
| 3 | Library + analytics + character | `.context/designer-review/03-library-analytics-character.md` |
| 4 | Entry & support — onboarding, auth, empty states, settings, modals, motivation system | `.context/designer-review/04-entry-support.md` |

Each doc follows one structure: **Strengths → Findings (High / Medium / Low)** per screen, each finding citing a screenshot path, source file:line, principle violated (hierarchy, consistency, a11y, affordance, feedback, legibility, motion), and a concrete recommendation.

### Phase 3 — Synthesize broad pass + pick deep-dive targets (main agent)

Read all four docs, write `.context/designer-review/SUMMARY.md`:
- Top 10 cross-cutting findings ranked by impact
- 2–3 areas with the heaviest concentration of High findings → become deep-dive targets
- Rationale for each deep-dive pick

### Phase 4 — Deep-dive (2–3 parallel `Designer` agents)

Each deep-dive Designer:
- Re-screenshots the area with more states / edge cases (error, loading, long content, small-screen)
- Produces a component-level redesign proposal with specific tokens, layout changes, and motion tweaks
- Output: `.context/designer-review/deep-dive-{area}.md`

### Phase 5 — Final report (main agent)

Assemble `.context/designer-review/README.md` as the entry point:
- Executive summary (5–7 bullets)
- Links to all per-area docs + deep-dives
- Prioritized punch list (P0 / P1 / P2) with file paths + estimated effort
- Open questions for Andres

## Critical files / directories

**Read during review (source context):**
- `src/theme/index.ts` (606 lines — tokens entry)
- `src/theme/colors/`, `src/theme/typography.ts`, `src/theme/spacing.ts`, `src/theme/animations.ts`, `src/theme/darkColors.ts`
- `src/features/habits/HabitsApp.tsx` (navigation orchestrator)
- `src/screens/` (every subdirectory — screen implementations)
- `src/components/HabitCard/`, `src/components/HabitsList/`, `src/components/CreateHabitModal/`
- `src/components/FullsizeTemplatePreview/FullsizeTemplatePreview.tsx`
- `src/components/BinaryHeatmap/`, `src/components/CalendarTimeline/`, `src/components/ProgressSectionConsolidated/`
- `src/components/CelebrationSystem/`, `src/components/MotivationSystem/`, `src/components/SettingsModal/`

**Written during review (all new, under `.context/`):**
- `.context/designer-review/screenshots/**/*.png`
- `.context/designer-review/SCREEN-MAP.md`
- `.context/designer-review/01-design-system.md`
- `.context/designer-review/02-core-habits.md`
- `.context/designer-review/03-library-analytics-character.md`
- `.context/designer-review/04-entry-support.md`
- `.context/designer-review/SUMMARY.md`
- `.context/designer-review/deep-dive-{area}.md` (×2–3)
- `.context/designer-review/README.md`

No source code files are modified.

## Verification

1. `.context/designer-review/README.md` exists and links to every sub-doc
2. Every screen listed in the Explore map (Phase 1 of exploration) has at least one screenshot OR is documented as "unreachable via web preview — reason: …"
3. Every High-severity finding cites a screenshot path + source file:line
4. SUMMARY.md's deep-dive picks are traceable to the broad-sweep findings
5. Andres can skim README → SUMMARY in under 5 minutes and know what to fix first

## Out of scope

- No code changes. This is purely an audit/report.
- No native-only rendering checks (iOS / Android simulator) — flagged as a follow-up if Expo web coverage is insufficient.
- No implementation of recommendations — those become follow-up tasks per Andres's direction.
