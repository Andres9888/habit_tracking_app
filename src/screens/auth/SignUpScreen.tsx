import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
    password,
    setPassword,
    pendingVerification,
    isLoading,
    handleSignUp,
    handleVerification,
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
    <View className='flex-1 bg-white'>
      <View className='flex-1 px-6' style={{ paddingTop: insets.top + 16 }}>
        <SignUpHeader />

        {oauthError && (
          <AuthError message={oauthError} onDismiss={clearError} />
        )}

        <View className='gap-3'>
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

        <View className='gap-6'>
          <FormInput
            autoCapitalize='none'
            autoComplete='email'
            editable={!isAnyLoading}
            keyboardType='email-address'
            label='Email'
            placeholder='Enter your email'
            value={emailAddress}
            onChangeText={setEmailAddress}
          />
          <FormInput
            secureTextEntry
            autoComplete='password-new'
            editable={!isAnyLoading}
            label='Password'
            placeholder='Create a password'
            value={password}
            onChangeText={setPassword}
          />
          <SubmitButton
            disabled={!emailAddress || !password || isAnyLoading}
            isLoading={isLoading}
            label='CREATE ACCOUNT'
            loadingLabel='CREATING ACCOUNT...'
            onPress={handleSignUp}
          />
        </View>

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
