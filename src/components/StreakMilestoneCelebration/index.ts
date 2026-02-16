/**
 * StreakMilestoneCelebration Module - Barrel Export
 *
 * Streak milestone celebration system for 7, 30, and 100 day achievements.
 * Includes provider for global celebration state, celebration modal UI,
 * confetti animations, and share card generation.
 *
 * **Quick Start:**
 * ```tsx
 * // 1. Add provider to app root
 * <StreakMilestoneProvider userName={user.firstName}>
 *   <App />
 * </StreakMilestoneProvider>
 *
 * // 2. Trigger celebrations from habit completion
 * const { checkAndCelebrate } = useStreakMilestone();
 * checkAndCelebrate(habitId, name, emoji, prevStreak, newStreak);
 * ```
 *
 * **Architecture Note:**
 * This module contains both UI components and a React Context provider.
 * Ideally, the provider should be extracted to src/contexts/StreakMilestoneContext/
 * for consistency with other context providers. File move deferred.
 *
 * @module StreakMilestoneCelebration
 */

// Main component
export { StreakMilestoneCelebration } from './StreakMilestoneCelebration';
export { default } from './StreakMilestoneCelebration';

// Sub-components
export { ConfettiAnimation } from './ConfettiAnimation';
export { AchievementCard } from './AchievementCard';

// Provider & Hook
export {
  StreakMilestoneProvider,
  useStreakMilestone,
} from './StreakMilestoneProvider';

// Standalone hooks
export {
  useMilestoneCheck,
  checkAndTriggerMilestone,
  persistMilestoneShown,
} from './useMilestoneCheck';

// Constants & Utilities
export {
  STREAK_MILESTONES,
  getMilestoneForStreak,
  checkStreakMilestoneCrossed,
  CONFETTI_COLORS,
  ANIMATION_TIMING,
} from './constants';

// Types
export type {
  StreakMilestone,
} from './constants';
export type {
  StreakMilestoneCelebrationProps,
  AchievementCardProps,
  ConfettiAnimationProps,
  UseStreakMilestoneCheckOptions,
  UseStreakMilestoneCheckReturn,
} from './types';
