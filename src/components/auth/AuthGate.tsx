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
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { api } from '../../../convex/_generated/api';
import { colors } from '../../theme/colors';
import HabitsApp from '../../features/habits/HabitsApp';
import { useConvexAuthReady } from '../../providers';
import { OnboardingScreen } from '../../screens/onboarding';
import { useOnboardingStatus } from '../../screens/onboarding/useOnboardingStatus';
import WelcomeScreen from '../../screens/auth/WelcomeScreen';

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
      getOrCreateUserRef.current().catch((error_: unknown) => {
        if (__DEV__) console.error('Failed to sync user:', error_);
      });
    }
  }, [isSignedIn, isConvexReady]);

  if (!isLoaded || (isSignedIn && onboardingComplete === null)) {
    return <BrandedLoadingScreen />;
  }

  if (!isSignedIn) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <WelcomeScreen />
      </GestureHandlerRootView>
    );
  }

  if (!onboardingComplete) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <OnboardingScreen onComplete={markComplete} />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HabitsApp />
    </GestureHandlerRootView>
  );
}
