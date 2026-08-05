/**
 * Milestone Calculation Functions
 *
 * Business logic for milestone progress tracking.
 */

import type { Milestone, MilestoneCalculation } from './milestones.types';
import { MILESTONES } from './milestones.data';

/** Gets the next milestone after the current streak */
export function getNextMilestone(currentStreak: number): Milestone | null {
  return MILESTONES.find((m) => m.days > currentStreak) ?? null;
}

/** Gets the current milestone (last achieved) */
export function getCurrentMilestone(currentStreak: number): Milestone | null {
  const achieved = MILESTONES.filter((m) => m.days <= currentStreak);
  return achieved.length > 0 ? (achieved.at(-1) ?? null) : null;
}

/** Gets the previous milestone before the next one */
export function getPreviousMilestone(currentStreak: number): Milestone | null {
  const nextIdx = MILESTONES.findIndex((m) => m.days > currentStreak);
  if (nextIdx <= 0) return null;
  return MILESTONES[nextIdx - 1];
}

/** Checks if the current streak exactly matches a milestone */
export function isOnMilestone(currentStreak: number): boolean {
  return MILESTONES.some((m) => m.days === currentStreak);
}

/** Calculates all milestone-related values */
export function calculateMilestoneProgress(
  currentStreak: number,
  celebratedMilestones: number[] = []
): MilestoneCalculation {
  if (currentStreak <= 0) {
    return {
      currentMilestone: null,
      daysRemaining: 3,
      displayState: 'no-streak',
      nextMilestone: MILESTONES[0],
      previousMilestone: null,
      progressPercentage: 0,
    };
  }

  const nextMilestone = getNextMilestone(currentStreak);
  const currentMilestone = getCurrentMilestone(currentStreak);
  const previousMilestone = getPreviousMilestone(currentStreak);

  const justHitMilestone =
    isOnMilestone(currentStreak) &&
    !celebratedMilestones.includes(currentStreak);

  const daysRemaining = nextMilestone ? nextMilestone.days - currentStreak : 0;

  let progressPercentage = 0;
  if (nextMilestone) {
    const startPoint = previousMilestone?.days ?? 0;
    const range = nextMilestone.days - startPoint;
    const current = currentStreak - startPoint;
    progressPercentage = range > 0 ? Math.round((current / range) * 100) : 0;
  } else {
    progressPercentage = 100;
  }

  return {
    currentMilestone,
    daysRemaining,
    displayState: justHitMilestone
      ? 'just-hit'
      : currentStreak > 0
        ? 'in-progress'
        : 'no-streak',
    nextMilestone,
    previousMilestone,
    progressPercentage,
  };
}
