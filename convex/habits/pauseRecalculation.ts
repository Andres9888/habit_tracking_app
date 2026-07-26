import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';
import {
  calculateMomentumStrengthSnapshot,
  resolveAlgorithmMode,
} from '../habitStrength';
import { calculateStreakFromHistory } from '../streakUtils';
import { getTodayForTimezone, maxDateKey } from './utils';

export async function recalculateOnPauseChange(
  ctx: MutationCtx,
  habitId: Id<'habits'>,
  timezone?: string
): Promise<void> {
  const habit = await ctx.db.get(habitId);
  if (!habit) return;

  const allTracking = await ctx.db
    .query('tracking')
    .withIndex('by_habit_and_date', (q) => q.eq('habitId', habitId))
    .collect();
  const today = getTodayForTimezone(timezone);
  let maxTrackingDateKey = today;
  for (const record of allTracking) {
    maxTrackingDateKey = maxDateKey(maxTrackingDateKey, record.date);
  }
  const tracking = allTracking.map((record) => ({
    completed: record.completed,
    date: record.date,
  }));
  const evaluationDateKey = maxDateKey(today, maxTrackingDateKey);
  const snapshot = calculateMomentumStrengthSnapshot({
    habitCreatedAt: habit.createdAt,
    mode: resolveAlgorithmMode(habit.strengthAlgorithm),
    throughDate: evaluationDateKey,
    tracking,
  });
  const streakData = calculateStreakFromHistory(tracking, evaluationDateKey, {
    pausedAt: habit.pausedAt,
    resumedAt: habit.resumedAt,
    timezone,
  });

  await ctx.db.patch(habitId, {
    bestStreak: streakData.bestStreak,
    currentStreak: streakData.currentStreak,
    lastCompletedDate: streakData.lastCompletedDate,
    strength: snapshot.strength,
    strengthLevel: snapshot.strengthLevel,
    strengthUpdatedAt: Date.now(),
  });
}
