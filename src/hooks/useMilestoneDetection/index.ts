/**
 * Milestone Detection Hooks - Barrel Export
 *
 * Re-exports all milestone detection hooks and types.
 */

// Types
export type {
  MilestoneAchievement,
  UseMilestoneDetectionReturn,
  UseMultiMilestoneDetectionReturn,
} from './types';

// Utilities
export { checkMilestoneCrossed, MILESTONE_THRESHOLDS } from './utils';

// Hooks
export { useMilestoneDetection } from './useMilestoneDetection';
export { useMultiMilestoneDetection } from './useMultiMilestoneDetection';

// Default export for backward compatibility
export { useMilestoneDetection as default } from './useMilestoneDetection';
