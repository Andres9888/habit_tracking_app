import { useSyncExternalStore } from 'react';

import {
  isQueryCacheHydrated,
  subscribeQueryCacheHydrated,
} from '../store/hydration';

export function useQueryCacheHydrated(): boolean {
  return useSyncExternalStore(
    subscribeQueryCacheHydrated,
    isQueryCacheHydrated,
    isQueryCacheHydrated
  );
}
