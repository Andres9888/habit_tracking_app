/**
 * StatusIndicator Component
 * Displays completion checkmark or at-risk warning
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { useAppTheme } from '../../../theme';
import { styles } from '../HabitCard.styles';

interface StatusIndicatorProps {
  completed: boolean;
  atRisk: boolean;
  checkmarkAnimatedStyle: AnimatedStyle<{
    transform: { scale: number; rotate: string }[];
  }>;
}

export function StatusIndicator({
  completed,
  atRisk,
  checkmarkAnimatedStyle,
}: StatusIndicatorProps) {
  const theme = useAppTheme();

  if (completed) {
    return (
      <Animated.View
        style={[
          styles.checkmark,
          { backgroundColor: theme.custom.colors.primary[500] },
          checkmarkAnimatedStyle,
        ]}
      >
        <Text style={styles.checkmarkText}>✓</Text>
      </Animated.View>
    );
  }

  if (atRisk) {
    return (
      <View
        style={[
          styles.warningBadge,
          { backgroundColor: theme.custom.colors.warning[500] },
        ]}
      >
        <Text style={styles.warningText}>⚠️</Text>
      </View>
    );
  }

  return null;
}
