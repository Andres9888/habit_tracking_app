/**
 * Milestone Detection Types
 */

import type { StrengthLevel } from '../../components/HabitStrengthIndicator';

export interface MilestoneAchievement {
  /** The new level achieved */
  level: StrengthLevel;
  /** Current strength percentage */
  strength: number;
  /** Previous strength percentage */
  previousStrength: number;
  /** Habit ID */
  habitId: string;
  /** Habit name for display */
  habitName: string;
}

export interface UseMilestoneDetectionReturn {
  milestone: MilestoneAchievement | null;
  clearMilestone: () => void;
}

export interface UseMultiMilestoneDetectionReturn {
  milestones: MilestoneAchievement[];
  clearMilestone: (habitId: string) => void;
}
