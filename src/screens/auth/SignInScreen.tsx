/**
 * SignInScreen - Sign in experience
 * Warm minimal design with staggered animations
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
import { Link } from 'lucide-react-native';
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

  // Entrance animations (staggered, no breathing)
  const iconScale = useSharedValue(0.8);
  const iconOpacity = useSharedValue(0);
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(20);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(24);

  useEffect(() => {
    // Icon entrance
    iconOpacity.value = withTiming(1, { duration: 400 });
    iconScale.value = withSpring(1, { damping: 15 });

    // Header entrance
    headerOpacity.value = withDelay(100, withTiming(1, { duration: 350 }));
    headerTranslateY.value = withDelay(100, withSpring(0, { damping: 15 }));

    // Content entrance
    contentOpacity.value = withDelay(280, withTiming(1, { duration: 350 }));
    contentTranslateY.value = withDelay(280, withSpring(0, { damping: 15 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }],
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
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Animated.View style={[styles.iconContainer, iconStyle]}>
              <Link color='#1F2937' size={40} strokeWidth={2} />
            </Animated.View>

            <Animated.View style={headerStyle}>
              <Text style={styles.welcomeTitle}>Welcome back</Text>
              <Text style={styles.welcomeSubtitle}>
                Your habits are waiting. Let's keep the momentum going.
              </Text>
            </Animated.View>
          </View>

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
  authContent: {
    gap: 24,
  },
  container: {
    backgroundColor: '#faf9f7',
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
    lineHeight: 20,
    textAlign: 'center',
  },
  formSection: {
    gap: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: '#f5f5f4',
    borderRadius: 20,
    height: 80,
    justifyContent: 'center',
    marginBottom: 16,
    width: 80,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  socialButtons: {
    gap: 12,
  },
  welcomeSubtitle: {
    color: '#57534e',
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  welcomeTitle: {
    color: '#1F2937',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.42,
    marginBottom: 8,
    textAlign: 'center',
  },
});
