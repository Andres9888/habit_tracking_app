/**
 * NameInputSection - Dark mode aware
 * 34px hero title, centered input with subtle border
 */

import { useState } from 'react';
import { View, Text, TextInput, Keyboard } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../theme';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { buildTextInputHintProps } from '@/utils/textInputHintProps';

interface NameInputSectionProps {
  habitName: string;
  onChangeText: (text: string) => void;
}

export function NameInputSection({
  habitName,
  onChangeText,
}: NameInputSectionProps) {
  const { colors, isDark } = useThemeColors();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      className='items-center px-6'
      style={{ marginBottom: spacing['2xl'], marginTop: spacing.xl }}
    >
      <Animated.View
        className='mb-6'
        entering={FadeInDown.duration(280).delay(100).springify().damping(18)}
      >
        <Text
          accessibilityRole='header'
          className='text-center leading-tight'
          style={{ ...typography.heading2, color: colors.text.primary }}
        >
          Edit your habit
        </Text>
      </Animated.View>

      {/* Name Input */}
      <Animated.View className='w-full' entering={FadeInUp.duration(280).delay(160).springify().damping(18)}>
        <TextInput
          accessibilityLabel='Habit name'
          className='w-full rounded-2xl border-2 px-5 py-4 text-center text-2xl font-medium'
          maxLength={50}
          returnKeyType='done'
          style={{
            lineHeight: 28,
            color: colors.text.primary,
            backgroundColor: isDark ? colors.card : '#FFFFFF',
            borderColor: isFocused ? colors.primary[600] : colors.border,
          }}
          value={habitName}
          {...buildTextInputHintProps(
            'Update your habit name',
            colors.text.tertiary
          )}
          onBlur={() => setIsFocused(false)}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onSubmitEditing={Keyboard.dismiss}
        />
      </Animated.View>
    </View>
  );
}
