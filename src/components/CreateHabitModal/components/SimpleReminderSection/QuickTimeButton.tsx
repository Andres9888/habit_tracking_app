/**
 * QuickTimeButton Component
 *
 * A pressable button for selecting a quick time preset.
 * Features press animation and haptic feedback.
 */

import { useCallback, useRef } from 'react';
import { Animated, Pressable, Text } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { Motion } from '../../../../constants/motion';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import type { QuickTimeButtonProps } from './types';

export const QuickTimeButton = ({
  isSelected,
  label,
  onPress,
  time,
}: QuickTimeButtonProps) => {
  const scale = useRef(new Animated.Value(1)).current;
  const { triggerSelection } = useHapticFeedback();
  const { colors: themeColors } = useThemeColors();

  const handlePressIn = useCallback(() => {
    Animated.timing(scale, {
      duration: Motion.duration.fast,
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.timing(scale, {
      duration: Motion.duration.base,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return (
    <Animated.View style={{ flex: 1, transform: [{ scale }] }}>
      <Pressable
        accessibilityLabel={`Set reminder to ${label} at ${time}`}
        accessibilityRole='button'
        className='items-center rounded-xl py-3'
        style={{ backgroundColor: isSelected ? themeColors.status.info : themeColors.background }}
        onPress={() => {
          triggerSelection();
          onPress();
        }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text
          className={`text-xs font-semibold ${
            isSelected ? 'text-white' : ''
          }`}
          style={isSelected ? undefined : { color: themeColors.text.secondary }}
        >
          {label}
        </Text>
        <Text
          className='mt-0.5 text-[10px]'
          style={{ color: isSelected ? 'rgba(255,255,255,0.8)' : themeColors.text.tertiary }}
        >
          {time}
        </Text>
      </Pressable>
    </Animated.View>
  );
};
