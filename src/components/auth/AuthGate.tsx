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
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { api } from '../../../convex/_generated/api';
import { colors } from '../../theme/colors';
import { typography, fontWeights } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { SkeletonLoader, HabitCardSkeleton } from '../SkeletonLoader';
import HabitsApp from '../../features/habits/HabitsApp';
import { useConvexAuthReady } from '../../providers';
import { OnboardingScreen } from '../../screens/onboarding';
import { useOnboardingStatus } from '../../screens/onboarding/useOnboardingStatus';
import WelcomeScreen from '../../screens/auth/WelcomeScreen';

const LOADING_TIMEOUT_MS = 10_000;

function ChainIcon() {
  return (
    <View style={loadingStyles.iconContainer}>
      <Text style={loadingStyles.iconText}>🔗</Text>
    </View>
  );
}

function BrandedLoadingScreen() {
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
    <View style={loadingStyles.container}>
      <View style={loadingStyles.content}>
        <ChainIcon />
        <Text style={loadingStyles.appName}>Chain Day</Text>

        {timedOut ? (
          <View style={loadingStyles.errorCard}>
            <Text style={loadingStyles.errorTitle}>
              Taking longer than expected
            </Text>
            <Text style={loadingStyles.errorDescription}>
              We're having trouble connecting. Check your internet connection
              and try again.
            </Text>
            <Pressable
              accessibilityLabel='Try Again'
              accessibilityRole='button'
              style={loadingStyles.retryButton}
              onPress={handleRetry}
            >
              <Text style={loadingStyles.retryButtonText}>Try Again</Text>
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
    ...typography.heading2,
    color: colors.primary[700],
    fontSize: 22,
    letterSpacing: 0.5,
    marginBottom: spacing.xl,
  },
  container: {
    alignItems: 'center',
    backgroundColor: colors.light.background,
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  errorCard: {
    alignItems: 'center',
    backgroundColor: colors.light.card,
    borderColor: colors.border,
    borderRadius: borderRadius.large,
    borderWidth: 1,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    padding: spacing.lg,
    ...shadows.floatingActionButton,
  },
  errorDescription: {
    ...typography.caption,
    color: colors.text.secondary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  errorTitle: {
    ...typography.heading3,
    color: colors.text.primary,
    fontSize: 17,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: colors.primary[100],
    borderRadius: borderRadius.xl,
    height: 64,
    justifyContent: 'center',
    marginBottom: spacing.base,
    width: 64,
  },
  iconText: {
    fontSize: 28,
  },
  retryButton: {
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.button,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  retryButtonText: {
    ...typography.button,
    color: colors.text.inverse,
    fontSize: 17,
  },
  cardsPreview: {
    flex: 1,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
  },
  shimmerContainer: {
    marginTop: spacing.md,
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
