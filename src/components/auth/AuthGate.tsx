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
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';

import { api } from '../../../convex/_generated/api';
import HabitsApp from '../../features/habits/HabitsApp';
import { useConvexAuthReady } from '../../providers';
import { OnboardingScreen } from '../../screens/onboarding/OnboardingScreen';
import { useOnboardingStatus } from '../../screens/onboarding/useOnboardingStatus';
import WelcomeScreen from '../../screens/auth/WelcomeScreen';
import { BrandedLoadingScreen } from './BrandedLoadingScreen';

const ENTER = FadeInDown.duration(280).springify().damping(18);
const EXIT = FadeOut.duration(300);

function getScreenKey(isSignedIn: boolean, onboardingComplete: boolean) {
  if (!isSignedIn) return 'welcome' as const;
  return onboardingComplete ? ('app' as const) : ('onboarding' as const);
}

export function AuthGate() {
  const { isLoaded, isSignedIn } = useAuth();
  const isConvexReady = useConvexAuthReady();
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);
  const { complete: onboardingComplete, markComplete } = useOnboardingStatus(
    isSignedIn ?? false
  );

  const getOrCreateUserRef = useRef(getOrCreateUser);
  getOrCreateUserRef.current = getOrCreateUser;

  useEffect(() => {
    if (isSignedIn && isConvexReady) {
      const result = getOrCreateUserRef.current();
      if (result && typeof (result as Promise<unknown>).catch === 'function') {
        result.catch((error_: unknown) => {
          if (__DEV__) console.error('Failed to sync user:', error_);
        });
      }
    }
  }, [isSignedIn, isConvexReady]);

  if (!isLoaded || (isSignedIn && onboardingComplete === null)) {
    return <BrandedLoadingScreen />;
  }

  const screenKey = getScreenKey(
    isSignedIn ?? false,
    onboardingComplete ?? false
  );

  return (
    <GestureHandlerRootView className='flex-1'>
      {screenKey === 'welcome' && (
        <Animated.View
          key='welcome'
          entering={ENTER}
          exiting={EXIT}
          style={{ flex: 1 }}
        >
          <WelcomeScreen />
        </Animated.View>
      )}
      {screenKey === 'onboarding' && (
        <Animated.View
          key='onboarding'
          entering={ENTER}
          exiting={EXIT}
          style={{ flex: 1 }}
        >
          <OnboardingScreen onComplete={markComplete} />
        </Animated.View>
      )}
      {screenKey === 'app' && (
        <Animated.View key='app' entering={ENTER} style={{ flex: 1 }}>
          <HabitsApp />
        </Animated.View>
      )}
    </GestureHandlerRootView>
  );
}
