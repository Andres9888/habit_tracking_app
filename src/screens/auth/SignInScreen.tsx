import { useSignIn } from '@clerk/clerk-expo';
import { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SocialLoginButtons } from '../../components/auth/SocialLoginButtons';
import {
  AnimatedLogo,
  ForgotPasswordModal,
  FormInput,
  PasswordInput,
  SubmitButton,
} from './components';

interface SignInScreenProps {
  onNavigateToSignUp?: () => void;
}

export default function SignInScreen({ onNavigateToSignUp }: SignInScreenProps) {
  const { signIn, setActive, isLoaded } = useSignIn();
  const insets = useSafeAreaInsets();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }

    setIsLoading(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
      } else {
        // Handle additional verification steps if needed
        Alert.alert(
          'Error',
          'Sign in incomplete. Please check your credentials.'
        );
      }
    } catch (error: any) {
      console.error(JSON.stringify(error, null, 2));
      Alert.alert('Error', error.errors?.[0]?.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className='flex-1 bg-white'>
      <View className='flex-1 px-6' style={{ paddingTop: insets.top + 16 }}>
        {/* Logo Section */}
        <View className='mb-8 items-center'>
          <AnimatedLogo size={80} />
          <Text className='mb-2 text-3xl font-extrabold tracking-tight text-slate-900'>
            Welcome Back! 👋
          </Text>
          <Text className='text-base text-slate-500'>
            Sign in to continue your journey
          </Text>
        </View>

        <SocialLoginButtons />

        <View className='gap-6'>
          <FormInput
            label='EMAIL'
            icon='📧'
            autoCapitalize='none'
            autoComplete='email'
            keyboardType='email-address'
            placeholder='Enter your email address'
            value={emailAddress}
            onChangeText={setEmailAddress}
            accessibilityLabel='Email input'
            accessibilityHint='Enter your email address to sign in'
          />

          <PasswordInput
            value={password}
            onChangeText={setPassword}
            placeholder='Enter your password'
          />

          {/* Forgot Password Link */}
          <TouchableOpacity
            className='self-end'
            onPress={() => setShowForgotPassword(true)}
            accessibilityLabel='Forgot password?'
            accessibilityRole='button'
            accessibilityHint='Opens password reset form'
          >
            <Text className='text-sm font-semibold text-slate-900'>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <SubmitButton
            label='SIGN IN'
            loadingLabel='SIGNING IN...'
            isLoading={isLoading}
            disabled={!emailAddress || !password}
            onPress={onSignInPress}
          />
        </View>

        {/* Sign Up Prompt */}
        {onNavigateToSignUp && (
          <View className='mt-8 flex-row items-center justify-center'>
            <Text className='text-base text-slate-500'>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity
              onPress={onNavigateToSignUp}
              accessibilityLabel="Sign up"
              accessibilityRole="button"
              accessibilityHint="Navigate to create a new account"
            >
              <Text className='text-base font-semibold text-slate-900'>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        visible={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </View>
  );
}
