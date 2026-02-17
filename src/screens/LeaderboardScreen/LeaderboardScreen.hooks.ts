/**
 * LeaderboardScreen Hooks
 * Calculate streak statistics and leaderboard data
 */

import { useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { LeaderboardStats, HabitStreakData } from './LeaderboardScreen.types';

/**
 * Calculate longest streak from tracking data
 */
function calculateLongestStreak(
  completions: Array<{ date: string; completed: boolean }>
): number {
  const sortedCompletions = completions
    .filter((c) => c.completed)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let longestStreak = 0;
  let tempStreak = 0;
  let lastDate: Date | null = null;

  for (const completion of sortedCompletions) {
    const completionDate = new Date(completion.date);

    if (lastDate === null) {
      tempStreak = 1;
    } else {
      const daysDiff = Math.floor(
        (completionDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysDiff === 1) {
        tempStreak++;
      } else if (daysDiff > 1) {
        tempStreak = 1;
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak);
    lastDate = completionDate;
  }

  return longestStreak;
}

/**
 * Main hook for leaderboard data
 */
export function useLeaderboardData(): {
  stats: LeaderboardStats | null;
  isLoading: boolean;
} {
  const habits = useQuery(api.habits.list);
  const tracking = useQuery(api.habits.getTracking, {
    dates: [], // Get all tracking data
    startDate: '2020-01-01', // Far back enough to get all history
    endDate: new Date().toISOString().split('T')[0],
  });

  const stats = useMemo<LeaderboardStats | null>(() => {
    if (!habits || !Array.isArray(habits) || !tracking || !Array.isArray(tracking)) {
      return null;
    }

    // Build habit streak data
    const habitStreaks: HabitStreakData[] = habits.map((habit) => {
      const habitTracking = tracking.filter((t) => t.habitId === habit._id);
      const longestStreak = calculateLongestStreak(habitTracking);
      const currentStreak = habit.currentStreak ?? 0;

      return {
        habitId: habit._id,
        habitName: habit.name,
        currentStreak,
        longestStreak,
        strength: habit.strength ?? 0,
      };
    });

    // Calculate stats
    const activeStreaks = habitStreaks.filter((h) => h.currentStreak > 0).length;
    const longestEverStreak = Math.max(...habitStreaks.map((h) => h.longestStreak), 0);
    const totalActiveStreakDays = habitStreaks.reduce(
      (sum, h) => sum + h.currentStreak,
      0
    );
    const averageStreak =
      activeStreaks > 0 ? Math.round(totalActiveStreakDays / activeStreaks) : 0;

    // Top streakers (30+ day current streaks)
    const topStreakers = habitStreaks
      .filter((h) => h.currentStreak >= 30)
      .sort((a, b) => b.currentStreak - a.currentStreak)
      .slice(0, 5);

    // Top current streak
    const topStreak = habitStreaks.reduce<HabitStreakData | null>((max, habit) => {
      if (!max || habit.currentStreak > max.currentStreak) {
        return habit;
      }
      return max;
    }, null);

    // Personal bests
    const longestStreakHabit = habitStreaks.reduce<HabitStreakData | null>(
      (max, habit) => {
        if (!max || habit.longestStreak > max.longestStreak) {
          return habit;
        }
        return max;
      },
      null
    );

    const mostConsistent = habitStreaks.reduce<HabitStreakData | null>(
      (max, habit) => {
        if (!max || habit.strength > max.strength) {
          return habit;
        }
        return max;
      },
      null
    );

    const currentBest = habitStreaks.reduce<HabitStreakData | null>((max, habit) => {
      if (!max || habit.currentStreak > max.currentStreak) {
        return habit;
      }
      return max;
    }, null);

    return {
      topStreak,
      totalHabits: habits.length,
      activeStreaks,
      longestEverStreak,
      averageStreak,
      topStreakers,
      personalBests: {
        longestStreak: longestStreakHabit,
        mostConsistent,
        currentBest,
      },
    };
  }, [habits, tracking]);

  return {
    stats,
    isLoading: habits === undefined || tracking === undefined,
  };
}
