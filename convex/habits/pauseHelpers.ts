/**
 * Shared pause/resume recalculation.
 *
 * Extracted from pause.ts so the single-habit mutations and the bulk
 * `pauseAll` churn-save path run identical streak/strength maths.
 */
import type { MutationCtx } from '../_generated/server';
import type { Doc, Id } from '../_generated/dataModel';
import { calculateStreakFromHistory } from '../streakUtils';
import {
  getTodayForTimezone,
  getTrackingCutoffKey,
  maxDateKey,
} from './utils';
import {
  calculateMomentumStrengthSnapshot,
  resolveAlgorithmMode,
} from '../habitStrength';

/**
 * Recalculate streak and strength after a pause state change.
 *
 * `preloaded` lets a caller that already holds the post-patch habit document
 * skip the re-read. `pauseAll` iterates every habit in one transaction, so the
 * redundant `db.get` there was a per-habit N+1. It must be the *post-patch*
 * doc: the streak maths reads `pausedAt`/`resumedAt`.
 */
export async function recalculateOnPauseChange(
  ctx: MutationCtx,
  habitId: Id<'habits'>,
  timezone?: string,
  preloaded?: Doc<'habits'>
): Promise<void> {
  const habit = preloaded ?? (await ctx.db.get(habitId));
  if (!habit) return;

  // Bounded: pauseAll runs this once per habit inside a single transaction, so
  // an unbounded read here multiplied out to tens of thousands of documents for
  // long-tenured users — the exact users the churn-save path exists to keep.
  const allTracking = await ctx.db
    .query('tracking')
    .withIndex('by_habit_and_date', (q) =>
      q.eq('habitId', habitId).gte('date', getTrackingCutoffKey())
    )
    .collect();

  const today = getTodayForTimezone(timezone);
  let maxTrackingDateKey = today;
  for (const record of allTracking) {
    maxTrackingDateKey = maxDateKey(maxTrackingDateKey, record.date);
  }
  const evaluationDateKey = maxDateKey(today, maxTrackingDateKey);

  const tracking = allTracking.map((r) => ({
    completed: r.completed,
    date: r.date,
  }));

  // Resolve algorithm mode from per-habit setting, fallback 'balanced'
  const mode = resolveAlgorithmMode(habit.strengthAlgorithm);

  const snapshot = calculateMomentumStrengthSnapshot({
    habitCreatedAt: habit.createdAt,
    mode,
    throughDate: evaluationDateKey,
    tracking,
  });

  // Pass pause info to exclude paused periods from streak
  const streakData = calculateStreakFromHistory(tracking, evaluationDateKey, {
    pausedAt: habit.pausedAt,
    resumedAt: habit.resumedAt,
    timezone,
  });

  await ctx.db.patch(habitId, {
    // Guarded because the tracking read is windowed — a best streak set before
    // the lookback cutoff is not recomputable and must not be overwritten.
    bestStreak: Math.max(streakData.bestStreak, habit.bestStreak ?? 0),
    currentStreak: streakData.currentStreak,
    lastCompletedDate: streakData.lastCompletedDate,
    strength: snapshot.strength,
    strengthLevel: snapshot.strengthLevel,
    strengthUpdatedAt: Date.now(),
  });
}
