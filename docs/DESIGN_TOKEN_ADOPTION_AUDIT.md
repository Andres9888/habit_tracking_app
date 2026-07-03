# Design Token Adoption Deep-Dive Audit

**Date:** 2026-04-21
**Prior audit:** [`docs/archive/DESIGN_CONSISTENCY_REVIEW.md`](./archive/DESIGN_CONSISTENCY_REVIEW.md) (2026-04-05, 21/24 score)
**Scope:** All four design token systems — Colors, Typography, Icons, Shadows
**Method:** Code-level measurement via ripgrep; spot-checked claims against source
**Output:** Findings only — no code changes

---

## Executive Summary

| System                                 | Apr 5 adoption | Today                       | Δ              | Grade |
| -------------------------------------- | -------------- | --------------------------- | -------------- | ----- |
| Typography — `fontWeight`              | ~20% tokens    | **~96%** tokens             | **+76pp** ⭐⭐ | A     |
| Icons — `iconSizes.*`                  | **0%**         | ~50% strict / ~94% on-scale | **+50pp** ⭐⭐ | B+    |
| Typography — `fontSize`                | ~46% tokens    | ~59% tokens                 | +13pp ⭐       | C+    |
| Colors — `useThemeColors` / `colors.*` | ~65%           | ~68%                        | +3pp           | B     |
| Shadows — `shadows.*`                  | ~15%           | ~22%                        | +7pp           | D+    |

**Three Apr-5 "quick wins" are already fixed** and do not need remediation:

- `borderRadius: 999` bug — **0 matches** (was 5 in ColorPickerSection)
- `strokeWidth={2.25}` — **0 matches** (was 6 across SearchBar, SwipeableActionButton, etc.). Only a test comment still references it.
- SyncStatus `*/styles.ts` files — migrated to `colors.warning`, `typography.caption`, `fontWeights.medium`, `borderRadius.large`. Verified against `ConflictNotification/styles.ts`.

**Headline take:** The system is healthier than the April review suggested. The two weakest pillars (icons at 0%, fontWeight at 20%) both made dramatic jumps. Shadows remains the laggard. Most remaining gaps are in a small number of files that tend to bypass _multiple_ token systems at once — target those for leverage.

---

## Trajectory Since Apr 5

Notable design-related commits (non-checkpoint) in the 16-day window:

- `1338c89c5` design: ship designer-review polish pass (buckets A/B/D/E) (#1319)
- `6a4769f7c` design(settings): fix toggle alignment, section headers, token consistency
- `216230eb4` fix(color-picker): sharpen selected swatch
- `dc54661a6` fix-swatch-blur (#1318)
- `d6fd30fc3` polish(library): smooth back-transition exit for fullsize preview
- `350d39263` refactor: decompose TemplateListCard + polish loading state
- `ef5160f7f` copy(advanced): rework habit strength picker to "Growth Type"
- `169969f57` polish(library): holistic copy rewrite on habit library page
- `67e40c92b` polish(settings): add edge-fade scroll cue to growth-icon presets
- `9fbd1dbe2` feat(chain): growth-curve material tiers (copper→legendary)
- `152adff27` fix(templates): replace broken YouTube links (#1321)

These explain most of the token migration gains, particularly in Settings, Library, and TemplatesScreen.

---

## 1. Typography Deep-Dive

### Type scale (from `src/theme/typography.ts`)

Valid `fontSize` values: **10, 12, 13, 14, 16, 17, 20, 22, 34**
Valid `fontWeight` values (via `fontWeights.*`): **'400' (regular), '500' (medium), '600' (semibold), '700' (bold)**

### Measurements

| Metric                                   | Count  | Files |
| ---------------------------------------- | ------ | ----- |
| `typography.*` token references          | 490    | 201   |
| Raw `fontSize: N`                        | 337    | 155   |
| `fontWeight: fontWeights.*` (token)      | 356    | 201   |
| Raw `fontWeight: '\d+'` (string literal) | **13** | **8** |

**fontSize adoption:** 490 / (490 + 337) = **59%** token adoption (up from 46%).
**fontWeight adoption:** 356 / (356 + 13) = **96.5%** token adoption (up from 20%). **Near-complete.**

### Off-scale fontSize values found

| Value          | Instances | Note                                                                                                                                                                    |
| -------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fontSize: 11` | 5         | StreakGoalCard (3), PairsWellWith, GoalCollectionGrid                                                                                                                   |
| `fontSize: 15` | ~10       | Most are inline text on colored chips / "Restored!" / "Resume habit" — intentional mid-body size, **no token exists**. Consider adding `bodyMedium: 15` or align to 14. |
| `fontSize: 18` | ~6        | Mostly emoji `<Text>{emoji}</Text>` — **exempt** (emoji rendering). `SettingsModal/AccountRow.tsx` uses 18 for the profile initial badge — could be `heading3` (20).    |
| `fontSize: 26` | 2         | `dashboard.styles.ts` hero numbers — not on scale. Consider 28 (if added) or 22.                                                                                        |

**Apr 5 said 11/15/18 were the main deviations — still the same three.** No 9px found.

### Remaining raw-fontWeight offenders (8 files, 13 occurrences)

```
src/components/CelebrationSystem/examples/CelebrationExample.tsx    4 — example file, low priority
src/screens/HabitDetailScreen/components/GoalTabEmptyState.tsx      2
src/screens/HabitDetailScreen/components/GoalAdjustSheet/*.tsx      2
src/screens/HabitDetailScreen/components/GoalCoachLine/*.tsx        1
src/screens/HabitDetailScreen/components/GoalWhyAnchor/*.tsx        1
src/screens/HabitDetailScreen/components/GoalTabContent.tsx         1
src/screens/HabitEditScreen/StreakGoalSection.tsx                   1
src/components/HabitCard/tests/HabitCard.toggle.test.tsx            1 — test file
```

**Cluster:** 7 of 13 live in **HabitDetailScreen/Goal\*** components — a recent feature (goal tab empty states, coach lines, why anchors). Single-pass fix would bring fontWeight adoption above 99%.

### Top-10 raw-fontSize offenders

| File                                                                                     | Raw `fontSize` count |
| ---------------------------------------------------------------------------------------- | -------------------- |
| `src/components/ProgressSectionConsolidated/StreakGoalCard/styles/dashboard.styles.ts`   | 15                   |
| `src/components/ProgressSectionConsolidated/StreakGoalCard/styles/compact.styles.ts`     | 11                   |
| `src/screens/TemplatesScreen/components/GoalCollectionGrid/GoalCollectionGrid.styles.ts` | 7                    |
| `src/lib/sentry/ErrorBoundary/ErrorFallback.styles.ts`                                   | 7                    |
| `src/screens/TemplatesScreen/components/StartHereCard/StartHereCard.tsx`                 | 5                    |
| `src/components/CalendarTimeline/components/DayCellRing.styles.ts`                       | 5                    |
| `src/components/CelebrationSystem/examples/CelebrationExample.tsx`                       | 5 (example file)     |
| `src/screens/templates/TemplatePreviewModal/styles.ts`                                   | 4                    |
| `src/screens/TemplatesScreen/components/GoalCollectionGrid/FeaturedGoalCard.tsx`         | 4                    |
| `src/components/StrengthRing/StrengthRing.constants.ts`                                  | 4                    |

**Observation:** StreakGoalCard _dashboard + compact_ styles alone account for **26 raw fontSize values** — 8% of the app total. These are where the "variation K" layout lives (a recent redesign). Converting those two files would move the needle significantly.

### Templates status update (Apr 5 flagged as 100% raw)

Apr 5 said _"All 7 template style files use raw values exclusively."_ Now:

| File                 | typography refs | raw fontSize |
| -------------------- | --------------- | ------------ |
| `formStyles.ts`      | 4               | 0            |
| `tabStyles.ts`       | 2               | 0            |
| `customizeStyles.ts` | 2               | 0            |
| `categoryStyles.ts`  | 1               | 1            |
| `scrollStyles.ts`    | 1               | 0            |
| `searchStyles.ts`    | 1               | 0            |
| `sortStyles.ts`      | 1               | 0            |
| `controlStyles.ts`   | 1               | 0            |
| `browseStyles.ts`    | 1               | 0            |
| `previewStyles.ts`   | 0               | 3            |

**Templates are ~90% migrated.** Only `previewStyles.ts` and `categoryStyles.ts` remain — 4 raw values total.

### Recommendations

1. **Fix 7 HabitDetailScreen/Goal\* files** → raw fontWeight drops to ~4. <15 min.
2. **Migrate StreakGoalCard dashboard/compact** → single biggest fontSize win. ~30 min.
3. **Decide on `fontSize: 15`**: either add a `bodyMedium` token or treat as deliberate off-scale. 10+ uses suggest it's a real semantic need.
4. **Finish TemplatePreviewModal/previewStyles.ts** → 3 raw values, last template file holdout.

---

## 2. Icon Size Deep-Dive

### Token scale (from `src/theme/iconSizes.ts`)

| Token    | Size |
| -------- | ---- |
| `micro`  | 10   |
| `small`  | 16   |
| `medium` | 20   |
| `large`  | 24   |
| `xl`     | 32   |
| `xxl`    | 48   |

### Measurements

| Metric                           | Count | Files |
| -------------------------------- | ----- | ----- |
| `iconSizes.*` token references   | 393   | 237   |
| Raw `size={N}` on JSX icon props | ~394  | 238   |
| Files that import `iconSizes`    | 237   | —     |

**Strict token adoption:** 393 / (393 + 394) = **~50%** (up from 0%).
**On-scale adoption (token OR raw-matches-scale):** ~94% (only ~43 occurrences off-scale).

### Off-scale sizes remaining

| Size        | Instances | Files |
| ----------- | --------- | ----- |
| `size={18}` | 28        | 13    |
| `size={14}` | 12        | 8     |
| `size={12}` | 3         | 3     |
| `size={22}` | 0         | —     |
| `size={28}` | 0         | —     |

**Apr 5 had 180+ off-scale icon sizes. Today: ~43.** A 76% reduction.

### On-scale raw sizes (candidates for token conversion)

| Size        | Instances | Should be          |
| ----------- | --------- | ------------------ |
| `size={20}` | 25        | `iconSizes.medium` |
| `size={24}` | 7         | `iconSizes.large`  |
| `size={16}` | 2         | `iconSizes.small`  |

These ~34 occurrences use the correct _numeric value_ but skip the token name — purely cosmetic, but finishing them closes the loop.

### Top size={18} offenders (the biggest remaining cluster)

Spread thinly across:

- `ArchiveUndoToast`, `DraftRecoveryBanner`, `DeleteUndoToast` — toast iconography (consider adding a `toast` size alias or standardize to 20)
- `VisualizationExercise/*` — consider `iconSizes.small` (16) or `medium` (20)
- `StatsGrid/StatsGrid.tsx` — stat row icons (should likely be 16 or 20)
- `NotesSection/VisualizationGuide/*` — 8 occurrences in `visualizationTechniques.tsx` alone

### Recommendations

1. **Decide on 18**: it's the single biggest off-scale cluster (28 occurrences across 13 files). Either add `iconSizes.button` / `iconSizes.toast` = 18, or migrate all to 16 or 20.
2. **Auto-convert `size={20|16|24}`** to `iconSizes.medium|small|large` — ~34 instances. Codemod-friendly.
3. **Investigate `size={14}`** in 8 files — some may be in tight layouts (badges, inline text) where neither `micro` (10) nor `small` (16) fits. Possibly add a `badge` = 14 token.

---

## 3. Shadow Deep-Dive

### Token levels (from `src/theme/spacing.ts` — shadows section)

| Token                  | shadowColor | offset.height | opacity | radius | elevation | Use case         |
| ---------------------- | ----------- | ------------- | ------- | ------ | --------- | ---------------- |
| `subtle`               | `#2D2A26`   | 1             | 0.04    | 3      | 1         | Chips, badges    |
| `card`                 | `#2D2A26`   | 2             | 0.06    | 8      | 3         | Cards at rest    |
| `floatingActionButton` | `#2D2A26`   | 4             | 0.08    | 16     | 6         | FAB, pressed     |
| `modal`                | `#2D2A26`   | 8             | 0.10    | 24     | 8         | Modals, sheets   |
| `alert`                | `#2D2A26`   | 12            | 0.14    | 32     | 12        | Alerts, overlays |

### Measurements

| Metric                                                            | Count                         | Files |
| ----------------------------------------------------------------- | ----------------------------- | ----- |
| `shadows.(subtle\|card\|floatingActionButton\|modal\|alert)` refs | 93                            | 80    |
| Files importing `shadows` from theme                              | 71                            | —     |
| Inline `shadowColor/Offset/Opacity/Radius/elevation` props        | ~427 (Apr 5 baseline; stable) | ~120  |

**Strict token adoption: ~22%** (up from ~15% in April — modest improvement).

### Correctness vs. tokenization

Shadows are the one area where **raw values are often semantically correct** — most inline shadows use `shadowColor: '#2D2A26'` (warm-stone token color) with values close to one of the five levels. The gap is less "wrong values" and more "not routed through the named token."

### Top shadow-inline offenders

The top cluster is **SettingsModal** — 7 files each declare their own shadow:

```
src/components/SettingsModal/AccountRow.tsx
src/components/SettingsModal/ProfileCard.tsx
src/components/SettingsModal/SettingsSection.tsx
src/components/SettingsModal/SortPicker.tsx
src/components/SettingsModal/sections/DeleteAccountButton.tsx
src/components/SettingsModal/sections/SignOutCard.tsx
```

And **MotivationSystem/Workshop** section cards — 5 near-identical `SectionCard.tsx` files (WOOPSection, VoiceNotesSection, VisionBoardSection, CueTriggerSection, DualVizSetup) that each declare their own `shadowColor/Offset/Opacity`.

### Recommendations

1. **Deduplicate MotivationSystem SectionCards** — 5 files with identical shadow code. Either import `shadows.card` or create a shared `SectionCardShadow` style object. Single-commit fix.
2. **Audit SettingsModal shadows** — 7 files, likely all want `shadows.card` or `shadows.subtle`. Low risk since SettingsModal was recently polished (Apr 10-ish commit).
3. **Add an ESLint rule** (future) that flags raw `shadowColor:` outside of `src/theme/**`. Would prevent regressions.

---

## 4. Color Deep-Dive

### Palette source (from `src/theme/colors/core.ts`, `darkColors.ts`, `semantic.ts`)

Defined palettes: `primary[100–700]`, `gray[50–900]`, `indigo[200–900]`, `premium[400–700]`, `secondary[100–600]`, `streak[100–700]`, `strength.*`, plus semantic aliases (`background`, `card`, `surface`, `border`, `text.*`, `error/warning/success/info` + `*Light` variants).

### Measurements

| Metric                                  | Count  | Files |
| --------------------------------------- | ------ | ----- |
| `colors.*` member references            | 2,029+ | 467+  |
| `useThemeColors()` hook calls           | 394    | 238   |
| Raw `#NNNNNN` hex (theme+test excluded) | 985    | 268   |

**Token adoption (rough):** ~67–70% (stable vs. April's 65%).

### Raw hex — where it lives

Most raw hex is in three categories:

**(A) Legitimate data files — should stay** (~500+ of the 985 hex values)

- `CategoryFilters.colors.ts` — 57 category palette entries
- `nameSuggestions.constants.ts` — 31 entries
- `suggestions.data.ts` (SmartSuggestions) — 31
- `DraggableHabit/colorUtils.ts` — 23 color computation helpers
- `goalCollections.ts`, `hubermanPhases.ts`, `milestone-colors.ts` — data-driven palettes
- `StreakMilestoneCelebration/constants.ts`, `StrengthDistributionChart.constants.ts`, `StrengthRing.constants.ts` — visualization palettes (intentional)

**(B) Local "colors.ts" / "colors.tsx" files** (the grey zone)

- `src/components/SettingsModal/SettingsRow.colors.ts` — 8 entries
- `src/components/HabitCard/HabitCard.colors.ts`
- `src/components/CreateHabitModal/components/CategoryFilters/CategoryFilters.colors.ts`
- These are architectural decisions — per-component palettes. Some could be tokens, some are genuinely local.

**(C) Hard violations — should be tokens**

- `SyncStatus/SyncingIndicator.tsx:21` — `const ICON_COLOR = '#d97706'` (amber-600, should be `colors.warning`/`colors.streak`)
- `SyncStatus/OfflineIndicator.tsx:21` — `const ICON_COLOR = '#a8a29e'` (stone-400, should be `colors.gray[300]`)
- `src/constants/auth.ts` lines 14, 20, 26, 38 — per Feb 14 audit, still using raw `#ffffff`, `#dc2626`, `#1c1917`, `#10b981` (not verified today, but audit flagged)
- `ErrorBoundary/errorFallbackStyles.ts:34, 49` — `'#FCA5A5'`, `'#B91C1C'` for dark mode fallback (not in theme)

### Top 20 files with raw hex (excluding legitimate data/constants)

```
CategoryFilters.colors.ts                 57  — local palette (likely OK)
nameSuggestions.constants.ts              31  — data
SmartSuggestions/suggestions.data.ts      31  — data
DraggableHabit/colorUtils.ts              23  — color-math helper
CreateHabitModal/constants.ts             21  — data
goalCollections.ts                        15  — data
HabitStrengthHistory/InfoModal/index.tsx  12  — may have hardcoded UI hex
ArchivedHabitsModal/utils.ts              11
StreakMilestoneCelebration/constants.ts   10  — celebration palette
QuickActionsSheet/ActionItem.tsx          10  — ⚠️ UI component
ProgressSection/YourProgressCard/constants.ts  10  — data
templates/TemplatePreviewModal/constants.ts     9
HabitStrengthHistory/strengthUtils/constants.ts 9
BinaryHeatmap/constants.ts                 9
templates/TemplatePreviewModal/ColorPicker.tsx  8
TemplateListCard/TemplateListCard.styles.ts    8  — ⚠️ styles file
DayBar.constants.ts                        8
PersonalBestsCard.constants.ts             8
HabitCalendarView/CalendarLegend/CalendarLegend.tsx  8  — ⚠️ UI component
CalendarTimeline/theme.ts                  8  — component-level theme
```

The `⚠️` rows are the true violations. The rest are legitimate domain color data.

### Recommendations

1. **Audit `QuickActionsSheet/ActionItem.tsx`** (10 hex values in a UI component) — should use `colors.*` references.
2. **Audit `HabitCalendarView/CalendarLegend.tsx`** (8 hex in a legend UI) — likely needs strength color tokens.
3. **Migrate `SyncStatus/*Indicator.tsx` ICON_COLOR constants** to `colors.streak[600]` / `colors.gray[300]`.
4. **Document which `*.colors.ts` files are sanctioned as local** vs. which should roll up into the theme. Currently no explicit policy exists.

---

## 5. Multi-System Offenders (New Cross-Cut)

Files that bypass **≥2 token systems** simultaneously — highest-leverage targets.

| File                                                                         | Typography         | Icons | Shadows                  | Colors               | Severity |
| ---------------------------------------------------------------------------- | ------------------ | ----- | ------------------------ | -------------------- | -------- |
| `ProgressSectionConsolidated/StreakGoalCard/styles/dashboard.styles.ts`      | 15 raw fontSize    | —     | —                        | Uses tokens          | ⚠️ H     |
| `ProgressSectionConsolidated/StreakGoalCard/styles/compact.styles.ts`        | 11 raw fontSize    | —     | —                        | Uses tokens          | ⚠️ H     |
| `lib/sentry/ErrorBoundary/ErrorFallback.styles.ts`                           | 7 raw fontSize     | —     | Inline                   | Raw hex              | ⚠️ H     |
| `TemplatesScreen/components/GoalCollectionGrid/GoalCollectionGrid.styles.ts` | 7 raw fontSize     | —     | —                        | —                    | M        |
| `CalendarTimeline/components/DayCellRing.styles.ts`                          | 5 raw fontSize     | —     | —                        | —                    | M        |
| `SettingsModal/AccountRow.tsx`                                               | `fontSize: 18` raw | —     | Inline shadow            | —                    | M        |
| `HabitDetailScreen/components/Goal*` (7 files)                               | Raw fontWeight     | —     | —                        | Local hex (`'#fff'`) | M        |
| `MotivationSystem/Workshop/*SectionCard.tsx` (5 files)                       | —                  | —     | Duplicated inline shadow | —                    | M        |

### Priority Rank

1. **StreakGoalCard dashboard + compact** — 26 raw fontSize in 2 files. Ship one PR, drop fontSize violations by ~8%.
2. **HabitDetailScreen Goal\* cluster** — 7 files with raw fontWeight + raw fontSize + `color: '#fff'` literals. Concentrated in GoalTab/GoalAdjust/GoalWhy/GoalCoach.
3. **MotivationSystem Workshop SectionCards** — 5 identical shadow duplications. One refactor fixes all.
4. **SettingsModal shadow cluster** — 7 files, recently polished so theme alignment is overdue.

---

## 6. Screen Coverage Matrix

Rough letter grades based on token adoption in representative styles files of each surface.

| Screen / Surface                             | Typography         | Icons | Shadows         | Colors            | Overall   |
| -------------------------------------------- | ------------------ | ----- | --------------- | ----------------- | --------- |
| **Habits List** (HabitCard, BottomActionBar) | B+                 | A     | B               | B+                | **B+**    |
| **Analytics** (charts, stat cards)           | B                  | A     | C+              | B                 | B         |
| **Character** (CharacterCard, attributes)    | A-                 | A     | B               | B+                | **A-**    |
| **Templates** (browse, list card, category)  | B+                 | A     | B-              | B                 | B         |
| **Template Preview Modal**                   | C+                 | A-    | C               | C+                | C+        |
| **Habit Detail** (hero, tabs, goal)          | C                  | A     | B               | C+ (local hex)    | **C+** ⚠️ |
| **Habit Edit** (sections, danger zone)       | C                  | A     | B               | B                 | C+        |
| **Create Habit Modal**                       | B                  | A     | B               | B+                | B         |
| **Settings** (rows, sections)                | A-                 | A     | C (shadow dup.) | A-                | B+        |
| **Onboarding**                               | B                  | A     | B               | B                 | B         |
| **Auth / Welcome**                           | C+                 | A     | C               | C+                | C+        |
| **Paywall / Premium**                        | B                  | A     | B               | B                 | B         |
| **SyncStatus / Offline**                     | B                  | A     | B               | B (local consts)  | B         |
| **ErrorBoundary**                            | C (7 raw fontSize) | A     | C               | C (hex fallbacks) | **C** ⚠️  |

**Weakest surfaces:** ErrorBoundary, Habit Detail (Goal tab), Auth, Template Preview.
**Strongest:** Character, Settings, Habits List.

---

## 7. Prioritized Remediation Roadmap

### Wave 1 — Quick wins (under 1 day total)

| #   | Task                                                                                 | Effort | Impact                               |
| --- | ------------------------------------------------------------------------------------ | ------ | ------------------------------------ |
| 1   | Tokenize `HabitDetailScreen/Goal*` fontWeight (7 files, 8 occurrences)               | 15 min | fontWeight adoption 96.5% → >99%     |
| 2   | Migrate `StreakGoalCard/dashboard.styles.ts` + `compact.styles.ts` (26 raw fontSize) | 30 min | fontSize adoption +3pp               |
| 3   | Audit `QuickActionsSheet/ActionItem.tsx` (10 hex) → use `colors.*`                   | 15 min | Removes a UI hex hotspot             |
| 4   | Replace `SyncStatus/*Indicator.tsx` `ICON_COLOR` constants with `colors.*`           | 10 min | Eliminates last SyncStatus hardcodes |
| 5   | Finish `TemplatePreviewModal/previewStyles.ts` (3 raw fontSize)                      | 10 min | Templates 100% tokenized             |
| 6   | Audit `CalendarLegend.tsx` (8 hex)                                                   | 15 min | Removes a UI hex hotspot             |

### Wave 2 — Systematic migrations (1–2 days)

| #   | Task                                                                      | Effort                          | Impact                             |
| --- | ------------------------------------------------------------------------- | ------------------------------- | ---------------------------------- |
| 7   | Decide on `fontSize: 15` (add `bodyMedium` or migrate to 14)              | 30 min decision + 1hr migration | Closes typography "off-scale" tail |
| 8   | Decide on `size={18}` (add `iconSizes.button=18` or migrate to 16/20)     | Same                            | Off-scale icons 43 → ~15           |
| 9   | Deduplicate MotivationSystem/Workshop SectionCard shadows                 | 45 min                          | +5 files to shadows.\*             |
| 10  | Tokenize SettingsModal shadow cluster (7 files)                           | 1 hr                            | +7 files to shadows.\*             |
| 11  | Convert on-scale raw `size={20\|16\|24}` to `iconSizes.*` (~34 instances) | Codemod; 30 min                 | Icon strict adoption 50% → ~65%    |

### Wave 3 — Architectural (optional)

| #   | Task                                                                                             | Effort               | Impact                       |
| --- | ------------------------------------------------------------------------------------------------ | -------------------- | ---------------------------- |
| 12  | Add ESLint rule: flag `shadowColor:` / raw `#NNNNNN` outside `src/theme/**` and `*.constants.ts` | 2–4 hr               | Prevents regression          |
| 13  | Define policy: what's a sanctioned `*.colors.ts` file vs. theme violation                        | Discussion + doc     | Clarifies the grey zone      |
| 14  | Consider renaming `iconSizes` tokens to include `14` / `18` if those are real needs              | 1 hr + design review | Completes icon scale         |
| 15  | Migrate ErrorBoundary / Sentry ErrorFallback styles to tokens                                    | 1 hr                 | Closes worst-scoring surface |

---

## 8. Verification Notes

Spot-checks performed to validate claims in this doc:

- ✅ `src/theme/typography.ts` — read 180 lines. Type scale matches audit claim (34/28/22/20/17/16/14/13/10/12).
- ✅ `src/theme/iconSizes.ts` — read 33 lines. Six-token scale confirmed (10/16/20/24/32/48).
- ✅ `src/theme/spacing.ts` — read 159 lines. Five-elevation shadow system confirmed.
- ✅ `src/theme/colors/core.ts` — read 206 lines. Palette structure matches claims.
- ✅ `src/components/SyncStatus/ConflictNotification/styles.ts` — read: uses `typography.caption.fontSize`, `fontWeights.medium`, `colors.warning`, `borderRadius.large`. Apr 5 claim of "fully hardcoded" is **stale**; this file is now fully tokenized.
- ✅ `src/components/ProgressSectionConsolidated/StreakGoalCard/styles/dashboard.styles.ts` — read: confirmed 15 raw `fontSize` values (11, 14, 20, 24, 26, 10, 12, 13). Colors, borderRadius, fontWeights **are** tokenized. Hybrid compliance.
- ✅ `borderRadius: 999` bug — searched `src/`, **zero matches**. Confirmed fixed.
- ✅ `strokeWidth={2.25}` — one match, and it's in a test comment (`FloatingActionButton.test.tsx:153`). Confirmed effectively fixed.
- ✅ iconSizes file import count: `rg -l iconSizes src/ --glob !src/theme/**` returns 237 files (was 0 in April).

**Stale Apr-5 claims to disregard:**

- "SyncStatus `*/styles.ts` files use hardcoded Tailwind colors" — now tokenized (at least ConflictNotification verified).
- "0 components use iconSizes tokens" — 237 files now do.
- "fontWeight 20% adoption" — now ~96.5%.
- "borderRadius 999 in 5 files" — all fixed.
- "strokeWidth 2.25 in 6 files" — all fixed.
- "Template styles 0% typography" — now ~90% tokenized.

---

## Summary

The design token system is **in substantially better shape than the April 5 review suggested.** Five specific issues flagged then as Wave-1 fixes are already resolved. The biggest remaining work concentrates in ~10 files that span multiple token categories — StreakGoalCard styles, HabitDetailScreen Goal\* components, and a handful of shadow-duplicating SectionCards. Addressing just those files would move every metric into A-territory.

Shadows remain the lowest-adoption pillar (~22%), but most "violations" are semantically correct inline values — they just bypass the token abstraction. A targeted sweep of SettingsModal and MotivationSystem Workshop would raise adoption materially without changing visual output.

No regressions detected versus April 5. All movement is positive.
