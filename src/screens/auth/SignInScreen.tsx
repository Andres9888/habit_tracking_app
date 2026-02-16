/**
 * SignInScreen - Premium sign in experience
 * Warm stone palette, consistent with SignUpScreen
 */

/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import React, { useState } from 'react';
import { Text, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Link } from 'lucide-react-native';
import { colors } from '../../theme/colors';
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

interface SignInScreenProps {
  /** Auto-focus the email input on mount */
  autoFocusEmail?: boolean;
  /** Callback when user wants to navigate to sign up */
  onNavigateToSignUp?: () => void;
}

function SignInScreenContent(_props: SignInScreenProps = {}) {
  const insets = useSafeAreaInsets();
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
    headerTranslateY.value = withDelay(110, withSpring(0, { damping: 18, stiffness: 150 }));

    // Content entrance (60ms stagger)
    contentOpacity.value = withDelay(170, withTiming(1, { duration: 280 }));
    contentTranslateY.value = withDelay(170, withSpring(0, { damping: 18, stiffness: 150 }));
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
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[
          colors.light.background,
          colors.light.gradientMid ?? '#F0EDE8',
        ]}
        style={{ flex: 1 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: insets.bottom + 24,
              paddingHorizontal: 24,
              paddingTop: insets.top + 24,
            }}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={{ marginBottom: 32 }}>
              <Animated.View
                entering={FadeInDown.delay(0).springify().damping(18)}
                style={{
                  alignItems: 'center',
                  alignSelf: 'center',
                  backgroundColor: colors.light.surface,
                  borderRadius: 16,
                  elevation: 4,
                  height: 80,
                  justifyContent: 'center',
                  marginBottom: 16,
                  shadowColor: colors.gray[900],
                  shadowOffset: { height: 4, width: 0 },
                  shadowOpacity: 0.08,
                  shadowRadius: 16,
                  width: 80,
                }}
              >
                <Link color={colors.gray[800]} size={40} strokeWidth={2} />
              </Animated.View>

              <Animated.Text
                entering={FadeInDown.delay(50).springify().damping(18)}
                style={{
                  color: colors.gray[800],
                  fontSize: 34,
                  fontWeight: '700',
                  letterSpacing: -0.5,
                  marginBottom: 8,
                  textAlign: 'center',
                }}
              >
                Welcome back
              </Animated.Text>
              <Animated.Text
                entering={FadeInDown.delay(100).springify().damping(18)}
                style={{
                  color: colors.gray[500],
                  fontSize: 17,
                  lineHeight: 22,
                  textAlign: 'center',
                }}
              >
                Your habits are waiting. Let's keep going.
              </Animated.Text>
            </View>

          {/* Welcome Message */}
          <Animated.View style={[styles.welcomeSection, headerStyle]}>
            <Text style={styles.welcomeTitle}>Welcome back! 👋</Text>
            <Text style={styles.welcomeSubtitle}>
              Your streak is waiting — let's keep the momentum going.
            </Text>
          </Animated.View>

          {/* Auth Content */}
          <Animated.View style={[styles.authContent, contentStyle]}>
            {oauthError && (
              <AuthError message={oauthError} onDismiss={clearError} />
            )}

            {/* Form card — matches SignUpScreen elevation */}
            <Animated.View
              entering={FadeInUp.delay(100).springify().damping(18)}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 16,
                elevation: 4,
                padding: 24,
                shadowColor: colors.gray[900],
                shadowOffset: { height: 4, width: 0 },
                shadowOpacity: 0.08,
                shadowRadius: 16,
              }}
            >
              <View style={{ gap: 12 }}>
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

              <View style={{ gap: 20 }}>
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
            <Animated.View
              entering={FadeInUp.delay(200).springify().damping(18)}
              style={{ marginTop: 32, paddingHorizontal: 16 }}
            >
              <Text
                style={{
                  color: colors.gray[400],
                  fontSize: 13,
                  lineHeight: 18,
                  textAlign: 'center',
                }}
              >
                By continuing, you agree to our Terms & Privacy Policy
              </Text>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>

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
  footerLink: {
    color: '#047857',
    textDecorationLine: 'underline',
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

export default function SignInScreen(props: SignInScreenProps) {
  return (
    <ScreenErrorBoundary screenName="Sign In">
      <SignInScreenContent {...props} />
    </ScreenErrorBoundary>
  );
}
