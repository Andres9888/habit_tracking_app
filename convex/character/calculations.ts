/**
 * Calculation functions for character stats
 */

import type { Doc, Id } from '../_generated/dataModel';

interface HabitStreaks {
  habitStreaks: Map<Id<'habits'>, number>;
  maxStreak: number;
}

/**
 * Calculate streaks for each habit
 */
export function calculateHabitStreaks(
  habits: Doc<'habits'>[],
  allTracking: Doc<'tracking'>[]
): HabitStreaks {
  const habitStreaks = new Map<Id<'habits'>, number>();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const habit of habits) {
    const habitTracking = allTracking
      .filter((t) => t.habitId === habit._id && t.completed)
      .map((t) => new Date(t.date).getTime())
      .sort((a, b) => b - a);

    let streak = 0;
    for (const [i, element] of habitTracking.entries()) {
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);

      if (element === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }
    habitStreaks.set(habit._id, streak);
  }

  const streakArray = [...habitStreaks.values()];
  const maxStreak = streakArray.length > 0 ? Math.max(...streakArray) : 0;

  return { habitStreaks, maxStreak };
}

/**
 * Difficulty multipliers for XP and strength gains.
 * Higher difficulty = higher reward to incentivize challenging habits.
 */
export const DIFFICULTY_MULTIPLIERS: Record<string, number> = {
  easy: 0.5,
  medium: 1.0,
  hard: 1.5,
  epic: 2.5,
};

/**
 * Get the XP multiplier for a given difficulty level.
 */
export function getDifficultyMultiplier(difficulty?: string): number {
  return DIFFICULTY_MULTIPLIERS[difficulty ?? 'medium'] ?? 1.0;
}

/**
 * Calculate total XP from tracking data
 */
export function calculateTotalXP(
  habits: Doc<'habits'>[],
  allTracking: Doc<'tracking'>[],
  habitStreaks: Map<Id<'habits'>, number>
): number {
  let totalXP = 0;
  const completedTracking = allTracking.filter((t) => t.completed);

  for (const tracking of completedTracking) {
    const habit = habits.find((h) => h._id === tracking.habitId);
    if (!habit) continue;

    // Difficulty multiplier
    const multiplier = getDifficultyMultiplier(
      (habit as unknown as { difficulty?: string }).difficulty
    );

    // Base XP: 10 per completion, scaled by difficulty
    let xp = Math.round(10 * multiplier);

    // Streak bonus: +2 XP per day in current streak
    const streak = habitStreaks.get(habit._id) || 0;
    xp += Math.min(streak * 2, 50); // Cap streak bonus at 50

    // Strength bonus: up to +10 XP based on habit strength
    const strength = habit.strength || 0;
    xp += Math.floor(strength * 10);

    totalXP += xp;
  }

  return totalXP;
}

/**
 * Calculate level from total XP using square root progression
 */
export function calculateLevel(totalXP: number): {
  level: number;
  xpInCurrentLevel: number;
  xpNeededForNextLevel: number;
} {
  const level = Math.floor(Math.sqrt(totalXP / 50)) + 1;
  const xpForCurrentLevel = (level - 1) ** 2 * 50;
  const xpForNextLevel = level ** 2 * 50;
  const xpInCurrentLevel = totalXP - xpForCurrentLevel;
  const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;

  return { level, xpInCurrentLevel, xpNeededForNextLevel };
}

/**
 * Get title based on level
 */
export function getTitle(level: number): string {
  const titles = [
    'Novice',
    'Habit Hero',
    'Routine Master',
    'Consistency Champion',
    'Discipline Legend',
    'Zen Master',
    'Unstoppable Force',
  ];
  const titleIndex = Math.min(Math.floor(level / 5), titles.length - 1);
  return titles[titleIndex];
}
