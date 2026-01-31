/**
 * SignInScreen - Redesigned sign in page
 * Warmer copy, better visual hierarchy
 */

import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import {
  AuthDivider,
  AuthError,
  ForgotPasswordLink,
  ForgotPasswordModal,
  FormInput,
  SocialSignInButton,
  SubmitButton,
} from './components';
import { useOAuthSignIn } from './hooks/useOAuthSignIn';
import { useSignInFlow } from './hooks/useSignInFlow';

export default function SignInScreen() {
  const insets = useSafeAreaInsets();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const {
    emailAddress,
    setEmailAddress,
    password,
    setPassword,
    isLoading,
    handleSignIn,
    canSubmit,
  } = useSignInFlow();
  const {
    signInWithGoogle,
    signInWithApple,
    isLoading: oauthLoading,
    error: oauthError,
    clearError,
  } = useOAuthSignIn();

  const isAnyLoading = isLoading || !!oauthLoading;

  // Entrance animations
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(15);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withDelay(100, withSpring(1));
    headerTranslateY.value = withDelay(100, withSpring(0));
    contentOpacity.value = withDelay(200, withSpring(1));
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
        {/* Header */}
        <Animated.View style={[styles.header, headerStyle]}>
          <Text style={styles.emoji}>👋</Text>
          <Text style={styles.title}>Welcome back!</Text>
          <Text style={styles.subtitle}>Your habits are waiting for you</Text>
        </Animated.View>

        {/* Auth Content */}
        <Animated.View style={[styles.authContent, contentStyle]}>
          {oauthError && (
            <AuthError message={oauthError} onDismiss={clearError} />
          )}

          <View style={styles.socialButtons}>
            <SocialSignInButton
              disabled={isAnyLoading}
              isLoading={oauthLoading === 'oauth_apple'}
              provider='apple'
              onPress={signInWithApple}
            />
            <SocialSignInButton
              disabled={isAnyLoading}
              isLoading={oauthLoading === 'oauth_google'}
              provider='google'
              onPress={signInWithGoogle}
            />
          </View>

          <AuthDivider />

          <View style={styles.formSection}>
            <FormInput
              autoCapitalize='none'
              autoComplete='email'
              editable={!isAnyLoading}
              keyboardType='email-address'
              label='Email'
              placeholder='your@email.com'
              value={emailAddress}
              onChangeText={setEmailAddress}
            />

            <FormInput
              secureTextEntry
              autoComplete='password'
              editable={!isAnyLoading}
              label='Password'
              labelRight={
                <ForgotPasswordLink onPress={() => setShowForgotPassword(true)} />
              }
              placeholder='Enter your password'
              value={password}
              onChangeText={setPassword}
            />

            <SubmitButton
              disabled={!canSubmit || isAnyLoading}
              isLoading={isLoading}
              label='Sign In'
              loadingLabel='Signing in...'
              onPress={handleSignIn}
            />
          </View>
        </Animated.View>
      </View>

      <ForgotPasswordModal
        visible={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
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
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1c1917',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#78716c',
  },
  authContent: {
    gap: 24,
  },
  socialButtons: {
    gap: 12,
  },
  formSection: {
    gap: 20,
  },
});
