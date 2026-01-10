import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { AuthDivider, SocialSignInButton } from './components';
import { useOAuthSignIn } from './hooks/useOAuthSignIn';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';

type AuthMode = 'welcome' | 'signin' | 'signup';

export default function WelcomeScreen() {
  const [mode, setMode] = useState<AuthMode>('welcome');
  const { signInWithGoogle, signInWithApple, isLoading } = useOAuthSignIn();

  if (mode === 'signin') {
    return (
      <View className='flex-1 bg-white'>
        <SignInScreen />
        <TouchableOpacity
          className='absolute left-6 top-[60px] z-10'
          onPress={() => setMode('welcome')}
        >
          <Text className='text-base font-semibold text-stone-800'>← Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (mode === 'signup') {
    return (
      <View className='flex-1 bg-white'>
        <SignUpScreen />
        <TouchableOpacity
          className='absolute left-6 top-[60px] z-10'
          onPress={() => setMode('welcome')}
        >
          <Text className='text-base font-semibold text-stone-800'>← Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-white'>
      <View className='flex-1 justify-between px-6 pb-[60px] pt-[100px]'>
        <View className='items-center gap-4'>
          <Text className='mb-4 text-[80px]'>✓</Text>
          <Text className='text-center text-[40px] font-extrabold tracking-tight text-stone-800'>
            Habit Tracker
          </Text>
          <Text className='text-center text-lg leading-7 text-stone-500'>
            Build better habits, one day at a time
          </Text>
        </View>

        <View className="gap-3">
          <SocialSignInButton
            disabled={!!isLoading}
            isLoading={isLoading === 'oauth_apple'}
            onPress={signInWithApple}
            provider="apple"
          />
          <SocialSignInButton
            disabled={!!isLoading}
            isLoading={isLoading === 'oauth_google'}
            onPress={signInWithGoogle}
            provider="google"
          />

          <AuthDivider />

          <TouchableOpacity
            className={`items-center rounded-3xl bg-stone-800 py-[18px] ${isLoading ? 'opacity-40' : ''}`}
            disabled={!!isLoading}
            onPress={() => setMode('signup')}
          >
            <Text className="text-[15px] font-semibold tracking-[3px] text-white">
              GET STARTED
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`items-center rounded-3xl border border-stone-200 py-[18px] ${isLoading ? 'opacity-40' : ''}`}
            disabled={!!isLoading}
            onPress={() => setMode('signin')}
          >
            <Text className="text-[15px] font-semibold tracking-[3px] text-stone-800">
              SIGN IN
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
