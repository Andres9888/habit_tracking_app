/**
 * Burst Type Determination Utilities
 *
 * Helper functions to determine which celebration burst type to use
 * based on user context and achievements.
 */

import type { BurstType } from '../confetti/types';

/**
 * Determine burst type based on completion context
 */
export interface CompletionContext {
  /** Current streak (days) */
  streak?: number;

  /** Previous streak before this completion */
  previousStreak?: number;

  /** Habit strength/level (0-100) */
  strength?: number;

  /** Previous strength before this completion */
  previousStrength?: number;

  /** Number of consecutive completions in current session */
  chainCount?: number;

  /** All habits completed this week? */
  isPerfectWeek?: boolean;

  /** Is first completion of the day? */
  isFirstOfDay?: boolean;

  /** Number of habits total */
  totalHabits?: number;

  /** Number completed today */
  completedToday?: number;
}

/**
 * Milestone thresholds for streak celebrations
 */
export const STREAK_MILESTONES = [7, 14, 21, 30, 50, 60, 90, 100, 365] as const;

/**
 * Level thresholds for habit strength (0-100 scale)
 */
export const STRENGTH_LEVELS = [20, 40, 60, 80] as const;

/**
 * Determine the appropriate burst type based on completion context
 *
 * Priority order (highest first):
 * 1. Perfect week (all habits completed)
 * 2. Streak milestone (7, 14, 30, 100 days, etc.)
 * 3. Level up (habit strength increases)
 * 4. Chain completion (3+ in a row)
 * 5. Default completion
 */
export function determineBurstType(context: CompletionContext): BurstType {
  const {
    streak = 0,
    previousStreak = 0,
    strength = 0,
    previousStrength = 0,
    chainCount = 0,
    isPerfectWeek = false,
  } = context;

  // Priority 1: Perfect week
  if (isPerfectWeek) {
    return 'perfectWeek';
  }

  // Priority 2: Streak milestone
  if (isStreakMilestone(streak)) {
    return 'streakMilestone';
  }

  // Priority 3: Level up
  if (didLevelUp(previousStrength, strength)) {
    return 'levelUp';
  }

  // Priority 4: Chain completion (3+ in a row)
  if (chainCount >= 3) {
    return 'chainCompletion';
  }

  // Default: regular completion
  return 'default';
}

/**
 * Check if a streak value is a milestone
 */
export function isStreakMilestone(streak: number): boolean {
  return STREAK_MILESTONES.some((milestone) => milestone === streak);
}

/**
 * Check if habit strength leveled up
 */
export function didLevelUp(previousStrength: number, currentStrength: number): boolean {
  return STRENGTH_LEVELS.some(
    (level) => previousStrength < level && currentStrength >= level
  );
}

/**
 * Get the next streak milestone
 */
export function getNextStreakMilestone(currentStreak: number): number | null {
  const next = STREAK_MILESTONES.find((m) => m > currentStreak);
  return next ?? null;
}

/**
 * Get the next strength level
 */
export function getNextStrengthLevel(currentStrength: number): number | null {
  const next = STRENGTH_LEVELS.find((l) => l > currentStrength);
  return next ?? null;
}

/**
 * Check if approaching a milestone (within 2 days/points)
 */
export function isApproachingMilestone(
  context: CompletionContext
): { type: 'streak' | 'level' | null; value: number | null; current: number } {
  const { streak = 0, strength = 0 } = context;

  // Check streak milestones
  const nextStreak = getNextStreakMilestone(streak);
  if (nextStreak && streak >= nextStreak - 2) {
    return {
      type: 'streak',
      value: nextStreak,
      current: streak,
    };
  }

  // Check strength levels
  const nextLevel = getNextStrengthLevel(strength);
  if (nextLevel && strength >= nextLevel - 2) {
    return {
      type: 'level',
      value: nextLevel,
      current: strength,
    };
  }

  return { type: null, value: null, current: 0 };
}
