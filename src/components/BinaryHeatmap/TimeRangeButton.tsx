/**
 * TimeRangeButton Component
 *
 * Individual button within the TimeRangeToggle segmented control.
 */

import React, { memo, useCallback } from 'react';
import { Pressable, Text, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import type { TimeRange } from './types';
import type { HeatmapColors } from './heatmapColors';
import { styles } from './TimeRangeToggle.styles';
import {
  getTimeRangeLabel,
  getTimeRangeAccessibilityLabel,
} from './TimeRangeToggle.helpers';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface TimeRangeButtonProps {
  range: TimeRange;
  isActive: boolean;
  hColors: HeatmapColors;
  onPress: (range: TimeRange) => void;
  reduceMotion: boolean;
}

export const TimeRangeButton = memo(function TimeRangeButton({
  range,
  isActive,
  hColors,
  onPress,
  reduceMotion,
}: TimeRangeButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ scale: scale.value ?? 1 }],
    };
  });

  const handlePressIn = useCallback(() => {
    if (!reduceMotion) scale.value = withSpring(0.95, { damping: 15 });
  }, [reduceMotion, scale]);

  const handlePressOut = useCallback(() => {
    if (!reduceMotion) scale.value = withSpring(1, { damping: 15 });
  }, [reduceMotion, scale]);

  const handlePress = useCallback(() => {
    onPress(range);
  }, [onPress, range]);

  const getButtonStyle = ({ focused }: { focused: boolean }) => [
    animatedStyle,
    styles.button,
    isActive && [
      styles.buttonActive,
      { backgroundColor: hColors.CARD_BACKGROUND },
    ],
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
          { color: isActive ? hColors.TEXT_PRIMARY : hColors.TEXT_SECONDARY },
        ]}
      >
        {getTimeRangeLabel(range)}
      </Text>
    </AnimatedPressable>
  );
});
