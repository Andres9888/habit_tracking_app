/**
 * TimeRangeToggle Component
 *
 * Pill-style toggle for selecting time range (1M/1Y/All).
 * Features haptic feedback and reduced motion support.
 *
 * @example
 * ```tsx
 * <TimeRangeToggle
 *   value="1y"
 *   onChange={(value) => setTimeRange(value)}
 * />
 * ```
 */

import React, { useCallback, useEffect } from 'react';
import { View } from 'react-native';

import { useThemeColors } from '@/theme/ThemeContext';
import { triggerHaptic } from '@/utils/haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { springs } from '@/theme/animations';
import { shadows } from '@/theme/spacing';

import { useReduceMotion } from '../../hooks/useReduceMotion';
import { TIME_RANGE_OPTIONS } from './constants';
import { TimeRangeSegment } from './TimeRangeSegment';
import type { TimeRange, TimeRangeToggleProps } from './types';

const AnimatedView = Animated.createAnimatedComponent(View);

/**
 * Pill-style toggle for selecting time range.
 */
export const TimeRangeToggle = React.memo(function TimeRangeToggle({
  value,
  onChange,
}: TimeRangeToggleProps) {
  const { colors: themeColors, isDark } = useThemeColors();
  const reduceMotion = useReduceMotion();

  // Calculate selected index for indicator position (default to 0 if not found)
  const selectedIndex = Math.max(
    0,
    TIME_RANGE_OPTIONS.findIndex((opt) => opt.value === value)
  );
  const indicatorPosition = useSharedValue(selectedIndex);

  // Update indicator position when value changes
  useEffect(() => {
    const newIndex = Math.max(
      0,
      TIME_RANGE_OPTIONS.findIndex((opt) => opt.value === value)
    );
    indicatorPosition.value = reduceMotion
      ? newIndex
      : withSpring(newIndex, springs.sheet);
  }, [value, reduceMotion, indicatorPosition]);

  const handlePress = useCallback(
    (newValue: TimeRange) => {
      if (newValue !== value) {
        triggerHaptic('tap');
        onChange(newValue);
      }
    },
    [value, onChange]
  );

  // Width of each pill segment (fixed width for consistent spacing)
  const segmentWidth = 44;

  const indicatorStyle = useAnimatedStyle(() => {
    'worklet';
    const position = indicatorPosition.value ?? 0;
    return {
      transform: [{ translateX: position * segmentWidth }],
    };
  });

  return (
    <View
      accessibilityLabel='Time range selection'
      accessibilityRole='tablist'
      className='flex-row rounded-full p-0.5'
      style={{
        backgroundColor: isDark ? themeColors.surface : themeColors.gray[100],
      }}
    >
      {/* Animated indicator background */}
      <AnimatedView
        className='absolute rounded-full'
        style={[
          {
            ...shadows.subtle,
            backgroundColor: themeColors.card,
            height: 28,
            left: 2,
            top: 2,
            width: segmentWidth,
          },
          indicatorStyle,
        ]}
      />

      {/* Toggle options */}
      {TIME_RANGE_OPTIONS.map((option) => (
        <TimeRangeSegment
          key={option.value}
          isSelected={option.value === value}
          label={option.label}
          segmentWidth={segmentWidth}
          textPrimary={themeColors.text.primary}
          textSecondary={themeColors.text.secondary}
          value={option.value}
          onPress={handlePress}
        />
      ))}
    </View>
  );
});
