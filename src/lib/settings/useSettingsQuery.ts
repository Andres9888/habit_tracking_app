import { useAuth } from '@clerk/clerk-expo';
import { api } from '../../../convex/_generated/api';
import { useConvexAuthReady } from '../../providers/ConvexAuthReady.context';
import { useCachedQuery } from '../queryCache';
import { useQueryCacheHydrated } from '../queryCache/hooks/useQueryCacheHydrated';

/**
 * Read user settings only after Clerk + Convex auth are confirmed.
 * Firing settings.get before the Convex JWT is attached used to throw
 * and crash the startup tree via ThemeColorProvider. Cached rows stay
 * usable via serveCachedWhileSkipped until the live query can run.
 */
export function useSettingsQuery() {
  const { isSignedIn } = useAuth();
  const isConvexAuthenticated = useConvexAuthReady();
  const isCacheHydrated = useQueryCacheHydrated();
  const canQuery =
    isSignedIn === true && isConvexAuthenticated && isCacheHydrated;

  return useCachedQuery(api.settings.get, canQuery ? {} : 'skip', {
    entryName: 'settings.get',
    serveCachedWhileSkipped: true,
  });
}
