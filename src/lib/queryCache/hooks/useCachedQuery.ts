import { useQuery } from 'convex/react';
import type { FunctionReference } from 'convex/server';
import { useEffect, useMemo, useRef, useSyncExternalStore } from 'react';

import type { CachedQueryOptions } from '../types';
import { getCacheEntry } from '../registry';
import { queryCacheStore } from '../store/state';
import {
  buildLatestMemoryKey,
  buildLatestStorageKey,
  buildMemoryKey,
  getQueryCacheScope,
  normalizeArgs,
} from '../persistence/keys';
import { scheduleEntryWrite } from '../persistence/writeEntry';

function useLiveQuery<Query extends FunctionReference<'query'>>(
  query: Query,
  args: Query['_args'] | 'skip'
): Query['_returnType'] | undefined {
  return (
    useQuery as (...params: unknown[]) => Query['_returnType'] | undefined
  )(query, args);
}

export function useCachedQuery<Query extends FunctionReference<'query'>>(
  query: Query,
  args: Query['_args'] | 'skip',
  options: CachedQueryOptions
): Query['_returnType'] | undefined {
  const entry = getCacheEntry(options.entryName);
  const fallbackToLatest = options.fallbackToLatest ?? entry.latestFallback;
  const argsKey = normalizeArgs(args);
  const stableArgs = useRef(args);
  if (normalizeArgs(stableArgs.current) !== argsKey) stableArgs.current = args;
  const memoryKey = useMemo(
    () => buildMemoryKey(entry.name, stableArgs.current),
    [entry.name, argsKey]
  );
  const live = useLiveQuery(query, stableArgs.current);
  const previousLive = useRef<Query['_returnType'] | undefined>(undefined);
  const cached = useSyncExternalStore(
    (listener) => queryCacheStore.subscribe(memoryKey, listener),
    () => queryCacheStore.get<Query['_returnType']>(memoryKey),
    () => queryCacheStore.get<Query['_returnType']>(memoryKey)
  );
  const latestKey = buildLatestMemoryKey(entry.name);
  const latest = useSyncExternalStore(
    (listener) => queryCacheStore.subscribe(latestKey, listener),
    () => queryCacheStore.get<Query['_returnType']>(latestKey),
    () => queryCacheStore.get<Query['_returnType']>(latestKey)
  );

  useEffect(() => {
    if (live === undefined) return;
    previousLive.current = live;
    const scope = getQueryCacheScope();
    const savedAt = Date.now();
    queryCacheStore.set(memoryKey, live, savedAt);
    queryCacheStore.set(latestKey, live, savedAt);
    scheduleEntryWrite(
      entry,
      buildLatestStorageKey(entry, scope),
      stableArgs.current,
      live,
      scope
    );
  }, [argsKey, entry, latestKey, live, memoryKey]);

  if (args === 'skip') return undefined;
  if (live !== undefined) return live;
  if (previousLive.current !== undefined) return previousLive.current;
  return cached ?? (fallbackToLatest ? latest : undefined);
}

export function useCachedQuerySavedAt(
  entryName: CachedQueryOptions['entryName'],
  args: unknown,
  options: Pick<CachedQueryOptions, 'fallbackToLatest'> = {}
): number | undefined {
  const entry = getCacheEntry(entryName);
  const fallbackToLatest = options.fallbackToLatest ?? entry.latestFallback;
  const memoryKey = useMemo(
    () => buildMemoryKey(entry.name, args),
    [entry.name, args]
  );
  const latestKey = buildLatestMemoryKey(entry.name);
  const savedAt = useSyncExternalStore(
    (listener) => queryCacheStore.subscribe(memoryKey, listener),
    () => queryCacheStore.getSavedAt(memoryKey),
    () => queryCacheStore.getSavedAt(memoryKey)
  );
  const latestSavedAt = useSyncExternalStore(
    (listener) => queryCacheStore.subscribe(latestKey, listener),
    () => queryCacheStore.getSavedAt(latestKey),
    () => queryCacheStore.getSavedAt(latestKey)
  );

  return savedAt ?? (fallbackToLatest ? latestSavedAt : undefined);
}
