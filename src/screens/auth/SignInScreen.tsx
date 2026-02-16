/**
 * SignInScreen - Premium sign in experience
 * Clean design with chain branding and smooth animations
 */

/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Linking,
  Text,
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '../../theme/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
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
  ForgotPasswordLink,
  ForgotPasswordModal,
  FormInput,
  PasswordInput,
  SocialSignInButton,
  SubmitButton,
} from './components';
import { useOAuthSignIn } from './hooks/useOAuthSignIn';
import { useSignInFlow } from './hooks/useSignInFlow';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import { colors } from '../../theme/colors';
import { useThemeColors } from '../../theme/ThemeContext';

interface SignInScreenProps {
  /** Auto-focus the email input on mount */
  autoFocusEmail?: boolean;
  /** Callback when user wants to navigate to sign up */
  onNavigateToSignUp?: () => void;
}

function SignInScreenContent(_props: SignInScreenProps = {}) {
  const { colors: themeColors, isDark } = useThemeColors();
  const styles = useScreenStyles();
  const insets = useSafeAreaInsets();
  const { colors } = useThemeColors();

  const themedStyles = useMemo(
    () => ({
      appName: { color: colors.text.primary } as const,
      container: { backgroundColor: colors.background } as const,
      footerLink: { color: colors.primary[600] } as const,
      footerText: { color: colors.text.tertiary } as const,
      tagline: { color: colors.text.secondary } as const,
      welcomeSubtitle: { color: colors.text.secondary } as const,
      welcomeTitle: { color: colors.text.primary } as const,
    }),
    [colors],
  );
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const passwordRef = useRef<TextInput>(null);
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

  useEffect(() => {
    // Logo entrance
    logoScale.value = withDelay(
      50,
      withSpring(1, { damping: 18, stiffness: 150 })
    );
    logoOpacity.value = withDelay(50, withTiming(1, { duration: 280 }));

    // Header entrance (60ms stagger)
    headerOpacity.value = withDelay(110, withTiming(1, { duration: 280 }));
    headerTranslateY.value = withDelay(
      110,
      withSpring(0, { damping: 18, stiffness: 150 })
    );

    // Content entrance (60ms stagger)
    contentOpacity.value = withDelay(170, withTiming(1, { duration: 280 }));
    contentTranslateY.value = withDelay(
      170,
      withSpring(0, { damping: 18, stiffness: 150 })
    );
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
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
    <View style={[staticStyles.container, themedStyles.container]}>
      {/* Subtle gradient background */}
      <LinearGradient
        colors={[colors.background, colors.gray[100], colors.background]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={staticStyles.flex}
      >
        <ScrollView
          contentContainerStyle={[
            staticStyles.scrollContent,
            { paddingBottom: insets.bottom + 24, paddingTop: insets.top + 40 },
          ]}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          {/* Logo & Brand */}
          <View style={staticStyles.brandSection}>
            <Animated.View style={[staticStyles.logoContainer, logoStyle]}>
              <LinearGradient
                colors={['#22c55e', '#16a34a']}
                style={staticStyles.logoGradient}
              >
                <Text style={staticStyles.logoEmoji}>🔗</Text>
              </LinearGradient>
            </Animated.View>

            <Animated.View style={headerStyle}>
              <Text style={[staticStyles.appName, themedStyles.appName]}>Chain Day</Text>
              <Text style={[staticStyles.tagline, themedStyles.tagline]}>Don't break the chain</Text>
            </Animated.View>
          </View>

          {/* Welcome Message */}
          <Animated.View style={[staticStyles.welcomeSection, headerStyle]}>
            <Text style={[staticStyles.welcomeTitle, themedStyles.welcomeTitle]}>Welcome back! 👋</Text>
            <Text style={[staticStyles.welcomeSubtitle, themedStyles.welcomeSubtitle]}>
              Your streak is waiting — let's keep the momentum going.
            </Text>
          </Animated.View>

          {/* Auth Content */}
          <Animated.View style={[staticStyles.authContent, contentStyle]}>
            {oauthError && (
              <AuthError message={oauthError} onDismiss={clearError} />
            )}

            <View style={staticStyles.socialButtons}>
              <SocialSignInButton
                disabled={isAnyLoading}
                isLoading={oauthLoading === 'oauth_apple'}
                provider='apple'
                testID='auth-sign-in-apple-button'
                onPress={() => void signInWithApple()}
              />
              <SocialSignInButton
                disabled={isAnyLoading}
                isLoading={oauthLoading === 'oauth_google'}
                provider='google'
                testID='auth-sign-in-google-button'
                onPress={() => void signInWithGoogle()}
              />
            </View>

            <AuthDivider />

            <View style={staticStyles.formSection}>
              <FormInput
                autoCapitalize='none'
                autoComplete='email'
                blurOnSubmit={false}
                editable={!isAnyLoading}
                error={emailError}
                keyboardType='email-address'
                label='Email'
                placeholder='your@email.com'
                returnKeyType='next'
                value={emailAddress}
                onBlur={onEmailBlur}
                onChangeText={setEmailAddress}
                onSubmitEditing={() => passwordRef.current?.focus()}
              />

              <PasswordInput
                ref={passwordRef}
                autoComplete='password'
                editable={!isAnyLoading}
                labelRight={
                  <ForgotPasswordLink
                    onPress={() => setShowForgotPassword(true)}
                  />
                }
                placeholder='Enter your password'
                returnKeyType='go'
                value={password}
                onChangeText={setPassword}
                onSubmitEditing={() => void handleSignIn()}
              />

              <SubmitButton
                disabled={!canSubmit || isAnyLoading}
                isLoading={isLoading}
                label='Sign In'
                loadingLabel='Signing in…'
                testID='auth-sign-in-button'
                onPress={() => void handleSignIn()}
              />
            </View>
          </Animated.View>

          {/* Footer */}
          <View style={staticStyles.footer}>
            <Text style={[staticStyles.footerText, themedStyles.footerText]}>
              By continuing, you agree to our{' '}
              <Text
                accessibilityRole='link'
                style={[staticStyles.footerLink, themedStyles.footerLink]}
                onPress={() => void Linking.openURL('https://chainday.app/terms')}
              >
                Terms
              </Text>
              {' & '}
              <Text
                accessibilityRole='link'
                style={[staticStyles.footerLink, themedStyles.footerLink]}
                onPress={() => void Linking.openURL('https://chainday.app/privacy')}
              >
                Privacy Policy
              </Text>
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

const staticStyles = StyleSheet.create({
  appName: {
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
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  footer: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  footerLink: {
    textDecorationLine: 'underline',
  },
  footerText: {
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
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  welcomeSection: {
    marginBottom: 32,
  },
  welcomeSubtitle: {
    fontSize: 17,
    lineHeight: 24,
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
});

export default function SignInScreen(props: SignInScreenProps) {
  return (
    <ScreenErrorBoundary screenName='Sign In'>
      <SignInScreenContent {...props} />
    </ScreenErrorBoundary>
  );
}
