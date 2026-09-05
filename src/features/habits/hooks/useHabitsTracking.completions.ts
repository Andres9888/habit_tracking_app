/**
 * Completion-set and streak construction for the habits list.
 *
 * Split out of useHabitsTracking.helpers so both stay under the file-length
 * budget. These two functions are deliberately adjacent: the Set identities
 * preserved by buildCompletedDatesByHabit are exactly what buildStreakRunByHabit
 * caches on.
 */

import type { CurrentStreakRun } from '../../../utils/streak';
import { computeCurrentStreakRun } from '../../../utils/streak';

type TrackingEntry = { completed: boolean; date: string; habitId: string };

function sameDates(a: Set<string>, b: Set<string>) {
  if (a.size !== b.size) return false;
  for (const value of a) {
    if (!b.has(value)) return false;
  }
  return true;
}

export function buildCompletedDatesByHabit(
  tracking: TrackingEntry[],
  pendingToggles: Map<string, boolean>,
  previous?: Map<string, Set<string>>
) {
  const completedDatesByHabit = new Map<string, Set<string>>();
  for (const entry of tracking) {
    if (!entry.completed) continue;
    if (!completedDatesByHabit.has(entry.habitId)) {
      completedDatesByHabit.set(entry.habitId, new Set<string>());
    }
    completedDatesByHabit.get(entry.habitId)?.add(entry.date);
  }

  for (const [key, toCompleted] of pendingToggles) {
    const [habitId = '', date = ''] = key.split(':');
    if (!completedDatesByHabit.has(habitId)) {
      completedDatesByHabit.set(habitId, new Set<string>());
    }
    if (toCompleted) {
      completedDatesByHabit.get(habitId)?.add(date);
    } else {
      completedDatesByHabit.get(habitId)?.delete(date);
    }
  }

  // Carry over the previous Set object for any habit whose dates are unchanged.
  // A toggle rebuilds this map for every habit, and the identity of each Set is
  // what lets buildStreakRunByHabit below skip the untouched ones.
  if (previous) {
    for (const [habitId, dates] of completedDatesByHabit) {
      const previousDates = previous.get(habitId);
      if (previousDates && sameDates(dates, previousDates)) {
        completedDatesByHabit.set(habitId, previousDates);
      }
    }
  }

  return completedDatesByHabit;
}

// Streaks walk backwards day by day from today, so a user with a long streak
// pays for every habit on every toggle. Keyed on the Set identity preserved
// above, plus the day, since "today" moving invalidates every streak.
const streakCache = new WeakMap<
  Set<string>,
  { dayKey: number; run: CurrentStreakRun }
>();

/**
 * Client-side streak runs per habit. The run carries its earliest counted day
 * so callers can tell a genuinely-finished streak from one that merely ran out
 * of tracking data at the edge of the fetched window.
 */
export function buildStreakRunByHabit(
  completedDatesByHabit: Map<string, Set<string>>,
  stableToday: Date
) {
  const dayKey = stableToday.getTime();
  const runByHabit = new Map<string, CurrentStreakRun>();
  for (const [habitId, completedDates] of completedDatesByHabit) {
    const cached = streakCache.get(completedDates);
    if (cached && cached.dayKey === dayKey) {
      runByHabit.set(habitId, cached.run);
      continue;
    }
    const run = computeCurrentStreakRun(completedDates, stableToday);
    streakCache.set(completedDates, { dayKey, run });
    runByHabit.set(habitId, run);
  }
  return runByHabit;
}
