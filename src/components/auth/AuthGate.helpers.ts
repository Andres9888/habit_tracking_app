import { FEATURE_FLAGS } from '../../constants/featureFlags';
import type { AuthScreenKey } from './AuthGateContent';

export function getScreenKey(
  isSignedIn: boolean,
  onboardingComplete: boolean,
  hasEntitlement: boolean
): AuthScreenKey {
  if (!isSignedIn) return 'welcome';
  if (FEATURE_FLAGS.ONBOARDING_V2_ENABLED && !onboardingComplete)
    return 'onboarding';
  if (!FEATURE_FLAGS.PAYWALL_ENABLED) return 'app';
  return hasEntitlement ? 'app' : 'paywall';
}

export function shouldShowLoadingScreen({
  isCacheHydrated,
  isLoaded,
  isSettingsReady,
  isSignedIn,
  onboardingComplete,
}: {
  isCacheHydrated: boolean;
  isLoaded: boolean;
  isSettingsReady: boolean;
  isSignedIn: boolean | undefined;
  onboardingComplete: boolean | null;
}): boolean {
  const signedInComplete = isSignedIn === true && onboardingComplete === true;
  return (
    !isLoaded ||
    !isCacheHydrated ||
    (isSignedIn === true && onboardingComplete === null) ||
    (signedInComplete && !isSettingsReady)
  );
}
