/**
 * AuthGate Component
 *
 * Authentication boundary that controls app access.
 * Shows WelcomeScreen for unauthenticated users,
 * OnboardingFlowV2 (Chain Builder) for first-time users after sign-up
 * when FEATURE_FLAGS.ONBOARDING_V2_ENABLED is true,
 * HabitsApp for authenticated users.
 * Syncs user to Convex database on sign-in.
 */

import { useAuth } from '@clerk/clerk-expo';
import { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { FEATURE_FLAGS } from '../../constants/featureFlags';
import { usePremium } from '../../hooks/usePremium';
import { useQueryCacheHydrated } from '../../lib/queryCache';
import { useConvexAuthReady } from '../../providers';
import { useOnboardingV2Complete } from '../../screens/onboarding-v2';
import { AuthGateContent, type AuthScreenKey } from './AuthGateContent';
import { BrandedLoadingScreen } from './BrandedLoadingScreen';
import { useAuthGateUserSync } from './useAuthGateUserSync';

function getScreenKey(
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

function shouldShowLoadingScreen({
  isCacheHydrated,
  isLoaded,
  isPremiumLoading,
  isSignedIn,
  onboardingComplete,
}: {
  isCacheHydrated: boolean;
  isLoaded: boolean;
  isPremiumLoading: boolean;
  isSignedIn: boolean | undefined;
  onboardingComplete: boolean | null;
}): boolean {
  return (
    !isLoaded ||
    !isCacheHydrated ||
    (isSignedIn === true && onboardingComplete === null) ||
    (FEATURE_FLAGS.PAYWALL_ENABLED &&
      isSignedIn === true &&
      onboardingComplete === true &&
      isPremiumLoading)
  );
}

export function AuthGate() {
  const { isLoaded, isSignedIn } = useAuth();
  const isConvexReady = useConvexAuthReady();
  const isCacheHydrated = useQueryCacheHydrated();
  const { complete: onboardingComplete, markComplete } =
    useOnboardingV2Complete(isSignedIn ?? false);
  const { isPremium, isLoading: isPremiumLoading } = usePremium();
  const [paywallDismissed, setPaywallDismissed] = useState(false);

  useAuthGateUserSync(isSignedIn, isConvexReady);

  if (
    shouldShowLoadingScreen({
      isCacheHydrated,
      isLoaded,
      isPremiumLoading,
      isSignedIn,
      onboardingComplete,
    })
  ) {
    return <BrandedLoadingScreen />;
  }

  const screenKey = getScreenKey(
    isSignedIn ?? false,
    onboardingComplete ?? false,
    isPremium || paywallDismissed
  );

  return (
    <GestureHandlerRootView className='flex-1'>
      <AuthGateContent
        markComplete={markComplete}
        onPaywallDismiss={() => setPaywallDismissed(true)}
        screenKey={screenKey}
      />
    </GestureHandlerRootView>
  );
}
