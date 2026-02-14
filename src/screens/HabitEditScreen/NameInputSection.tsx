/**
 * NameInputSection - Matches Create modal style
 * 34px hero title, centered input with subtle border
 * Dark mode aware via ThemedTextInput.
 */

import { View, Text, Keyboard } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { ThemedTextInput } from '@/components/ui/ThemedTextInput';
import { useThemeColors } from '@/theme/ThemeContext';

interface NameInputSectionProps {
  habitName: string;
  onChangeText: (text: string) => void;
}

export function NameInputSection({
  habitName,
  onChangeText,
}: NameInputSectionProps) {
  const { colors } = useThemeColors();

  return (
    <View className='px-4'>
      {/* Hero Title - 34px bold centered like Create modal */}
      <Animated.View
        className='mb-6'
        entering={FadeInDown.duration(240).delay(100)}
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
      <Animated.View entering={FadeInUp.duration(240).delay(160)}>
        <ThemedTextInput
          accessibilityLabel='Habit name'
          maxLength={50}
          placeholder='e.g., Read for 20 minutes'
          returnKeyType='done'
          style={{
            textAlign: 'center',
            fontSize: 22,
            fontWeight: '500',
            lineHeight: 28,
          }}
          value={habitName}
          onChangeText={onChangeText}
          onSubmitEditing={Keyboard.dismiss}
        />
        <Text
          className='mt-2 text-center text-[13px]'
          style={{ color: colors.text.tertiary }}
        >
          {habitName.length}/50 characters
        </Text>
      </Animated.View>
    </View>
  );
}
