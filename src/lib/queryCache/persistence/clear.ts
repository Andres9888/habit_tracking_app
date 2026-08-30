import { getStorageAdapter } from './adapters';
import { queryCacheEntries } from '../registry';
import { buildLatestStorageKey } from './keys';
import { cancelPendingWrites } from './writeEntry';

/**
 * Drop the Keychain copy of entries that have since moved to plain storage.
 * Without this the old secure chunks stay behind forever: clear/read both
 * route through the entry's *current* adapter.
 */
export async function purgeLegacySecureEntries(
  scope: string | null
): Promise<void> {
  await Promise.allSettled(
    queryCacheEntries
      .filter((entry) => entry.migratedFromSecure)
      .map((entry) =>
        getStorageAdapter('secure').removeItem(
          buildLatestStorageKey(entry, scope)
        )
      )
  );
}

export async function clearQueryCacheForScope(
  scope: string | null
): Promise<void> {
  cancelPendingWrites();
  await Promise.allSettled([
    ...queryCacheEntries.map((entry) =>
      getStorageAdapter(entry.storage).removeItem(
        buildLatestStorageKey(entry, scope)
      )
    ),
    purgeLegacySecureEntries(scope),
  ]);
}
