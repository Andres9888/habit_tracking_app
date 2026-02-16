/* eslint-disable max-lines, max-lines-per-function */
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
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { api } from '../../../convex/_generated/api';
import { useThemeColors } from '../../theme/ThemeContext';
import { SkeletonLoader, HabitCardSkeleton } from '../SkeletonLoader';
import HabitsApp from '../../features/habits/HabitsApp';
import { useConvexAuthReady } from '../../providers';
import { OnboardingScreen } from '../../screens/onboarding';
import { useOnboardingStatus } from '../../screens/onboarding/useOnboardingStatus';
import WelcomeScreen from '../../screens/auth/WelcomeScreen';

const LOADING_TIMEOUT_MS = 10_000;

function BrandedLoadingScreen() {
  const { colors: themeColors, isDark } = useThemeColors();
  const [timedOut, setTimedOut] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setTimedOut(true);
    }, LOADING_TIMEOUT_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleRetry = useCallback(() => {
    setTimedOut(false);
    timerRef.current = setTimeout(() => {
      setTimedOut(true);
    }, LOADING_TIMEOUT_MS);
  }, []);

  return (
    <View
      style={[
        loadingStyles.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      <View style={loadingStyles.content}>
        <View
          style={[
            loadingStyles.iconContainer,
            { backgroundColor: themeColors.primary[100] },
          ]}
        >
          <Text style={loadingStyles.iconText}>🔗</Text>
        </View>
        <Text
          style={[loadingStyles.appName, { color: themeColors.primary[700] }]}
        >
          Chain Day
        </Text>

        {timedOut ? (
          <View
            style={[
              loadingStyles.errorCard,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.border,
              },
            ]}
          >
            <Text
              style={[
                loadingStyles.errorTitle,
                { color: themeColors.text.primary },
              ]}
            >
              Taking longer than expected
            </Text>
            <Text
              style={[
                loadingStyles.errorDescription,
                { color: themeColors.text.secondary },
              ]}
            >
              We're having trouble connecting. Check your internet connection
              and try again.
            </Text>
            <Pressable
              accessibilityLabel='Try Again'
              accessibilityRole='button'
              style={[
                loadingStyles.retryButton,
                { backgroundColor: themeColors.primary[600] },
              ]}
              onPress={handleRetry}
            >
              <Text
                style={[
                  loadingStyles.retryButtonText,
                  { color: themeColors.text.inverse },
                ]}
              >
                Try Again
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={loadingStyles.shimmerContainer}>
            <SkeletonLoader borderRadius={4} height={4} width={120} />
          </View>
        )}
      </View>

      {/* Ghost habit cards preview */}
      <View style={loadingStyles.cardsPreview}>
        <HabitCardSkeleton />
        <HabitCardSkeleton />
      </View>
    </View>
  );
}

const loadingStyles = StyleSheet.create({
  appName: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 32,
  },
  cardsPreview: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  errorCard: {
    alignItems: 'center',
    backgroundColor: undefined,
    borderColor: undefined,
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 24,
    marginTop: 8,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  errorDescription: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 24,
    height: 64,
    justifyContent: 'center',
    marginBottom: 16,
    width: 64,
  },
  iconText: {
    fontSize: 28,
  },
  retryButton: {
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  retryButtonText: {
    fontSize: 17,
    fontWeight: '600',
  },
  shimmerContainer: {
    marginTop: 12,
  },
});
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

  // Determine which screen to show
  const screenKey = !isSignedIn
    ? 'welcome'
    : !onboardingComplete
      ? 'onboarding'
      : 'app';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {screenKey === 'welcome' && (
        <Animated.View
          key="welcome"
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
          style={{ flex: 1 }}
        >
          <WelcomeScreen />
        </Animated.View>
      )}
      {screenKey === 'onboarding' && (
        <Animated.View
          key="onboarding"
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
          style={{ flex: 1 }}
        >
          <OnboardingScreen onComplete={markComplete} />
        </Animated.View>
      )}
      {screenKey === 'app' && (
        <Animated.View
          key="app"
          entering={FadeIn.duration(300)}
          style={{ flex: 1 }}
        >
          <HabitsApp />
        </Animated.View>
      )}
    </GestureHandlerRootView>
  );
}
