import { useQuery } from 'convex/react';
import type { FunctionReference } from 'convex/server';
import { useMemo, useRef, useSyncExternalStore } from 'react';

import type { CachedQueryOptions } from '../types';
import { getCacheEntry } from '../registry';
import { queryCacheStore } from '../store/state';
import {
  buildLatestArgsMemoryKey,
  buildLatestMemoryKey,
  buildMemoryKey,
  normalizeArgs,
} from '../persistence/keys';
import { usePersistCachedQuery } from './usePersistCachedQuery';

function useLiveQuery<Query extends FunctionReference<'query'>>(
  query: Query,
  args: Query['_args'] | 'skip'
): Query['_returnType'] | undefined {
  return (
    useQuery as (...params: unknown[]) => Query['_returnType'] | undefined
  )(query, args);
}

function useQueryCacheValue<T>(key: string): T | undefined {
  return useSyncExternalStore(
    (listener) => queryCacheStore.subscribe(key, listener),
    () => queryCacheStore.get<T>(key),
    () => queryCacheStore.get<T>(key)
  );
}

type LatestUsable = (persistedArgs: unknown, requestedArgs: unknown) => boolean;

function getLatestFallback<T>(
  latest: T | undefined,
  fallbackToLatest: boolean | undefined,
  latestUsable: LatestUsable | undefined,
  persistedArgs: unknown,
  requestedArgs: unknown
): T | undefined {
  if (!fallbackToLatest) return undefined;
  if (latestUsable && !latestUsable(persistedArgs, requestedArgs)) {
    return undefined;
  }
  return latest;
}

export function useCachedQuery<Query extends FunctionReference<'query'>>(
  query: Query,
  args: Query['_args'] | 'skip',
  options: CachedQueryOptions
): Query['_returnType'] | undefined {
  const entry = getCacheEntry(options.entryName);
  const fallbackToLatest = options.fallbackToLatest ?? entry.latestFallback;
  const latestUsable = options.latestUsable ?? entry.latestUsable;
  const writeLatest = options.writeLatest ?? options.fallbackToLatest ?? true;
  const argsKey = normalizeArgs(args);
  const stableArgs = useRef(args);
  if (normalizeArgs(stableArgs.current) !== argsKey) stableArgs.current = args;
  const memoryKey = useMemo(
    () => buildMemoryKey(entry.name, stableArgs.current),
    [entry.name, argsKey]
  );
  const live = useLiveQuery(query, stableArgs.current);
  const previousLive = useRef<Query['_returnType'] | undefined>(undefined);
  const cached = useQueryCacheValue<Query['_returnType']>(memoryKey);
  const latestKey = buildLatestMemoryKey(entry.name);
  const latest = useQueryCacheValue<Query['_returnType']>(latestKey);
  const latestArgs = useQueryCacheValue<unknown>(buildLatestArgsMemoryKey(entry.name));

  usePersistCachedQuery({
    argsKey,
    entry,
    latestKey,
    live,
    memoryKey,
    previousLive,
    stableArgs,
    writeLatest,
  });

  if (args === 'skip') return undefined;
  if (live !== undefined) return live;
  if (previousLive.current !== undefined) return previousLive.current;
  return (
    cached ??
    getLatestFallback(
      latest,
      fallbackToLatest,
      latestUsable,
      latestArgs,
      stableArgs.current
    )
  );
}
