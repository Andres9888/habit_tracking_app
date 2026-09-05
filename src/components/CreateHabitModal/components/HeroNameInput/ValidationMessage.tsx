/**
 * ValidationMessage — animated feedback line under the habit name input.
 * Split out of HeroNameInput.tsx to keep it under the 100-line budget.
 */
import { Text } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import type { ValidationResult } from './types';

interface ValidationMessageProps {
  style: AnimatedStyle<ViewStyle>;
  validation: ValidationResult;
}

export function ValidationMessage({ style, validation }: ValidationMessageProps) {
  const { colors: themeColors } = useThemeColors();

  const color = (() => {
    switch (validation.type) {
      case 'success': {
        return themeColors.primary[600];
      }
      case 'warning': {
        return '#D97706';
      }
      default: {
        return themeColors.text.secondary;
      }
    }
  })();

  return (
    <Animated.View className='mt-2' style={style}>
      <Text className='text-sm font-medium' style={{ color }}>
        {validation.message}
      </Text>
    </Animated.View>
  );
}
