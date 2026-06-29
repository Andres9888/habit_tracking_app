/**
 * Overlay the shared optimistic store (`pendingToggles`) onto a flat tracking
 * array, returning a new array (or the same reference when nothing is pending).
 *
 * Existing entries are flipped; pending toggles for dates with no server entry
 * are appended via `makeEntry`. This lets array-consuming surfaces (the habit
 * calendar modal's month grid + heatmap) reflect optimistic toggles the same
 * way the merged date-set does for the list and detail screens — keeping every
 * completion surface in sync with the shared store.
 */
type TrackingLike = { completed: boolean; date: string; habitId: string };

export function applyPendingTogglesToTracking<T extends TrackingLike>(
  tracking: T[],
  pendingToggles: Map<string, boolean>,
  makeEntry: (habitId: string, date: string, completed: boolean) => T
): T[] {
  if (pendingToggles.size === 0) return tracking;
  const merged: T[] = [...tracking];
  const indexByKey = new Map<string, number>();
  for (const [i, entry] of merged.entries()) {
    indexByKey.set(`${entry.habitId}:${entry.date}`, i);
  }
  for (const [key, toCompleted] of pendingToggles) {
    const existing = indexByKey.get(key);
    if (existing === undefined) {
      const [habitId = '', date = ''] = key.split(':');
      merged.push(makeEntry(habitId, date, toCompleted));
    } else {
      merged[existing] = { ...merged[existing], completed: toCompleted };
    }
  }
  return merged;
}
