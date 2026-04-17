# Chain Day Design Improvements — Implementation Plan

## Context

The user requested implementation of `Design Improvements.html` from a Claude Design handoff bundle for the "Chain Day" habit tracker. The design is a Before/After audit-driven redesign covering 4 screens: Habits list, Empty state, Habit detail, Character. Original audit flagged typography token bypass, hardcoded hex, off-grid spacing, and className/StyleSheet mixing.

**Key discovery during exploration:** Much of the token-hygiene work is already complete (HabitCard uses `theme.custom.typography.heading3`, CharacterCard is StyleSheet-only, EmptyState uses theme colors). The real deltas are the **visual redesigns** — progress-ring avatar, chain-as-hero detail view, named tiers, capsule FAB, serif "Today" header, displayLarge empty-state hero.

**User-confirmed scope:** All four screens (Option B), including replacing the existing `BottomActionBar` with the design's "New habit" capsule FAB.

---

## Implementation plan

Five phases, shipped as sequential PRs (or a single branch with per-phase commits):

### Phase 1 — Habit Detail: chain-as-hero (Section 3)

**New components** (each ≤100 lines, following project decomposition pattern):

- `src/screens/HabitDetailScreen/components/StatStrip/`
  - `StatStrip.tsx`, `StatStrip.styles.ts`, `StatStrip.types.ts`, `index.ts`.
  - Three cells: Current streak (🔥, `streak.700`), Automatic % (`primary.700`), Personal best (neutral).
  - All numbers use `typography.displayLarge` (34 Literata Bold) + `fontVariantNumeric: 'tabular-nums'`.
  - 1px `colors.border` dividers between cells.

- `src/screens/HabitDetailScreen/components/ChainGridCard/`
  - `ChainGridCard.tsx`, `ChainGridCard.styles.ts`, `ChainGridCard.types.ts`, `ChainGridCard.hooks.ts` (for end-of-streak detection), `index.ts`.
  - 7-col grid, filled days = `colors.primary[600]` with inset highlight `inset 0 0 0 1px rgba(255,255,255,0.15)` and white check icon.
  - End-of-streak days (last `true` before a `false`) get `borderWidth: 2, borderColor: colors.streak[500]` ring.
  - "Last N days" caption; defaults to 49 days.
  - Personal-best callout row: "✨ N days to beat your personal best" in `primary.100` pill with `primary.700` text. Hide when `bestStreak <= currentStreak`.

**Wire-in:** `src/screens/HabitDetailScreen/components/HabitDetailContent.tsx` — read first; insert `StatStrip` above and `ChainGridCard` replacing or above existing `MonthlyCalendarGrid`.

### Phase 2 — Character: progress-ring avatar + named tier (Section 4)

**Edit:** `src/screens/CharacterScreen/components/CharacterCard.tsx`

- Wrap avatar in `react-native-svg` progress ring. Track `colors.gray[200]`, fill `colors.primary[600]`, stroke width 4, linecap round, `strokeDashoffset` based on `xp / xpToNextLevel`.
- Replace separate `Level N` + `data.title` rows with single `Level {n} · {title}` using `typography.heading1` (Literata 22/700).
- Replace horizontal XP bar + gradient with inline XP pill: `streak.100` bg, `streak.700` text, 🏆 emoji, `borderRadius.full`, `tabular-nums`.
- Remove trophy-count badge (redundant with the ring).
- "N XP to Level M" becomes `caption` under the heading.

**New file:** `src/screens/CharacterScreen/tiers.ts` — `level → tierName` mapping (Novice 1–5, Adept 6–15, Master 16–30, Legend 31+). Falls back to `data.title` if the consumer passes one.

**Adjacent edit:** Achievement cards (find in `CharacterScreen/components/`) — switch to `borderRadius.medium` (12) + `shadows.subtle`, colored icon background per category (`streak.100`, `primary.100`, purple `#E0E7FF` for Night owl).

### Phase 3 — Habits list: serif "Today" header (Section 1, subset)

**Edit:** `src/components/CalendarTimeline/` greeting area (locate the exact file inside the folder first).

- Headline → `typography.heading1` (Literata) reading "Today".
- Meta line → `{weekday, month day} · {N} of {M} complete` with completed count in `colors.primary[700]` semibold.
- Keep existing `MicroProgressBar` but ensure 4px height, `borderRadius.xs` (4), `colors.primary[600]` fill on a `colors.gray[200]` track.

### Phase 4 — Empty state: "Don't break the chain." (Section 2)

**Edit:** `src/components/EmptyState/EmptyState.tsx` (the `noHabits` variant).

Option chosen: extend the existing generic component with richer `noHabits` rendering rather than a parallel component.

- When `variant === 'noHabits'`:
  - Chain-circle hero: 72×72 circle, `primary.100` bg, 🔗 emoji 36px.
  - Hero headline: "Don't break the chain." using `typography.displayLarge` (clamped to `fontSize: 28, lineHeight: 34` for this surface).
  - Subcopy: "Pick one habit. We'll grow it one link at a time." in `body` + `text.secondary`, max 280 width centered.
  - Time-aware chip header ("Morning · try one of these") — compute bucket from local time (morning ≤11, afternoon ≤17, else evening). Uppercase caption + letter-spacing 0.6.
  - Chips use `bodySmall` + `border: colors.border`, hover/press → `primary.100` bg + `primary.500` border + `primary.700` text. Tap pre-fills input.
  - Dynamic CTA: text input + primary button. Disabled (`gray[200]` bg, `gray[400]` text) when empty; active (`primary[600]` bg, warm-tint shadow `0 4px 12px rgba(5,150,105,0.28)`) when text present. Label toggles `'Enter a habit name first' → 'Add "{name}" →'`.
  - 8px-grid padding throughout.

**New file:** `src/components/EmptyState/useTimeBucket.ts` — returns `'morning' | 'afternoon' | 'evening'` plus a label.

**Wire-in check:** identify where `<EmptyState variant="noHabits" ... />` actually renders on the habits list. If it's not wired, render it from the empty-list path (likely `HabitsApp.tsx` or `HabitsListContent.tsx`).

### Phase 5 — FAB: replace BottomActionBar with capsule (Section 1, FAB)

**User confirmed** they want the design's capsule FAB in place of the current 3-zone `BottomActionBar`.

**Deprecate:** `src/features/habits/components/BottomActionBar/` — delete after swap; move the Settings and Templates entry points elsewhere (see below).

**New component:** `src/features/habits/components/NewHabitFab/`
- `NewHabitFab.tsx`, `NewHabitFab.styles.ts`, `index.ts`.
- Pill: 10/20/10/10 padding, `borderRadius.full`, `primary[600]` bg, warm-tint shadow `0 8px 24px rgba(5,150,105,0.28), 0 2px 6px rgba(45,42,38,0.08)`.
- Inner 36×36 translucent circle (`rgba(255,255,255,0.22)`) housing Plus icon; "New habit" label in `body/600` white.
- Positioned centered bottom with `insets.bottom + 24` offset.
- Retains the press/ripple/bounce animations from the existing `FloatingActionButton` via `useFABAnimations`.

**Re-home orphaned actions:** Settings and Templates entry points currently live in `BottomActionBar`. Move them to:
- Settings → top-right header button on the habits screen (confirm via `HabitsApp.tsx`).
- Templates → keep existing route; promote an entry in settings or as a secondary action in the empty state.
- **If re-homing is non-trivial**, stop and surface it to the user rather than hiding functionality.

**Wire-in:** `src/features/habits/HabitsApp.tsx:128` — replace `<BottomActionBar .../>` with `<NewHabitFab .../>`.

---

## Critical files to read before each phase

- **Phase 1:** `src/screens/HabitDetailScreen/components/HabitDetailContent.tsx`, `src/components/BinaryHeatmap/MonthlyCalendarGrid/MonthlyCalendarGrid.tsx`, `src/theme/colors/core.ts`, `src/theme/typography.ts`, `src/theme/spacing.ts`.
- **Phase 2:** `src/screens/CharacterScreen/components/CharacterCard.tsx` (lines 100+ for styles), `src/screens/CharacterScreen/constants.ts`, `src/screens/CharacterScreen/types.ts`, `package.json` (verify `react-native-svg`).
- **Phase 3:** `src/components/CalendarTimeline/CalendarTimeline.tsx`, `src/components/CalendarTimeline/components/MicroProgressBar.tsx`, `src/features/habits/components/HabitsList/HabitsListHeader.tsx`.
- **Phase 4:** `src/components/EmptyState/constants.ts`, `src/components/EmptyState/styles.ts`, `src/components/EmptyState/TemplateChip.tsx`, `src/components/EmptyState/types.ts`, `src/features/habits/HabitsApp.tsx` (locate noHabits render path).
- **Phase 5:** `src/features/habits/components/BottomActionBar/BottomActionBar.tsx` (entire folder), `src/features/habits/components/FloatingActionButton/FloatingActionButton.tsx` + `useFABAnimations.ts`, `src/features/habits/HabitsApp.tsx`, `src/features/habits/useBottomBarProps.ts`.
- **Design reference:** `/tmp/design-fetch/extracted/habit-tracker/project/Design Improvements.html`, `screens.jsx`, `habit-card.jsx`, `tokens.js`.

---

## Verification plan (per phase)

1. **Types + lint** — `npx tsc --noEmit` and `npm run lint:max-lines` must pass; no new errors.
2. **Unit tests** — add/update for: `ChainGridCard` (filled/empty/end-of-streak), `StatStrip` (number formatting, tabular-nums), `CharacterCard` (ring stroke math at 0/50/100% XP), `EmptyState` (time bucket selection, CTA label toggle), `NewHabitFab` (accessibility label, press fires callback). Update existing `HabitsApp.fab.test.tsx` and `FloatingActionButton.test.tsx` for the FAB swap.
3. **Visual validation** — Start the iOS simulator via Expo; navigate to each screen. Screenshot and compare side-by-side with the design HTML opened in a browser. Per user's memory: "lint/types pass ≠ render matches." Don't claim done without the screenshot compare.
4. **Token compliance** — `grep -r "#FCD34D\|#92400e\|padding:\s*20\|fontWeight:\s*['\"]800" src/screens/HabitDetailScreen src/screens/CharacterScreen src/components/EmptyState src/features/habits/components/NewHabitFab` returns zero hits.
5. **Accessibility** — each new control has `accessibilityLabel` + `accessibilityRole`; screen reader narration follows the visible hierarchy.

## Out of scope (explicit)

- Token-cleanup in unrelated files flagged by the March audit but not part of these 5 screens — follow-up pass if desired.
- Dark-mode validation beyond what our theme tokens already cover — spot-check only.
- Prototype.html (not requested — only Design Improvements.html was).

## Branch note

System instructions asked for a branch rename. Plan mode blocks writes beyond this file, so I did not rename. Proposed name: `chain-design-lift` (17 chars). I'll rename on plan approval before any code changes.
