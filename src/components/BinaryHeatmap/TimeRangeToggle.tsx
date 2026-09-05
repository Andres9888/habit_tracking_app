/* eslint-disable max-lines */
/**
 * TimeRangeToggle Component
 *
 * A segmented control for switching between time ranges (3m, 6m, 1y).
 */

import React, { memo, useCallback } from 'react';
import { View, Pressable, Text, Platform } from 'react-native';
import Animated from 'react-native-reanimated';

import { usePressAnimation } from '@/hooks/usePressAnimation';
import type { TimeRange, TimeRangeToggleProps } from './types';
import { useThemedToggleStyles } from './TimeRangeToggle.styles';
import {
  TIME_RANGES,
  getTimeRangeLabel,
  getTimeRangeAccessibilityLabel,
} from './TimeRangeToggle.helpers';

const PressableBase = Animated.createAnimatedComponent(Pressable);

interface TimeRangeButtonProps {
  range: TimeRange;
  isActive: boolean;
  onPress: (range: TimeRange) => void;
}

const TimeRangeButton = memo(function TimeRangeButton({
  range,
  isActive,
  onPress,
}: TimeRangeButtonProps) {
  const styles = useThemedToggleStyles();
  const { animatedStyle, pressHandlers } = usePressAnimation();

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
    <PressableBase
      accessible
      accessibilityLabel={getTimeRangeAccessibilityLabel(range)}
      accessibilityRole='tab'
      accessibilityState={{ selected: isActive }}
      style={getButtonStyle}
      onPress={handlePress}
      {...pressHandlers}
    >
      <Text
        style={[
          styles.buttonText,
          isActive ? styles.buttonTextActive : styles.buttonTextInactive,
        ]}
      >
        {getTimeRangeLabel(range)}
      </Text>
    </PressableBase>
  );
});

export const TimeRangeToggle = memo(function TimeRangeToggle({
  value,
  onChange,
}: TimeRangeToggleProps) {
  const styles = useThemedToggleStyles();

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
          onPress={handleRangePress}
        />
      ))}
    </View>
  );
});

export default TimeRangeToggle;
