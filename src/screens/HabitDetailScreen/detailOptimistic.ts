/**
 * detailOptimistic — merge shared-store pending toggles into the detail
 * screen's completed-dates set and derive hero stats from the merged result.
 *
 * Replaces the today-only ±1 overlay (optimisticToday): once pending toggles
 * are merged into completedDates, stats must be derived from the merged set
 * or today's pending op would be double-counted. Streak is computed
 * client-side only while this habit has a pending toggle; in the steady
 * state the server's value is authoritative (the tracking window is finite,
 * so a longer-than-window streak would be truncated by client computation).
 */
import { parseISO } from 'date-fns';
import { buildCompletedDatesByHabit } from '../../features/habits/hooks/useHabitsTracking.helpers';
import { computeCurrentStreakFromDates } from '../../utils/streak';

export function mergeCompletedDates(
  completedDatesKey: string,
  pendingToggles: Map<string, boolean>,
  habitId: string
): Set<string> {
  const entries = completedDatesKey
    ? completedDatesKey
        .split(',')
        .map((date) => ({ completed: true, date, habitId }))
    : [];
  return (
    buildCompletedDatesByHabit(entries, pendingToggles).get(habitId) ??
    new Set<string>()
  );
}

export function hasPendingToggleForHabit(
  pendingToggles: Map<string, boolean>,
  habitId: string
): boolean {
  if (!habitId) return false;
  const prefix = `${habitId}:`;
  for (const key of pendingToggles.keys()) {
    if (key.startsWith(prefix)) return true;
  }
  return false;
}

export interface DetailStats {
  bestStreak: number;
  currentStreak: number;
  isCompletedToday: boolean;
  totalCompletions: number;
}

export function applyOptimisticStats(
  server: { bestStreak: number; currentStreak: number },
  completedDates: Set<string>,
  hasPending: boolean,
  today: string
): DetailStats {
  const currentStreak = hasPending
    ? computeCurrentStreakFromDates(completedDates, parseISO(today))
    : server.currentStreak;
  return {
    bestStreak: Math.max(server.bestStreak, currentStreak),
    currentStreak,
    isCompletedToday: completedDates.has(today),
    totalCompletions: completedDates.size,
  };
}
