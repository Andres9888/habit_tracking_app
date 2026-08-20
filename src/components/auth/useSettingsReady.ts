import { useSettingsQuery } from '../../lib/settings/useSettingsQuery';

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
  return settings != null;
}

export function useSettingsReady(isSignedIn: boolean | undefined): boolean {
  return useStartupSettings(isSignedIn).isReady;
}

export function useStartupSettings(isSignedIn: boolean | undefined) {
  const settings = useSettingsQuery();

  return {
    isReady: isStartupSettingsReady({
      isSignedIn: isSignedIn === true,
      settings,
    }),
    settings,
  };
}
