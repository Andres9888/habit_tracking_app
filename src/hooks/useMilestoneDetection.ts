/**
 * Milestone Detection Hooks - Backward Compatibility Re-export
 *
 * This file re-exports from the decomposed useMilestoneDetection/ folder
 * to maintain backward compatibility with existing imports.
 *
 * @deprecated Import directly from './useMilestoneDetection/index' for new code.
 */

export {
  // Types
  type MilestoneAchievement,
  type UseMilestoneDetectionReturn,
  type UseMultiMilestoneDetectionReturn,
  // Utilities
  checkMilestoneCrossed,
  MILESTONE_THRESHOLDS,
  // Hooks
  useMilestoneDetection,
  useMultiMilestoneDetection,
  // Default export
  useMilestoneDetection as default,
} from './useMilestoneDetection/index';
