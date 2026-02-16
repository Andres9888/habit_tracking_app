/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import { useRef } from 'react';
import { ScrollView, View, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import {
  AuthDivider,
  AuthError,
  FormInput,
  PasswordInput,
  SignInLink,
  SocialSignInButton,
  SubmitButton,
  VerificationView,
} from './components';
import { useOAuthSignIn } from './hooks/useOAuthSignIn';
import { useSignUpFlow } from './hooks/useSignUpFlow';
import { PasswordStrengthBar } from './components/PasswordStrengthBar';
import { SignUpHeader } from './components/SignUpHeader';
import { ScreenErrorBoundary } from '../../components/ErrorBoundary';

interface SignUpScreenProps {
  onNavigateToSignIn?: () => void;
}

function SignUpScreenContent({
  onNavigateToSignIn,
}: SignUpScreenProps) {
  const insets = useSafeAreaInsets();
  const passwordRef = useRef<TextInput>(null);
  const {
    emailAddress,
    setEmailAddress,
    emailError,
    onEmailBlur,
    password,
    setPassword,
    passwordError,
    onPasswordBlur,
    pendingVerification,
    isLoading,
    handleSignUp,
    handleVerification,
    isFormValid,
  } = useSignUpFlow();
  const {
    signInWithGoogle,
    signInWithApple,
    isLoading: oauthLoading,
    error: oauthError,
    clearError,
  } = useOAuthSignIn();

  const isAnyLoading = isLoading || !!oauthLoading;

  if (pendingVerification) {
    return (
      <VerificationView
        emailAddress={emailAddress}
        isLoading={isLoading}
        onVerify={handleVerification}
      />
    );
  }

  return (
    <View className='flex-1'>
      <LinearGradient
        colors={[
          colors.light.background,
          colors.light.gradientMid ?? '#f5f5f0',
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
            <SignUpHeader />

            {oauthError && (
              <AuthError message={oauthError} onDismiss={clearError} />
            )}

            {/* OPTIMIZED: Form card with depth matching SignIn */}
            <Animated.View
              entering={FadeInUp.delay(100).springify().damping(18)}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 16,
                elevation: 4,
                padding: 24,
                shadowColor: '#1c1917',
                shadowOffset: { height: 4, width: 0 },
                shadowOpacity: 0.08,
                shadowRadius: 16,
              }}
            >
              <View className='gap-3'>
                <SocialSignInButton
                  disabled={isAnyLoading}
                  isLoading={oauthLoading === 'oauth_apple'}
                  provider='apple'
                  testID='auth-sign-up-apple-button'
                  onPress={signInWithApple}
                />
                <SocialSignInButton
                  disabled={isAnyLoading}
                  isLoading={oauthLoading === 'oauth_google'}
                  provider='google'
                  testID='auth-sign-up-google-button'
                  onPress={signInWithGoogle}
                />
              </View>

              <AuthDivider />

              <View className='gap-6'>
                <FormInput
                  autoCapitalize='none'
                  autoComplete='email'
                  blurOnSubmit={false}
                  editable={!isAnyLoading}
                  error={emailError}
                  keyboardType='email-address'
                  label='Email'
                  placeholder='Enter your email'
                  returnKeyType='next'
                  value={emailAddress}
                  onBlur={onEmailBlur}
                  onChangeText={setEmailAddress}
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
                <View>
                  <PasswordInput
                    ref={passwordRef}
                    autoComplete='password-new'
                    editable={!isAnyLoading}
                    error={passwordError}
                    placeholder='Create a password'
                    returnKeyType='go'
                    value={password}
                    onBlur={onPasswordBlur}
                    onChangeText={setPassword}
                    onSubmitEditing={handleSignUp}
                  />
                  <PasswordStrengthBar password={password} />
                </View>
                <SubmitButton
                  disabled={
                    !emailAddress || !password || isAnyLoading || !isFormValid
                  }
                  isLoading={isLoading}
                  label='Create Account'
                  loadingLabel='Creating your account…'
                  testID='auth-sign-up-button'
                  onPress={handleSignUp}
                />
              </View>
            </Animated.View>

            {onNavigateToSignIn && (
              <Animated.View
                entering={FadeInUp.delay(200).springify().damping(18)}
              >
                <SignInLink
                  className='mt-6'
                  disabled={isAnyLoading}
                  onPress={onNavigateToSignIn}
                />
              </Animated.View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

export default function SignUpScreen(props: SignUpScreenProps) {
  return (
    <ScreenErrorBoundary screenName="Sign Up">
      <SignUpScreenContent {...props} />
    </ScreenErrorBoundary>
  );
}
