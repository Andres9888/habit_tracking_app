import type { Doc } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';
import {
  calculateMomentumStrengthSnapshot,
  resolveAlgorithmMode,
} from '../habitStrength';
import { calculateStreakFromHistory } from '../streakUtils';
import { skipPausedDays } from './skipPausedDays';
import { getTodayForTimezone, getTrackingCutoffKey, maxDateKey } from './utils';

export async function recalculateHabitStrength(
  ctx: MutationCtx,
  habit: Doc<'habits'>
): Promise<void> {
  const tracking = await ctx.db
    .query('tracking')
    .withIndex('by_habit_and_date', (q) =>
      q.eq('habitId', habit._id).gte('date', getTrackingCutoffKey())
    )
    .collect();

  let evaluationDateKey = getTodayForTimezone();
  for (const record of tracking) {
    evaluationDateKey = maxDateKey(evaluationDateKey, record.date);
  }

  const trackingForSnapshot = tracking.map((record) => ({
    completed: record.completed,
    date: record.date,
  }));
  const mode = resolveAlgorithmMode(habit.strengthAlgorithm);
  const snapshot = calculateMomentumStrengthSnapshot({
    habitCreatedAt: habit.createdAt,
    mode,
    skipDate: skipPausedDays(habit),
    throughDate: evaluationDateKey,
    tracking: trackingForSnapshot,
  });
  const streakData = calculateStreakFromHistory(
    trackingForSnapshot,
    evaluationDateKey,
    { pausedAt: habit.pausedAt, resumedAt: habit.resumedAt }
  );

  await ctx.db.patch(habit._id, {
    bestStreak: Math.max(streakData.bestStreak, habit.bestStreak ?? 0),
    currentStreak: streakData.currentStreak,
    lastCompletedDate: streakData.lastCompletedDate,
    strength: snapshot.strength,
    strengthLevel: snapshot.strengthLevel,
    strengthUpdatedAt: Date.now(),
  });
}
