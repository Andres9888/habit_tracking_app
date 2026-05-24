/**
 * Recalculate Stale Habit Strength (Cron Internal Mutation)
 *
 * Background reconciliation that walks active habits whose `strengthUpdatedAt`
 * is older than `staleAfterMs` and recomputes strength + streak from full
 * tracking history. Prevents the "instant decay on toggle" UX: between
 * toggles the stored strength is frozen, so a daily catch-up keeps the
 * displayed value at most ~24h stale.
 */
import { v } from 'convex/values';
import { internal } from '../_generated/api';
import { internalMutation } from '../_generated/server';
import {
  calculateMomentumStrengthSnapshot,
  resolveAlgorithmMode,
} from '../habitStrength';
import { calculateStreakFromHistory } from '../streakUtils';
import { getTodayForTimezone, maxDateKey } from './utils';

const DEFAULT_STALE_MS = 23 * 60 * 60 * 1000;
const DEFAULT_BATCH_SIZE = 100;
const SCAN_MULTIPLIER = 4;

export const recalculateStaleStrength = internalMutation({
  args: {
    batchSize: v.optional(v.number()),
    cursor: v.optional(v.id('habits')),
    staleAfterMs: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const staleAfterMs = args.staleAfterMs ?? DEFAULT_STALE_MS;
    const batchSize = args.batchSize ?? DEFAULT_BATCH_SIZE;
    const cutoff = Date.now() - staleAfterMs;

    const scanned = await ctx.db
      .query('habits')
      .take(batchSize * SCAN_MULTIPLIER);

    const candidates = scanned.filter(
      (habit) =>
        !habit.archived &&
        !habit.paused &&
        !habit.pendingStrengthRecalcId &&
        (habit.strengthUpdatedAt ?? 0) < cutoff
    );

    const toProcess = candidates.slice(0, batchSize);
    let processed = 0;
    let failed = 0;

    for (const habit of toProcess) {
      try {
        const tracking = await ctx.db
          .query('tracking')
          .withIndex('by_habit_and_date', (q) =>
            q.eq('habitId', habit._id)
          )
          .collect();

        let evaluationDateKey = getTodayForTimezone();
        for (const record of tracking) {
          evaluationDateKey = maxDateKey(evaluationDateKey, record.date);
        }

        const trackingForSnapshot = tracking.map((r) => ({
          completed: r.completed,
          date: r.date,
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
          bestStreak: streakData.bestStreak,
          currentStreak: streakData.currentStreak,
          lastCompletedDate: streakData.lastCompletedDate,
          strength: snapshot.strength,
          strengthLevel: snapshot.strengthLevel,
          strengthUpdatedAt: Date.now(),
        });
        processed += 1;
      } catch (error) {
        failed += 1;
        console.error('[recalculateStaleStrength] failed', {
          error,
          habitId: habit._id,
        });
      }
    }

    if (candidates.length > toProcess.length) {
      await ctx.scheduler.runAfter(
        0,
        internal.habits.recalculateStaleStrength.recalculateStaleStrength,
        { batchSize, staleAfterMs }
      );
    }

    return { failed, processed, remaining: candidates.length - toProcess.length };
  },
  returns: v.object({
    failed: v.number(),
    processed: v.number(),
    remaining: v.number(),
  }),
});
