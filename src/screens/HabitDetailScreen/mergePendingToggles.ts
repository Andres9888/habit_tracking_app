/**
 * Overlay the optimistic store's pending toggles onto the server-derived
 * completed-dates Set for a single habit.
 *
 * The detail screen used to read server tracking only, so every calendar cell
 * waited on the Convex round-trip before it filled. Merging here is the same
 * contract the habits list already honours in
 * `useHabitsTracking.completions.ts`: the store is the source of truth for any
 * date with an in-flight write, and the server merely reconciles.
 *
 * Set identity is preserved whenever the contents are unchanged, so the memo
 * chain below this (month grid, week rail, hero) does not re-render on
 * unrelated store notifications.
 */

function sameDates(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false;
  for (const value of a) {
    if (!b.has(value)) return false;
  }
  return true;
}

function applyPending(
  base: Set<string>,
  pendingToggles: Map<string, boolean>,
  prefix: string
): Set<string> {
  let next: Set<string> | null = null;
  for (const [key, toCompleted] of pendingToggles) {
    if (!key.startsWith(prefix)) continue;
    const date = key.slice(prefix.length);
    if (!date || toCompleted === base.has(date)) continue;
    next ??= new Set(base);
    if (toCompleted) next.add(date);
    else next.delete(date);
  }
  return next ?? base;
}

export function mergePendingToggles(
  base: Set<string>,
  pendingToggles: Map<string, boolean>,
  habitId: string | undefined,
  previous?: Set<string>
): Set<string> {
  const merged = habitId
    ? applyPending(base, pendingToggles, `${habitId}:`)
    : base;
  return previous && sameDates(merged, previous) ? previous : merged;
}
