/**
 * Resolve the next completion flag for toggleHabit.
 * `requested` is the desired state from offline sync; omit it to flip.
 */
export function resolveCompletedStatus(
  existingCompleted: boolean | undefined,
  requested?: boolean
): { next: boolean; noop: boolean } {
  const current = existingCompleted ?? false;
  const next = requested ?? !current;
  return { next, noop: current === next };
}
