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
import { useMutation } from 'convex/react';
import { useEffect, useRef, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';

import { api } from '../../../convex/_generated/api';
import { FEATURE_FLAGS } from '../../constants/featureFlags';
import HabitsApp from '../../features/habits/HabitsApp';
import { useConvexAuthReady } from '../../providers';
import { BrandedLoadingScreen } from './BrandedLoadingScreen';
import {
  OnboardingFlowV2,
  useOnboardingV2Complete,
} from '../../screens/onboarding-v2';
import WelcomeScreen from '../../screens/auth/WelcomeScreen';
import { RevenueCatPaywall } from '../RevenueCatPaywall';
import { usePremium } from '../../hooks/usePremium';
import { enterEasing } from '../../theme/animations';

const ENTER = FadeInDown.duration(280).easing(enterEasing);
const EXIT = FadeOut.duration(300);

type ScreenKey = 'welcome' | 'onboarding' | 'paywall' | 'app';

function getScreenKey(
  isSignedIn: boolean,
  onboardingComplete: boolean,
  hasEntitlement: boolean
): ScreenKey {
  if (!isSignedIn) return 'welcome';
  if (FEATURE_FLAGS.ONBOARDING_V2_ENABLED && !onboardingComplete) return 'onboarding';
  if (!FEATURE_FLAGS.PAYWALL_ENABLED) return 'app';
  return hasEntitlement ? 'app' : 'paywall';
}

export function AuthGate() {
  const { isLoaded, isSignedIn } = useAuth();
  const isConvexReady = useConvexAuthReady();
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);
  const { complete: onboardingComplete, markComplete } = useOnboardingV2Complete(
    isSignedIn ?? false
  );
  const { isPremium, isLoading: isPremiumLoading } = usePremium();
  const [paywallDismissed, setPaywallDismissed] = useState(false);

  const getOrCreateUserRef = useRef(getOrCreateUser);
  getOrCreateUserRef.current = getOrCreateUser;

  useEffect(() => {
    if (isSignedIn && isConvexReady) {
      void getOrCreateUserRef.current().catch((error_: unknown) => {
        if (__DEV__) console.error('Failed to sync user:', error_);
      });
    }
  }, [isSignedIn, isConvexReady]);

  // Wait for premium status to resolve before deciding paywall vs app, so the
  // paywall doesn't flash for users who already have an entitlement.
  const isWaitingForPremium =
    FEATURE_FLAGS.PAYWALL_ENABLED &&
    isSignedIn === true &&
    onboardingComplete === true &&
    isPremiumLoading;

  if (
    !isLoaded ||
    (isSignedIn && onboardingComplete === null) ||
    isWaitingForPremium
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
      {screenKey === 'welcome' ? <Animated.View
          key='welcome'
          entering={ENTER}
          exiting={EXIT}
          style={{ flex: 1 }}
        >
          <WelcomeScreen />
        </Animated.View> : null}
      {FEATURE_FLAGS.ONBOARDING_V2_ENABLED && screenKey === 'onboarding' ? <Animated.View
          key='onboarding'
          entering={ENTER}
          exiting={EXIT}
          style={{ flex: 1 }}
        >
          <OnboardingFlowV2 onComplete={markComplete} />
        </Animated.View> : null}
      {FEATURE_FLAGS.PAYWALL_ENABLED && screenKey === 'paywall' ? (
        <Animated.View
          key='paywall'
          entering={ENTER}
          exiting={EXIT}
          style={{ flex: 1 }}
        >
          <BrandedLoadingScreen />
          <RevenueCatPaywall visible onClose={() => setPaywallDismissed(true)} />
        </Animated.View>
      ) : null}
      {screenKey === 'app' ? <Animated.View key='app' entering={ENTER} style={{ flex: 1 }}>
          <HabitsApp />
        </Animated.View> : null}
    </GestureHandlerRootView>
  );
}
