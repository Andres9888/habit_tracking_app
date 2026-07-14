import type { CacheEntryDefinition, PersistedEntry } from '../types';
import { getStorageAdapter } from './adapters';
import { canonicalStringify } from './keys';

const lastWritten = new Map<string, string>();
const timers = new Map<string, ReturnType<typeof setTimeout>>();
const WRITE_DELAY_MS = 150;

function buildPersistedEntry(
  entry: CacheEntryDefinition,
  args: unknown,
  value: unknown
): PersistedEntry {
  return {
    args,
    savedAt: Date.now(),
    value,
    version: entry.version,
  };
}

async function writePersistedEntry(
  entry: CacheEntryDefinition,
  key: string,
  persisted: PersistedEntry
): Promise<void> {
  await getStorageAdapter(entry.storage).setItem(key, JSON.stringify(persisted));
  lastWritten.set(key, canonicalStringify(persisted.value));
}

export function cancelPendingWrites(): void {
  for (const timer of timers.values()) clearTimeout(timer);
  timers.clear();
  lastWritten.clear();
}

export function scheduleEntryWrite(
  entry: CacheEntryDefinition,
  key: string,
  args: unknown,
  value: unknown,
  _scope?: string | null
): void {
  const serializedValue = canonicalStringify(value);
  if (lastWritten.get(key) === serializedValue) return;
  const existing = timers.get(key);
  if (existing) clearTimeout(existing);
  timers.set(
    key,
    setTimeout(() => {
      timers.delete(key);
      const persisted = buildPersistedEntry(entry, args, value);
      writePersistedEntry(entry, key, persisted)
        .catch((error) => {
          if (__DEV__) console.warn('[queryCache] persist failed', error);
        });
    }, WRITE_DELAY_MS)
  );
}

export async function writeEntryImmediately(
  entry: CacheEntryDefinition,
  key: string,
  args: unknown,
  value: unknown
): Promise<number> {
  const persisted = buildPersistedEntry(entry, args, value);
  await writePersistedEntry(entry, key, persisted);
  return persisted.savedAt;
}
