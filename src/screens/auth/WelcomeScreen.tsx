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
import { styles, useWelcomeStyles } from './WelcomeScreen.styles';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import { colors } from '../../theme/colors';
import { useThemeColors } from '@/theme/ThemeContext';

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
  const { colors: themeColors } = useThemeColors();
  const dynamicStyles = useWelcomeStyles();

  if (mode === 'signin') {
    return (
      <View style={dynamicStyles.container}>
        <Suspense fallback={<View style={dynamicStyles.loadingContainer}><ActivityIndicator size="large" color={colors.primary[600]} /></View>}>
          <SignInScreen />
        </Suspense>
        <View style={[dynamicStyles.backButton, { top: insets.top + 8 }]}>
          <BackButton onPress={() => setMode('welcome')} />
        </View>
      </View>
    );
  }

  if (mode === 'signup') {
    return (
      <View style={dynamicStyles.container}>
        <Suspense fallback={<View style={dynamicStyles.loadingContainer}><ActivityIndicator size="large" color={colors.primary[600]} /></View>}>
          <SignUpScreen />
        </Suspense>
        <View style={[dynamicStyles.backButton, { top: insets.top + 8 }]}>
          <BackButton onPress={() => setMode('welcome')} />
        </View>
      </View>
    );
  }

  return (
    <View style={dynamicStyles.container}>
      <View style={[dynamicStyles.content, { paddingTop: insets.top + 24 }]}>
        <View style={dynamicStyles.heroSection}>
          <Animated.View style={[dynamicStyles.iconContainer, iconStyle]}>
            <Link color={themeColors.text.primary} size={40} strokeWidth={2} />
          </Animated.View>
          <Animated.Text style={[dynamicStyles.title, titleStyle]}>
            Chain Day
          </Animated.Text>
          <Animated.Text style={[dynamicStyles.subtitle, subtitleStyle]}>
            Build habits that stick
          </Animated.Text>
        </View>

        <Animated.View style={[dynamicStyles.actionSection, buttonsStyle]}>
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
            style={[dynamicStyles.primaryButton, isLoading && dynamicStyles.buttonDisabled]}
            onPress={() => setMode('signup')}
          >
            <Text style={dynamicStyles.primaryButtonText}>Create Free Account</Text>
          </AnimatedPressable>
          <AnimatedPressable
            accessibilityHint='Navigate to sign in screen'
            accessibilityLabel='Sign in to existing account'
            accessibilityRole='link'
            accessibilityState={{ disabled: !!isLoading }}
            disableAnimation={!!isLoading}
            disabled={!!isLoading}
            style={dynamicStyles.textLink}
            onPress={() => setMode('signin')}
          >
            <Text style={dynamicStyles.textLinkLabel}>Already have an account?</Text>
            <Text style={dynamicStyles.textLinkAction}> Sign in</Text>
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
