# Phase 02: Animation Token Consolidation

**Priority:** P0 - Critical
**Scope:** Eliminate duplicate spring/duration constants, single source of truth
**Context:** The canonical animation tokens live in `src/theme/animations.ts` (springs, durations, easings). But there are 5+ competing files that re-declare the same values. When one changes, the others don't, causing celebration animations to feel different across screens (HabitCard=damping:12, TodaysFocusCard=damping:8, MilestoneCelebration=damping:10). There's also an extreme outlier: EmojiChip uses damping:3.

## Rules

- `src/theme/animations.ts` is the SINGLE SOURCE OF TRUTH for all spring presets and durations
- Other files should IMPORT from theme, not re-declare values
- Sequence/stagger constants in `src/constants/animations.ts` are fine to keep (they provide app-specific sequence patterns)
- The `MAGIC_NUMBERS` export in `src/constants/animations.ts` is already deprecated - leave it for now
- When consolidating, keep backward compatibility by re-exporting from theme
- All celebration bouncy springs should use `springs.bouncy` = `{ damping: 10, stiffness: 180 }` from theme

---

- [ ] **Consolidate HabitsEmptyStateMinimal spring configs.** The file `src/features/habits/components/HabitsEmptyStateMinimal/animations/springConfigs.ts` declares 6 spring configs (chipHover, chipPress, ctaPress, entrance, smooth, successPop) that are ALL identical (`damping: 18, stiffness: 150`). Replace the entire file content to import and re-export from theme: `import { springs } from '../../../../../theme/animations'; export const SPRING_CONFIGS = { chipHover: springs.standard, chipPress: springs.standard, ctaPress: springs.standard, entrance: springs.standard, smooth: springs.standard, successPop: springs.standard } as const; export const EXIT_SPRING_CONFIG = springs.standard;`. Then verify all imports in `src/features/habits/components/HabitsEmptyStateMinimal/animations.ts` still work. Run `npx tsc --noEmit` on the changed files.

- [ ] **Consolidate src/constants/animations.ts SPRING_CONFIG.** In `src/constants/animations.ts`, the `SPRING_CONFIG` constant (line 11) duplicates `springs.standard`. Change it to: `import { springs } from '../theme/animations'; export const SPRING_CONFIG = springs.standard;`. Keep `ANIMATION_DURATIONS`, `STAGGER_DELAYS`, `ANIMATION_SEQUENCES`, `OPACITY_VALUES`, `SCALE_VALUES`, `INTERPOLATION_RANGES`, and deprecated `MAGIC_NUMBERS` as-is since they provide app-specific values not in theme. Verify consumers still compile: check `src/utils/animationHelpers.ts` which imports `SPRING_CONFIG` from this file.

- [ ] **Consolidate src/utils/animations/helpers.ts SPRING_CONFIGS.** In `src/utils/animations/helpers.ts` (line 25), `SPRING_CONFIGS` re-declares bouncy, entrance, snappy, exit configs. Replace with imports from theme: `import { springs } from '../../theme/animations';` then `export const SPRING_CONFIGS = { bouncy: springs.bouncy, entrance: springs.standard, snappy: springs.snappy, exit: springs.exit } as const;`. Verify all consumers (`src/features/habits/components/BottomActionBar/useBarAnimations.ts`, `src/features/habits/components/HabitsEmptyStateMinimal/animations.ts`) still compile correctly.

- [ ] **Consolidate src/utils/animations/cardPressAnimation.ts.** In `src/utils/animations/cardPressAnimation.ts` (line 25), `CARD_PRESS_SPRING_CONFIG` duplicates `springs.button`. Replace with: `import { springs } from '../../theme/animations'; export const CARD_PRESS_SPRING_CONFIG: WithSpringConfig = springs.button;`. Verify the file compiles.

- [ ] **Consolidate src/constants/ui-values.ts ANIMATION_VALUES.** In `src/constants/ui-values.ts` (line 270), `ANIMATION_VALUES` duplicates spring damping/stiffness values. Replace with: `import { springs, durations } from '../theme/animations'; export const ANIMATION_VALUES = { springDamping: springs.standard.damping, springStiffness: springs.standard.stiffness, pressAnimationDuration: 50, staggerDuration: durations.stagger } as const;`. Do NOT change the other constants in this file (OPACITY, SHADOW_OPACITY, SCALE, ANIMATION_DURATION, etc.) as they serve different purposes.

- [ ] **Fix EmojiChip extreme spring outlier.** In `src/components/CreateHabitModal/components/EmojiPicker/EmojiChip.tsx`, find the spring with `damping: 3` and change it to use `springs.standard` (`damping: 18, stiffness: 150`). Import `springs` from the theme. This damping:3 value is an extreme outlier that causes unrealistic bouncing and potential visual jank on lower-end devices.

- [ ] **Standardize celebration bounce springs.** The bouncy spring for celebrations should be consistent. Fix these files to all use `springs.bouncy` (damping: 10, stiffness: 180) from theme: (1) `src/features/habits/components/BottomActionBar/useCelebrationAnimations.ts` - line 18 has `BOUNCE_SPRING = { damping: 12, stiffness: 200 }` - change to import springs.bouncy from theme. (2) `src/components/ProgressSectionConsolidated/TodaysFocusCard/hooks/useCelebrationEffects.ts` - find the spring with `damping: 8` and replace with springs.bouncy. (3) `src/components/MilestoneCelebration/constants.ts` - find `BADGE_BOUNCE_DAMPING` and `BADGE_BOUNCE_STIFFNESS` and replace with values from springs.bouncy (or import directly). After changes, all three celebration animations will feel identical.

- [ ] **Consolidate src/lib/timing/config.ts SPRING_CONFIGS.** Read `src/lib/timing/config.ts` and find the `SPRING_CONFIGS` export (around line 140). Replace the spring config declarations to import from theme: `import { springs } from '../../theme/animations';` and map the configs to theme springs. Verify all consumers still compile.
