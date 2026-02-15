/* eslint-disable max-lines */
/**
 * WelcomeScreen - Auth landing page
 * Clean design consistent with app style
 */

import React, { useEffect, useState } from 'react';
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
import { trackWelcomeViewed, trackAuthStarted } from '../../lib/analytics/funnelEvents';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import { styles } from './WelcomeScreen.styles';

type AuthMode = 'welcome' | 'signin' | 'signup';

export default function WelcomeScreen() {
  const [mode, setMode] = useState<AuthMode>('welcome');
  const insets = useSafeAreaInsets();
  const { signInWithGoogle, signInWithApple, isLoading, error, clearError } =
    useOAuthSignIn();
  const { iconStyle, titleStyle, subtitleStyle, buttonsStyle } =
    useWelcomeAnimations();

  useEffect(() => {
    trackWelcomeViewed();
  }, []);

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
            <Link color='#1c1917' size={40} strokeWidth={2} />
          </Animated.View>
          <Animated.Text style={[styles.title, titleStyle]}>
            Chain Day
          </Animated.Text>
          <Animated.Text style={[styles.subtitle, subtitleStyle]}>
            Build habits that stick
          </Animated.Text>

          {/* Value props */}
          <Animated.View style={[styles.valueProps, subtitleStyle]}>
            <Text style={styles.valuePropItem}>✅  Track daily streaks visually</Text>
            <Text style={styles.valuePropItem}>📊  Watch habits grow stronger over time</Text>
            <Text style={styles.valuePropItem}>⚡  Start in under 30 seconds</Text>
          </Animated.View>
        </View>

        <Animated.View style={[styles.actionSection, buttonsStyle]}>
          {error && <AuthError message={error} onDismiss={clearError} />}
          <SocialSignInButton
            disabled={!!isLoading}
            isLoading={isLoading === 'oauth_apple'}
            provider='apple'
            onPress={() => {
              trackAuthStarted('apple');
              signInWithApple();
            }}
          />
          <SocialSignInButton
            disabled={!!isLoading}
            isLoading={isLoading === 'oauth_google'}
            provider='google'
            onPress={() => {
              trackAuthStarted('google');
              signInWithGoogle();
            }}
          />
          <AuthDivider />
          <AnimatedPressable
            accessibilityHint='Navigate to sign in screen'
            accessibilityLabel='Sign in to existing account'
            accessibilityRole='link'
            accessibilityState={{ disabled: !!isLoading }}
            disableAnimation={!!isLoading}
            disabled={!!isLoading}
            style={styles.textLink}
            onPress={() => {
              trackAuthStarted('email_signin');
              setMode('signin');
            }}
          >
            <Text style={styles.textLinkLabel}>Already have an account?</Text>
            <Text style={styles.textLinkAction}> Sign in</Text>
          </AnimatedPressable>
        </Animated.View>
      </View>
    </View>
  );
}
