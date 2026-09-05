/**
 * One-shot cache priming.
 *
 * Writes a value fetched outside of `useCachedQuery` (e.g. a single
 * `convex.query` warm-up) into exactly the slots `usePersistCachedQuery`
 * writes, so a later `useCachedQuery(query, args, { entryName })` reads it
 * synchronously on its first render instead of waiting for the subscription.
 */
import {
  buildLatestArgsMemoryKey,
  buildLatestMemoryKey,
  buildLatestStorageKey,
  buildMemoryKey,
  getQueryCacheScope,
} from './persistence/keys';
import { scheduleEntryWrite } from './persistence/writeEntry';
import { getCacheEntry } from './registry';
import { queryCacheStore } from './store/state';
import type { QueryCacheEntryName } from './types';

/** True when the in-memory cache already holds a value for these exact args. */
export function hasCachedQueryValue(
  entryName: QueryCacheEntryName,
  args: unknown
): boolean {
  return queryCacheStore.get(buildMemoryKey(entryName, args)) !== undefined;
}

export function primeQueryCache(
  entryName: QueryCacheEntryName,
  args: unknown,
  value: unknown
): void {
  if (value == null) return;
  const entry = getCacheEntry(entryName);
  const scope = getQueryCacheScope();
  const savedAt = Date.now();

  queryCacheStore.set(buildMemoryKey(entry.name, args), value, savedAt);

  // Mirror writeLatestValue(): the `:latest` slot plus the args it was written
  // with, then the persisted entry.
  queryCacheStore.set(buildLatestMemoryKey(entry.name), value, savedAt);
  queryCacheStore.set(buildLatestArgsMemoryKey(entry.name), args, savedAt);
  scheduleEntryWrite(
    entry,
    buildLatestStorageKey(entry, scope),
    args,
    value,
    scope
  );
}
