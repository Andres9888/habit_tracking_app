type LatestUsable = (persistedArgs: unknown, requestedArgs: unknown) => boolean;

interface ResolveCachedValueArgs<T> {
  args: unknown;
  cached: T | undefined;
  fallbackToLatest: boolean | undefined;
  latest: T | undefined;
  latestArgs: unknown;
  latestUsable: LatestUsable | undefined;
  live: T | undefined;
  previousLive: T | undefined;
  requestedArgs: unknown;
}

function getLatestFallback<T>({
  fallbackToLatest,
  latest,
  latestArgs,
  latestUsable,
  requestedArgs,
}: Pick<
  ResolveCachedValueArgs<T>,
  'fallbackToLatest' | 'latest' | 'latestArgs' | 'latestUsable' | 'requestedArgs'
>): T | undefined {
  if (!fallbackToLatest) return undefined;
  if (latestUsable && !latestUsable(latestArgs, requestedArgs)) return undefined;
  return latest;
}

// Pure resolution of the value a cached query should surface, in priority
// order: live → previousLive → cached → guarded latest fallback. Extracted so
// the stabilizer hook can be called unconditionally in useCachedQuery.
export function resolveCachedValue<T>(params: ResolveCachedValueArgs<T>): T | undefined {
  if (params.args === 'skip') return undefined;
  if (params.live !== undefined) return params.live;
  if (params.previousLive !== undefined) return params.previousLive;
  return params.cached ?? getLatestFallback(params);
}
