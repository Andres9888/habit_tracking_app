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
