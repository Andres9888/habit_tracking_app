/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import { View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import {
  AuthDivider,
  AuthError,
  FormInput,
  SignInLink,
  SocialSignInButton,
  SubmitButton,
  VerificationView,
} from './components';
import { useOAuthSignIn } from './hooks/useOAuthSignIn';
import { useSignUpFlow } from './hooks/useSignUpFlow';
import { SignUpHeader } from './components/SignUpHeader';

interface SignUpScreenProps {
  onNavigateToSignIn?: () => void;
}

export default function SignUpScreen({
  onNavigateToSignIn,
}: SignUpScreenProps) {
  const insets = useSafeAreaInsets();
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
    <View
      className='flex-1'
      style={{ backgroundColor: colors.light.background }}
    >
      <View className='flex-1 px-6' style={{ paddingTop: insets.top + 24 }}>
        <SignUpHeader />

        {oauthError && (
          <AuthError message={oauthError} onDismiss={clearError} />
        )}

        <Animated.View
          className='gap-3'
          entering={FadeInUp.delay(100).springify().damping(18)}
        >
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
        </Animated.View>

        <AuthDivider />

        <Animated.View
          className='gap-6'
          entering={FadeInUp.delay(150).springify().damping(18)}
        >
          <FormInput
            autoCapitalize='none'
            autoComplete='email'
            editable={!isAnyLoading}
            error={emailError}
            keyboardType='email-address'
            label='Email'
            placeholder='Enter your email'
            value={emailAddress}
            onBlur={onEmailBlur}
            onChangeText={setEmailAddress}
          />
          <FormInput
            secureTextEntry
            autoComplete='password-new'
            editable={!isAnyLoading}
            error={passwordError}
            label='Password'
            placeholder='Create a password'
            value={password}
            onBlur={onPasswordBlur}
            onChangeText={setPassword}
          />
          <SubmitButton
            disabled={
              !emailAddress || !password || isAnyLoading || !isFormValid
            }
            isLoading={isLoading}
            label='Create account'
            loadingLabel='Creating account...'
            onPress={handleSignUp}
          />
        </Animated.View>

        {onNavigateToSignIn && (
          <SignInLink
            className='mt-6'
            disabled={isAnyLoading}
            onPress={onNavigateToSignIn}
          />
        )}
      </View>
    </View>
  );
}
