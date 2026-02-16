/**
 * AuthGate Component
 *
 * Authentication boundary that controls app access.
 * Shows WelcomeScreen for unauthenticated users,
 * OnboardingScreen for first-time users after sign-up,
 * HabitsApp for authenticated users.
 * Syncs user to Convex database on sign-in.
 */

import { useAuth } from '@clerk/clerk-expo';
import { useMutation } from 'convex/react';
import { useEffect, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { api } from '../../../convex/_generated/api';
import HabitsApp from '../../features/habits/HabitsApp';
import { useConvexAuthReady } from '../../providers';
import { OnboardingScreen } from '../../screens/onboarding';
import { useOnboardingStatus } from '../../screens/onboarding/useOnboardingStatus';
import WelcomeScreen from '../../screens/auth/WelcomeScreen';

import { AnimatedScreen } from './AnimatedScreen';
import { BrandedLoadingScreen } from './BrandedLoadingScreen';

export function AuthGate() {
  const { isLoaded, isSignedIn } = useAuth();
  const isConvexReady = useConvexAuthReady();
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);
  const { complete: onboardingComplete, markComplete } = useOnboardingStatus(
    isSignedIn ?? false
  );

  // Store the mutation in a ref so the effect below never re-fires when the
  // Convex mutation reference changes. Without this, the closure inside
  // useEffect would capture a stale `getOrCreateUser` on re-renders.
  const getOrCreateUserRef = useRef(getOrCreateUser);
  getOrCreateUserRef.current = getOrCreateUser;

  useEffect(() => {
    if (isSignedIn && isConvexReady) {
      getOrCreateUserRef.current().catch((error_: unknown) => {
        if (__DEV__) console.error('Failed to sync user:', error_);
      });
    }
  }, [isSignedIn, isConvexReady]);

  if (!isLoaded || (isSignedIn && onboardingComplete === null)) {
    return <BrandedLoadingScreen />;
  }

  // State machine: auth status + onboarding determine which screen to show.
  //   not signed in        → 'welcome'  (sign-in / sign-up)
  //   signed in, new user  → 'onboarding'
  //   signed in, returning → 'app'
  const screenKey = !isSignedIn
    ? 'welcome'
    : !onboardingComplete
      ? 'onboarding'
      : 'app';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {screenKey === 'welcome' && (
        <AnimatedScreen key="welcome">
          <WelcomeScreen />
        </AnimatedScreen>
      )}
      {screenKey === 'onboarding' && (
        <AnimatedScreen key="onboarding">
          <OnboardingScreen onComplete={markComplete} />
        </AnimatedScreen>
      )}
      {screenKey === 'app' && (
        <AnimatedScreen key="app" noExit>
          <HabitsApp />
        </AnimatedScreen>
      )}
    </GestureHandlerRootView>
  );
}
