/**
 * Streak Calculator
 *
 * Re-exports all streak calculation functions for backwards compatibility.
 * Implementation split across:
 * - historyCalculation.ts - calculateStreakFromHistory
 * - offlineCalculation.ts - calculateOfflineStreak, mergeTrackingWithPending
 * - streakFromDates.ts - calculateBestStreakFromDates, computeCurrentStreakFromDates
 */

export { calculateStreakFromHistory } from './historyCalculation';
export {
  calculateOfflineStreak,
  mergeTrackingWithPending,
} from './offlineCalculation';
export {
  calculateBestStreakFromDates,
  computeCurrentStreakFromDates,
} from './streakFromDates';
