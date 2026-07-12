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

import { usePremium } from '../../hooks/usePremium';
import { useQueryCacheHydrated } from '../../lib/queryCache';
import { useConvexAuthReady } from '../../providers';
import { useOnboardingV2Complete } from '../../screens/onboarding-v2';
import { getScreenKey, shouldShowLoadingScreen } from './AuthGate.helpers';
import { AuthGateContent } from './AuthGateContent';
import { BrandedLoadingScreen } from './BrandedLoadingScreen';
import { useAuthGateUserSync } from './useAuthGateUserSync';
import { useSettingsReady } from './useSettingsReady';

export function AuthGate() {
  const { isLoaded, isSignedIn } = useAuth();
  const isConvexReady = useConvexAuthReady();
  const isCacheHydrated = useQueryCacheHydrated();
  const { complete: onboardingComplete, markComplete } =
    useOnboardingV2Complete(isSignedIn ?? false);
  const { isPremium, isLoading: isPremiumLoading } = usePremium();
  // prettier-ignore
  const isSettingsReady = useSettingsReady(isSignedIn, isConvexReady, isCacheHydrated);
  const [paywallDismissed, setPaywallDismissed] = useState(false);

  useAuthGateUserSync(isSignedIn, isConvexReady);

  if (
    shouldShowLoadingScreen({
      isCacheHydrated,
      isLoaded,
      isPremiumLoading,
      isSettingsReady,
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
