/* eslint-disable max-lines */
/**
 * WelcomeScreen - Auth landing page
 * Clean design consistent with app style
 */

import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Link, Flame, Brain, Zap, Star } from 'lucide-react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
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
import { styles } from './WelcomeScreen.styles';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';

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
            Build habits that stick — backed by science
          </Animated.Text>

          {/* Value proposition bullets */}
          <View style={styles.valueProps}>
            <Animated.View entering={FadeInDown.delay(400).springify().damping(18)} style={styles.valuePropRow}>
              <Flame color='#059669' size={18} />
              <Text style={styles.valuePropText}>Don't Break the Chain — visual streaks that motivate</Text>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(500).springify().damping(18)} style={styles.valuePropRow}>
              <Brain color='#059669' size={18} />
              <Text style={styles.valuePropText}>Science-backed habit strength tracking</Text>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(600).springify().damping(18)} style={styles.valuePropRow}>
              <Zap color='#059669' size={18} />
              <Text style={styles.valuePropText}>Create your first habit in under 30 seconds</Text>
            </Animated.View>
          </View>

          {/* Social proof */}
          <Animated.View entering={FadeInDown.delay(700).springify().damping(18)} style={styles.socialProof}>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} color='#fbbf24' fill='#fbbf24' size={14} />
              ))}
            </View>
            <Text style={styles.socialProofText}>Loved by 10,000+ people building lasting habits</Text>
          </Animated.View>
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
