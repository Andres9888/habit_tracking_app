/**
 * WelcomeScreen - Redesigned auth landing page
 * Features animated hero, social proof, and clear CTAs
 */

import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  AuthDivider,
  AuthError,
  BackButton,
  SocialSignInButton,
} from './components';
import { HeroAnimation } from './components/HeroAnimation';
import { SocialProofBadge } from './components/SocialProofBadge';
import { useOAuthSignIn } from './hooks/useOAuthSignIn';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';

type AuthMode = 'welcome' | 'signin' | 'signup';

export default function WelcomeScreen() {
  const [mode, setMode] = useState<AuthMode>('welcome');
  const insets = useSafeAreaInsets();
  const { signInWithGoogle, signInWithApple, isLoading, error, clearError } =
    useOAuthSignIn();

  // Entrance animations
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const subtitleOpacity = useSharedValue(0);
  const buttonsOpacity = useSharedValue(0);
  const buttonsTranslateY = useSharedValue(20);

  useEffect(() => {
    // Staggered entrance
    titleOpacity.value = withDelay(200, withSpring(1));
    titleTranslateY.value = withDelay(200, withSpring(0));
    subtitleOpacity.value = withDelay(300, withSpring(1));
    buttonsOpacity.value = withDelay(500, withTiming(1, { duration: 400 }));
    buttonsTranslateY.value = withDelay(500, withSpring(0));
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const buttonsStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
    transform: [{ translateY: buttonsTranslateY.value }],
  }));

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
      <View style={[styles.content, { paddingTop: insets.top + 40 }]}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <HeroAnimation />

          <Animated.Text style={[styles.title, titleStyle]}>
            Chain Day
          </Animated.Text>

          <Animated.Text style={[styles.subtitle, subtitleStyle]}>
            Build habits that actually stick
          </Animated.Text>

          <SocialProofBadge />
        </View>

        {/* Action Section */}
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

          <TouchableOpacity
            style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
            disabled={!!isLoading}
            activeOpacity={0.8}
            onPress={() => setMode('signup')}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.textLink}
            disabled={!!isLoading}
            onPress={() => setMode('signin')}
          >
            <Text style={styles.textLinkLabel}>Already have an account?</Text>
            <Text style={styles.textLinkAction}> Sign in</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
  },
  heroSection: {
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1c1917',
    letterSpacing: -1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#78716c',
    textAlign: 'center',
    marginBottom: 8,
  },
  actionSection: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#1c1917',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  textLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  textLinkLabel: {
    fontSize: 15,
    color: '#78716c',
  },
  textLinkAction: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1c1917',
  },
});
