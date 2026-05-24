/**
 * PresetButton - Reminder preset with time label
 * Per spec: 48px height, Morning/Midday/Evening with time labels
 */

import { memo, useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { durations, springs } from '@/theme/animations';
import { useThemeColors } from '@/theme/ThemeContext';
import type { PresetButtonProps } from './types';

const useButtonAnimation = (reduceMotion: boolean) => {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    'worklet';
    if (reduceMotion) return;
    scale.value = withTiming(0.97, { duration: durations.instant });
  }, [scale, reduceMotion]);

  const handlePressOut = useCallback(() => {
    'worklet';
    if (reduceMotion) {
      scale.value = 1;
      return;
    }
    scale.value = withSpring(1, springs.standard);
  }, [scale, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { animatedStyle, handlePressIn, handlePressOut };
};

function PresetButtonComponent({
  preset,
  isSelected,
  onPress,
  reduceMotion,
}: PresetButtonProps) {
  const { animatedStyle, handlePressIn, handlePressOut } =
    useButtonAnimation(reduceMotion);
  const { colors } = useThemeColors();

  return (
    <Pressable
      accessibilityLabel={`Set reminder for ${preset.label}${preset.time ? ` at ${preset.time}` : ''}`}
      accessibilityRole='button'
      accessibilityState={{ selected: isSelected }}
      className='flex-1'
      testID={`preset-${preset.id}`}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
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
