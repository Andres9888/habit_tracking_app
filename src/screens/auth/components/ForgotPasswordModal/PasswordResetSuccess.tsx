import { Text, TouchableOpacity, View } from 'react-native';
import type { PasswordResetSuccessProps } from './types';

export function PasswordResetSuccess({ onClose }: PasswordResetSuccessProps) {
  return (
    <View className='gap-4 py-4'>
      <View className='items-center justify-center rounded-2xl bg-green-50 p-6'>
        <Text className='text-5xl'>✓</Text>
        <Text className='mt-2 text-center text-base font-semibold text-green-900'>
          Email Sent Successfully
        </Text>
        <Text className='mt-1 text-center text-sm text-green-700'>
          Please check your inbox for password reset instructions.
        </Text>
      </View>

      <TouchableOpacity
        accessibilityHint='Closes this dialog and returns to sign in'
        accessibilityLabel='Close modal'
        accessibilityRole='button'
        activeOpacity={0.8}
        className='items-center rounded-3xl border border-stone-900 bg-stone-900 py-4'
        onPress={onClose}
      >
        <Text className='text-[15px] font-semibold tracking-[3px] text-white'>
          CLOSE
        </Text>
      </TouchableOpacity>
    </View>
  );
}
