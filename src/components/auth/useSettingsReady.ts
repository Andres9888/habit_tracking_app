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
  const input = {
    isCacheHydrated,
    isConvexAuthenticated,
    isSignedIn: isSignedIn === true,
  };
  const canQuery = canQuerySettings(input);
  const settings = useCachedQuery(api.settings.get, canQuery ? {} : 'skip', {
    entryName: 'settings.get',
  });

  if (isSignedIn !== true) return true;
  if (!canQuery) return false;
  return settings !== undefined;
}
