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
  serveCachedWhileSkipped: boolean | undefined;
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
  // A skipped request has no args-keyed memory slot (the key would be built
  // from 'skip'), so opted-in callers read the args-independent latest slot.
  if (params.args === 'skip') {
    return params.serveCachedWhileSkipped ? params.latest : undefined;
  }
  if (params.live !== undefined) return params.live;
  if (params.previousLive !== undefined) return params.previousLive;
  return params.cached ?? getLatestFallback(params);
}
