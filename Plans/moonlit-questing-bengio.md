# UX Design Review: Habit Detail Screen

**Reviewer:** Sally (UX Expert)
**Date:** 2026-03-22
**Screen:** HabitDetailScreen (modal)
**Branch:** biarritz-v1

---

## Context

The Habit Detail Screen is the primary deep-dive view for a single habit. It opens as a bottom-sliding modal and contains a hero area (icon + name), quick stats pills, a tabbed view (Calendar/Strength), and action buttons. This review audits the screen's design quality across theming, accessibility, information architecture, visual design, and interaction patterns.

---

## Executive Summary

The screen has solid accessibility annotations, haptic feedback, and spring-based animation choreography. However, it suffers from **14 hardcoded color values that bypass the theme system**, causing QuickStatsRow and DetailViewTabs to render light-mode colors on dark-mode backgrounds. Beyond theming, the screen underutilizes available habit data (frequency, notes, "completed today" state) and contains a dead-code component (`HeroSection.tsx`) that duplicates `DetailHero.tsx` with extra features that are never rendered.

---

## Findings

### CRITICAL

#### C1: QuickStatsRow is fully hardcoded -- broken in dark mode

`QuickStatsRow.tsx` uses zero theme tokens. All six colors are hardcoded hex literals:
- `#ecfdf5` (active pill bg) -- near-white on dark bg
- `#F5F0EB` (inactive pill bg) -- warm off-white
- `#047857` / `#6B6560` (value text)
- `#059669` / `#9C958D` (label text)

The component doesn't import `useThemeColors` at all.

**Impact:** Every dark-mode user sees light blobs on a dark surface. Most visible area after the hero.

**Fix:** Import `useThemeColors`, map to semantic tokens (`colors.status.successLight`, `colors.card`, `colors.text.secondary`).

**File:** `src/screens/HabitDetailScreen/components/QuickStatsRow.tsx` (lines 34, 37, 60, 66)

---

#### C2: DetailViewTabs + TabButton have hardcoded colors and unthemed NativeWind classes

Three related issues:
1. `DetailViewTabs.tsx` uses `bg-stone-100`, `bg-white` with **no `dark:` variants**
2. `DetailViewTabs.tsx` hardcodes `shadowColor: '#059669'` on indicator
3. `DetailViewTabButton.tsx` hardcodes `'#059669'` three times for active state; hint badge uses `bg-stone-200/60` with no dark variant

**Impact:** Entire tab control renders in light-mode colors regardless of theme.

**Fix:** Replace NativeWind classes with `isDark`-aware styles (pattern already used by `YearHeatmapSection`). Replace `#059669` with `colors.primary[600]`/`colors.primary[500]`.

**Files:**
- `src/screens/HabitDetailScreen/components/DetailViewTabs.tsx` (lines 62, 67, 72)
- `src/screens/HabitDetailScreen/components/DetailViewTabButton.tsx` (lines 40, 47, 54, 57)

---

#### C3: streakShadow constant has hardcoded light-mode background

`DetailHeader.constants.ts` line 16 sets `backgroundColor: '#ecfdf5'` -- a static object outside theme context. Currently unreferenced but exported alongside active constants, creating a maintenance trap.

**Fix:** Remove if unused, or convert to function accepting `isDark`.

**File:** `src/screens/HabitDetailScreen/components/DetailHeader.constants.ts` (line 15-21)

---

### HIGH

#### H1: Dead component -- HeroSection.tsx exported but never rendered

`HeroSection.tsx` is exported from the barrel but `HabitDetailScreen.tsx` renders `DetailHero` instead. HeroSection has features DetailHero lacks:
- Streak badge (gradient pill showing "N day streak!" when >= 7 days)
- Notes display (`habit.notes` as secondary text)
- Animated icon bounce via `useHeroAnimations`

**Impact:** Users lose streak celebration and notes visibility. Two parallel components for the same slot increases maintenance burden.

**Fix:** Decide which is canonical. If HeroSection features are wanted, replace DetailHero with HeroSection and delete DetailHero. Otherwise delete HeroSection + useHeroAnimations.

**Files:**
- `src/screens/HabitDetailScreen/components/HeroSection.tsx`
- `src/screens/HabitDetailScreen/components/DetailHero.tsx`

---

#### H2: `isCompletedToday` computed but never shown in UI

`useHabitDetailScreenState` computes and returns `isCompletedToday`, but no rendered component consumes it. No visual celebration or checkmark when the habit is completed today.

**Impact:** Missed positive reinforcement moment. Habit research (B.J. Fogg's "Tiny Habits") emphasizes immediate celebration as critical for behavior change.

**Fix:** Add visual indicator to hero area -- checkmark overlay on icon, status pill, or brief animation. Pass `isCompletedToday` from `screenState` to the hero component.

---

#### H3: No frequency/schedule info displayed

The habits schema has `frequency`, `daysOfWeek`, `preferredTime`, `cueTime`, `cueLocation`, `cueAfterBehavior` -- none displayed on the detail screen. Users must navigate to edit to recall their own schedule.

**Impact:** Detail screen loses utility as a reflection/planning tool.

**Fix:** Add a compact "Schedule" row between hero and stats showing frequency + preferred time (e.g., "Daily -- Mornings" or "Mon, Wed, Fri").

---

### MEDIUM

#### M1: DetailHero icon fallback colors are hardcoded amber

Lines 30-31 fall back to `#fef3c7` (amber-100) / `#f59e0b` (amber-500) when habit has no custom color. Bright amber on dark background (#111827) is jarring -- it's the largest element (80x80px).

**Fix:** Use `isDark ? colors.primary[100] : '#fef3c7'` or define `DEFAULT_ICON_BG` with variants.

**File:** `src/screens/HabitDetailScreen/components/DetailHero.tsx` (lines 30-31)

---

#### M2: Tab hint badges use 10px text -- below minimum readable size

`DetailViewTabButton.tsx` line 55 renders hints at `text-[10px]` (~7.5pt). Apple HIG minimum is 11pt, Material minimum is 12sp.

**Fix:** Increase to 11-12px. Adjust pill padding accordingly.

**File:** `src/screens/HabitDetailScreen/components/DetailViewTabButton.tsx` (line 55)

---

#### M3: Tab content transition (200ms FadeIn) too abrupt

Switching tabs uses `FadeIn.duration(200)` with no spatial transition. Scroll resets with `animated: false`. The tab indicator spring (~300ms) finishes after the content is already fully visible.

**Fix:** Extend to 300ms, add subtle `FadeInDown` with 8-12px translate, change `scrollTo` to `animated: true`.

**File:** `src/screens/HabitDetailScreen/components/HabitDetailContent.tsx` (lines 40, 65, 86)

---

#### M4: Hardcoded `#FFFFFF` ignores warm theme palette

Both `HabitDetailContent.tsx:32` and `YearHeatmapSection.tsx:26` use `isDark ? colors.card : '#FFFFFF'`. Light-mode `colors.card` is `#EDEAE5` (warm parchment). Pure white cards look cooler/whiter than the surrounding warm surface.

**Fix:** Replace `'#FFFFFF'` with `colors.card` in both files.

---

### LOW

#### L1: Icon container oversized for emoji (80x80 for 34px)

18% fill ratio. Feels like a "colored tile" rather than focused icon display.

**Fix:** Reduce container to 64x64 or increase emoji to ~44px.

---

#### L2: QuickStatsRow labels are generic

"current", "best", "total" are ambiguous without emoji context.

**Fix:** Use "streak", "best streak", "completions" for clarity.

---

#### L3: No visual feedback during calendar day toggle

`isTogglingCalendar` prevents double-taps but no visual indication (opacity change, spinner) that the tap registered.

**Fix:** Pass toggle state to calendar, show subtle opacity reduction on tapped cell.

---

#### L4: HabitStrengthSection uses hardcoded shadowColor constant

Very minor. Uses imported `COLORS.textPrimary` instead of theme token.

---

## Summary Table

| ID | Sev | Component | Issue | Effort |
|----|-----|-----------|-------|--------|
| C1 | Critical | QuickStatsRow | 6 hardcoded colors, no theme hook | S |
| C2 | Critical | DetailViewTabs + TabButton | Hardcoded colors + no dark: variants | S |
| C3 | Critical | DetailHeader.constants | Hardcoded light bg in static constant | XS |
| M4 | Medium | Content + YearHeatmap | Hardcoded #FFFFFF ignores warm theme | XS |
| M1 | Medium | DetailHero | Hardcoded amber fallback colors | S |
| H1 | High | HeroSection vs DetailHero | Dead component with feature loss | M |
| H2 | High | HabitDetailScreen | isCompletedToday unused | M |
| H3 | High | HabitDetailScreen | No frequency/schedule display | M |
| M2 | Medium | DetailViewTabButton | 10px hint text below min readable | XS |
| M3 | Medium | HabitDetailContent | 200ms FadeIn too abrupt | S |
| L1 | Low | DetailHero | 80x80 for 34px emoji | XS |
| L2 | Low | QuickStatsRow | Generic labels | XS |
| L3 | Low | Calendar handlers | No visual toggle feedback | S |
| L4 | Low | HabitStrengthSection | Hardcoded shadow constant | XS |

## Recommended Implementation Order

**Pass 1 -- Theme fixes (all Critical + M4 + M1):** C1 -> C2 -> C3 -> M4 -> M1. Single pass through all hardcoded colors. Smallest effort, highest impact.

**Pass 2 -- Component consolidation (H1):** Decide on DetailHero vs HeroSection, delete the loser.

**Pass 3 -- Feature additions (H2 + H3):** Add "completed today" indicator and schedule display.

**Pass 4 -- Polish (M2 + M3 + L*):** Font sizes, animation timing, label clarity.

## Verification

After implementation:
1. Toggle dark mode and verify QuickStatsRow, DetailViewTabs, and hero icon all use appropriate dark colors
2. Verify tab control renders with theme-aware backgrounds in both modes
3. Confirm no hardcoded hex colors remain in `HabitDetailScreen/` directory (grep for `#[0-9a-fA-F]{6}` outside constants)
4. If HeroSection is adopted, verify streak badge and notes render correctly
5. Visual regression: compare screenshots before/after in both light and dark mode
