/**
 * AuthGate Component
 *
 * Authentication boundary that controls app access.
 * Shows WelcomeScreen for unauthenticated users,
 * HabitsApp for authenticated users.
 * Syncs user to Convex database on sign-in.
 */

import { useAuth } from '@clerk/clerk-expo';
import { useMutation } from 'convex/react';
import { useEffect, useRef, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';

import { api } from '../../../convex/_generated/api';
import HabitsApp from '../../features/habits/HabitsApp';
import { useConvexAuthReady } from '../../providers';
import { BrandedLoadingScreen } from './BrandedLoadingScreen';
import WelcomeScreen from '../../screens/auth/WelcomeScreen';
import { RevenueCatPaywall } from '../RevenueCatPaywall';
import { usePremium } from '../../hooks/usePremium';
import { enterEasing } from '../../theme/animations';

const ENTER = FadeInDown.duration(280).easing(enterEasing);
const EXIT = FadeOut.duration(300);

type ScreenKey = 'welcome' | 'paywall' | 'app';

function getScreenKey(isSignedIn: boolean, hasEntitlement: boolean): ScreenKey {
  if (!isSignedIn) return 'welcome';
  return hasEntitlement ? 'app' : 'paywall';
}

export function AuthGate() {
  const { isLoaded, isSignedIn } = useAuth();
  const isConvexReady = useConvexAuthReady();
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);
  const { isPremium, isLoading: isPremiumLoading } = usePremium();

  // TODO(paywall-gate): testing-only bypass — remove this state and pass
  // dismissible={false} on RevenueCatPaywall to restore the hard gate.
  // Resets on app restart (ephemeral, useState is per-mount).
  const [paywallDismissedForTesting, setPaywallDismissedForTesting] =
    useState(false);

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
  const isWaitingForPremium = isSignedIn === true && isPremiumLoading;

  if (!isLoaded || isWaitingForPremium) {
    return <BrandedLoadingScreen />;
  }

  const screenKey = getScreenKey(
    isSignedIn ?? false,
    isPremium || paywallDismissedForTesting
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
      {screenKey === 'paywall' ? (
        <Animated.View
          key='paywall'
          entering={ENTER}
          exiting={EXIT}
          style={{ flex: 1 }}
        >
          <BrandedLoadingScreen />
          <RevenueCatPaywall
            visible
            onClose={() => setPaywallDismissedForTesting(true)}
          />
        </Animated.View>
      ) : null}
      {screenKey === 'app' ? <Animated.View key='app' entering={ENTER} style={{ flex: 1 }}>
          <HabitsApp />
        </Animated.View> : null}
    </GestureHandlerRootView>
  );
}
