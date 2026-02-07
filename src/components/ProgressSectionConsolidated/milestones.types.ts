/**
 * MilestoneProgress Type Definitions
 *
 * Pure type definitions for the milestone gamification system.
 */

/** Milestone configuration */
export interface Milestone {
  /** Number of days required for this milestone */
  days: number;
  /** Badge emoji for this milestone */
  badge: string;
  /** Display name for this milestone */
  name: string;
}

/** Display state for the MilestoneProgress component */
export type MilestoneDisplayState = 'in-progress' | 'just-hit' | 'no-streak';

/** Props for MilestoneProgress component */
export interface MilestoneProgressProps {
  /** Current streak in days */
  currentStreak: number;
  /** Optional callback when a milestone is achieved */
  onMilestoneHit?: (milestone: number) => void;
  /** Track which milestones have been celebrated */
  celebratedMilestones?: number[];
}

/** Result of milestone calculations */
export interface MilestoneCalculation {
  currentMilestone: Milestone | null;
  nextMilestone: Milestone | null;
  daysRemaining: number;
  progressPercentage: number;
  displayState: MilestoneDisplayState;
  previousMilestone: Milestone | null;
}
