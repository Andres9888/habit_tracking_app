/**
 * PasswordResetButtons - Submit and Cancel buttons for password reset form
 */

import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

interface PasswordResetButtonsProps {
  email: string;
  isLoading: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

export function PasswordResetButtons({
  email,
  isLoading,
  onSubmit,
  onCancel,
}: PasswordResetButtonsProps) {
  const isDisabled = isLoading || !email.trim();

  return (
    <View className='gap-2'>
      <TouchableOpacity
        accessibilityHint='Sends password reset instructions to your email'
        accessibilityLabel='Send reset email'
        accessibilityRole='button'
        accessibilityState={{ busy: isLoading, disabled: isDisabled }}
        className={`items-center rounded-3xl border border-stone-900 bg-stone-900 py-4 ${isDisabled ? 'opacity-40' : ''}`}
        disabled={isDisabled}
        onPress={onSubmit}
      >
        {isLoading ? (
          <ActivityIndicator color='#ffffff' size='small' />
        ) : (
          <Text className='text-[15px] font-semibold tracking-[3px] text-white'>
            SEND RESET EMAIL
          </Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        accessibilityHint='Closes this dialog without sending reset email'
        accessibilityLabel='Cancel password reset'
        accessibilityRole='button'
        className='items-center rounded-3xl border border-stone-200 bg-white py-4'
        disabled={isLoading}
        onPress={onCancel}
      >
        <Text className='text-[15px] font-semibold tracking-[3px] text-stone-900'>
          CANCEL
        </Text>
      </TouchableOpacity>
    </View>
  );
}
