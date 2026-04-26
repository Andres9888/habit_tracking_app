# Plan — Full Design Consistency Review (2026-04-23)

## Context

Between 2026-03-19 (17/24) and 2026-04-05 (21/24) two design audits were produced (`.planning/ui-reviews/full-app-UI-REVIEW.md` and `DESIGN_CONSISTENCY_REVIEW.md` at repo root). Since 2026-04-05 another ~30 design-impacting commits have landed — none of them covered by an audit:

- `7237e160c` Habit Detail scrollspy tabs + pinned title + parchment pill
- `90c04a2ea` LoL-style rank tiles + medal growth emojis (Character screen)
- `f5311430e` Calm Habit Library entrance + workflow animations
- `4a5d52708`, `552f57eb3`, `6a8826ea8` Habit Detail canonical animation alignment
- `eb5d44da0` Cross-fade tier color transitions
- `507d93c44`, `9fbd1dbe2` Chain material tiers (copper→legendary) + CalendarTimeline
- `18100d6a4` Library advanced options + info subtitles on template preview
- `35ad6e2d1` fontWeight token migration (Goal* + StreakGoalSection)
- `1338c89c5` Designer review polish pass (buckets A/B/D/E)

User wants: **full fresh 6-pillar audit, new score vs 21/24, code audit + screenshots, report + sequenced remediation waves, no code changes**.

## Outcome

Three deliverables committed to the repo (plus screenshot captures):

1. **`DESIGN_CONSISTENCY_REVIEW.md`** at repo root — overwrites the 2026-04-05 version with a new-dated 2026-04-23 audit.
2. **`.planning/ui-reviews/full-app-UI-REVIEW-2026-04-23.md`** — 6-pillar scored companion (keeps the 2026-03-19 one as historical baseline).
3. **`REMEDIATION_PLAN.md`** at repo root — sequenced waves (Wave 1 quick wins → Wave N architectural), no implementation.
4. **`.planning/ui-reviews/screenshots-2026-04-23/`** — per-surface PNGs captured from the running app.

## Prerequisite (blocking Phase 3)

`.env.local` does not exist in the workspace. The dev server (`npm run dev`) will fail without it. Two paths:

- **Path A (preferred):** User provides a `.env.local` with test Clerk + Convex + RevenueCat values so `npm run expo:start --web` serves the web build. Screenshots captured via Chrome DevTools MCP.
- **Path B (fallback):** If credentials can't be made available, the audit ships **code-only** with the screenshot section marked `deferred`, and the remediation plan proceeds. Screenshot step can be done later in a separate session once credentials are set.

I'll ask before Phase 3 if `.env.local` still isn't present.

## Approach — 8 Phases

### Phase 1. Load baseline (already done; documented here for executor)

Already read into context:
- `DESIGN_CONSISTENCY_REVIEW.md` (2026-04-05, 21/24, 12 findings)
- `.planning/ui-reviews/full-app-UI-REVIEW.md` (2026-03-19, 17/24, 6 pillars)
- Theme structure in `src/theme/` confirmed canonical (colors, typography, spacing, shadows, animations, iconSizes)

### Phase 2. Quantitative token-adoption rescan

Re-run the same grep-based measurements that produced the 2026-04-05 numbers so the new score is directly comparable. Commands (read-only):

```bash
# fontSize raw vs typography.* tokens
grep -rE 'fontSize:\s*[0-9]+' src --include='*.ts*' | grep -v -E '(theme|__tests__|\.test\.)' | wc -l
grep -rE 'typography\.' src --include='*.ts*' | wc -l

# fontWeight raw vs fontWeights.*
grep -rE "fontWeight:\s*['\"]\d" src --include='*.ts*' | grep -v -E '(theme|__tests__|\.test\.)' | wc -l
grep -rE 'fontWeights\.' src --include='*.ts*' | wc -l

# Color: raw hex vs useThemeColors() + colors.*
grep -rE '#[0-9A-Fa-f]{6}' src --include='*.ts*' | grep -v -E '(theme|__tests__|colors\.light|colors\.dark|categoryColors|constants|confetti|dayStateConfigs|CharacterScreen/constants)' | wc -l
grep -rl 'useThemeColors' src | wc -l

# Icon sizes
grep -rE 'size=\{[0-9]+\}' src --include='*.tsx' | wc -l
grep -rE 'iconSizes\.' src --include='*.ts*' | wc -l

# Shadows
grep -rE '(shadowColor|shadowOffset|shadowRadius|elevation:)' src --include='*.ts*' | grep -v theme | wc -l
grep -rE 'shadows\.' src --include='*.ts*' | wc -l

# borderRadius raw vs tokens
grep -rE 'borderRadius:\s*[0-9]+' src --include='*.ts*' | grep -v theme | wc -l
grep -rE 'borderRadius\.' src --include='*.ts*' | wc -l

# NativeWind custom text-[Npx]
grep -rE 'text-\[[0-9]+px\]' src --include='*.tsx' | wc -l
```

Output: a "Token Adoption" table in the new report with Apr 5 → Apr 23 deltas.

### Phase 3. Visual capture (blocked if `.env.local` missing)

1. Start the dev server: `npm run dev` (spawns `convex dev` + `expo --web` in parallel).
2. Load Chrome DevTools MCP and navigate to `http://localhost:8081` (or whichever port Expo picks).
3. For each surface below: resize viewport to 390×844 (iPhone 14 dimensions), capture screenshot, save to `.planning/ui-reviews/screenshots-2026-04-23/<surface>.png`.
4. Also capture key modal and empty states where relevant.

**Capture matrix (one PNG per row, more for multi-state surfaces):**

| # | Surface | States to capture |
|---|---------|-------------------|
| 1 | Welcome (auth) | default, OAuth loading, error |
| 2 | Onboarding | each of 13 steps (resume flow) |
| 3 | Habits/Today | empty (new user), populated, selection mode, batch confirm |
| 4 | Habit Detail | hero + each tab (Calendar, Strength, Goals), pinned parchment pill, heatmap |
| 5 | Habit Edit | form default, danger zone, name validation |
| 6 | Habit Library | browse (hero + popular + categories), category drill, goal collection, search, template preview (w/ advanced options) |
| 7 | Analytics | empty state, populated (all chart sections) |
| 8 | Character (ranks) | rank tiles, attributes, achievements, stats |
| 9 | Settings Modal | account, notifications, appearance, danger |
| 10 | Create Habit Modal | all steps, color picker (swatch sharpness), reminder picker |
| 11 | Sync indicators | offline, syncing, conflict, synced toast |
| 12 | Error boundary | screen-level fallback |

**If Path B (no dev server):** skip Phase 3, mark section in report as "screenshots deferred — see `.maestro/screenshots/` for partial coverage," continue.

### Phase 4. Static audit — new surfaces since 2026-04-05

Scan each newly-introduced/refactored surface for:
- Token adoption (colors, typography, spacing, shadows, iconSizes, borderRadius)
- Animation pattern canonicality (damping:18 / stiffness:150 spring, reduceMotion checks)
- Hardcoded hex values outside token system
- Inline styles vs theme references

Specific files to review (from recent commits):
- `src/screens/HabitDetailScreen/` — scrollspy, pinned title, parchment pill
- `src/screens/CharacterScreen/` — rank tiles, medal emojis
- `src/components/CalendarTimeline/` — material tiers cross-fade
- `src/screens/TemplatesScreen/` (Habit Library) — entrance/workflow animations, advanced options
- `src/components/ChainVisualizer/` — growth-curve material tiers, uniform connector thickness
- `src/components/CreateHabitModal/components/ColorPickerSection/` — swatch sharpness fix
- `src/features/habits/components/StreakGoalSection/` — fontWeight token migration
- `src/components/FullsizeTemplatePreview/` — advanced options + info subtitles

### Phase 5. 6-pillar scoring (same rubric as 2026-03-19)

For each pillar produce: score/4, key finding, delta vs. 21/24 baseline, top issues with file:line refs.

- **Copywriting** — onboarding CTAs, destructive confirms, error messages, empty states. Check whether prior finding on generic "Next"/"Skip" and "contact support" dead-end was addressed (onboarding PR #1327 landed Apr 22 — may have fixed).
- **Visuals** — hierarchy, animation consistency, CharacterCard hardcoded "10" trophy (was a 2026-03-19 finding; verify fix).
- **Color** — re-measure the 613/1,101 hex count, verify `SyncStatus` module status, confirm `colors.accent` still undefined in light mode (Mar 19 bug).
- **Typography** — re-measure 15+ distinct font sizes, verify `CharacterCard` token migration status, check new scrollspy + parchment pill for scale compliance.
- **Spacing** — re-measure off-grid values (20 violations in Mar 19), verify 8-pt grid adherence in new surfaces.
- **Experience Design** — confirm comprehensive state coverage maintained (was 4/4); audit new surfaces for loading/error/empty states.

### Phase 6. Cross-cutting consistency audit

Patterns Explorer agents flagged that aren't in prior audits:
- **Button fragmentation** — 40+ implementations; list them, propose consolidation candidates
- **Card fragmentation** — 62 distinct card components; categorize (data / habit / template / progress / rank)
- **Modal/sheet patterns** — custom Modal vs. ad-hoc Animated.View sheets; recommend standardization
- **Empty-state fragmentation** — 15+ implementations vs. shared `EmptyState/` primitive
- **Icon strategy** — Expo Vector Icons + emoji + custom icons (`FocusIcon`, `ChainLinkIcon`); audit consistency
- **Animation migration** — `Animated.Value` (JS thread) vs `Reanimated` patterns; count legacy usages
- **NativeWind className + StyleSheet dual system** — 382 files mix both; architectural call-out

### Phase 7. Write the audit report

Replace `DESIGN_CONSISTENCY_REVIEW.md` at repo root with a new 2026-04-23 audit. Structure:

1. Header (date, scope, prior audits, commits-since)
2. Overall score X/24 with delta table
3. What improved since Apr 5 (remediated findings)
4. Current findings (severity-tagged, file:line refs) — preserving any still-open items from Apr 5
5. New findings from newly-shipped surfaces
6. Cross-cutting patterns (buttons, cards, modals, etc.)
7. Token adoption table (Apr 5 → Apr 23 delta)
8. Summary + trajectory

Move the 2026-04-05 version to `.planning/ui-reviews/archive/DESIGN_CONSISTENCY_REVIEW-2026-04-05.md` so it's preserved.

Also write `.planning/ui-reviews/full-app-UI-REVIEW-2026-04-23.md` — the 6-pillar scored variant, same rubric as 2026-03-19.

### Phase 8. Write the remediation plan

`REMEDIATION_PLAN.md` at repo root with sequenced waves. Each wave: goal, effort, risk, files touched, verification.

**Wave 0 — Visual bug fixes (minutes)**
- `borderRadius: 999` → `borderRadius.full` (5 call sites in ColorPickerSection)
- `strokeWidth: 2.25` → 2 or 2.5 (6 call sites)
- `CharacterCard` trophy hardcoded "10" → wire to real data

**Wave 1 — High-ROI quick wins (< 1 day each)**
- Adopt `iconSizes.*` tokens (0% → 50% with ~200 replacements across 258 files)
- SyncStatus module colors → theme tokens (5 files, amber/stone palette bypass)
- TemplatesScreen styles (7 files) typography token adoption
- Tailwind config `borderRadius.card` 12 → 16 (match theme)
- `colors.accent` light-mode definition (fix WeeklySummaryCard undefined-color bug)

**Wave 2 — Systematic token migrations (1–3 days each)**
- fontWeight migration: 229 raw → fontWeights.* (codemod-able, `'600'`/`'700'` → semibold/bold)
- fontSize migration: 328 raw → typography.* (manual — requires judgment on nearest token)
- Shadow token adoption: 15% → 60% (start with highest-traffic components)
- borderRadius migration: 50% → 85%
- Custom `text-[Npx]` NativeWind classes → standard text sizes (192 occurrences)

**Wave 3 — Architectural (multi-day)**
- Button consolidation: audit 40+ implementations, propose unified variant system
- Card primitive system: categorize 62 cards, extract shared primitives
- Modal/sheet standardization: pick one bottom-sheet pattern
- Animation migration: remaining `Animated.Value` → Reanimated (70+ usages)
- NativeWind + StyleSheet dual system: document boundary rules or pick one

**Wave 4 — Long-tail cleanup**
- Remaining 1,101 hardcoded hex values in components
- Empty-state consolidation into shared primitive (15+ → 1)
- Button padding variants consolidation (10+ → 3 sizes)
- Copywriting pass on onboarding CTAs (if PR #1327 didn't fully land)

Each wave includes: **explicit "Done when" criteria** tied to the token-adoption metrics so progress is measurable.

## Critical files

**Prior audits (read-only reference):**
- `DESIGN_CONSISTENCY_REVIEW.md`
- `.planning/ui-reviews/full-app-UI-REVIEW.md`

**Theme system (baseline for scoring):**
- `src/theme/index.ts` (barrel)
- `src/theme/colors/core.ts`, `colors/semantic.ts`, `darkColors.ts`
- `src/theme/typography.ts` (type scale)
- `src/theme/spacing.ts` (grid + componentSpacing + shadows + borderRadius)
- `src/theme/animations.ts` (canonical springs/durations)
- `src/theme/iconSizes.ts` (0% adoption today)
- `src/theme/ThemeContext.tsx` (`useThemeColors`)

**New surfaces to audit in Phase 4:**
- `src/screens/HabitDetailScreen/**`
- `src/screens/CharacterScreen/**` (especially `components/CharacterCard.tsx`)
- `src/screens/TemplatesScreen/**`
- `src/components/CalendarTimeline/**`
- `src/components/ChainVisualizer/**`
- `src/components/CreateHabitModal/components/ColorPickerSection/**`
- `src/components/FullsizeTemplatePreview/**`

**Files to produce:**
- `DESIGN_CONSISTENCY_REVIEW.md` (rewrite)
- `.planning/ui-reviews/full-app-UI-REVIEW-2026-04-23.md` (new)
- `.planning/ui-reviews/archive/DESIGN_CONSISTENCY_REVIEW-2026-04-05.md` (moved)
- `REMEDIATION_PLAN.md` (new)
- `.planning/ui-reviews/screenshots-2026-04-23/*.png` (per-surface captures)

## Verification (how we know the review is good)

- **Comparable numbers**: token-adoption table cites counts gathered with the same grep patterns as Apr 5 so deltas are apples-to-apples.
- **Every finding has a file:line reference** — no vague statements like "some components bypass".
- **Every finding maps to a wave** in `REMEDIATION_PLAN.md`; every wave item maps back to a finding.
- **Prior findings reconciled** — each of the 12 Apr 5 findings has explicit status (remediated / partial / open / regressed).
- **New surfaces covered** — each post-Apr 5 commit in the design-impact list has at least one corresponding audit paragraph or explicit "no consistency issues" note.
- **Screenshots** (if Phase 3 runs) are named by surface and referenced inline in the report.
- **No code changes** — `git status` shows only the new/modified `.md` files and new `.png` screenshots.

## Assumptions & open dependencies

- `.env.local` availability gates Phase 3. If absent, screenshots deferred; report still ships.
- Audit uses the same grep patterns as 2026-04-05 for directly comparable numbers. If token file paths have moved (unlikely — theme structure unchanged), queries will be updated and noted in the report.
- "9 screens" from prior audit still matches current navigation (Welcome, Onboarding, Habits, HabitDetail, HabitEdit, Analytics, Templates, Character, Settings). If onboarding PR #1327 changed the count, audit will reflect current state.
- Dark mode remains force-locked (PR #1229) — audit scores **light mode only**. Dark-mode readiness will be a separate follow-up referenced but not scored.
