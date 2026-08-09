/**
 * Fields written onto a tracking row when toggling completion.
 * Absent kind means full — keep legacy rows valid without migration.
 */
export type CompletionKind = 'full' | 'minimal';

export function trackingCompletionPatch(
  completed: boolean,
  kind?: CompletionKind
): {
  completed: boolean;
  kind: CompletionKind | undefined;
} {
  if (!completed) {
    return { completed: false, kind: undefined };
  }
  return {
    completed: true,
    kind: kind === 'minimal' ? 'minimal' : undefined,
  };
}
