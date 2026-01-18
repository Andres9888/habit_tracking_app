import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  AnimatedLogo,
  AuthDivider,
  AuthError,
  BackButton,
  LegalFooter,
  SignInLink,
  SocialProofBadge,
  SocialSignInButton,
} from './components';
import { useOAuthSignIn } from './hooks/useOAuthSignIn';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';

type AuthMode = 'welcome' | 'signin' | 'signup';

export default function WelcomeScreen() {
  const [mode, setMode] = useState<AuthMode>('welcome');
  const { signInWithGoogle, signInWithApple, isLoading, error, clearError } =
    useOAuthSignIn();

  if (mode === 'signin') {
    return (
      <View className='flex-1 bg-white'>
        <SignInScreen onNavigateToSignUp={() => setMode('signup')} />
        <BackButton onPress={() => setMode('welcome')} />
      </View>
    );
  }

  if (mode === 'signup') {
    return (
      <View className='flex-1 bg-white'>
        <SignUpScreen onNavigateToSignIn={() => setMode('signin')} />
        <BackButton onPress={() => setMode('welcome')} />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#fafaf9', '#ffffff']}
      end={{ x: 0, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={{ flex: 1 }}
    >
      <View className='flex-1 justify-between px-6 pb-[60px] pt-[100px]'>
        <View className='items-center gap-4'>
          <AnimatedLogo size={80} />
          <Text className='text-center text-[40px] font-extrabold tracking-tight text-stone-800'>
            Daily Habits
          </Text>
          <Text className='text-center text-lg leading-7 text-stone-500'>
            Build lasting habits with science-backed techniques
          </Text>
          <SocialProofBadge />
        </View>

        <View className='gap-3'>
          {error && <AuthError message={error} onDismiss={clearError} />}
          <SocialSignInButton
            disabled={!!isLoading}
            isLoading={isLoading === 'oauth_apple'}
            provider='apple'
            onPress={signInWithApple}
          />
          <SocialSignInButton
            disabled={!!isLoading}
            isLoading={isLoading === 'oauth_google'}
            provider='google'
            onPress={signInWithGoogle}
          />
          <AuthDivider />
          <TouchableOpacity
            className={`items-center rounded-2xl bg-stone-800 py-[18px] ${isLoading ? 'opacity-40' : ''}`}
            disabled={!!isLoading}
            onPress={() => setMode('signup')}
          >
            <Text className='text-[15px] font-semibold text-white'>
              Continue with Email
            </Text>
          </TouchableOpacity>
          <SignInLink
            disabled={!!isLoading}
            onPress={() => setMode('signin')}
          />
          <View className='mt-4'>
            <LegalFooter />
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
