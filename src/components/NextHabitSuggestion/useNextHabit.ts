/**
 * useNextHabit Hook
 * Determines which habit to focus on next based on:
 * 1. Incomplete habits first
 * 2. Highest streak (don't break the chain!)
 * 3. Original order as tiebreaker
 */

import { useMemo } from 'react';
import type { HabitData } from './types';

interface HabitWithTracking extends HabitData {
  completedToday?: boolean;
  currentStreak?: number;
  order?: number;
}

interface UseNextHabitResult {
  nextHabit: HabitData | null;
  completedCount: number;
  totalCount: number;
}

export function useNextHabit(
  habits: HabitWithTracking[],
  todayTracking: Record<string, boolean>
): UseNextHabitResult {
  return useMemo(() => {
    if (!habits || habits.length === 0) {
      return { nextHabit: null, completedCount: 0, totalCount: 0 };
    }

    // Separate completed and incomplete habits
    const incomplete: HabitWithTracking[] = [];
    const completed: HabitWithTracking[] = [];

    for (const habit of habits) {
      const isComplete = todayTracking[habit._id] ?? habit.completedToday ?? false;
      if (isComplete) {
        completed.push(habit);
      } else {
        incomplete.push(habit);
      }
    }

    if (incomplete.length === 0) {
      // All habits complete!
      return {
        nextHabit: null,
        completedCount: completed.length,
        totalCount: habits.length,
      };
    }

    // Sort incomplete habits by priority:
    // 1. Higher streak = higher priority (don't break the chain!)
    // 2. Original order as tiebreaker
    const sorted = [...incomplete].sort((a, b) => {
      const streakA = a.currentStreak ?? 0;
      const streakB = b.currentStreak ?? 0;
      
      // Higher streak = higher priority
      if (streakB !== streakA) {
        return streakB - streakA;
      }
      
      // Original order as tiebreaker
      return (a.order ?? 0) - (b.order ?? 0);
    });

    return {
      nextHabit: sorted[0],
      completedCount: completed.length,
      totalCount: habits.length,
    };
  }, [habits, todayTracking]);
}
