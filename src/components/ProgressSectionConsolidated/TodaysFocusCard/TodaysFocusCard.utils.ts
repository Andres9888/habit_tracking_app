/**
 * TodaysFocusCard Utilities
 *
 * Pure functions for determining focus state and calculating goal values.
 */

import type { TodaysFocusCardProps, FocusState } from '../TodaysFocusCardTypes';
import {
  getCelebrationMilestone,
  getNextCelebrationMilestone,
} from '../TodaysFocusCardTypes';

/**
 * Determines the focus state based on user metrics
 */
export function determineFocusState(
  props: TodaysFocusCardProps,
  celebratedMilestones: number[] = []
): FocusState {
  const {
    currentStreak,
    isCompletedToday,
    weeklyCompletion,
    habitAge,
    bestStreak,
  } = props;

  // Check for celebration state first (highest priority when on a milestone)
  // Only show celebration if completed today and on a milestone not yet celebrated
  const milestoneConfig = getCelebrationMilestone(currentStreak);
  if (
    isCompletedToday &&
    milestoneConfig &&
    !celebratedMilestones.includes(currentStreak)
  ) {
    return 'celebrating';
  }

  // Completed state takes priority (after celebration)
  if (isCompletedToday) {
    return 'completed';
  }

  // New habit (less than 7 days old)
  if (habitAge < 7) {
    return 'starting';
  }

  // Recovering: had a good streak before, currently at 0
  if (currentStreak === 0 && bestStreak > 7) {
    return 'recovering';
  }

  // Struggling: no streak and poor weekly performance
  if (currentStreak === 0 && weeklyCompletion < 3) {
    return 'struggling';
  }

  // Thriving: strong streak and good weekly performance
  if (currentStreak >= 7 && weeklyCompletion >= 5) {
    return 'thriving';
  }

  // Building: moderate streak
  if (currentStreak >= 3) {
    return 'building';
  }

  // Default to starting if none of the above
  return 'starting';
}

/**
 * Calculates the goal value to display based on state
 */
export function calculateGoalValue(
  state: FocusState,
  props: TodaysFocusCardProps
): number {
  const { currentStreak, bestStreak } = props;

  switch (state) {
    case 'thriving': {
      // Next milestone: find next milestone after current streak
      const milestones = [7, 14, 21, 30, 60, 90, 100, 365];
      return milestones.find((m) => m > currentStreak) ?? currentStreak + 1;
    }
    case 'celebrating': {
      // Show the next milestone after celebration
      const nextMilestone = getNextCelebrationMilestone(currentStreak);
      return nextMilestone?.days ?? currentStreak + 1;
    }
    case 'building': {
      return 7;
    }
    case 'starting': {
      return 3;
    }
    case 'struggling': {
      return 1;
    }
    case 'recovering': {
      return bestStreak;
    }
    case 'completed': {
      return currentStreak;
    }
    default: {
      return 1;
    }
  }
}
