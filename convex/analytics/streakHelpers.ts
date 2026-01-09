/**
 * Streak calculation helpers for analytics
 */

import { Id } from '../_generated/dataModel';

interface StreakResult {
  currentStreak: number;
  longestStreak: number;
}

/**
 * Get streak information for a specific habit
 */
export async function getStreaksForHabit(
  ctx: any,
  habitId: Id<'habits'>,
  _userId: string
): Promise<StreakResult> {
  const trackings = await ctx.db
    .query('tracking')
    .withIndex('by_habit_and_date', (q: any) => q.eq('habitId', habitId))
    .collect();

  // Calculate streaks
  let tempStreak = 0;
  let longestStreak = 0;
  let lastDate: Date | null = null;

  const sortedTrackings = trackings
    .filter((t: any) => t.completed)
    .sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

  for (const tracking of sortedTrackings) {
    const trackingDate = new Date(tracking.date);

    if (lastDate === null) {
      tempStreak = 1;
    } else {
      const daysDiff = Math.floor(
        (trackingDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysDiff === 1) {
        tempStreak++;
      } else if (daysDiff > 1) {
        tempStreak = 1;
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak);
    lastDate = trackingDate;
  }

  // Check if streak is current (within last 2 days)
  const today = new Date();
  let currentStreak = 0;
  if (lastDate) {
    const daysSinceLastCompletion = Math.floor(
      (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    currentStreak = daysSinceLastCompletion <= 1 ? tempStreak : 0;
  }

  return { currentStreak, longestStreak };
}
