import React, { memo, useCallback } from 'react';
import { Pressable, Text, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { TimeRange } from './types';
import { styles } from './TimeRangeToggle.styles';
import { springs } from '@/theme/animations';
import {
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

export const TimeRangeButton = memo(function TimeRangeButton({
  range,
  isActive,
  onPress,
  reduceMotion,
}: TimeRangeButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return { transform: [{ scale: scale.value ?? 1 }] };
  });

  const handlePressIn = useCallback(() => {
    if (!reduceMotion) scale.value = withSpring(0.95, springs.standard);
  }, [reduceMotion, scale]);

  const handlePressOut = useCallback(() => {
    if (!reduceMotion) scale.value = withSpring(1, springs.standard);
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
