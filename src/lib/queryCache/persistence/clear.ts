import { getStorageAdapter } from './adapters';
import { queryCacheEntries } from '../registry';
import { buildLatestStorageKey } from './keys';
import { cancelPendingWrites } from './writeEntry';

export async function clearQueryCacheForScope(
  scope: string | null
): Promise<void> {
  cancelPendingWrites();
  await Promise.allSettled(
    queryCacheEntries.map((entry) =>
      getStorageAdapter(entry.storage).removeItem(
        buildLatestStorageKey(entry, scope)
      )
    )
  );
}
