/* eslint-disable max-lines */
/**
 * TimeRangeToggle Component
 *
 * A segmented control for switching between time ranges (3m, 6m, 1y).
 */

import React, { memo, useCallback } from 'react';
import { View, Pressable, Text, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { springs } from '@/theme/animations';
import type { TimeRange, TimeRangeToggleProps } from './types';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { useThemedToggleStyles } from './TimeRangeToggle.styles';
import {
  TIME_RANGES,
  getTimeRangeLabel,
  getTimeRangeAccessibilityLabel,
} from './TimeRangeToggle.helpers';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TimeRangeButtonProps {
  range: TimeRange;
  isActive: boolean;
  onPress: (range: TimeRange) => void;
  reduceMotion: boolean;
}

const TimeRangeButton = memo(function TimeRangeButton({
  range,
  isActive,
  onPress,
  reduceMotion,
}: TimeRangeButtonProps) {
  const styles = useThemedToggleStyles();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ scale: scale.value ?? 1 }],
    };
  });

  const handlePressIn = useCallback(() => {
    if (!reduceMotion)
      scale.value = withSpring(0.95, springs.button);
  }, [reduceMotion, scale]);

  const handlePressOut = useCallback(() => {
    if (!reduceMotion)
      scale.value = withSpring(1, springs.button);
  }, [reduceMotion, scale]);

  const handlePress = useCallback(() => {
    onPress(range);
  }, [onPress, range]);

  const getButtonStyle = ({ focused }: { focused: boolean }) => [
    animatedStyle,
    styles.button,
    isActive && styles.buttonActive,
    Platform.OS === 'web' && focused && styles.webFocus,
  ];

  return (
    <AnimatedPressable
      accessible
      accessibilityLabel={getTimeRangeAccessibilityLabel(range)}
      accessibilityRole='tab'
      accessibilityState={{ selected: isActive }}
      style={getButtonStyle}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Text
        style={[
          styles.buttonText,
          isActive ? styles.buttonTextActive : styles.buttonTextInactive,
        ]}
      >
        {getTimeRangeLabel(range)}
      </Text>
    </AnimatedPressable>
  );
});

export const TimeRangeToggle = memo(function TimeRangeToggle({
  value,
  onChange,
}: TimeRangeToggleProps) {
  const styles = useThemedToggleStyles();
  const reduceMotion = useReduceMotion();

  const handleRangePress = useCallback(
    (range: TimeRange) => {
      if (range !== value) onChange(range);
    },
    [value, onChange]
  );

  return (
    <View
      accessibilityLabel='Time range selector'
      accessibilityRole='tablist'
      style={styles.container}
    >
      {TIME_RANGES.map((range) => (
        <TimeRangeButton
          key={range}
          isActive={value === range}
          range={range}
          reduceMotion={reduceMotion}
          onPress={handleRangePress}
        />
      ))}
    </View>
  );
});

export default TimeRangeToggle;
