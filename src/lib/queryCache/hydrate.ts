import { queryCacheEntries } from './registry';
import { queryCacheStore } from './store/state';
import {
  buildLatestArgsMemoryKey,
  buildLatestMemoryKey,
  buildLatestStorageKey,
  buildMemoryKey,
  getQueryCacheScope,
  setQueryCacheScope,
} from './persistence/keys';
import { purgeLegacySecureEntries } from './persistence/clear';
import { readEntry } from './persistence/readEntry';
import { cancelPendingWrites } from './persistence/writeEntry';
import { resetQueryCacheHydrated } from './store/hydration';

export async function hydrateQueryCache(scope: string | null): Promise<void> {
  // Fire-and-forget: a leftover Keychain copy is never read once the entry
  // declares plain storage, so this must not delay first paint.
  void purgeLegacySecureEntries(scope);
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
      queryCacheStore.set(
        buildLatestArgsMemoryKey(entry.name),
        persisted.args,
        persisted.savedAt
      );
    }
  }
}

export function resetQueryCache(): void {
  cancelPendingWrites();
  queryCacheStore.reset();
  resetQueryCacheHydrated();
}

// Module-level scope (not a component ref) so Fast Refresh / Strict Mode
// remounts do not wipe a still-valid in-memory cache and re-latch AuthGate
// onto the loading screen.
export function applyQueryCacheScope(scope: string | null): void {
  if (getQueryCacheScope() !== scope) {
    resetQueryCache();
  }
  setQueryCacheScope(scope);
}

export { getCacheEntry } from './registry';
