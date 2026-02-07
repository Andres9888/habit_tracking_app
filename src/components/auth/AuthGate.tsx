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
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { api } from '../../../convex/_generated/api';
import HabitsApp from '../../features/habits/HabitsApp';
import { useConvexAuthReady } from '../../providers';
import WelcomeScreen from '../../screens/auth/WelcomeScreen';

export function AuthGate() {
  const { isLoaded, isSignedIn } = useAuth();
  const isConvexReady = useConvexAuthReady();
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);

  // Use ref to prevent mutation identity from triggering useEffect re-runs
  const getOrCreateUserRef = useRef(getOrCreateUser);
  getOrCreateUserRef.current = getOrCreateUser;

  // Sync user to Convex when signed in and Convex auth is ready
  useEffect(() => {
    if (isSignedIn && isConvexReady) {
      getOrCreateUserRef.current().catch((error_: unknown) => {
        if (__DEV__) console.error('Failed to sync user:', error_);
      });
    }
  }, [isSignedIn, isConvexReady]);

  // Show loading while Clerk initializes
  if (!isLoaded) {
    return (
      <View className='flex-1 items-center justify-center bg-white dark:bg-stone-900'>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  // Show welcome/auth screens if not signed in
  if (!isSignedIn) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <WelcomeScreen />
      </GestureHandlerRootView>
    );
  }

  // Show main app - let HabitsApp handle its own loading states
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HabitsApp />
    </GestureHandlerRootView>
  );
}
