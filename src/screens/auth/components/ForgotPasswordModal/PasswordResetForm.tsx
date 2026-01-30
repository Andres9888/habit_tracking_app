import { Text, TextInput, View } from 'react-native';
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
        <Text className='text-sm font-medium text-stone-500'>
          Email address
        </Text>
        <View className='relative'>
          <TextInput
            accessible
            autoFocus
            accessibilityHint='Enter your email to receive password reset instructions'
            accessibilityLabel='Email address input'
            autoCapitalize='none'
            autoComplete='email'
            className={`rounded-3xl border ${error ? 'border-red-600' : 'border-stone-200'} bg-white px-5 py-3.5 text-base font-medium text-stone-900`}
            editable={!isLoading}
            keyboardType='email-address'
            placeholder='Enter your email address'
            placeholderTextColor='#a8a29e'
            returnKeyType='send'
            value={email}
            onChangeText={onEmailChange}
            onSubmitEditing={onSubmit}
          />
          <View className='-transtone-y-1/2 absolute left-4 top-1/2'>
            <Text className='text-lg'>📧</Text>
          </View>
          <View className='pl-10' />
        </View>
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
      <PasswordResetButtons
        email={email}
        isLoading={isLoading}
        onCancel={onCancel}
        onSubmit={onSubmit}
      />
    </View>
  );
}
