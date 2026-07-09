type Listener = () => void;

const listeners = new Set<Listener>();
let hydrated = false;

export function isQueryCacheHydrated(): boolean {
  return hydrated;
}

export function markQueryCacheHydrated(): void {
  if (hydrated) return;
  hydrated = true;
  for (const listener of listeners) listener();
}

export function resetQueryCacheHydrated(): void {
  if (!hydrated) return;
  hydrated = false;
  for (const listener of listeners) listener();
}

export function subscribeQueryCacheHydrated(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
