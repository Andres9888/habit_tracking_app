/**
 * Session-stable ordering for metric-driven sort modes (streak / strength).
 *
 * Those metrics change the moment a habit is toggled. Re-sorting live means a
 * first completion under `streak_asc` teleports the row from its spot among
 * the streak-0 habits to the far end of the list — it looks like the habit
 * vanished under the user's finger. So the order is computed when the list
 * first appears (or the sort mode changes) and then held: existing rows keep
 * their positions, new habits slot in where the live sort would put them,
 * removed habits drop out. The next launch picks up the fresh order.
 *
 * Name and manual modes are untouched — toggling cannot change those keys.
 */

import { useMemo, useRef } from 'react';
import type { Habit, HabitSortMode } from '../types';

const LIVE_METRIC_MODES: ReadonlySet<HabitSortMode> = new Set([
  'streak_asc',
  'streak_desc',
  'strength_asc',
  'strength_desc',
]);

export function isLiveMetricSort(mode: HabitSortMode): boolean {
  return LIVE_METRIC_MODES.has(mode);
}

/**
 * Merges newcomers into a held order: each new id is placed right after the
 * nearest habit that precedes it in the fresh sort and is already held (or at
 * the front). Held rows never move relative to each other.
 */
export function mergeHeldOrder(
  held: readonly string[],
  freshSorted: readonly string[]
): string[] {
  const fresh = new Set(freshSorted);
  const next = held.filter((id) => fresh.has(id));
  const known = new Set(next);
  let anchor: string | null = null;
  for (const id of freshSorted) {
    if (known.has(id)) {
      anchor = id;
      continue;
    }
    const at = anchor === null ? 0 : next.indexOf(anchor) + 1;
    next.splice(at, 0, id);
    known.add(id);
    anchor = id;
  }
  return next;
}

export function useStableSortOrder(
  sorted: Habit[],
  habitSortMode: HabitSortMode
): Habit[] {
  const heldRef = useRef<{ ids: string[]; mode: HabitSortMode } | null>(null);

  return useMemo(() => {
    if (!isLiveMetricSort(habitSortMode)) {
      heldRef.current = null;
      return sorted;
    }
    const freshIds = sorted.map((h) => h._id);
    const held = heldRef.current;
    if (!held || held.mode !== habitSortMode) {
      heldRef.current = { ids: freshIds, mode: habitSortMode };
      return sorted;
    }
    const ids =
      held.ids.length === freshIds.length &&
      held.ids.every((id, i) => id === freshIds[i])
        ? held.ids
        : mergeHeldOrder(held.ids, freshIds);
    heldRef.current = { ids, mode: habitSortMode };
    const byId = new Map<string, Habit>(sorted.map((h) => [h._id, h]));
    const out: Habit[] = [];
    for (const id of ids) {
      const habit = byId.get(id);
      if (habit) out.push(habit);
    }
    return out;
  }, [habitSortMode, sorted]);
}
