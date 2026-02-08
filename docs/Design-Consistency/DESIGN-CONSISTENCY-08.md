# Phase 8: Accessibility Fixes & Touch Target Compliance

**Goal:** Fix all Apple HIG touch target violations (44x44pt minimum), color contrast failures, and extend reduced motion support.

**Context:** The app has excellent accessibility label coverage (1,306 instances across 294 buttons), but has specific issues:

- 4-6 buttons are undersized (< 44x44pt) with missing or insufficient hitSlop
- Gray-400 (#9CA3AF) is used for text in places where it fails WCAG 2.1 AA contrast (3.0:1 vs required 4.5:1)
- Reduced motion preferences (`useReducedMotion`) are only applied to ~30% of animated components

---

- [x] **Fix undersized touch targets (CRITICAL).** These interactive elements are below the 44x44pt Apple HIG minimum: _(Completed: Added hitSlop to 5 files — YourProgressCard +10, DraftRecoveryBanner +10, WOOPSectionHeader 8→12, DualVizHeader 8→12, NotesHeader +6. ESLint sort-keys fixed. 17 new tests pass.)_
  1. `src/components/ProgressSection/YourProgressCard/YourProgressCard.tsx` (line ~73) — Info button is h-7 w-7 (28x28pt) with NO hitSlop. Add `hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}` to reach 48x48pt.
  2. `src/components/DraftRecoveryBanner/DraftRecoveryBanner.tsx` — Close button is h-7 w-7 (28x28pt) with no hitSlop. Add `hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}`.
  3. `src/components/MotivationSystem/Workshop/WOOPSection/WOOPSectionHeader.tsx` (line ~45) — Help button has `hitSlop={8}` reaching 40x40pt. Increase hitSlop to `{{ top: 12, bottom: 12, left: 12, right: 12 }}` to reach 48x48pt (verified Feb 2025: hitSlop exists but is undersized).
  4. `src/components/MotivationSystem/Workshop/DualVizSetup/components/DualVizHeader.tsx` (line ~30) — Same pattern as WOOPSectionHeader. Verify hitSlop exists and increase to 12 if needed.
  5. `src/components/StatsNotesModal/NotesList/components/NotesHeader.tsx` (line ~21) — Add button is h-9 w-9 (36x36pt). Verify hitSlop exists; if not, add `hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}` to reach 48x48pt.
  - Run lint on each modified file.

- [x] **Fix color contrast for gray-400 text usage.** Gray-400 (#9CA3AF) has only 3.0:1 contrast ratio on white, failing WCAG AA for normal text. It should only be used for: _(Completed: Replaced gray-400 readable text → gray-500 (#78716c, 4.6:1 contrast) across 10 components. Tailwind text-stone-400→text-stone-500: StreakCards (2), StatCard (1), NoteCard (1), EmptyInsightsState (2), TrendSection (2), PersonalBestsCard (1), ArchivedHabitsModal/EmptyState (1), HabitCardHeader (2). StyleSheet: StrengthProgressBar.styles.ts arrow+nextHint → colors.gray[500], MilestoneProgress progress.styles.ts milestoneName+progressLabelText → #78716c. Updated existing strengthprogressbar-tokens test expectations. 14 new tests pass.)_
  - Placeholder text in inputs (acceptable per WCAG)
  - Disabled state text (acceptable per WCAG)
  - Decorative/non-essential text

  Search for `text-stone-400`, `color: '#9CA3AF'`, and `colors.gray[400]` used as text color in `src/components/`. For any instance where it's used as readable secondary text (not placeholder/disabled), replace with `colors.gray[500]` (#78716c, which has 4.6:1 contrast on white, passing AA). Limit scope to the 10 most visible components. Run lint on modified files.

- [x] **Fix primary-500 used for text on white backgrounds.** `colors.primary[500]` (#10B981) has only 2.9:1 contrast on white. The theme already documents this: "Use Primary-700 for text". Search for instances where primary-500 is used as a text color (not as a background or icon fill) and replace with `colors.primary[700]` (#047857). Common patterns to search: `color: colors.primary[500]`, `color: '#10B981'`, `text-emerald-500`. Focus on body text and labels — icon fills and backgrounds can keep primary-500 since they have different contrast requirements (3:1 for UI components). Run lint. _(Completed: Replaced primary-500 text colors → primary-700 (#047857, ~6.0:1 contrast) across 11 files. StyleSheet: HabitRankingsList/itemStyles.ts, SuggestedActions.styles.ts, StrengthDisplay.tsx, ShareCardHeader.tsx, useButtonConfig.ts (secondary+ghost variants). Tailwind: StatsCard.tsx, ActivityLog.tsx, MinimalReminderToggle.tsx, QuickStatsStrip.tsx (all text-emerald-500→text-emerald-700). Hardcoded hex: FloatingXPText.tsx, PresetButton.tsx (#10B981→#047857). Icon fills and decorative letters (WOOP, PromptList) kept as primary-500. Border/bg colors unchanged. 15 new tests pass.)_

- [x] **Extend reduced motion support to major animated components.** Import `useReducedMotion` from `react-native-reanimated` in these high-visibility animated components and conditionally disable animations: _(Completed: Added `useReduceMotion()` to HabitCard tap/pan/celebration animations (7 files) and 9 MotivationSystem AnimatedSection components. HabitCard: tap gesture uses `withTiming(v, {duration:0})` instead of `withSpring` when reduced motion; celebration skips scale/ripple/confetti animations; pan gesture uses instant snap. MotivationSystem: all 8 Workshop AnimatedSections + CelebrationScreen AnimatedContent now call `useReduceMotion()` as system fallback via `reduceMotionProp ?? systemReduceMotion`. FullsizeTemplatePreview already fully wired — no changes needed. GuideHeader.tsx doesn't exist (task doc reference outdated). ESLint clean. 27 new tests pass.)_
  - `src/components/HabitCard/` — the main card has scale/spring animations on tap and swipe. When `reducedMotion` is true, use instant transitions instead of springs.
  - `src/components/FullsizeTemplatePreview/components/GuideHeader.tsx` — uses FadeInDown entering animation. Conditionally skip when reduced motion is preferred.
  - `src/components/MotivationSystem/` — multiple components with staggered FadeIn animations. Add `useReducedMotion()` check and use `FadeIn.duration(0)` or skip entering animations entirely.
  - This doesn't need to cover every animated component — focus on the ones users interact with most frequently. Components that already use `useReducedMotion()` (HeroIcon, ProgressRing, useChipAnimations, useCtaButtonAnimations) are fine.
  - Run lint on modified files.

- [ ] **Migrate VisionBoardPreview to use shared Modal component.** `src/components/VisionBoardPreview/VisionBoardPreview.tsx` (line ~66) uses raw React Native `Modal` with basic `animationType='fade'` instead of the app's unified `Modal` component from `src/components/Modal/`. Refactor it to use the app's Modal with the `fullScreen` or `bottomSheet` variant for consistent open/close animations, backdrop behavior, and accessibility handling. The app's Modal already respects reduced motion preferences.
