# Phase 6: Unify Animation System & Press Feedback

**Goal:** Consolidate the two competing animation systems and standardize press feedback across all interactive elements.

**Context:** The app has two animation config sources that need consolidation:

- `src/theme/animations.ts` — defines `durations`, `easings`, and `springs` (bouncy, snappy, gentle)
- `src/constants/motion.ts` — defines `Springs.button`, `Springs.sheet`, `Springs.gentle`, `Springs.bouncy`, `Springs.pulse`, `Springs.micro` (more complete set)

**UPDATE (Feb 2025):** `motion.ts` now has well-defined spring presets, but consumers still hardcode springs instead of importing them. Key offenders: `useButtonAnimation.ts` (hardcoded `{damping: 15, stiffness: 150}`), `useToastAnimations.ts` (4 hardcoded instances), `Modal.constants.ts` (3 custom springs alongside 1 import).

Interactive elements have inconsistent press feedback: some use scale animation (0.95 or 0.96), some use opacity only, and some have no visual feedback. `AnimatedPressable` exists and works correctly but is underutilized.

---

- [x] **Consolidate animation constants into a single source.** `src/constants/motion.ts` already has the more complete set of spring presets (button, sheet, gentle, bouncy, pulse, micro). Copy these values into `src/theme/animations.ts` as the canonical `springs` object, replacing the current 3-preset version (bouncy, snappy, gentle). The merged `springs` object should include: `button: { damping: 15, stiffness: 300 }`, `sheet: { damping: 20, stiffness: 200 }`, `gentle: { damping: 20, stiffness: 100 }`, `snappy: { damping: 15, stiffness: 150 }`, `bouncy: { damping: 10, stiffness: 180 }`, `pulse: { damping: 12, stiffness: 250 }`, `micro: { damping: 15, stiffness: 400 }`. Then update `src/constants/motion.ts` to re-export from `@/theme/animations` instead of defining its own values. Ensure all existing imports from `constants/motion` still work. Run `npx eslint src/theme/animations.ts src/constants/motion.ts --fix`.

  > **Done (Feb 2026):** Merged 7 spring presets into `src/theme/animations.ts`. `motion.ts` now re-exports `springs as Springs` from `@/theme/animations` — all 28 consumer files continue to work unchanged. ESLint clean. 14 new tests pass.

- [x] **Standardize Button press feedback to use theme springs.** In `src/components/Button/useButtonAnimation.ts`, replace the hardcoded spring `{ damping: 15, stiffness: 150 }` with the theme's `springs.button` (imported from `@/theme`). The scale target should be `0.96` to match `AnimatedPressable`. Then search all other files that define press animations with hardcoded springs and replace:
  - `src/components/CategoryChip/useCategoryChipHandlers.ts` — replace `{ damping: 15, stiffness: 200 }` with `springs.button`
  - `src/components/FullsizeTemplatePreview/components/ScienceBox.tsx` — replace `{ damping: 15, stiffness: 300 }` with `springs.button`
  - `src/components/Toast/useToastButtonAnimation.ts` — replace with `springs.button`
  - Run lint on each modified file.
    > **Done (Feb 2026):** Replaced hardcoded springs in all 4 files → `springs.button` from `@/theme/animations`. `useButtonAnimation` scale target changed from 0.95→0.96 to match AnimatedPressable. `useCategoryChipHandlers` (stiffness:200→button), `ScienceBox` (stiffness:300→button), `useToastButtonAnimation` (removed local SPRING_CONFIG). ESLint clean. 18 new tests pass.

- [x] **Add press feedback to RewardCelebrationToast buttons.** In `src/components/RewardCelebrationToast/RewardCelebrationToast.tsx` (around lines 52-90), the Pressable buttons only use Tailwind `active:opacity-80` classes with no scale animation. Replace them with the app's `AnimatedPressable` component (from `src/components/ui/AnimatedPressable.tsx`) or add `usePressAnimation` hook to provide consistent scale feedback matching other buttons. Import `AnimatedPressable` and replace the plain `Pressable` wrapping the toast action buttons.

  > **Done (Feb 2026):** Replaced all 3 Pressable buttons (Share, Primary CTA, Dismiss) with AnimatedPressable. Removed `active:opacity-80`, `active:bg-stone-100`, `active:opacity-60` Tailwind press classes — scale animation now handles press feedback. Container still uses RN Animated for slide-in/out. Pre-existing test `RewardCelebrationToast.test.tsx` has stale "Unlock boosters" text expectation (was already failing before changes). 10 new tests pass.

- [x] **Add press animation to SettingsRow.** In `src/components/SettingsModal/SettingsRow.tsx` (around lines 35-45), the component uses `TouchableOpacity` with haptic-only feedback. Replace `TouchableOpacity` with `AnimatedPressable` (from `src/components/ui/AnimatedPressable.tsx`) to provide consistent scale feedback. If `AnimatedPressable` doesn't support all the props SettingsRow needs, add `usePressAnimation` from `src/hooks/usePressAnimation.ts` instead.

  > **Done (Feb 2026):** Replaced `TouchableOpacity` with `AnimatedPressable` for navigation/selection row types. Removed `activeOpacity={0.7}` — scale animation now handles press feedback (default 0.96). Toggle and info types unchanged (non-interactive). Haptic feedback preserved. ESLint clean. 10 new tests pass.

- [x] **Replace hardcoded spring configs in Toast animations.** In `src/components/Toast/useToastAnimations.ts` (lines 44, 58, 68, 89-90), there are 4 instances of `{ damping: 15, stiffness: 150 }`. Replace all with `springs.snappy` imported from `@/theme`. Similarly fix `src/components/DeleteUndoToast/useDeleteToastAnimations.ts` (line 22). Also fix `src/components/HabitCard/gestures/panGesture.ts` (lines 21-24, 31) — replace swipe spring with `springs.snappy`. Run lint on all modified files.

  > **Done (Feb 2026):** Replaced 4 hardcoded `{ damping: 15, stiffness: 150 }` in useToastAnimations.ts, removed `SPRING_CONFIG` constant in useDeleteToastAnimations.ts (4 usages → `springs.snappy`), and replaced 2 inline springs in panGesture.ts → `springs.snappy`. All values were exact matches for `springs.snappy` so behavior is unchanged. ESLint clean (only pre-existing function-length warnings). 14 new tests pass.

- [x] **Replace hardcoded spring configs in Modal animations.** In `src/components/Modal/Modal.constants.ts` (lines 16-42), replace:
  - `BOTTOM_SHEET_SPRING_CONFIG = { damping: 26, stiffness: 300 }` — create a new `springs.bottomSheet` in theme with these values, then reference it
  - `EXIT_SPRING_CONFIG = { damping: 26, mass: 1, stiffness: 420 }` — create `springs.exit` in theme
  - `FULLSCREEN_ORGANIC_SPRING` already references `Springs.sheet` (good) — update to use `springs.sheet` from theme
  - Run lint on `src/components/Modal/`.
    > **Done (Feb 2026):** Added 3 new spring tokens to `src/theme/animations.ts`: `bottomSheet` (damping:26, stiffness:300), `exit` (damping:26, mass:1, stiffness:420), `gesture` (damping:20, mass:1, stiffness:450). Updated `Modal.constants.ts` to import `springs` directly from `@/theme/animations` instead of re-exported `Springs` from `constants/motion`. `BOTTOM_SHEET_SPRING_CONFIG` → `springs.bottomSheet`, `EXIT_SPRING_CONFIG` → `springs.exit`, `GESTURE_SPRING_CONFIG` → `springs.gesture`, `FULLSCREEN_ORGANIC_SPRING` → `...springs.sheet`. All 3 consumer files (runEnterAnimation, runExitAnimation, useModalGestures) unchanged — they import named constants from Modal.constants.ts. ESLint clean (0 new issues). Updated existing animation-springs test (7→10 presets). 11 new tests pass.
