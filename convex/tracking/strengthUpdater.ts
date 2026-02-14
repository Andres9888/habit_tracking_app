import type { GenericMutationCtx } from 'convex/server';
import type { DataModel, Id } from '../_generated/dataModel';
import { calculateMomentumStrengthSnapshot } from '../habitStrength';
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
  toggleDate: string;
  timezone?: string;
}

/**
 * Update habit strength after a toggle operation
 */
export async function updateHabitStrength(
  params: StrengthUpdateParams
): Promise<void> {
  const { ctx, habitCreatedAt, habitId, currentStrength, toggleDate, timezone } =
    params;

  const allTracking = await ctx.db
    .query('tracking')
    .withIndex('by_habit_and_date', (q) => q.eq('habitId', habitId))
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
    throughDate: evaluationDateKey,
    tracking: trackingData,
  });

  await ctx.db.patch(habitId, {
    strength: snapshot.strength,
    strengthLevel: snapshot.strengthLevel,
    strengthUpdatedAt: Date.now(),
  });

  // Log the strength change in debug mode
  const previousStrength100 = currentStrength * 100;
  console.warn('🔧 Strength updated:', {
    change: `${(snapshot.strength100 - previousStrength100).toFixed(2)}%`,
    evaluationDateKey,
    newStrength: `${snapshot.strength100.toFixed(1)}%`,
    previousStrength: `${previousStrength100.toFixed(1)}%`,
  });
}
