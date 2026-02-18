/**
 * NameInputSection - Dark mode aware
 * 34px hero title, centered input with subtle border
 */

import { useState } from 'react';
import { View, Text, TextInput, Keyboard } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../theme';

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
    <View className='px-4'>
      {/* Hero Title - 34px bold centered like Create modal */}
      <Animated.View
        className='mb-6'
        entering={FadeInDown.duration(280).delay(100).springify().damping(18)}
      >
        <Text
          accessibilityRole='header'
          className='text-center font-bold'
          style={{
            fontSize: 34,
            letterSpacing: -34 * 0.02,
            lineHeight: 34 * 1.2,
            color: colors.text.primary,
          }}
        >
          Edit your habit
        </Text>
      </Animated.View>

      {/* Name Input */}
      <Animated.View entering={FadeInUp.duration(280).delay(160).springify().damping(18)}>
        <TextInput
          accessibilityLabel='Habit name'
          className='w-full rounded-2xl border-2 px-5 py-4 text-center text-[22px] font-medium'
          maxLength={50}
          placeholder='e.g., Read for 20 minutes before bed'
          placeholderTextColor={isDark ? colors.text.tertiary : '#a1a1aa'}
          returnKeyType='done'
          style={{
            lineHeight: 28,
            color: colors.text.primary,
            backgroundColor: isDark ? colors.card : '#FFFFFF',
            borderColor: isFocused ? colors.primary[600] : colors.border,
          }}
          value={habitName}
          onBlur={() => setIsFocused(false)}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onSubmitEditing={Keyboard.dismiss}
        />
        <Text
          className='mt-2 text-center text-[13px]'
          style={{ color: colors.text.tertiary }}
        >
          {habitName.length}/50 characters
          {habitName.length > 0 && habitName.trim().length < 2
            ? ' · At least 2 characters required'
            : ''}
        </Text>
      </Animated.View>
    </View>
  );
}
