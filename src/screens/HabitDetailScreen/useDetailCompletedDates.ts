/**
 * The detail screen's completed-dates Set: server tracking for this habit,
 * overlaid with any in-flight optimistic toggle.
 *
 * Extracted from `useHabitDetailScreenState` so that hook stays inside the
 * 100-line ceiling; the memo chain below it (month grid, week rail, hero)
 * depends on this Set keeping its identity when the contents are unchanged.
 */

import { useMemo, useRef } from 'react';
import type { Id } from '../../../convex/_generated/dataModel';
import type { HabitTrackingEntry } from '../../features/habits/types';
import { usePendingToggles } from '../../lib/optimistic';
import { mergePendingToggles } from './mergePendingToggles';

export function useDetailCompletedDates(
  habitId: Id<'habits'> | undefined,
  tracking: HabitTrackingEntry[]
): Set<string> {
  // Stable string key so a fresh `tracking` array with identical contents does
  // not invalidate the Set below it.
  const completedDatesKey = useMemo(() => {
    if (!habitId || !tracking || !Array.isArray(tracking)) return '';
    const dates = tracking
      .filter((entry) => entry && entry.habitId === habitId && entry.completed)
      .map((entry) => entry.date)
      .filter((date): date is string => typeof date === 'string');
    if (dates.length === 0) return '';
    return dates.sort().join(',');
  }, [habitId, tracking]);

  // Note: ''.split(',') returns [''] not [], so the empty string is checked first.
  const pendingToggles = usePendingToggles();
  const previousCompletedRef = useRef<Set<string> | undefined>(undefined);
  return useMemo(() => {
    const base = completedDatesKey
      ? new Set(completedDatesKey.split(','))
      : new Set<string>();
    const merged = mergePendingToggles(
      base,
      pendingToggles,
      habitId,
      previousCompletedRef.current
    );
    previousCompletedRef.current = merged;
    return merged;
  }, [completedDatesKey, habitId, pendingToggles]);
}
