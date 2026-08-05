import type { CacheEntryDefinition, PersistedEntry } from '../types';
import { getStorageAdapter } from './adapters';
import { canonicalStringify } from './keys';

const lastWritten = new Map<string, string>();
const timers = new Map<string, ReturnType<typeof setTimeout>>();
const WRITE_DELAY_MS = 150;

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
      const persisted: PersistedEntry = {
        args,
        savedAt: Date.now(),
        value,
        version: entry.version,
      };
      getStorageAdapter(entry.storage)
        .setItem(key, JSON.stringify(persisted))
        .then(() => {
          lastWritten.set(key, serializedValue);
        })
        .catch((error) => {
          if (__DEV__) console.warn('[queryCache] persist failed', error);
        });
    }, WRITE_DELAY_MS)
  );
}
