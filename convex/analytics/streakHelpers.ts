/**
 * Streak calculation helpers for analytics
 */

import type { QueryCtx } from '../_generated/server';
import { Id } from '../_generated/dataModel';

interface StreakResult {
  currentStreak: number;
  longestStreak: number;
}

/**
 * Compute streak from a pre-sorted list of completed tracking dates.
 * Pure function — no DB access.
 */
function computeStreakFromDates(sortedDates: string[]): StreakResult {
  if (sortedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  let tempStreak = 0;
  let longestStreak = 0;
  let lastDate: Date | null = null;

  for (const dateStr of sortedDates) {
    const trackingDate = new Date(dateStr);

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

/**
 * Get streak information for a specific habit (single-habit query).
 * Kept for backward compatibility with non-batch callers.
 */
export async function getStreaksForHabit(
  ctx: QueryCtx,
  habitId: Id<'habits'>,
  _userId: string
): Promise<StreakResult> {
  const trackings = await ctx.db
    .query('tracking')
    .withIndex('by_habit_and_date', (q) => q.eq('habitId', habitId))
    .collect();

  const sortedDates = trackings
    .filter((t) => t.completed)
    .map((t) => t.date as string)
    .sort();

  return computeStreakFromDates(sortedDates);
}

/**
 * Batch-fetch streaks for multiple habits in a SINGLE query.
 *
 * Instead of N separate indexed queries (one per habit), this fetches
 * all tracking records for the user at once, groups by habitId, and
 * computes streaks in-memory. Reduces Convex read operations from
 * O(N) queries to O(1) query for the analytics screens.
 */
export async function getStreaksForHabitsBatch(
  ctx: QueryCtx,
  habitIds: Id<'habits'>[]
): Promise<Map<string, StreakResult>> {
  const results = new Map<string, StreakResult>();

  if (habitIds.length === 0) return results;

  // Single query: fetch ALL completed tracking records for this user
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    for (const id of habitIds) {
      results.set(id, { currentStreak: 0, longestStreak: 0 });
    }
    return results;
  }

  const allTrackings = await ctx.db
    .query('tracking')
    .withIndex('by_user_and_date', (q) => q.eq('userId', identity.subject))
    .collect();

  // Group completed trackings by habitId
  const habitIdSet = new Set(habitIds.map(String));
  const byHabit = new Map<string, string[]>();

  for (const t of allTrackings) {
    if (!t.completed || !habitIdSet.has(String(t.habitId))) continue;
    const key = String(t.habitId);
    let dates = byHabit.get(key);
    if (!dates) {
      dates = [];
      byHabit.set(key, dates);
    }
    dates.push(t.date);
  }

  // Compute streaks per habit
  for (const id of habitIds) {
    const dates = byHabit.get(String(id));
    if (!dates || dates.length === 0) {
      results.set(id, { currentStreak: 0, longestStreak: 0 });
    } else {
      dates.sort();
      results.set(id, computeStreakFromDates(dates));
    }
  }

  return results;
}
