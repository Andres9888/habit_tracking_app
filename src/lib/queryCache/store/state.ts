import { structuralEqual } from '../equality';

type Listener = () => void;

interface CacheRecord {
  savedAt?: number;
  value: unknown;
}

const cache = new Map<string, CacheRecord>();
const globalListeners = new Set<Listener>();
const keyListeners = new Map<string, Set<Listener>>();

function notify(key?: string): void {
  if (key) {
    for (const listener of keyListeners.get(key) ?? []) listener();
  }
  for (const listener of globalListeners) listener();
}

function subscribeToSet(set: Set<Listener>, listener: Listener): () => void {
  set.add(listener);
  return () => set.delete(listener);
}

export const queryCacheStore = {
  get<T>(key: string): T | undefined {
    return cache.get(key)?.value as T | undefined;
  },
  getSavedAt(key: string): number | undefined {
    return cache.get(key)?.savedAt;
  },
  reset(): void {
    if (cache.size === 0) return;
    cache.clear();
    notify();
  },
  set(key: string, value: unknown, savedAt = Date.now()): void {
    const current = cache.get(key);
    if (current && current.value === value && current.savedAt === savedAt)
      return;
    // Content-identical fresh instance: keep the prior value reference (so
    // useSyncExternalStore readers bail on the unchanged snapshot) but adopt
    // the new savedAt (so useCachedQuerySavedAt readers stay reactive).
    // NOTE: relies on all value readers going through uSES — a direct
    // (non-uSES) reader would still see a notify with an unchanged reference.
    if (current && structuralEqual(current.value, value)) {
      cache.set(key, { savedAt, value: current.value });
      notify(key);
      return;
    }
    cache.set(key, { savedAt, value });
    notify(key);
  },
  subscribe(keyOrListener: string | Listener, listener?: Listener): () => void {
    if (typeof keyOrListener === 'function') {
      return subscribeToSet(globalListeners, keyOrListener);
    }

    if (!listener) return () => {};
    const listeners = keyListeners.get(keyOrListener) ?? new Set<Listener>();
    listeners.add(listener);
    keyListeners.set(keyOrListener, listeners);
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0) keyListeners.delete(keyOrListener);
    };
  },
};
