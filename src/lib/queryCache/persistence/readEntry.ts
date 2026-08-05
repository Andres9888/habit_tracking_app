import type { CacheEntryDefinition, PersistedEntry } from '../types';
import { getStorageAdapter } from './adapters';

export async function readEntry<T>(
  entry: CacheEntryDefinition,
  key: string
): Promise<PersistedEntry<T> | null> {
  try {
    const raw = await getStorageAdapter(entry.storage).getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PersistedEntry<T>>;
    if (parsed.version !== entry.version || !('value' in parsed)) return null;
    return parsed as PersistedEntry<T>;
  } catch {
    return null;
  }
}
