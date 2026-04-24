# Goal section visual consistency with Strength/Calendar

## Context

On the Habit Detail screen, three sections stack in a scrollspy layout: **Calendar**, **Strength**, **Goal**. Calendar and Strength each render as a single theme-aware card (`rounded-2xl`, `backgroundColor: colors.card`, `shadows.card`). The Goal section is the odd one out:

1. **No outer card** — `GoalTabContent` renders directly on the screen gradient with only `px-5` padding, while Strength/Calendar sit in contained cards.
2. **Nested sub-cards look cluttered** — `StreakGoalCard` renders four separate sub-cards (`CompactHero`, `NextMilestonePill`, `MilestonesRow`, `ProjectedBanner`). In Strength, the internal `StrengthHero`/`StrengthChart`/`StrengthStatsRow` sit flat inside one outer card.
3. **Hardcoded non-theme colors** — the sub-cards use `colors.light.surface` + `colors.gray[200]` literals. In dark mode these stay bright while the rest of the screen goes dark, producing a second mismatch.

User confirmed: "All of the above — make Goal visually consistent with Strength/Calendar."

Intended outcome: Goal reads as one cohesive card matching the Strength pattern, with only the intentional accent elements (gold "Next milestone" pill, parchment "Why" pill) preserved as deliberate highlights.

## Approach

Mirror the `HabitStrengthSection` pattern exactly. Wrap Goal's composition in a single theme-aware outer card, strip the redundant inner sub-card chrome, and keep only the elements that are intentionally colored accents.

### Changes

**1. `src/screens/HabitDetailScreen/components/GoalTabContent.tsx`**
- Replace the bare `Animated.View className='px-5'` wrapper with a card container modeled on `HabitStrengthSection.tsx:112-155`:
  - `className='overflow-hidden rounded-2xl shadow-sm'`
  - `style={{ ...shadows.card, backgroundColor: themeColors.card }}`
  - Inner `<View className='p-5'>` for padding.
- Add a "Goal" section heading at the top of the card (mirrors `"Habit Strength"` heading in `HabitStrengthSection.tsx:124-126`) using `typography.heading3` + `themeColors.text.primary`. Place "Adjust goal" as a right-aligned trailing link in the same header row (replaces the current centered bottom button) so the header mirrors Strength's title + control pattern.
- Import `shadows` from `../../../theme/spacing` (already used in `HabitDetailContent.tsx`).
- Apply the same theme-aware card treatment to the `!hasGoal` empty-state branch so both states match.

**2. `src/screens/HabitDetailScreen/components/HabitDetailContent.tsx` (line 92-94)**
- Change the Goal wrapper from `<View className='mt-4'>` to `<View className='mx-4 mt-4'>` so Goal aligns with Strength's horizontal insets. Keep `onLayout={makeSectionLayoutHandler('goal')}` on the wrapper (scrollspy still needs the y-position of the outer node). Do not add `colors.card`/`shadows.card` here — the inner `GoalTabContent` owns card styling now (same separation of concerns as `HabitStrengthSection` which renders its own card while `HabitDetailContent.tsx:74-90` also wraps it in a card; we replicate only the inner pattern to avoid the existing double-wrap wart).

**3. `src/components/ProgressSectionConsolidated/StreakGoalCard/styles/compact.styles.ts`**
- `heroCard` (lines 44-51): remove `backgroundColor`, `borderColor`, `borderWidth`, `borderRadius`. Keep `marginBottom` + `padding` (adjust padding to match sibling rhythm — likely `paddingHorizontal: 0`, `paddingVertical: 4`).
- `milestonesCard` (lines 96-104): same treatment — strip background/border/radius, keep vertical spacing.
- **Keep `nextCard` (lines 118-129) intact** — this is the intentional gold "Next milestone" pill and must remain as a colored accent inside the outer card.

**4. `src/components/ProgressSectionConsolidated/StreakGoalCard/styles/dashboard.styles.ts`**
- `bannerCard` (lines 13-22): strip `backgroundColor`/`borderColor`/`borderWidth`/`borderRadius`. Keep padding + flex layout. `ProjectedBanner` becomes a flat row inside the outer card.

**5. Do NOT touch**
- `GoalWhyAnchor` (parchment pill) — intentional warm-toned accent, matches Product Intent notes.
- `NextMilestonePill` / `nextCard` styling — intentional gold streak pill.
- `GoalCoachLine` — text-only line, no card chrome to strip.
- `StreakGoalCard.tsx` itself — composition stays the same.
- Strength and Calendar sections — already consistent.

## Critical files

- `src/screens/HabitDetailScreen/components/GoalTabContent.tsx` (rewrite wrapper + add header + adjust button placement)
- `src/screens/HabitDetailScreen/components/HabitDetailContent.tsx` (one line: add `mx-4` to the Goal wrapper)
- `src/components/ProgressSectionConsolidated/StreakGoalCard/styles/compact.styles.ts` (strip `heroCard` + `milestonesCard` chrome)
- `src/components/ProgressSectionConsolidated/StreakGoalCard/styles/dashboard.styles.ts` (strip `bannerCard` chrome)

## Reference patterns to reuse (already in-repo)

- `src/components/HabitStrengthSection/HabitStrengthSection.tsx:111-155` — canonical outer-card + header + flat-inner-content pattern.
- `src/screens/HabitDetailScreen/components/YearHeatmapSection.tsx:28-46` — alternative card pattern (also OK, but Strength is the closer analog since Goal has a title).
- `src/theme/spacing.ts` — `shadows.card` export.
- `src/theme/ThemeContext.ts` — `useThemeColors().colors.card`, `.text.primary`.

## Verification

1. **Build & type-check**: `npm run typecheck` and `npm run lint` pass cleanly (no new `max-lines` warnings — changes are additive-small in files already under the limit).
2. **Visual check — light mode**: Start dev server, navigate to any habit with a `goalDuration > 0`:
   - Goal section sits in a rounded card flush with Strength's horizontal alignment.
   - "Goal" header visible at the top of the card, "Adjust goal" link right-aligned in same row.
   - `CompactHero` stats, milestones row, and projected banner render flat inside the card, separated only by vertical spacing.
   - Gold "Next milestone" pill and parchment "Why" pill still render as colored accents.
3. **Visual check — dark mode**: toggle theme. Goal card background follows `colors.card` (dark surface), text stays legible, no orphan light panels.
4. **Empty state**: open a habit with `goalDuration === 0`. `GoalTabEmptyState` should render inside the same outer card treatment.
5. **Scrollspy**: scroll through the detail screen. Tabs (`calendar`/`strength`/`goal`) highlight as each section enters the viewport — confirms the `onLayout` handler on the outer wrapper still reports the correct y-position.
6. **Pre-commit**: run `git commit --no-verify` (pre-commit eslint is broken upstream per memory) — run `tsc --noEmit` manually first.
