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
import { Pressable, Text, View } from 'react-native';

import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { useReduceMotion } from '../../hooks/useReduceMotion';
import { useThemeColors } from '../../theme';
import { TIME_RANGE_OPTIONS } from './constants';
import type { TimeRange, TimeRangeToggleProps } from './types';

const AnimatedView = Animated.createAnimatedComponent(View);

/**
 * Pill-style toggle for selecting time range.
 */
export const TimeRangeToggle = React.memo(function TimeRangeToggle({
  value,
  onChange,
}: TimeRangeToggleProps) {
  const reduceMotion = useReduceMotion();
  const { isDark } = useThemeColors();
  const trackBg = isDark ? 'rgba(255,255,255,0.08)' : '#f5f5f4';
  const pillBg = isDark ? 'rgba(255,255,255,0.15)' : '#ffffff';
  const selectedTextColor = isDark ? '#f5f5f4' : '#1c1917';
  const unselectedTextColor = isDark ? '#a8a29e' : '#78716c';

  // Calculate selected index for indicator position (default to 0 if not found)
  const selectedIndex = Math.max(0, TIME_RANGE_OPTIONS.findIndex((opt) => opt.value === value));
  const indicatorPosition = useSharedValue(selectedIndex);

  // Update indicator position when value changes
  useEffect(() => {
    const newIndex = Math.max(0, TIME_RANGE_OPTIONS.findIndex((opt) => opt.value === value));
    indicatorPosition.value = reduceMotion ? newIndex : withSpring(newIndex, {
        damping: 15,
        stiffness: 200,
      });
  }, [value, reduceMotion, indicatorPosition]);

  const handlePress = useCallback(
    (newValue: TimeRange) => {
      if (newValue !== value) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
      accessibilityLabel="Time range selection"
      accessibilityRole="tablist"
      className="flex-row rounded-full p-0.5"
      style={{ backgroundColor: trackBg }}
    >
      {/* Animated indicator background */}
      <AnimatedView
        className="absolute rounded-full shadow-sm"
        style={[
          {
            backgroundColor: pillBg,
            height: 28,
            left: 2,
            top: 2,
            width: segmentWidth,
          },
          indicatorStyle,
        ]}
      />

      {/* Toggle options */}
      {TIME_RANGE_OPTIONS.map((option) => {
        const isSelected = option.value === value;

        return (
          <Pressable
            key={option.value}
            accessibilityLabel={`${option.label} time range`}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            className="items-center justify-center"
            style={{ height: 28, width: segmentWidth }}
            onPress={() => handlePress(option.value)}
          >
            <Text
              className='text-xs font-semibold'
              style={{ color: isSelected ? selectedTextColor : unselectedTextColor }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
});
