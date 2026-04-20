# Improve Goals Tab on Habit Details — Motivation-First

## Context

The Goals tab (third tab on `HabitDetailScreen`) currently shows numbers only: a ring, a milestone pill, a badge row, and a projected-date banner. It tells users *where* they are but not *why they're doing this* or *what to do next*.

Meanwhile, the `habits` schema already stores rich motivation data that is never surfaced on this page:
- `why` — user's reason for building the habit
- `identity` — "I am a ___ person" (James Clear)
- `woopWish`, `woopOutcome`, `woopObstacle`, `woopPlan` — WOOP protocol (Oettingen)
- `vizSuccess*`, `vizFailure*` — dual visualization (Huberman)

The user's ask: **"make goals help user stay motivated and help them with their goal."**

Goal of this change: turn the Goals tab from a scoreboard into a coach — anchor the user to their own "why", give them a contextual nudge based on where they are, and let them adjust the goal without leaving the page.

## Scope

Three focused additions, no schema changes, no new backend calls:

1. **"Why this matters" anchor** — surface the user's own motivation on the goal page.
2. **Contextual coach line** — a short, state-aware encouragement tied to progress %.
3. **Inline "Adjust goal" action** — change or remove the goal without navigating to Edit.

Out of scope: goal history, custom durations, redesigning the ring/hero, editing WOOP fields from this screen.

## Critical Files

**Modify:**
- `src/screens/HabitDetailScreen/components/GoalTabContent.tsx` — compose the three new pieces around the existing `StreakGoalCard`.
- `src/screens/HabitDetailScreen/components/GoalTabEmptyState.tsx` — light motivation copy tweak (one line).

**New:**
- `src/screens/HabitDetailScreen/components/GoalWhyAnchor/GoalWhyAnchor.tsx` — motivation anchor card (≤100 lines).
- `src/screens/HabitDetailScreen/components/GoalWhyAnchor/GoalWhyAnchor.hooks.ts` — resolves which motivation field to show (why → identity → woopWish → null) and returns display text + label.
- `src/screens/HabitDetailScreen/components/GoalWhyAnchor/index.ts` — barrel.
- `src/screens/HabitDetailScreen/components/GoalCoachLine/GoalCoachLine.tsx` — single-line progress-aware coach (≤100 lines).
- `src/screens/HabitDetailScreen/components/GoalCoachLine/GoalCoachLine.hooks.ts` — `useCoachMessage({ currentStreak, streakGoal, bestStreak })` returns `{ emoji, message, tone }`.
- `src/screens/HabitDetailScreen/components/GoalCoachLine/index.ts` — barrel.
- `src/screens/HabitDetailScreen/components/GoalAdjustSheet/GoalAdjustSheet.tsx` — bottom-sheet reusing the preset chip picker with a "Remove goal" ghost button (≤100 lines).
- `src/screens/HabitDetailScreen/components/GoalAdjustSheet/index.ts` — barrel.

**Reuse (do not duplicate):**
- `GoalPresetChip` from `src/screens/HabitDetailScreen/components/GoalPresetChip.tsx` — chip UI for both empty state and adjust sheet.
- `useThemeColors` from `src/theme/ThemeContext.tsx` — all color access.
- `useHapticFeedback` from `src/hooks/useHapticFeedback.ts` — `triggerSelection` / `triggerSuccess`.
- `useMutation(api.habits.update)` — already used in `GoalTabEmptyState`; reuse for adjust/remove.
- `typography` from `src/theme/typography.ts` — text tokens.
- `Animated` + `FadeInDown` from `react-native-reanimated` — entry animations.

## Design Details

### 1. Why Anchor (`GoalWhyAnchor`)
- Shown only when a goal exists AND at least one of `why`/`identity`/`woopWish` is set.
- Priority: `habit.why` > `habit.identity` > `habit.woopWish`.
- Label changes with source: "Your why" / "Who you're becoming" / "Your wish".
- Rendered as a soft-tinted card (`colors.status.streakLight` background, rounded-2xl) *above* the existing `StreakGoalCard`.
- Layout: small icon (💭 for why, 🌱 for identity, ⭐ for wish) + label + italic quote of the value.
- If none set and a goal exists, render a subtle inline CTA: "Add a reason — people who write their why are 2× more likely to finish." (no inline editor in this PR; tapping opens the existing Edit screen via `onEdit` prop already threaded through the detail modal — verify path, otherwise omit the CTA in v1).

### 2. Coach Line (`GoalCoachLine`)
- Single line beneath the ring, above `NextMilestonePill`.
- Emoji + 6-10 word message, based on `overallPercent` (computed by existing `useStreakGoalData`) and `bestStreak` vs `currentStreak`:
  - Broken streak (`currentStreak === 0 && bestStreak > 0`): 🔁 "Reset happens. Today is day 1 again."
  - Just started (< 10%): 🌱 "First week is the hardest. Show up today."
  - Building (10–40%): 📈 "Momentum's on your side — keep the chain alive."
  - Mid (40–70%): 💪 "Past halfway. Closer to goal than the start."
  - Home stretch (70–95%): 🔥 "Don't break the chain now."
  - Complete (≥ 100%): 🏆 "Goal crushed. Set a new one?" (adds affordance to Adjust sheet).
- Pure presentation; no haptics.

### 3. Adjust Sheet (`GoalAdjustSheet`)
- Triggered by a small ghost "Adjust goal" text button at the bottom of the card (below `ProjectedBanner`).
- Bottom-sheet modal using existing RN `Modal` pattern found in `HabitDetailScreen` (reuse the modal primitive — verify during implementation).
- Contents:
  - Title: "Adjust your goal"
  - Preset chips (same 6 presets as empty state), selected = current `goalDuration`.
  - Primary button: "Update goal" → calls `updateHabit({ habitId, goalDuration })` + `triggerSuccess()` + close.
  - Ghost button: "Remove goal" → calls `updateHabit({ habitId, goalDuration: 0 })` + close (card will re-render as empty state).
- Confirmation for removal: inline secondary press ("Tap again to confirm") — avoid blocking alert dialogs (harness rule).

### 4. GoalTabContent composition
```tsx
{hasGoal ? (
  <>
    <GoalWhyAnchor habit={habit} />
    <StreakGoalCard ... coachLine={<GoalCoachLine .../>} />
    <AdjustGoalButton onPress={() => setSheetOpen(true)} />
    <GoalAdjustSheet visible={sheetOpen} ... />
  </>
) : (
  <GoalTabEmptyState habitId={habit._id} />
)}
```
If passing `coachLine` as a prop into `StreakGoalCard` proves invasive, render `GoalCoachLine` as a sibling directly above `NextMilestonePill` by wrapping in a small local composition inside `GoalTabContent` (preferred — keeps `StreakGoalCard` untouched).

### 5. Empty state (`GoalTabEmptyState`)
- Replace line 2 of the subtitle ("66 days is the science-backed sweet spot.") with two-line copy:
  - "Pick a target — we'll celebrate every milestone."
  - Keep the existing "66 days is the science-backed sweet spot" as helper text below chips (preserves the science framing).
- No structural changes.

## Styling Rules
- Stay on Tailwind className + `useThemeColors()` tokens. Match existing sibling patterns (rounded-2xl, `shadows.card`, `typography.*`).
- No new theme tokens. All colors from `colors.status.streak*`, `colors.primary.*`, `colors.text.*`, `colors.light.surface`.
- Every new file ≤100 non-blank/non-comment lines (per repo's `max-lines` rule). Split with `.hooks.ts` if tight.

## Verification

**Manual (required):**
1. `npm start` → open iOS simulator.
2. Open any habit without a goal → Goals tab → empty state still renders, copy tweak visible, setting goal works.
3. Open a habit with `currentStreak = 0, bestStreak > 0, goalDuration > 0` → see "Reset happens…" coach line.
4. Open a habit with `why` set → see "Your why" anchor card with the quote.
5. Open a habit with only `identity` set → see "Who you're becoming" anchor.
6. Open a habit with neither → anchor hidden (or CTA visible — per decision in §1).
7. Tap "Adjust goal" → sheet opens → change preset → primary button updates, card re-renders with new goal.
8. Tap "Adjust goal" → "Remove goal" twice → card flips to empty state.
9. Simulate `currentStreak / goalDuration` at 0, 5, 30, 60, 95, 100% → coach messages match brackets.

**Automated:**
- `npm run lint:max-lines` → no new violations.
- `npm run typecheck` (or equivalent project script) → passes.
- Add unit tests only for `useCoachMessage` (pure function) — 6 bracket cases. No snapshot tests for new components in this PR.

**Screenshot-based (per user's validate-against-mock preference):**
- Before/after screenshots of Goals tab in three states: no goal, active goal with `why`, active goal without `why`. Post in PR description.

## Non-Goals / Explicit Deferrals
- No changes to Convex schema or mutations other than existing `habits.update`.
- No editing of `why` / `identity` / WOOP from this page (v1 CTA routes to Edit only).
- No redesign of the ring, hero, milestone badges, or projected banner.
- No celebration animations for hitting milestones (exists elsewhere — out of scope).
- No copy tests / A/B — messages are hard-coded constants in `GoalCoachLine.hooks.ts`.
