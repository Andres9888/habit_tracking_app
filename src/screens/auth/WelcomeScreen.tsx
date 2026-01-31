/**
 * WelcomeScreen - Auth landing page
 * Clean design consistent with app style
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
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { Link } from 'lucide-react-native';
import {
  AuthDivider,
  AuthError,
  BackButton,
  SocialSignInButton,
} from './components';
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
  const iconScale = useSharedValue(0.8);
  const iconOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(15);
  const subtitleOpacity = useSharedValue(0);
  const buttonsOpacity = useSharedValue(0);
  const buttonsTranslateY = useSharedValue(15);

  useEffect(() => {
    // Icon entrance
    iconOpacity.value = withDelay(100, withSpring(1));
    iconScale.value = withDelay(100, withSpring(1));
    
    // Text entrance
    titleOpacity.value = withDelay(250, withSpring(1));
    titleTranslateY.value = withDelay(250, withSpring(0));
    subtitleOpacity.value = withDelay(350, withSpring(1));
    
    // Buttons entrance
    buttonsOpacity.value = withDelay(450, withTiming(1, { duration: 300 }));
    buttonsTranslateY.value = withDelay(450, withSpring(0));
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));

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
      <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Animated.View style={[styles.iconContainer, iconStyle]}>
            <Link size={40} color="#1c1917" strokeWidth={2} />
          </Animated.View>

          <Animated.Text style={[styles.title, titleStyle]}>
            Chain Day
          </Animated.Text>

          <Animated.Text style={[styles.subtitle, subtitleStyle]}>
            Build habits that stick
          </Animated.Text>
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
            accessibilityLabel='Get started with Chain Day'
            accessibilityRole='button'
            accessibilityState={{ disabled: !!isLoading }}
            style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
            disabled={!!isLoading}
            activeOpacity={0.8}
            onPress={() => setMode('signup')}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityLabel='Sign in to existing account'
            accessibilityRole='link'
            accessibilityState={{ disabled: !!isLoading }}
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
    gap: 12,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#f5f5f4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1c1917',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17,
    color: '#78716c',
    textAlign: 'center',
  },
  actionSection: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#1c1917',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
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
