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
import { useCallback, useEffect, useRef } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { api } from '../../../convex/_generated/api';
import HabitsApp from '../../features/habits/HabitsApp';
import WelcomeScreen from '../../screens/auth/WelcomeScreen';

export function AuthGate() {
  const { isLoaded, isSignedIn } = useAuth();
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);

  // Use ref to store mutation to prevent it from triggering useEffect re-runs
  const getOrCreateUserRef = useRef(getOrCreateUser);
  getOrCreateUserRef.current = getOrCreateUser;

  // Retry with exponential backoff to handle auth token propagation delay
  const syncUserWithRetry = useCallback(async (retries = 3, delay = 500) => {
    for (let i = 0; i < retries; i++) {
      try {
        await getOrCreateUserRef.current();
        return; // Success, exit
      } catch (error) {
        const isAuthError =
          error instanceof Error && error.message.includes('Not authenticated');
        if (!isAuthError || i === retries - 1) {
          // Not an auth error, or last retry - log and exit
          if (__DEV__) console.error('Failed to sync user:', error);
          return;
        }
        // Wait before retry (auth token may be propagating)
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }, []);

  // Sync user to Convex when signed in
  useEffect(() => {
    if (isSignedIn) {
      syncUserWithRetry();
    }
  }, [isSignedIn, syncUserWithRetry]);

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
