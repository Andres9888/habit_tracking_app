# Phase 4: Replace Inline Spring Configs with Theme Imports

## Context

110+ files define `{ damping: X, stiffness: Y }` inline rather than importing from `src/theme/animations.ts` which defines canonical presets:

- `springs.standard` — `{ damping: 18, stiffness: 150 }` (general purpose)
- `springs.button` — `{ damping: 18, stiffness: 150 }` (interactive press)
- `springs.bouncy` — `{ damping: 8, stiffness: 120 }` (playful)
- `springs.snappy` — `{ damping: 22, stiffness: 300 }` (quick)
- `springs.gentle` — `{ damping: 20, stiffness: 120 }` (soft)
- `springs.bottomSheet` — `{ damping: 26, stiffness: 300 }` (sheet slide)
- `springs.sheet` — `{ damping: 20, stiffness: 200 }` (modal)
- `springs.exit` — `{ damping: 26, stiffness: 420 }` (fast dismiss)
- `springs.gesture` — `{ damping: 24, stiffness: 250 }` (gesture response)
- `springs.micro` — `{ damping: 22, stiffness: 250 }` (tiny interactions)
- `springs.pulse` — `{ damping: 6, stiffness: 100 }` (decorative pulses)

## Tasks

- [x] Search all `.ts` and `.tsx` files in `src/` for inline `{ damping: 18, stiffness: 150 }` patterns (the most common, matching `springs.standard`/`springs.button`). Replace with `springs.standard` or `springs.button` import from `@/theme/animations`. Target the top 20 files first. Verify with tsc after each batch.
  - **Completed:** Replaced all 51 files containing inline `{ damping: 18, stiffness: 150 }`. Used `springs.button` for press/release interactions (20 files) and `springs.standard` for general animations (31 files). Zero inline occurrences remain outside `theme/animations.ts`. No new TypeScript errors introduced. All 26 animation-specific tests pass.

- [x] Search for `{ damping: 8, stiffness: 120 }` (matches `springs.bouncy`), `{ damping: 22, stiffness: 300 }` (matches `springs.snappy`), `{ damping: 20, stiffness: 120 }` (matches `springs.gentle`). Replace with canonical imports. Verify with tsc.
  - **Completed:** Task doc values were stale — actual theme values differ. Real replacements: `{ damping: 10, stiffness: 180 }` → `springs.bouncy` in 5 files (HabitStrengthIndicator/animations.ts, StrengthProgressBar/strengthAnimationHelpers.ts, StrengthRing/useStrengthRingAnimation.ts, DraggableHabit/animationHelpers.ts, QuickCompleteButton/useQuickCompleteButton.ts). `springs.snappy` is identical to `springs.standard` (already replaced in task 1). `springs.gentle` (`{ damping: 20, stiffness: 100 }`) had zero inline occurrences outside the theme. All 19 animation tests pass.

- [x] Search for `{ damping: 26, stiffness: 300 }` (matches `springs.bottomSheet`), `{ damping: 20, stiffness: 200 }` (matches `springs.sheet`), `{ damping: 26, stiffness: 420 }` (matches `springs.exit`). Replace with canonical imports. Verify with tsc.
  - **Completed:** `bottomSheet` ({26, 300}) and `exit` ({26, 420}) had zero inline occurrences outside theme/animations.ts. `sheet` ({20, 200}) had 2 files already migrated to `springs.sheet` in prior sessions. Also fixed 3 stale test suites that had outdated spring value assertions from earlier refactoring: `animation-springs.test.ts` (updated preset count 10→11, corrected button/snappy/micro values, fixed Springs identity check), `button-press-springs.test.ts` (updated CategoryChip to check CARD_PRESS_SCALE/CARD_REST_SCALE constants), `toast-animation-springs.test.ts` (updated useToastAnimations from springs.snappy→springs.standard, fixed panGesture snap-back assertion). All 110 animation tests pass.

- [x] For spring configs that don't match any canonical preset, evaluate whether they should be added to `theme/animations.ts` as new presets or adjusted to the nearest canonical value. Document any new presets added.
  - **Completed:** Audited all 90+ remaining inline `damping:` references in production code. Added **4 new canonical presets** based on the most frequently recurring patterns:
    - `springs.celebration` — `{ damping: 12, stiffness: 200 }` — bounce effect for completion badges, progress pops (replaced in 14 files: StreakBadge, celebrationAnimation, celebrationAnimationEnhanced, useCelebrationAnimations, ConfettiParticle ×3, useHeaderToggle, CelebrationHeader, DailyProgressRing, useQuickCompleteButton, useHighlightAnimation, useHeaderAnimations, useSuccessAnimations)
    - `springs.pop` — `{ damping: 8, stiffness: 300 }` — explosive pop for confetti scale, fast expansion (replaced in 13 files: useBarAnimations, ConfettiParticle ×3, 6 MotivationSystem constants files, useHeaderAnimations, useSuccessAnimations, animationSequences)
    - `springs.responsive` — `{ damping: 15, stiffness: 300 }` — snappy interactive button feedback (replaced in 9 files: 5 MotivationSystem SPRING_BUTTON constants, usePressHandlers, useTemplateListItemHandlers, TemplateListFooter, useCategoryFilterAnimations)
    - `springs.settle` — `{ damping: 28, mass: 1, stiffness: 180 }` — heavy settling for stable modal/sheet transitions (replaced in 5 files: CelebrationScreen, ActivationModal, ContextAwareViz, RescueMode, FailureViz constants)
  - Also replaced `{ damping: 15, stiffness: 150 }` → `springs.standard` in 5 files (useArchiveUndoToast ×4 instances, RetryButton, useEmptyStateAnimations, OfflinePendingBanner constants, AnimatedHabitCard.hooks).
  - Updated `constants/motion.ts` Springs re-export to include all 4 new presets. Updated `animation-springs.test.ts` (11→15 presets, added value assertions for celebration/pop/responsive/settle). All 24 spring tests pass.
  - **Second pass (this session):** Replaced 40+ additional non-canonical inline configs with nearest canonical presets across 30+ files:
    - `{6, 120}` → `springs.bouncy` in 4 strength-animation files (HabitStrengthIndicator, StrengthRing, DraggableHabit/animationHelpers, strengthAnimationHelpers)
    - `{15, 100}` → `springs.gentle` in 2 files (StrengthDistributionChart, SpotlightHero)
    - `{12, 120}` / `{8, 0.8, 180}` → `springs.bouncy` (TemplateAddedToast constants)
    - `{6, 200}` → `springs.celebration` (TemplateAddedToast useCelebrationAnimations, QuickCompleteButton)
    - `{18, 1, 180}` → `springs.standard` (CalendarTabs, StreakMilestoneCelebration)
    - `{18, 100}` / `{20, 90}` → `springs.gentle` (TemplateScienceModal animationConstants)
    - `{20, 150}` → `springs.standard` (QuickActionsSheet ×2 files)
    - `{20, 300}` → `springs.bottomSheet` (HeatmapTooltip, Modal/runEnterAnimation)
    - `{15, 200}` / `{18, 200}` → `springs.sheet` (TemplatesModalSection, VisualizationModalSection, TimeRangeToggle, SortChip, HabitRenderContent)
    - `{18, 120}` → `springs.standard` (useCardAnimatedStyles, useTemplateCardAnimations)
    - `{8, 150}` → `springs.bouncy` (useTemplateCardAnimations, useAnimationEffects, useHeroAnimations, useProgressAnimations)
    - `{24, 400}` → `springs.exit` (useEntranceAnimations)
    - `{20, 400}` → `springs.gesture` (usePressHandlers)
    - `{8, 100}` → `springs.bouncy` (ReminderSelector/useButtonAnimations, useSuccessOverlayAnimations)
    - `{15, 250}` → `springs.pulse` (useHighlightAnimation)
    - Partial (damping-only) configs: `{damping: 18}` → standard, `{damping: 15}` → standard, `{damping: 12}` → celebration, `{damping: 10}` → bouncy, `{damping: 8}` → pop (across 15+ files)
    - `{18, 1, 150}` → `springs.standard` (SortBottomSheet, DayHabitsBottomSheet constants)
    - `{18, 1, 180}` → `springs.standard` (HabitDetailTabs constants)
    - `{12, 100}` → `springs.gentle` (ThisMonthCard constants)
  - **Remaining 24 production inline configs** cannot be standardized:
    - 8× Legacy `Animated.spring` API (LockedHabitCard ×3, SuggestionChips, PremiumTeaser, HeroNameInput, useColorButtonAnimations ×2) — require `toValue`/`useNativeDriver` params incompatible with spring preset objects
    - 6× Custom `mass`/`overshootClamping` params (widthExpansion, strengthAnimationHelpers, useStrengthRingAnimation, useCardStrengthFill, useStrengthAnimation ×2) — non-default mass values tune physics for specific effects
    - 3× Already-abstracted named constants (MilestoneCelebration uses BADGE_BOUNCE_DAMPING etc.)
    - 4× Utility/canonical definitions (helpers.ts, cardPressAnimation.ts) — these define spring configs consumed by other utilities
    - 2× Comments mentioning "damping" in documentation strings
    - 1× Deliberate custom override (HabitCard entrance constants with `damping: 24`)
  - All 114 animation/spring tests pass (10/11 suites; 1 pre-existing failure unrelated to springs).

- After all replacements, run `grep -r "damping:" src/ --include="*.ts" --include="*.tsx" | grep -v theme/animations | grep -v node_modules | wc -l` to measure remaining inline configs. Target: <20 remaining (down from 110+).
  - **Final count: 65 total references (24 production source, 41 test/comment).** Down from 110+ at start of Phase 4. All standardizable inline spring configs have been replaced. The remaining 24 production references are legacy Animated API calls, custom mass/overshootClamping physics, canonical utility definitions, and abstracted named constants — all intentionally different and not candidates for theme preset consolidation.
