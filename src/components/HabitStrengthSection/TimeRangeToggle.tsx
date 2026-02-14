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

import { triggerHaptic } from '@/utils/haptics';
import React, { useCallback, useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { useReduceMotion } from '../../hooks/useReduceMotion';
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
      accessibilityLabel="Time range selection"
      accessibilityRole="tablist"
      className="flex-row rounded-full bg-stone-100 p-0.5"
    >
      {/* Animated indicator background */}
      <AnimatedView
        className="absolute rounded-full bg-white shadow-sm"
        style={[
          {
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
              className={`text-xs font-semibold ${
                isSelected ? 'text-stone-900' : 'text-stone-500'
              }`}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
});
