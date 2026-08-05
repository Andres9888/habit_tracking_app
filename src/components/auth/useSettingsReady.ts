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

// Readiness keys off having settings from ANY source, not off Convex auth
// being confirmed. Cached settings are enough to boot: gating on canQuery too
// meant a Convex connection that never came up (offline, dead socket) parked
// the user on the loading screen forever with usable data already on disk.
export function isStartupSettingsReady({
  isSignedIn,
  settings,
}: {
  isSignedIn: boolean;
  settings: unknown;
}): boolean {
  if (!isSignedIn) return true;
  return settings !== undefined;
}

export function useSettingsReady(
  isSignedIn: boolean | undefined,
  isConvexAuthenticated: boolean,
  isCacheHydrated: boolean
): boolean {
  return useStartupSettings(isSignedIn, isConvexAuthenticated, isCacheHydrated)
    .isReady;
}

export function useStartupSettings(
  isSignedIn: boolean | undefined,
  isConvexAuthenticated: boolean,
  isCacheHydrated: boolean
) {
  const input = {
    isCacheHydrated,
    isConvexAuthenticated,
    isSignedIn: isSignedIn === true,
  };
  const canQuery = canQuerySettings(input);
  const settings = useCachedQuery(api.settings.get, canQuery ? {} : 'skip', {
    entryName: 'settings.get',
    // settings.get has one args shape ({}), so the args-independent latest
    // slot is always this user's row — safe to serve before Convex connects.
    serveCachedWhileSkipped: true,
  });

  return {
    isReady: isStartupSettingsReady({
      isSignedIn: isSignedIn === true,
      settings,
    }),
    settings,
  };
}
