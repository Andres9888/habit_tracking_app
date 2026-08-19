/**
 * Overlay pending optimistic toggles onto a habit's completed-date set so
 * Detail (week strip, history doors, day entry) matches the Home list.
 */
export function mergeCompletedDates(
  dates: Set<string>,
  habitId: string | undefined,
  pendingToggles: Map<string, boolean>
): Set<string> {
  if (!habitId || pendingToggles.size === 0) return dates;

  const prefix = `${habitId}:`;
  let next: Set<string> | undefined;
  for (const [key, toCompleted] of pendingToggles) {
    if (!key.startsWith(prefix)) continue;
    const date = key.slice(prefix.length);
    if (!date) continue;
    next ??= new Set(dates);
    if (toCompleted) next.add(date);
    else next.delete(date);
  }
  return next ?? dates;
}

export function unionDateSets(a: Set<string>, b: Set<string>): Set<string> {
  if (a.size === 0) return b;
  if (b.size === 0) return a;
  const next = new Set(a);
  for (const date of b) next.add(date);
  return next;
}
