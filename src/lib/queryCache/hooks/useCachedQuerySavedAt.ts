import { useMemo, useSyncExternalStore } from 'react';

import { buildLatestMemoryKey, buildMemoryKey } from '../persistence/keys';
import { getCacheEntry } from '../registry';
import { queryCacheStore } from '../store/state';
import type { CachedQueryOptions } from '../types';

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
