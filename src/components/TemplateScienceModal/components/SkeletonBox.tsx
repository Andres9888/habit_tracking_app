/**
 * SkeletonBox - Animated loading placeholder
 */

import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import type { SkeletonBoxProps } from '../TemplateScienceModal.types';

export const SkeletonBox = ({
  height,
  width,
  style,
  borderRadius = 8,
}: SkeletonBoxProps) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      false
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          backgroundColor: '#E5E7EB',
          borderRadius,
          height,
          width,
        },
        animatedStyle,
        style,
      ]}
    />
  );
};
