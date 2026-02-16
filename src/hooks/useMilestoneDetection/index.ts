/**
 * Milestone Detection Hooks - Barrel Export
 *
 * Re-exports all milestone detection hooks and types.
 */

// Types
export type { MilestoneAchievement } from './types';

// Hooks
export { useMilestoneDetection } from './useMilestoneDetection';

// Default export for backward compatibility
export { useMilestoneDetection as default } from './useMilestoneDetection';
