/* eslint-disable max-lines */
/**
 * WelcomeScreen - Auth landing page / entry point
 * 
 * ## Navigation Entry Points
 * - Primary entry for unauthenticated users (from AuthGate)
 * - Shows sign-in/sign-up options or lazy-loads those screens
 * 
 * ## State Management
 * - Local state: mode ('welcome' | 'signin' | 'signup')
 * - `useOAuthSignIn` hook: handles social sign-in
 * - `useWelcomeAnimations` hook: entrance animations
 * 
 * ## User Flow
 * 1. User sees welcome page with Chain Day branding
 * 2. User can: Sign in with Apple/Google, Create account, or Sign in with email
 * 3. Selecting sign-in/sign-up lazy-loads that screen
 * 
 * ## Performance Optimizations
 * - Lazy loads SignInScreen and SignUpScreen (reduces initial bundle)
 * - Uses React.lazy and Suspense for code splitting
 * - AnimatedPressable for button interactions
 * 
 * @flag UNDER_150_LINES - Screen is well-structured at 136 lines
 */

import React, { useState, lazy, Suspense } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { Link } from 'lucide-react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import {
  AuthDivider,
  AuthError,
  BackButton,
  SocialSignInButton,
} from './components';
import { useOAuthSignIn } from './hooks/useOAuthSignIn';
import { useWelcomeAnimations } from './hooks/useWelcomeAnimations';
import { styles } from './WelcomeScreen.styles';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import { colors } from '../../theme/colors';

// Lazy load auth screens - only bundle when user wants to sign in/up
const SignInScreen = lazy(() => import('./SignInScreen'));
const SignUpScreen = lazy(() => import('./SignUpScreen'));

type AuthMode = 'welcome' | 'signin' | 'signup';

function WelcomeScreenContent() {
  const [mode, setMode] = useState<AuthMode>('welcome');
  const insets = useSafeAreaInsets();
  const { signInWithGoogle, signInWithApple, isLoading, error, clearError } =
    useOAuthSignIn();
  const { iconStyle, titleStyle, subtitleStyle, buttonsStyle } =
    useWelcomeAnimations();

  if (mode === 'signin') {
    return (
      <View style={styles.container}>
        <Suspense fallback={<View style={styles.loadingContainer}><ActivityIndicator size="large" color={colors.primary[600]} /></View>}>
          <SignInScreen />
        </Suspense>
        <View style={[styles.backButton, { top: insets.top + 8 }]}>
          <BackButton onPress={() => setMode('welcome')} />
        </View>
      </View>
    );
  }

  if (mode === 'signup') {
    return (
      <View style={styles.container}>
        <Suspense fallback={<View style={styles.loadingContainer}><ActivityIndicator size="large" color={colors.primary[600]} /></View>}>
          <SignUpScreen />
        </Suspense>
        <View style={[styles.backButton, { top: insets.top + 8 }]}>
          <BackButton onPress={() => setMode('welcome')} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + 24 }]}>
        <View style={styles.heroSection}>
          <Animated.View style={[styles.iconContainer, iconStyle]}>
            <Link color='#1c1917' size={40} strokeWidth={2} />
          </Animated.View>
          <Animated.Text style={[styles.title, titleStyle]}>
            Chain Day
          </Animated.Text>
          <Animated.Text style={[styles.subtitle, subtitleStyle]}>
            Build habits that stick
          </Animated.Text>
        </View>

        <Animated.View style={[styles.actionSection, buttonsStyle]}>
          {error && <AuthError message={error} onDismiss={clearError} />}
          <SocialSignInButton
            disabled={!!isLoading}
            isLoading={isLoading === 'oauth_apple'}
            provider='apple'
            onPress={signInWithApple}
          />
          <SocialSignInButton
            disabled={!!isLoading}
            isLoading={isLoading === 'oauth_google'}
            provider='google'
            onPress={signInWithGoogle}
          />
          <AuthDivider />
          <AnimatedPressable
            accessibilityHint='Create a new Chain Day account'
            accessibilityLabel='Create free account with Chain Day'
            accessibilityRole='button'
            accessibilityState={{ disabled: !!isLoading }}
            disableAnimation={!!isLoading}
            disabled={!!isLoading}
            style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
            onPress={() => setMode('signup')}
          >
            <Text style={styles.primaryButtonText}>Create Free Account</Text>
          </AnimatedPressable>
          <AnimatedPressable
            accessibilityHint='Navigate to sign in screen'
            accessibilityLabel='Sign in to existing account'
            accessibilityRole='link'
            accessibilityState={{ disabled: !!isLoading }}
            disableAnimation={!!isLoading}
            disabled={!!isLoading}
            style={styles.textLink}
            onPress={() => setMode('signin')}
          >
            <Text style={styles.textLinkLabel}>Already have an account?</Text>
            <Text style={styles.textLinkAction}> Sign in</Text>
          </AnimatedPressable>
        </Animated.View>
      </View>
    </View>
  );
}

export default function WelcomeScreen() {
  return (
    <ScreenErrorBoundary screenName="Welcome">
      <WelcomeScreenContent />
    </ScreenErrorBoundary>
  );
}
