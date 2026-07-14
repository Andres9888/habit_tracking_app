/**
 * AuthGate — auth boundary: Welcome / Onboarding / Paywall / HabitsApp.
 * Syncs user to Convex on sign-in. Gates on cache + settings readiness.
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
import { useSettingsGate } from './useSettingsReady';

export function AuthGate() {
  const { isLoaded, isSignedIn } = useAuth();
  const isConvexReady = useConvexAuthReady();
  const isCacheHydrated = useQueryCacheHydrated();
  const { complete: onboardingComplete, markComplete } =
    useOnboardingV2Complete(isSignedIn ?? false);
  const { isPremium } = usePremium();
  const settingsGate = useSettingsGate(
    isSignedIn,
    isConvexReady,
    isCacheHydrated
  );
  const [paywallDismissed, setPaywallDismissed] = useState(false);

  useAuthGateUserSync(isSignedIn, isConvexReady);

  if (
    shouldShowLoadingScreen({
      isCacheHydrated,
      isLoaded,
      isSettingsReady: settingsGate.isReady,
      isSignedIn,
      onboardingComplete,
    })
  ) {
    return <BrandedLoadingScreen />;
  }

  const screenKey = getScreenKey(
    isSignedIn ?? false,
    onboardingComplete ?? false,
    settingsGate.hasPremium || isPremium || paywallDismissed
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
