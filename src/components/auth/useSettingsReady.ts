/**
 * Cold-start gate: true only when settings.get has a real value
 * (cached or live). Never treats product defaults as "ready" — that
 * would paint circle/no-bar then flip to the user's saved preference.
 *
 * Subscribe while the loading screen shows so the gate cannot deadlock
 * waiting for a query nobody is running. Convex dedupes with app-tree
 * consumers.
 */
import { api } from '../../../convex/_generated/api';
import { useCachedQuery } from '../../lib/queryCache';

interface SettingsReadyInput {
  isCacheHydrated: boolean;
  isConvexAuthenticated: boolean;
  isSignedIn: boolean;
}

export function canQuerySettings(input: SettingsReadyInput): boolean {
  return (
    input.isSignedIn && input.isConvexAuthenticated && input.isCacheHydrated
  );
}

export function useSettingsReady(
  isSignedIn: boolean | undefined,
  isConvexAuthenticated: boolean,
  isCacheHydrated: boolean
): boolean {
  return useSettingsGate(isSignedIn, isConvexAuthenticated, isCacheHydrated)
    .isReady;
}

export function useSettingsGate(
  isSignedIn: boolean | undefined,
  isConvexAuthenticated: boolean,
  isCacheHydrated: boolean
): { hasPremium: boolean; isReady: boolean } {
  const input = {
    isCacheHydrated,
    isConvexAuthenticated,
    isSignedIn: isSignedIn === true,
  };
  const canQuery = canQuerySettings(input);
  const settings = useCachedQuery(api.settings.get, canQuery ? {} : 'skip', {
    entryName: 'settings.get',
  });

  if (isSignedIn !== true) return { hasPremium: false, isReady: true };
  if (!canQuery) return { hasPremium: false, isReady: false };
  return {
    hasPremium: settings?.hasPremium ?? false,
    isReady: settings !== undefined,
  };
}
