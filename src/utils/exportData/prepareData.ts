/**
 * Prepare export data from Convex queries
 */

import type { Doc, Id } from '../../../convex/_generated/dataModel';
import type { HabitData, ExportData } from './types';

interface TrackingDoc {
  _id: Id<'tracking'>;
  habitId: Id<'habits'>;
  date: string;
  completed: boolean;
}

interface OverviewStats {
  averageStrength?: number;
  totalHabits?: number;
}

/**
 * Calculate streaks for a habit based on completions
 */
function calculateStreaks(
  completions: Array<{ date: string; completed: boolean }>
) {
  const sortedCompletions = completions
    .filter((c) => c.completed)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let currentStreak = 0;
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

  // Check if streak is current
  const today = new Date();
  if (lastDate) {
    const daysSinceLastCompletion = Math.floor(
      (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    currentStreak = daysSinceLastCompletion <= 1 ? tempStreak : 0;
  }

  return { currentStreak, longestStreak };
}

/**
 * Prepare export data from Convex queries
 * @param habits - Array of habit documents from Convex
 * @param trackings - Array of tracking documents from Convex
 * @param overviewStats - Overview statistics or null if not available
 * @returns Formatted export data ready for CSV or JSON conversion
 */
export async function prepareExportData(
  habits: Doc<'habits'>[],
  trackings: TrackingDoc[],
  overviewStats: OverviewStats | null | undefined
): Promise<ExportData> {
  const habitData: HabitData[] = habits.map((habit) => {
    const habitTrackings = trackings.filter((t) => t.habitId === habit._id);
    const completions = habitTrackings.map((t) => ({
      completed: t.completed,
      date: t.date,
    }));

    const { currentStreak, longestStreak } = calculateStreaks(completions);

    return {
      completions,
      createdAt: new Date(habit.createdAt).toISOString(),
      currentStreak,
      icon: habit.icon,
      id: habit._id,
      longestStreak,
      name: habit.name,
      strength: habit.strength ? habit.strength * 100 : 0,
    };
  });

  return {
    exportDate: new Date().toISOString(),
    habits: habitData,
    user: {
      averageStrength: overviewStats?.averageStrength || 0,
      totalHabits: overviewStats?.totalHabits || 0,
    },
    version: '1.0.0',
  };
}
