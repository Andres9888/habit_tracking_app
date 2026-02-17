/**
 * HeatmapCell Component
 *
 * Individual cell in the GitHub-style heatmap
 */

import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import type { CellProps } from './GitHubHeatmap.types';
import { styles, darkStyles } from './GitHubHeatmap.styles';
import { colors } from '../../theme/colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function HeatmapCell({ data, onPress, darkMode = false }: CellProps) {
  const scale = useSharedValue(1);

  const themeStyles = darkMode ? darkStyles : styles;

  const handlePressIn = () => {
    scale.value = withSpring(1.3, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Determine cell color based on completion level
  const getCellColor = () => {
    if (!data) {
      return darkMode ? '#1a1a1a' : '#ebedf0';
    }

    const themeColors = darkMode ? colors.dark : colors;

    switch (data.level) {
      case 'high':
        return themeColors.primary[500];
      case 'medium':
        return darkMode ? '#006d32' : '#9be9a8';
      case 'low':
        return darkMode ? '#004d26' : '#40c463';
      case 'none':
      default:
        return darkMode ? '#0d1117' : '#ebedf0';
    }
  };

  const backgroundColor = getCellColor();

  return (
    <AnimatedPressable
      style={[
        themeStyles.cell,
        animatedStyle,
        { backgroundColor },
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      hitSlop={{ top: 2, bottom: 2, left: 2, right: 2 }}
    />
  );
}
