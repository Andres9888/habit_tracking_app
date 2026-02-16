/* eslint-disable max-lines */
/**
 * WelcomeScreen - Auth landing page
 * Clean design consistent with app style
 *
 * Performance optimizations:
 * - Lazy loads SignInScreen and SignUpScreen when needed
 * - Reduces initial bundle size for welcome screen
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
import { useThemeColors } from '../../theme/ThemeContext';

// Lazy load auth screens - only bundle when user wants to sign in/up
const SignInScreen = lazy(() => import('./SignInScreen'));
const SignUpScreen = lazy(() => import('./SignUpScreen'));

type AuthMode = 'welcome' | 'signin' | 'signup';

function WelcomeScreenContent() {
  const [mode, setMode] = useState<AuthMode>('welcome');
  const insets = useSafeAreaInsets();
  const { colors: themeColors, isDark } = useThemeColors();
  const { signInWithGoogle, signInWithApple, isLoading, error, clearError } =
    useOAuthSignIn();
  const { iconStyle, titleStyle, subtitleStyle, buttonsStyle } =
    useWelcomeAnimations();

  const containerDarkStyle = { backgroundColor: themeColors.background };

  if (mode === 'signin') {
    return (
      <View style={[styles.container, isDark && containerDarkStyle]}>
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
      <View style={[styles.container, isDark && containerDarkStyle]}>
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
    <View style={[styles.container, isDark && containerDarkStyle]}>
      <View style={[styles.content, { paddingTop: insets.top + 24 }]}>
        <View style={styles.heroSection}>
          <Animated.View style={[styles.iconContainer, iconStyle, isDark && { backgroundColor: themeColors.card }]}>
            <Link color={themeColors.text.primary} size={40} strokeWidth={2} />
          </Animated.View>
          <Animated.Text style={[styles.title, { color: themeColors.text.primary }, titleStyle]}>
            Chain Day
          </Animated.Text>
          <Animated.Text style={[styles.subtitle, { color: themeColors.text.secondary }, subtitleStyle]}>
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
            <Text style={[styles.textLinkLabel, { color: themeColors.text.secondary }]}>Already have an account?</Text>
            <Text style={[styles.textLinkAction, { color: themeColors.primary[700] }]}> Sign in</Text>
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
