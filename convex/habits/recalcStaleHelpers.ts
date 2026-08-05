import type { Doc } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';
import {
  calculateMomentumStrengthSnapshot,
  resolveAlgorithmMode,
} from '../habitStrength';
import { calculateStreakFromHistory } from '../streakUtils';
import { getTodayForTimezone, maxDateKey } from './utils';

const RECALC_TRACKING_LOOKBACK_DAYS = 400;

function getTrackingCutoffKey(): string {
  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - RECALC_TRACKING_LOOKBACK_DAYS);
  return cutoff.toISOString().slice(0, 10);
}

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
