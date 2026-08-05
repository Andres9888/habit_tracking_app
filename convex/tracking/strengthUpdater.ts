import type { GenericMutationCtx } from 'convex/server';
import type { DataModel, Id } from '../_generated/dataModel';
import type { StrengthAlgorithmMode } from '../habitStrength';
import { calculateMomentumStrengthSnapshot } from '../habitStrength';
import { getTrackingCutoffKey } from '../habits/utils';
import { findMaxTrackingDate, getTodayForTimezone, maxDateKey } from './helpers';

interface TrackingRecord {
  completed: boolean;
  date: string;
}

interface StrengthUpdateParams {
  ctx: GenericMutationCtx<DataModel>;
  habitId: Id<'habits'>;
  habitCreatedAt: number;
  currentStrength: number;
  mode?: StrengthAlgorithmMode;
  toggleDate: string;
  timezone?: string;
}

/**
 * Update habit strength after a toggle operation
 */
export async function updateHabitStrength(
  params: StrengthUpdateParams
): Promise<void> {
  const { ctx, habitCreatedAt, habitId, currentStrength, mode, toggleDate, timezone } =
    params;

  // Bounded — see getTrackingCutoffKey. Only strength is written here, and the
  // momentum model decays to its floor well inside the lookback window.
  const allTracking = await ctx.db
    .query('tracking')
    .withIndex('by_habit_and_date', (q) =>
      q.eq('habitId', habitId).gte('date', getTrackingCutoffKey())
    )
    .collect();

  const maxTrackingDateKey = findMaxTrackingDate(allTracking, toggleDate);
  const evaluationDateKey = maxDateKey(
    getTodayForTimezone(timezone),
    maxDateKey(toggleDate, maxTrackingDateKey)
  );

  const trackingData: TrackingRecord[] = allTracking.map((record) => ({
    completed: record.completed,
    date: record.date,
  }));

  const snapshot = calculateMomentumStrengthSnapshot({
    habitCreatedAt,
    mode,
    throughDate: evaluationDateKey,
    tracking: trackingData,
  });

  await ctx.db.patch(habitId, {
    strength: snapshot.strength,
    strengthLevel: snapshot.strengthLevel,
    strengthUpdatedAt: Date.now(),
  });

  // Strength change logged only in development via Convex dashboard
}
