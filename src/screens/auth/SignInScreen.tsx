/**
 * @file SignInScreen.tsx
 * @description Premium sign-in experience with Chain Day branding and smooth entrance animations.
 *
 * ## Architecture
 * - **Authentication logic** is fully delegated to two hooks:
 *   - `useSignInFlow` — email/password state, validation, and Clerk sign-in.
 *   - `useOAuthSignIn` — Google & Apple OAuth flows via Clerk.
 * - **UI sub-components** (`FormInput`, `PasswordInput`, `SocialSignInButton`, etc.)
 *   live in `./components/` and are stateless/presentational.
 * - **Animations**: Three-stage entrance (logo → header → content) with 60ms staggers,
 *   using `withSpring(damping: 18)` + `withTiming(280ms)`.
 *
 * ## State Flow
 * ```
 * ┌─────────────────────────────────────────┐
 * │  isAnyLoading = isLoading || oauthLoading │
 * │  (disables all inputs & buttons)          │
 * └─────────────────────────────────────────┘
 *
 * Email/Password path:
 *   type email → blur validates → type password → Submit → handleSignIn()
 *
 * OAuth path:
 *   Tap Google/Apple → signInWithGoogle/Apple() → Clerk redirect
 * ```
 *
 * ## Refactoring Opportunities
 * - **REFACTOR**: The 6 shared-value + 3 animated-style blocks for entrance animations
 *   could be extracted into a `useStaggeredEntrance(stages)` hook.
 * - **REFACTOR**: `useScreenStyles()` re-creates the entire StyleSheet on every render;
 *   consider `useMemo` or splitting static vs. dynamic styles.
 */

/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import React, { useState, useRef } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';
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
import { EXTERNAL_URLS } from '@/constants';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';
import { colors } from '../../theme/colors';
import { useThemeColors } from '../../theme/ThemeContext';

// ── Types ────────────────────────────────────────────────────────────

interface SignInScreenProps {
  /** Auto-focus the email input on mount (used when deep-linking to sign-in). */
  autoFocusEmail?: boolean;
  /** Callback when user wants to navigate to sign up. */
  onNavigateToSignUp?: () => void;
}

// ── Main Content Component ───────────────────────────────────────────

/**
 * Inner sign-in screen (unwrapped from error boundary).
 *
 * Orchestrates:
 * 1. **Brand header** — logo, app name, tagline.
 * 2. **Welcome section** — motivational copy.
 * 3. **Auth content** — OAuth buttons, divider, email/password form.
 * 4. **Footer** — Terms & Privacy links.
 * 5. **Forgot password modal** — toggled by `showForgotPassword` state.
 */
function SignInScreenContent(_props: SignInScreenProps = {}) {
  const { colors: themeColors, isDark } = useThemeColors();
  const styles = useScreenStyles();
  const insets = useSafeAreaInsets();

  // ── State ──────────────────────────────────────────────────────
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  /** Ref to the password input — used to advance focus from the email field. */
  const passwordRef = useRef<TextInput>(null);

  // ── Hooks ──────────────────────────────────────────────────────

  /** Email/password sign-in state and handlers from Clerk. */
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

  /** OAuth (Google / Apple) sign-in state and handlers. */
  const {
    signInWithGoogle,
    signInWithApple,
    isLoading: oauthLoading,
    error: oauthError,
    clearError,
  } = useOAuthSignIn();

  /** Unified loading flag — disables all interactive elements when any auth is in progress. */
  const isAnyLoading = isLoading || !!oauthLoading;

  // ── Entrance Animations ────────────────────────────────────────
  // Three-stage cascade: logo (50ms) → header (110ms) → content (170ms).
  // Each stage combines opacity fade + spring translation/scale.

  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(20);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(30);

  /**
   * Kicks off the three-stage entrance animation on mount.
   * Delays are absolute (from mount), not relative to each other.
   */
  useEffect(() => {
    // Stage 1: Logo entrance (scale 0.5→1 + fade in)
    logoScale.value = withDelay(
      50,
      withSpring(1, { damping: 18, stiffness: 150 })
    );
    logoOpacity.value = withDelay(50, withTiming(1, { duration: 280 }));

    // Stage 2: Header entrance (60ms stagger from logo)
    headerOpacity.value = withDelay(110, withTiming(1, { duration: 280 }));
    headerTranslateY.value = withDelay(
      110,
      withSpring(0, { damping: 18, stiffness: 150 })
    );

    // Stage 3: Content entrance (60ms stagger from header)
    contentOpacity.value = withDelay(170, withTiming(1, { duration: 280 }));
    contentTranslateY.value = withDelay(
      170,
      withSpring(0, { damping: 18, stiffness: 150 })
    );
  }, []);

  /** Animated style for the logo (scale + opacity). */
  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  /** Animated style for the header section (translateY + opacity). */
  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  /** Animated style for the auth content section (translateY + opacity). */
  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  // ── Render ─────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      {/* Subtle warm gradient background */}
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
          {/* ── Brand Section ─────────────────────────────────── */}
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

          {/* ── Welcome Message ────────────────────────────────── */}
          <Animated.View style={[styles.welcomeSection, headerStyle]}>
            <Text style={styles.welcomeTitle}>Welcome back! 👋</Text>
            <Text style={styles.welcomeSubtitle}>
              Your streak is waiting — let's keep the momentum going.
            </Text>
          </Animated.View>

          {/* ── Auth Content (OAuth + Form) ────────────────────── */}
          <Animated.View style={[styles.authContent, contentStyle]}>
            {/* OAuth error banner (dismissible) */}
            {oauthError && (
              <AuthError message={oauthError} onDismiss={clearError} />
            )}

            {/* Social sign-in buttons */}
            <View style={styles.socialButtons}>
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

            {/* Email / Password form */}
            <View style={styles.formSection}>
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

          {/* ── Footer (Terms & Privacy) ──────────────────────── */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our{' '}
              <Text
                accessibilityRole='link'
                style={styles.footerLink}
                onPress={() =>
                  void Linking.openURL(EXTERNAL_URLS.TERMS)
                }
              >
                Terms
              </Text>
              {' & '}
              <Text
                accessibilityRole='link'
                style={styles.footerLink}
                onPress={() =>
                  void Linking.openURL(EXTERNAL_URLS.PRIVACY)
                }
              >
                Privacy Policy
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Forgot password modal — shown/hidden via state toggle */}
      <ForgotPasswordModal
        visible={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────────

/**
 * Creates theme-aware styles for the sign-in screen.
 *
 * **Note**: This hook re-creates the StyleSheet on every render because
 * `useThemeColors()` may change. This is acceptable for a screen-level
 * component but could be optimized with `useMemo` if profiling shows issues.
 *
 * @returns A `StyleSheet` object with all sign-in screen styles.
 */
function useScreenStyles() {
  const { colors: themeColors } = useThemeColors();
  return StyleSheet.create({
    appName: {
      color: themeColors.text.primary,
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
      backgroundColor: themeColors.background,
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
      color: themeColors.primary[700],
      textDecorationLine: 'underline',
    },
    footerText: {
      color: themeColors.text.tertiary,
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
      fontSize: 34,
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
      color: themeColors.text.secondary,
      fontSize: 13,
      marginTop: 4,
      textAlign: 'center',
    },
    welcomeSection: {
      marginBottom: 32,
    },
    welcomeSubtitle: {
      color: themeColors.text.secondary,
      fontSize: 17,
      lineHeight: 24,
      paddingHorizontal: 16,
      textAlign: 'center',
    },
    welcomeTitle: {
      color: themeColors.text.primary,
      fontSize: 22,
      fontWeight: '700',
      marginBottom: 8,
      textAlign: 'center',
    },
  });
}

// ── Public Export ─────────────────────────────────────────────────────

/**
 * Top-level `SignInScreen` export, wrapped in an error boundary.
 * If the sign-in UI crashes, the boundary renders a fallback instead
 * of a white screen, and the user can retry.
 */
export default function SignInScreen(props: SignInScreenProps) {
  return (
    <ScreenErrorBoundary screenName='Sign In'>
      <SignInScreenContent {...props} />
    </ScreenErrorBoundary>
  );
}
