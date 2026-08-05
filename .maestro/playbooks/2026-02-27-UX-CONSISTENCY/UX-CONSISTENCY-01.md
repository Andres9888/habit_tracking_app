# UI/UX Consistency Playbook — Phase 01 (P0)

## Goal

Unify motion system sources and remove hardcoded outlier springs/shadows so core interactions feel cohesive.

## Scope

Files listed below are the first pass to stabilize high-impact inconsistencies.

## Checklist

- [x] In `src/constants/animations.ts`, make this module a compatibility facade over `src/theme/animations.ts`:
  - Import canonical animation tokens from `@/theme/animations`.
  - Keep legacy exports names (`SPRING_CONFIG`, `ANIMATION_DURATIONS`, `STAGGER_DELAYS`, `ANIMATION_SEQUENCES`, `MAGIC_NUMBERS`) but source their values from `durations`, `springs`, and existing constants to remove duplicated truth.
  - Keep `ANIMATION_DURATIONS`/`STAGGER_DELAYS` semantically unchanged for current callers.
  - Add a short comment indicating migration status so future edits stay centralized.
  - Completed: `src/constants/animations.ts` now reuses canonical `durations`/`springs` while keeping all legacy export names and existing call-site behavior intact.

- [x] In `src/components/animations/constants.ts`, replace inline spring objects with aliases to canonical springs:
  - `SPRING_PREMIUM` and `SPRING_BUTTON` -> `springs.standard`
  - `SPRING_GENTLE` -> `springs.gentle`
  - `SPRING_BOUNCY` -> `springs.bouncy`
  - `STAGGER_DELAY` -> canonical stagger duration used for list entrances.
  - Keep file-level behavior stable for all existing imports.
  - **Completed (2026-02-27):** Switched all inline spring payloads to canonical references in `src/theme/animations.ts` and sourced `STAGGER_DELAY` from `durations.stagger` while preserving external constant names and values consumed by existing call sites.

- [x] In `src/components/animations/constants.ts` and `src/constants/motion.ts`, ensure the same spring presets are exposed as read-only constants so downstream modules can safely consume either path without re-encoding values.
  - Completed: `src/constants/motion.ts` now imports canonical `springs` from `@/theme/animations`, exposes frozen `SPRING_*` aliases, and freezes the exported `Springs` object for shared read-only access.

- [x] In `src/components/CreateHabitModal/components/EmojiPicker/EmojiChip.tsx`, replace the custom spring payload in `handlePressOut`:
  - Replace `withSpring(1, { damping: 3, stiffness: 300 })` with the canonical premium spring from `src/theme/animations`.
  - Keep the same 1→1.08→1 timing and `reduceMotion` behavior.
- Completed: `withSpring(1, springs.standard)` now used in `src/components/CreateHabitModal/components/EmojiPicker/EmojiChip.tsx`; animation timing and reduce-motion behavior remain unchanged. Added source-level regression coverage in `tests/unit/theme/button-press-springs.test.ts`.

- [x] In `src/components/MilestoneCelebration/constants.ts`, align spring tuning with canonical values:
  - Use `springs.bouncy` for badge launch values.
  - Use `springs.standard` for settle values.
  - Leave timing constants unchanged unless duration values are tied to old spring assumptions.
  - **Completed (2026-02-27):** Replaced hardcoded badge spring damping/stiffness with `springs.bouncy` and `springs.standard` aliases in `src/components/MilestoneCelebration/constants.ts`; duration-based timing constants remain unchanged.

- [x] In `src/screens/HabitDetailScreen/components/useHeroAnimations.ts` and
      `src/components/ProgressSectionConsolidated/TodaysFocusCard/hooks/useCelebrationEffects.ts`, replace direct hardcoded `damping`/`stiffness` values for non-identity motion with canonical spring constants (`springs.standard` by default, `springs.bouncy` only for explicit celebratory emphasis).
  - Completed 2026-02-27: Hero icon, badge, and focus-card celebration springs now consume canonical exports from `@/theme/animations` (`springs.standard` with one celebratory `springs.bouncy` step in the burst sequence), preserving existing timing and reduce-motion branches.

- [x] Update `src/components/CalendarTimeline/CalendarTimeline.styles.ts` and `src/features/habits/components/HabitsEmptyStateMinimal/animations/springConfigs.ts` to stop defining duplicate spring semantics for the same interaction types if they are purely aliases of canonical presets.
  - Completed 2026-02-27: `src/features/habits/components/HabitsEmptyStateMinimal/animations/springConfigs.ts` now derives all interaction spring entries from canonical `springs.standard`, with a frozen shared config (`STANDARD_SPRING_CONFIG`) that preserves existing `mass: 1` on this consumer path. `CalendarTimeline.styles.ts` was reviewed and did not contain duplicate spring semantics in its current implementation.
