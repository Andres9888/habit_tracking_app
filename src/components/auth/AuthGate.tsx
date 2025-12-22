import { useAuth } from '@clerk/clerk-expo';
import { useMutation, useQuery } from 'convex/react';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { api } from '../../../convex/_generated/api';
import HabitsApp from '../../features/habits/HabitsApp';
import WelcomeScreen from '../../screens/auth/WelcomeScreen';

export function AuthGate() {
  const { isLoaded, isSignedIn } = useAuth();
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);

  // Sync user to Convex when signed in (fire and forget)
  useEffect(() => {
    if (isSignedIn) {
      getOrCreateUser().catch((error) => {
        console.error('Failed to sync user:', error);
      });
    }
  }, [isSignedIn, getOrCreateUser]);

  // Show loading while Clerk initializes
  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Show welcome/auth screens if not signed in
  if (!isSignedIn) {
    return <WelcomeScreen />;
  }

  // Show main app - let HabitsApp handle its own loading states
  return <HabitsApp />;
}
