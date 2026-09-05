/**
 * PresetButton - Reminder preset with time label
 * Per spec: 48px height, Morning/Midday/Evening with time labels
 */

import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { usePressAnimation } from '@/hooks/usePressAnimation';
import { useThemeColors } from '@/theme/ThemeContext';
import type { PresetButtonProps } from './types';

function PresetButtonComponent({
  preset,
  isSelected,
  onPress,
}: PresetButtonProps) {
  const { animatedStyle, pressHandlers } = usePressAnimation();
  const { colors } = useThemeColors();

  return (
    <Pressable
      accessibilityLabel={`Set reminder for ${preset.label}${preset.time ? ` at ${preset.time}` : ''}`}
      accessibilityRole='button'
      accessibilityState={{ selected: isSelected }}
      className='flex-1'
      testID={`preset-${preset.id}`}
      onPress={onPress}
      {...pressHandlers}
    >
      <Animated.View
        className='items-center justify-center rounded-2xl px-3'
        style={[
          {
            backgroundColor: isSelected ? colors.primary[100] : colors.card,
            borderColor: isSelected ? colors.primary[500] : colors.cardBorder,
            borderWidth: isSelected ? 2 : 1,
            height: 48,
          },
          animatedStyle,
        ]}
      >
        <View className='flex-row items-center gap-1.5'>
          <Text className='text-base'>{preset.emoji}</Text>
          <Text
            className='text-sm font-semibold'
            style={{
              color: isSelected ? colors.primary[700] : colors.text.secondary,
            }}
          >
            {preset.label}
          </Text>
        </View>
        {preset.time ? <Text
            className='mt-0.5 text-xs'
            style={{
              color: isSelected ? colors.primary[700] : colors.text.tertiary,
            }}
          >
            {preset.time}
          </Text> : null}
      </Animated.View>
    </Pressable>
  );
}

export const PresetButton = memo(PresetButtonComponent);
