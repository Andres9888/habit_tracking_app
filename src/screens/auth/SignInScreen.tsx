/**
 * SignInScreen - Premium sign in experience
 * Clean design with chain branding and smooth animations
 */

import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
  withRepeat,
  Easing,
  interpolate,
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
  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(20);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(30);
  
  // Breathing animation for logo
  const breathe = useSharedValue(0);

  useEffect(() => {
    // Logo entrance
    logoScale.value = withDelay(50, withSpring(1, { damping: 12, stiffness: 100 }));
    logoOpacity.value = withDelay(50, withTiming(1, { duration: 400 }));
    
    // Header entrance
    headerOpacity.value = withDelay(200, withTiming(1, { duration: 500 }));
    headerTranslateY.value = withDelay(200, withSpring(0, { damping: 15 }));
    
    // Content entrance
    contentOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
    contentTranslateY.value = withDelay(400, withSpring(0, { damping: 15 }));
    
    // Breathing animation
    breathe.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { scale: logoScale.value },
      { scale: interpolate(breathe.value, [0, 1], [1, 1.05]) },
    ],
  }));

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Subtle gradient background */}
      <LinearGradient
        colors={['#fafaf9', '#f5f5f4', '#fafaf9']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 }
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo & Brand */}
          <View style={styles.brandSection}>
            <Animated.View style={[styles.logoContainer, logoStyle]}>
              <LinearGradient
                colors={['#22c55e', '#16a34a']}
                style={styles.logoGradient}
              >
                <Text style={styles.logoEmoji}>🔗</Text>
              </LinearGradient>
            </Animated.View>
            
            <Animated.View style={headerStyle}>
              <Text style={styles.appName}>Chain Day</Text>
              <Text style={styles.tagline}>Don't break the chain</Text>
            </Animated.View>
          </View>

          {/* Welcome Message */}
          <Animated.View style={[styles.welcomeSection, headerStyle]}>
            <Text style={styles.welcomeTitle}>Welcome back! 👋</Text>
            <Text style={styles.welcomeSubtitle}>
              Your habits are waiting. Let's keep the momentum going.
            </Text>
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
                label='Continue'
                loadingLabel='Signing in...'
                onPress={handleSignIn}
              />
            </View>
          </Animated.View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our Terms & Privacy Policy
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
    backgroundColor: '#fafaf9',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoEmoji: {
    fontSize: 40,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1c1917',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    color: '#78716c',
    textAlign: 'center',
    marginTop: 4,
  },
  welcomeSection: {
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1c1917',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#57534e',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
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
  footer: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#a8a29e',
    textAlign: 'center',
    lineHeight: 18,
  },
});
