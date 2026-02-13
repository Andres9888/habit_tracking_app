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
import { colors } from '../../theme/colors';
import HabitsApp from '../../features/habits/HabitsApp';
import { useConvexAuthReady } from '../../providers';
import { OnboardingScreen } from '../../screens/onboarding';
import { useOnboardingStatus } from '../../screens/onboarding/useOnboardingStatus';
import WelcomeScreen from '../../screens/auth/WelcomeScreen';
import { BrandedLoadingScreen } from './BrandedLoadingScreen';

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
              We're having trouble connecting. Check your internet connection and
              try again.
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
          <ActivityIndicator
            color={colors.primary[500]}
            size='small'
            style={loadingStyles.spinner}
          />
        )}
      </View>
    </View>
  );
}

const loadingStyles = StyleSheet.create({
  appName: {
    color: colors.primary[700],
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 32,
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
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 24,
    marginTop: 8,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  errorDescription: {
    color: colors.text.secondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  errorTitle: {
    color: colors.text.primary,
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: colors.primary[100],
    borderRadius: 32,
    height: 64,
    justifyContent: 'center',
    marginBottom: 16,
    width: 64,
  },
  iconText: {
    fontSize: 28,
  },
  retryButton: {
    backgroundColor: colors.primary[600],
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  retryButtonText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  spinner: {
    marginTop: 8,
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
