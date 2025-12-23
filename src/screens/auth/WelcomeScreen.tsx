import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';

type AuthMode = 'welcome' | 'signin' | 'signup';

export default function WelcomeScreen() {
  const [mode, setMode] = useState<AuthMode>('welcome');

  if (mode === 'signin') {
    return (
      <View className='flex-1 bg-white'>
        <SignInScreen onNavigateToSignUp={() => setMode('signup')} />
        <TouchableOpacity
          className='absolute left-6 top-[60px] z-10'
          onPress={() => setMode('welcome')}
        >
          <Text className='text-base font-semibold text-slate-900'>← Back</Text>
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
          <Text className='text-base font-semibold text-slate-900'>← Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-white'>
      <View className='flex-1 justify-between px-6 pb-[60px] pt-[100px]'>
        <View className='items-center gap-4'>
          <Text className='mb-4 text-[80px]'>✓</Text>
          <Text className='text-center text-[40px] font-extrabold tracking-tight text-slate-900'>
            Habit Tracker
          </Text>
          <Text className='text-center text-lg leading-7 text-slate-500'>
            Build better habits, one day at a time
          </Text>
        </View>

        <View className='gap-4'>
          <TouchableOpacity
            className='items-center rounded-3xl bg-slate-900 py-[18px]'
            onPress={() => setMode('signup')}
          >
            <Text className='text-[13px] font-bold tracking-[3px] text-white'>
              GET STARTED
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className='items-center rounded-3xl border border-slate-200 py-[18px]'
            onPress={() => setMode('signin')}
          >
            <Text className='text-[13px] font-bold tracking-[3px] text-slate-900'>
              SIGN IN
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
