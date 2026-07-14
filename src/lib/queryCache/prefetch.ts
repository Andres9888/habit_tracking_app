import { getCacheEntry } from './registry';
import {
  buildLatestArgsMemoryKey,
  buildLatestMemoryKey,
  buildLatestStorageKey,
  buildMemoryKey,
} from './persistence/keys';
import { writeEntryImmediately } from './persistence/writeEntry';
import { queryCacheStore } from './store/state';
import type { QueryCacheEntryName } from './types';

type PrefetchEntryParams = {
  args?: unknown;
  entryName: QueryCacheEntryName;
  value: unknown;
  writeLatest?: boolean;
};

export async function prefetchQueryCacheEntry({
  args = {},
  entryName,
  value,
  writeLatest = true,
}: PrefetchEntryParams): Promise<void> {
  const entry = getCacheEntry(entryName);
  const exactMemoryKey = buildMemoryKey(entry.name, args);
  const savedAt = Date.now();
  queryCacheStore.set(exactMemoryKey, value, savedAt);

  if (!writeLatest) return;

  const latestMemoryKey = buildLatestMemoryKey(entry.name);
  const latestArgsMemoryKey = buildLatestArgsMemoryKey(entry.name);
  queryCacheStore.set(latestMemoryKey, value, savedAt);
  queryCacheStore.set(latestArgsMemoryKey, args, savedAt);
  await writeEntryImmediately(
    entry,
    buildLatestStorageKey(entry),
    args,
    value
  );
}
