import { useAuth } from '@clerk/clerk-expo';
import { useEffect, useRef } from 'react';

import {
  hydrateQueryCache,
  resetQueryCache,
  setQueryCacheScope,
} from '../../lib/queryCache';
import type { QueryCacheProviderProps } from './types';

export function QueryCacheProvider({ children }: QueryCacheProviderProps) {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const previousScope = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    const scope = isSignedIn && userId ? userId : null;
    setQueryCacheScope(scope);
    if (previousScope.current !== scope) {
      resetQueryCache();
      previousScope.current = scope;
    }

    void hydrateQueryCache(scope);
  }, [isLoaded, isSignedIn, userId]);

  return children;
}
