/* eslint-disable max-lines */
/**
 * WelcomeScreen - Auth landing page
 * Clean design consistent with app style, with full dark mode support.
 */

import React, { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
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
import { useThemeColors } from '../../theme/ThemeContext';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import { styles } from './WelcomeScreen.styles';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';

type AuthMode = 'welcome' | 'signin' | 'signup';

function WelcomeScreenContent() {
  const [mode, setMode] = useState<AuthMode>('welcome');
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useThemeColors();
  const { signInWithGoogle, signInWithApple, isLoading, error, clearError } =
    useOAuthSignIn();
  const { iconStyle, titleStyle, subtitleStyle, buttonsStyle } =
    useWelcomeAnimations();

  const themed = useMemo(
    () => ({
      container: { backgroundColor: colors.background },
      iconContainer: {
        backgroundColor: colors.surface,
        shadowColor: colors.text.primary,
      },
      title: { color: colors.text.primary },
      subtitle: { color: colors.text.secondary },
      primaryButton: {
        backgroundColor: colors.primary[600],
        shadowColor: colors.primary[600],
      },
      primaryButtonText: { color: colors.text.inverse },
      textLinkLabel: { color: colors.text.secondary },
      textLinkAction: { color: colors.primary[isDark ? 500 : 700] },
      iconColor: colors.text.primary,
    }),
    [colors, isDark]
  );

  if (mode === 'signin') {
    return (
      <View style={[styles.container, themed.container]}>
        <SignInScreen />
        <View style={[styles.backButton, { top: insets.top + 8 }]}>
          <BackButton onPress={() => setMode('welcome')} />
        </View>
      </View>
    );
  }

  if (mode === 'signup') {
    return (
      <View style={[styles.container, themed.container]}>
        <SignUpScreen />
        <View style={[styles.backButton, { top: insets.top + 8 }]}>
          <BackButton onPress={() => setMode('welcome')} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, themed.container]}>
      <View style={[styles.content, { paddingTop: insets.top + 24 }]}>
        <View style={styles.heroSection}>
          <Animated.View style={[styles.iconContainer, themed.iconContainer, iconStyle]}>
            <Link color={themed.iconColor} size={40} strokeWidth={2} />
          </Animated.View>
          <Animated.Text style={[styles.title, themed.title, titleStyle]}>
            Chain Day
          </Animated.Text>
          <Animated.Text style={[styles.subtitle, themed.subtitle, subtitleStyle]}>
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
            style={[styles.primaryButton, themed.primaryButton, isLoading && styles.buttonDisabled]}
            onPress={() => setMode('signup')}
          >
            <Text style={[styles.primaryButtonText, themed.primaryButtonText]}>
              Create Free Account
            </Text>
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
            <Text style={[styles.textLinkLabel, themed.textLinkLabel]}>
              Already have an account?
            </Text>
            <Text style={[styles.textLinkAction, themed.textLinkAction]}> Sign in</Text>
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
