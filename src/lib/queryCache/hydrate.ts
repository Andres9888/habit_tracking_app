import { queryCacheEntries } from './registry';
import { queryCacheStore } from './store/state';
import {
  buildLatestMemoryKey,
  buildLatestStorageKey,
  buildMemoryKey,
} from './persistence/keys';
import { readEntry } from './persistence/readEntry';
import { cancelPendingWrites } from './persistence/writeEntry';

export async function hydrateQueryCache(scope: string | null): Promise<void> {
  const hydrated = await Promise.all(
    queryCacheEntries.map(async (entry) => {
      const persisted = await readEntry(
        entry,
        buildLatestStorageKey(entry, scope)
      );
      return persisted ? { entry, persisted } : null;
    })
  );

  for (const item of hydrated) {
    if (!item) continue;
    const { entry, persisted } = item;
    const memoryKey = buildMemoryKey(entry.name, persisted.args);
    const latestKey = buildLatestMemoryKey(entry.name);
    if (queryCacheStore.get(memoryKey) === undefined) {
      queryCacheStore.set(memoryKey, persisted.value, persisted.savedAt);
    }
    if (queryCacheStore.get(latestKey) === undefined) {
      queryCacheStore.set(latestKey, persisted.value, persisted.savedAt);
    }
  }
}

export function resetQueryCache(): void {
  cancelPendingWrites();
  queryCacheStore.reset();
}

export { getCacheEntry } from './registry';
