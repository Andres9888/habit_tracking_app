/**
 * SignInScreen - Premium sign in experience
 * Clean design with chain branding and smooth animations
 */

/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
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

interface SignInScreenProps {
  /** Auto-focus the email input on mount */
  autoFocusEmail?: boolean;
  /** Callback when user wants to navigate to sign up */
  onNavigateToSignUp?: () => void;
}

export default function SignInScreen(_props: SignInScreenProps = {}) {
  const insets = useSafeAreaInsets();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const {
    emailAddress,
    setEmailAddress,
    emailError,
    onEmailBlur,
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
    logoScale.value = withDelay(
      50,
      withSpring(1, { damping: 12, stiffness: 100 })
    );
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
            { paddingBottom: insets.bottom + 24, paddingTop: insets.top + 40 },
          ]}
          keyboardShouldPersistTaps='handled'
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
                error={emailError}
                keyboardType='email-address'
                label='Email'
                placeholder='your@email.com'
                value={emailAddress}
                onBlur={onEmailBlur}
                onChangeText={setEmailAddress}
              />

              <FormInput
                secureTextEntry
                autoComplete='password'
                editable={!isAnyLoading}
                label='Password'
                labelRight={
                  <ForgotPasswordLink
                    onPress={() => setShowForgotPassword(true)}
                  />
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
  appName: {
    color: '#1c1917',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  authContent: {
    gap: 24,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  container: {
    backgroundColor: '#fafaf9',
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  footer: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  footerText: {
    color: '#a8a29e',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  formSection: {
    gap: 20,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoEmoji: {
    fontSize: 40,
  },
  logoGradient: {
    alignItems: 'center',
    borderRadius: 24,
    elevation: 8,
    height: 80,
    justifyContent: 'center',
    shadowColor: '#22c55e',
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    width: 80,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  socialButtons: {
    gap: 12,
  },
  tagline: {
    color: '#57534e',
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  welcomeSection: {
    marginBottom: 32,
  },
  welcomeSubtitle: {
    color: '#57534e',
    fontSize: 17,
    lineHeight: 24,
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  welcomeTitle: {
    color: '#1c1917',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
});
