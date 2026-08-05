/**
 * Offline Streak Calculation
 *
 * Merges server tracking data with pending offline operations
 * for accurate streak calculation while offline.
 */

import { calculateStreakFromHistory } from './historyCalculation';
import type {
  PendingToggleOperation,
  StreakCalculatorOptions,
  StreakData,
  TrackingRecord,
} from './types';

/**
 * Merge server tracking with pending offline operations
 *
 * Applies pending toggles to server tracking data to get the current
 * effective completion state for each date.
 *
 * @param serverTracking - Tracking records from server
 * @param pendingOperations - Pending offline toggle operations
 * @returns Merged tracking records with pending operations applied
 */
export function mergeTrackingWithPending(
  serverTracking: TrackingRecord[],
  pendingOperations: PendingToggleOperation[]
): TrackingRecord[] {
  const trackingMap = new Map<string, boolean>();

  for (const record of serverTracking) {
    trackingMap.set(record.date, record.completed);
  }

  // Apply pending operations (later operations override earlier ones)
  for (const op of pendingOperations) {
    trackingMap.set(op.date, op.toCompleted);
  }

  return [...trackingMap.entries()].map(([date, completed]) => ({
    completed,
    date,
  }));
}

/**
 * Calculate streak for a habit including pending offline operations
 *
 * This is the main entry point for offline streak calculation. It merges
 * server tracking data with pending offline operations, then calculates
 * the streak as if all pending operations were already applied.
 *
 * @param serverTracking - Tracking records from server
 * @param pendingOperations - Pending offline toggle operations
 * @param todayDate - Today's date in YYYY-MM-DD format
 * @param _options - Optional calculation options (for future extensibility)
 * @returns Calculated streak data with pending operations applied
 */
export function calculateOfflineStreak(
  serverTracking: TrackingRecord[],
  pendingOperations: PendingToggleOperation[],
  todayDate: string,
  _options?: StreakCalculatorOptions
): StreakData {
  const mergedTracking = mergeTrackingWithPending(
    serverTracking,
    pendingOperations
  );

  return calculateStreakFromHistory(mergedTracking, todayDate);
}
