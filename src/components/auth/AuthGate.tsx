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
import { useEffect, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';

import { api } from '../../../convex/_generated/api';
import HabitsApp from '../../features/habits/HabitsApp';
import { useConvexAuthReady } from '../../providers';
import { BrandedLoadingScreen } from './BrandedLoadingScreen';
import WelcomeScreen from '../../screens/auth/WelcomeScreen';
import { enterEasing } from '../../theme/animations';

const ENTER = FadeInDown.duration(280).easing(enterEasing);
const EXIT = FadeOut.duration(300);

type ScreenKey = 'welcome' | 'app';

function getScreenKey(isSignedIn: boolean): ScreenKey {
  return isSignedIn ? 'app' : 'welcome';
}

export function AuthGate() {
  const { isLoaded, isSignedIn } = useAuth();
  const isConvexReady = useConvexAuthReady();
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);

  const getOrCreateUserRef = useRef(getOrCreateUser);
  getOrCreateUserRef.current = getOrCreateUser;

  useEffect(() => {
    if (isSignedIn && isConvexReady) {
      void getOrCreateUserRef.current().catch((error_: unknown) => {
        if (__DEV__) console.error('Failed to sync user:', error_);
      });
    }
  }, [isSignedIn, isConvexReady]);

  if (!isLoaded) {
    return <BrandedLoadingScreen />;
  }

  const screenKey = getScreenKey(isSignedIn ?? false);

  return (
    <GestureHandlerRootView className='flex-1'>
      {screenKey === 'welcome' ? (
        <Animated.View
          key='welcome'
          entering={ENTER}
          exiting={EXIT}
          style={{ flex: 1 }}
        >
          <WelcomeScreen />
        </Animated.View>
      ) : null}
      {screenKey === 'app' ? (
        <Animated.View key='app' entering={ENTER} style={{ flex: 1 }}>
          <HabitsApp />
        </Animated.View>
      ) : null}
    </GestureHandlerRootView>
  );
}
