import { useMemo } from 'react';
import {
  MILESTONES,
  type MilestoneDisplayState,
  type Milestone,
} from '../MilestoneProgressTypes';

interface UseAccessibilityLabelParams {
  displayState: MilestoneDisplayState;
  currentStreak: number;
  nextMilestone: Milestone | null;
  daysRemaining: number;
  progressPercentage: number;
}

export const useAccessibilityLabel = ({
  displayState,
  currentStreak,
  nextMilestone,
  daysRemaining,
  progressPercentage,
}: UseAccessibilityLabelParams): string => {
  return useMemo(() => {
    if (displayState === 'no-streak') {
      return 'No active streak. Start your streak today to reach the Habit Starter milestone at 3 days.';
    }

    if (displayState === 'just-hit') {
      const milestone = MILESTONES.find((m) => m.days === currentStreak);
      return `Congratulations! You hit ${currentStreak} days and earned the ${milestone?.name ?? 'milestone'} badge!`;
    }

    if (nextMilestone) {
      return `Next milestone: ${nextMilestone.days} days, ${nextMilestone.name}. ${daysRemaining} days away. Progress: ${progressPercentage} percent.`;
    }

    return `Congratulations! You've achieved all milestones with ${currentStreak} days streak!`;
  }, [
    displayState,
    currentStreak,
    nextMilestone,
    daysRemaining,
    progressPercentage,
  ]);
};
