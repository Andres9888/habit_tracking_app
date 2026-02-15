/** PasswordResetForm - OPTIMIZED: Better input styling, shadows */

import { Text, TextInput, View } from 'react-native';

import Animated, { FadeIn } from 'react-native-reanimated';

import type { PasswordResetFormProps } from './types';
import { PasswordResetButtons } from './PasswordResetButtons';

export function PasswordResetForm({
  email,
  error,
  isLoading,
  onEmailChange,
  onSubmit,
  onCancel,
}: PasswordResetFormProps) {
  return (
    <View className='gap-4'>
      <View className='gap-2'>
        <Text className='text-[13px] font-semibold text-stone-600'>
          Email address
        </Text>
        <View
          className={`rounded-2xl border-2 bg-white ${error ? 'border-red-500' : 'border-stone-200'}`}
          style={{
            shadowColor: error ? '#ef4444' : '#1c1917',
            shadowOffset: { height: 4, width: 0 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
          }}
        >
          <TextInput
            accessible
            autoFocus
            accessibilityHint='Enter your email to receive password reset instructions'
            accessibilityLabel='Email address input'
            autoCapitalize='none'
            autoComplete='email'
            className='px-4 py-4 text-[17px] font-medium text-stone-900'
            editable={!isLoading}
            keyboardType='email-address'
            placeholder='you@example.com'
            placeholderTextColor='#a1a1aa'
            returnKeyType='send'
            value={email}
            onChangeText={onEmailChange}
            onSubmitEditing={onSubmit}
          />
        </View>
        {error && (
          <Animated.Text
            accessibilityLiveRegion='polite'
            accessibilityRole='alert'
            className='text-[13px] font-medium text-red-600'
            entering={FadeIn.duration(200)}
          >
            {error}
          </Animated.Text>
        )}
      </View>
      <PasswordResetButtons
        email={email}
        isLoading={isLoading}
        onCancel={onCancel}
        onSubmit={onSubmit}
      />
    </View>
  );
}
