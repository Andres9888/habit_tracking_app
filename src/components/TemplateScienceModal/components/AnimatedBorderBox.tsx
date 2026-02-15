/**
 * AnimatedBorderBox - Citation box with animated border effect
 */

import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';

import type { AnimatedBorderBoxProps } from '../TemplateScienceModal.types';
import { hexToRgba } from '../TemplateScienceModal.utils';

export const AnimatedBorderBox = ({
  children,
  baseColor,
  style,
}: AnimatedBorderBoxProps) => {
  const borderProgress = useSharedValue(0);

  useEffect(() => {
    borderProgress.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );
  }, [borderProgress]);

  const activeColor = hexToRgba(baseColor, 0.25);

  const animatedBorderStyle = useAnimatedStyle(() => {
    const borderColorValue = interpolate(
      borderProgress.value,
      [0, 0.25, 0.5, 0.75, 1],
      [0, 1, 0, 1, 0]
    );
    return {
      borderColor: borderColorValue > 0.5 ? activeColor : '#e7e5e4',
    };
  });

  return (
    <Animated.View style={[styles.citationBox, animatedBorderStyle, style]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  citationBox: {
    backgroundColor: '#FAFAFA',
    borderColor: '#e7e5e4',
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 16,
    padding: 18,
  },
});
