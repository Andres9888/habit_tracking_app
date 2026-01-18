import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AuthDivider,
  AuthError,
  FormInput,
  SocialSignInButton,
  SubmitButton,
} from './components';
import { useOAuthSignIn } from './hooks/useOAuthSignIn';
import { useSignInFlow } from './hooks/useSignInFlow';

export default function SignInScreen() {
  const insets = useSafeAreaInsets();
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

  return (
    <View className='flex-1 bg-white'>
      <View className='flex-1 px-6' style={{ paddingTop: insets.top + 16 }}>
        <Text className='mb-2 text-[32px] font-extrabold tracking-tight text-stone-800'>
          Welcome Back
        </Text>
        <Text className='mb-10 text-base text-stone-500'>
          Sign in to continue tracking your habits
        </Text>

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
            autoComplete='password'
            editable={!isAnyLoading}
            label='Password'
            placeholder='Enter your password'
            value={password}
            onChangeText={setPassword}
          />

          <SubmitButton
            disabled={!canSubmit || isAnyLoading}
            isLoading={isLoading}
            label='Sign in'
            loadingLabel='Signing in...'
            onPress={handleSignIn}
          />
        </View>
      </View>
    </View>
  );
}
