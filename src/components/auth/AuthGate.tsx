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

import { useQueryCacheHydrated } from '../../lib/queryCache';
import { useConvexAuthReady } from '../../providers';
// Deep import, not the `screens/onboarding-v2` barrel: AuthGate is on the
// startup path, and the barrel also exports OnboardingFlowV2, which would pull
// the whole onboarding tree (incl. the RevenueCat paywall) into the startup
// chunk and defeat the lazy() split in AuthGateContent.
import { useOnboardingV2Complete } from '../../screens/onboarding-v2/useOnboardingV2Complete';
import { resolveAuthDestination } from './resolveAuthDestination';
import { AuthGateContent } from './AuthGateContent';
import { BrandedLoadingScreen } from './BrandedLoadingScreen';
import { useAuthGateUserSync } from './useAuthGateUserSync';
import { useStartupSettings } from './useSettingsReady';

export function AuthGate() {
  const { isLoaded, isSignedIn } = useAuth();
  const isConvexReady = useConvexAuthReady();
  const isCacheHydrated = useQueryCacheHydrated();
  const { complete: onboardingComplete, markComplete } =
    useOnboardingV2Complete(isSignedIn ?? false);
  const { isReady: isSettingsReady, settings } = useStartupSettings(isSignedIn);
  const [paywallDismissed, setPaywallDismissed] = useState(false);

  useAuthGateUserSync(isSignedIn, isConvexReady);

  const destination = resolveAuthDestination({
    hasEntitlement: settings?.hasPremium === true,
    isAuthLoaded: isLoaded,
    isCacheHydrated,
    isPaywallDismissed: paywallDismissed,
    isSettingsReady,
    isSignedIn,
    onboardingComplete,
  });

  if (destination === 'loading') {
    return <BrandedLoadingScreen />;
  }

  return (
    <GestureHandlerRootView className='flex-1'>
      <AuthGateContent
        markComplete={markComplete}
        onPaywallDismiss={() => setPaywallDismissed(true)}
        screenKey={destination}
      />
    </GestureHandlerRootView>
  );
}
