/**
 * StreakMilestoneCelebration - Barrel Export
 * Streak milestone celebration system (7, 30, 100 days)
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
