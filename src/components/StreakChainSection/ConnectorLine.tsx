/**
 * ConnectorLine Component
 * Animated connector between day circles in the streak chain — theme-aware
 */

import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  cancelAnimation,
} from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';
import { colors as palette } from '../../theme/colors';
import { borderRadius } from '../../theme/spacing';
import type { ConnectorLineProps } from './types';

export function ConnectorLine({ active, index }: ConnectorLineProps) {
  const { colors } = useThemeColors();
  const scaleX = useSharedValue(0);

  useEffect(() => {
    scaleX.value = withDelay(index * 35 + 15, withSpring(1, { damping: 18, stiffness: 150 }));

    return () => {
      cancelAnimation(scaleX);
    };
  }, [index, scaleX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: scaleX.value }],
  }));

  const lineColor = active ? palette.primary[300] : colors.gray[200];

  return (
    <Animated.View
      style={[
        localStyles.line,
        { backgroundColor: lineColor },
        animatedStyle,
      ]}
    />
  );
}

const localStyles = StyleSheet.create({
  line: {
    borderRadius: borderRadius.full,
    height: 6,
    left: '55%',
    position: 'absolute',
    right: '-55%',
    top: 20,
  },
});
