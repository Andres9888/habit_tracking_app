/* eslint-disable max-lines */
/**
 * WelcomeScreen - Auth landing page
 * Clean design consistent with app style
 */

import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { Link } from 'lucide-react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useThemeColors } from '../../theme/ThemeContext';
import {
  AuthDivider,
  AuthError,
  BackButton,
  SocialSignInButton,
} from './components';
import { useOAuthSignIn } from './hooks/useOAuthSignIn';
import { useWelcomeAnimations } from './hooks/useWelcomeAnimations';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import { createStyles } from './WelcomeScreen.styles';

type AuthMode = 'welcome' | 'signin' | 'signup';

export default function WelcomeScreen() {
  const { colors } = useThemeColors();
  const styles = createStyles(colors);
  const [mode, setMode] = useState<AuthMode>('welcome');
  const insets = useSafeAreaInsets();
  const { signInWithGoogle, signInWithApple, isLoading, error, clearError } =
    useOAuthSignIn();
  const { iconStyle, titleStyle, subtitleStyle, buttonsStyle } =
    useWelcomeAnimations();

  if (mode === 'signin') {
    return (
      <View style={styles.container}>
        <SignInScreen />
        <View style={[styles.backButton, { top: insets.top + 8 }]}>
          <BackButton onPress={() => setMode('welcome')} />
        </View>
      </View>
    );
  }

  if (mode === 'signup') {
    return (
      <View style={styles.container}>
        <SignUpScreen />
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
            <Link color={colors.text.primary} size={40} strokeWidth={2} />
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
