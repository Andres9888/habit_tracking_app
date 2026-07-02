export interface RecalculateStaleArgs {
  batchSize?: number;
  cutoff?: number;
  cursor?: string | null;
  staleAfterMs?: number;
}

export interface ResolvedRecalculateStaleArgs {
  batchSize: number;
  cutoff: number;
  staleAfterMs: number;
}

export function resolveRecalculateStaleArgs(
  args: RecalculateStaleArgs,
  defaults: ResolvedRecalculateStaleArgs
): ResolvedRecalculateStaleArgs {
  const staleAfterMs = args.staleAfterMs ?? defaults.staleAfterMs;
  return {
    batchSize: args.batchSize ?? defaults.batchSize,
    cutoff: args.cutoff ?? Date.now() - staleAfterMs,
    staleAfterMs,
  };
}

export function buildContinuationArgs(
  args: ResolvedRecalculateStaleArgs,
  cursor: string
) {
  return { ...args, cursor };
}
