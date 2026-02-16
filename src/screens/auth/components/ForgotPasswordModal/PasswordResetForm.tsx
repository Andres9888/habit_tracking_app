/** PasswordResetForm - OPTIMIZED: Better input styling, shadows — dark mode aware */
import { Text, TextInput, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useThemeColors } from '../../../../theme/ThemeContext';
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
  const { colors } = useThemeColors();
  return (
    <View className='gap-4'>
      <View className='gap-2'>
        <Text className='text-[13px] font-semibold' style={{ color: colors.text.secondary }}>
          Email address
        </Text>
        <View
          className={`rounded-2xl border-2 ${error ? 'border-red-500' : ''}`}
          style={{ 
            backgroundColor: colors.card, 
            borderColor: error ? '#ef4444' : colors.border,
            shadowColor: error ? '#ef4444' : colors.text.primary,
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
            className='px-4 py-4 text-[17px] font-medium'
            editable={!isLoading}
            keyboardType='email-address'
            placeholder='you@example.com'
            placeholderTextColor={colors.text.tertiary}
            returnKeyType='send'
            style={{ color: colors.text.primary }}
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
