/**
 * Strength percentage display for MilestoneCelebration
 */

import React from 'react';
import type { ViewStyle } from 'react-native';
import { Text } from 'react-native';

import Animated, { type AnimatedStyle } from 'react-native-reanimated';

import { styles } from './styles';
import { useAppTheme } from '../../theme';

interface StrengthDisplayProps {
  strength: number;
  percentageStyle: AnimatedStyle<ViewStyle>;
}

export function StrengthDisplay({
  strength,
  percentageStyle,
}: StrengthDisplayProps) {
  const theme = useAppTheme();

  return (
    <Animated.View style={[styles.percentageContainer, percentageStyle]}>
      <Text
        accessible
        accessibilityLabel={`${Math.round(strength)} percent strength`}
        style={[
          theme.custom.typography.heading1,
          styles.percentage,
          {
            color: theme.custom.colors.primary[700],
            fontFamily: theme.custom.fontFamilies.monospace,
          },
        ]}
      >
        {Math.round(strength)}%
      </Text>
      <Text
        style={[
          theme.custom.typography.caption,
          { color: theme.custom.colors.gray[500] },
        ]}
      >
        Strength
      </Text>
    </Animated.View>
  );
}
