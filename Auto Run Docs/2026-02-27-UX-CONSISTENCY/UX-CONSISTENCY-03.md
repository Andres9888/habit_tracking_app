# UI/UX Consistency Playbook — Phase 03 (Spacing, typography, and interaction feedback)

## Goal

Clean up remaining high-visibility consistency gaps from P1/P2 while keeping behavior stable.

## Checklist

- [x] In `src/components/HabitCard/HabitCard.styles.ts` and `src/screens/onboarding/OnboardingScreen.styles.ts`, standardize spacing tokens:
  - Replace off-grid numeric margins with `spacing` tokens (`marginVertical: 6` → `spacing.sm`, `marginTop: 2` → `spacing.xs`, `paddingBottom: 60` → `spacing['3xl']` where the design intent is large footer breathing room).
  - Avoid introducing new literals.
  - Completed in this pass: `HabitCard.styles.ts` uses `spacing.sm`/`spacing.xs`; `OnboardingScreen.styles.ts` uses `spacing['3xl']` and imports `spacing`.

- [x] In `src/components/HabitCard/HabitCard.styles.ts` and `src/screens/onboarding/OnboardingScreen.styles.ts`, migrate hardcoded font weight strings to `fontWeights`:
  - `fontWeight: '600'` -> `fontWeights.semibold`
  - `fontWeight: '700'` -> `fontWeights.bold`
  - Keep all other typographic properties untouched.
  - NOTE: Implemented in `src/components/HabitCard/HabitCard.styles.ts` and `src/screens/onboarding/OnboardingScreen.styles.ts`; replaced all `'600'` values with `fontWeights.semibold` and left non-target values unchanged.

- [x] In `src/components/CalendarTimeline/components/DayCell.tsx`, add tactile feedback on day selection:
  - Hook `onPress` through existing haptics utility and fire a light/tap pattern before/with `onDayPress(date)`.
  - Keep disabled/`reduceMotion` behavior unchanged.
  - Implemented: added `useHaptics` with `preference: reduceMotion` and `tap` trigger prior to `onDayPress`.

- [ ] In `src/components/HabitsEmptyStateMinimal` (chips, CTA, input, and badge surfaces), replace any remaining hardcoded dark/light color fallbacks with shared theme values to reduce manual skew between variants.
  - Start from `useEmptyStateColors.ts` and propagate updates to `HeroIcon.tsx`, `Chip.tsx`, `CtaButton.tsx`, and `HabitInput` usage.

- [ ] In `src/components/ProgressSectionConsolidated/TodaysFocusCard/hooks/useCelebrationEffects.ts`, if celebration pulse still uses a non-canonical spring, switch to `springs.bouncy` for intent-driven pop and `springs.standard` for settle.

- [ ] Add a one-pass check for remaining direct token violations:
  - Run regex checks for `fontWeight: '600'| '700'` in files touched in this phase.
  - Confirm no new `damping: 3` values remain in touched components.
