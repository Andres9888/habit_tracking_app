import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { PasswordResetFormProps } from './types';

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
      {/* Email Input */}
      <View className='gap-2'>
        <Text className='text-[10px] font-medium tracking-[3px] text-stone-500'>
          EMAIL ADDRESS
        </Text>
        <View className='relative'>
          <TextInput
            accessible
            autoFocus
            accessibilityHint='Enter your email to receive password reset instructions'
            accessibilityLabel='Email address input'
            autoCapitalize='none'
            autoComplete='email'
            className={`rounded-3xl border ${
              error ? 'border-red-600' : 'border-stone-200'
            } bg-white px-5 py-3.5 text-base font-medium text-stone-900`}
            editable={!isLoading}
            keyboardType='email-address'
            placeholder='Enter your email address'
            placeholderTextColor='#a8a29e'
            returnKeyType='send'
            value={email}
            onChangeText={onEmailChange}
            onSubmitEditing={onSubmit}
          />
          {/* Email icon prefix */}
          <View className='-transtone-y-1/2 absolute left-4 top-1/2'>
            <Text className='text-lg'>📧</Text>
          </View>
          <View className='pl-10' />
        </View>
        {/* Error message */}
        {error && (
          <Text
            accessibilityLiveRegion='polite'
            accessibilityRole='alert'
            className='text-xs font-medium text-red-600'
          >
            {error}
          </Text>
        )}
      </View>

      {/* Action Buttons */}
      <View className='gap-2'>
        {/* Submit Button */}
        <TouchableOpacity
          accessibilityHint='Sends password reset instructions to your email'
          accessibilityLabel='Send reset email'
          accessibilityRole='button'
          accessibilityState={{
            busy: isLoading,
            disabled: isLoading || !email.trim(),
          }}
          className={`items-center rounded-3xl border border-stone-900 bg-stone-900 py-4 ${
            isLoading || !email.trim() ? 'opacity-40' : ''
          }`}
          disabled={isLoading || !email.trim()}
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

        {/* Cancel Button */}
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
    </View>
  );
}
