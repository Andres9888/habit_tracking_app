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

import React, { useCallback, useEffect, useState } from 'react';
import { AccessibilityInfo, Pressable, Text, View } from 'react-native';

import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { COLORS, TIME_RANGE_OPTIONS } from './constants';
import type { TimeRange, TimeRangeToggleProps } from './types';

const AnimatedView = Animated.createAnimatedComponent(View);

/**
 * Pill-style toggle for selecting time range.
 */
export const TimeRangeToggle = React.memo(function TimeRangeToggle({
  value,
  onChange,
}: TimeRangeToggleProps) {
  const [reduceMotion, setReduceMotion] = useState(false);

  // Check for reduce motion preference
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  // Calculate selected index for indicator position
  const selectedIndex = TIME_RANGE_OPTIONS.findIndex((opt) => opt.value === value);
  const indicatorPosition = useSharedValue(selectedIndex);

  // Update indicator position when value changes
  useEffect(() => {
    const newIndex = TIME_RANGE_OPTIONS.findIndex((opt) => opt.value === value);
    if (reduceMotion) {
      indicatorPosition.value = newIndex;
    } else {
      indicatorPosition.value = withSpring(newIndex, {
        damping: 15,
        stiffness: 200,
      });
    }
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

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorPosition.value * segmentWidth }],
  }));

  return (
    <View
      className="flex-row rounded-full bg-stone-100 p-0.5"
      accessibilityRole="tablist"
      accessibilityLabel="Time range selection"
    >
      {/* Animated indicator background */}
      <AnimatedView
        className="absolute rounded-full bg-white shadow-sm"
        style={[
          {
            width: segmentWidth,
            height: 28,
            top: 2,
            left: 2,
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
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`${option.label} time range`}
            className="items-center justify-center"
            style={{ width: segmentWidth, height: 28 }}
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
