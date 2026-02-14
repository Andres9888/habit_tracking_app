/**
 * Hook to subscribe to optimistic store changes
 */

import { useSyncExternalStore } from 'react';
import { optimisticStore } from '../store';

export function useOptimisticStore(): ReturnType<
  typeof optimisticStore.getSnapshot
> {
  return useSyncExternalStore(
    (onStoreChange) => optimisticStore.subscribe(onStoreChange),
    () => optimisticStore.getSnapshot(),
    () => optimisticStore.getSnapshot()
  );
}
