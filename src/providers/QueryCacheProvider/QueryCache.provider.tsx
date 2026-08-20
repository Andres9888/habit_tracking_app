import { useAuth } from '@clerk/clerk-expo';
import { useEffect } from 'react';

import {
  applyQueryCacheScope,
  hydrateQueryCache,
  markQueryCacheHydrated,
} from '../../lib/queryCache';
import type { QueryCacheProviderProps } from './types';

export function QueryCacheProvider({ children }: QueryCacheProviderProps) {
  const { isLoaded, isSignedIn, userId } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;
    const scope = isSignedIn && userId ? userId : null;
    applyQueryCacheScope(scope);

    let isCurrentHydration = true;
    void hydrateQueryCache(scope).finally(() => {
      if (isCurrentHydration) markQueryCacheHydrated();
    });
    return () => {
      isCurrentHydration = false;
    };
  }, [isLoaded, isSignedIn, userId]);

  return children;
}
