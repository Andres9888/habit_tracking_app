/**
 * Hook to subscribe to optimistic store changes
 */

import { useSyncExternalStore } from 'react';
import { optimisticStore } from '../store';

export function useOptimisticStore() {
  return useSyncExternalStore(
    (onStoreChange) => optimisticStore.subscribe(onStoreChange),
    () => optimisticStore.getSnapshot(),
    () => optimisticStore.getSnapshot()
  );
}

/**
 * Subscribe to ONLY the pending-toggles slice of the store.
 *
 * Returns a referentially-stable Map that changes identity only when a toggle
 * is actually added/removed — not on every optimistic notify. This lets the
 * habits-list tracking hook skip re-rendering on operation-state changes,
 * archives, pauses, and reorders. Consumers must treat the result as readonly.
 */
export function usePendingToggles(): Map<string, boolean> {
  return useSyncExternalStore(
    (onStoreChange) => optimisticStore.subscribe(onStoreChange),
    () => optimisticStore.getPendingTogglesSnapshot(),
    () => optimisticStore.getPendingTogglesSnapshot()
  );
}
